// app/api/order-details/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

// Configuration for retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 10000;

export async function POST(req: Request) {
  try {
    // Verify user authentication
    const session = await auth();

    if (!session || !session.userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Get order ID from request body
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return new NextResponse(
        JSON.stringify({ message: "Order ID is required" }),
        { status: 400 }
      );
    }

    // Get Lalamove API credentials from environment variables
    const LALAMOVE_APPKEY = process.env.LALAMOVE_APPKEY;
    const LALAMOVE_SECRET = process.env.LALAMOVE_SECRET;
    const LALAMOVE_API_URL = process.env.LALAMOVE_API_URL;

    if (!LALAMOVE_APPKEY || !LALAMOVE_SECRET || !LALAMOVE_API_URL) {
      return new NextResponse(
        JSON.stringify({ message: "Lalamove API configuration missing" }),
        { status: 500 }
      );
    }

    // Prepare request to Lalamove API
    const path = `/v3/orders/${orderId}`;
    const market = process.env.LALAMOVE_MARKET || "PH";

    // Implement retry logic for the API call
    const orderDetails = await fetchWithRetry(
      `${LALAMOVE_API_URL}${path}`,
      LALAMOVE_APPKEY,
      LALAMOVE_SECRET,
      path,
      market
    );

    // Transform the response data with proper null checks
    const transformedData = {
      orderId: orderDetails.data?.orderId || orderId,
      status: orderDetails.data?.status || "UNKNOWN",
      shareLink: orderDetails.data?.shareLink || null,
      driverId: orderDetails.data?.driverId || null,
      stops: (orderDetails.data?.stops || []).map((stop: any) => ({
        coordinates: {
          lat: stop.coordinates?.lat || "0",
          lng: stop.coordinates?.lng || "0",
        },
        address: stop.address || "Unknown address",
        name: stop.name || "Unknown",
        phone: stop.phone || "N/A",
        POD: stop.POD
          ? {
              status: stop.POD.status || "UNKNOWN",
              image: stop.POD.image || null,
              deliveredAt: stop.POD.deliveredAt || null,
            }
          : undefined,
      })),
      distance: orderDetails.data?.distance || {
        value: "0",
        unit: "m",
      },
      driverInfo: orderDetails.data?.driverId
        ? {
            name: orderDetails.data.driverName || "Unknown driver",
            phone: orderDetails.data.driverPhone || "N/A",
          }
        : undefined,
      metadata: orderDetails.data?.metadata || {},
    };

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error: any) {
    console.error("API error:", error);

    // Return more detailed error information
    return new NextResponse(
      JSON.stringify({
        message: error.userMessage || "Internal server error",
        error: error.message,
        code: error.statusCode || 500,
        details: error.details || null,
      }),
      { status: error.statusCode || 500 }
    );
  }
}

// Helper function to generate HMAC signature for Lalamove API
function generateLalamoveSignature(message: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

// Function to add delay between retries
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to implement fetch with timeout
function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    fetch(url, {
      ...options,
      signal: controller.signal,
    })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
}

// Function to handle API calls with retry logic
async function fetchWithRetry(
  url: string,
  appKey: string,
  secret: string,
  path: string,
  market: string
): Promise<any> {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Attempting Lalamove API request (attempt ${attempt}/${MAX_RETRIES}): ${url}`
      );

      // Generate fresh timestamp and signature for each attempt
      const timestamp = new Date().toISOString();
      const message = `${timestamp}${path}`;
      const signature = generateLalamoveSignature(message, secret);

      // Make request to Lalamove API with timeout
      const response = await fetchWithTimeout(
        url,
        {
          method: "GET",
          headers: {
            Authorization: `hmac ${appKey}:${timestamp}:${signature}`,
            "Content-Type": "application/json",
            Market: market,
            Accept: "application/json",
          },
        },
        REQUEST_TIMEOUT_MS
      );

      console.log(
        `Lalamove API response status (attempt ${attempt}): ${response.status}`
      );

      // Parse response as JSON
      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid JSON response from Lalamove API");
      }

      // If response is not ok, throw an error that will be caught below
      if (!response.ok) {
        const error: any = new Error(
          `Lalamove API error: ${data.message || response.statusText}`
        );
        error.statusCode = response.status;
        error.details = data;
        error.userMessage = `Error fetching order details: ${
          data.message || response.statusText
        }`;
        throw error;
      }

      // If we get here, the request was successful
      return data;
    } catch (error: any) {
      lastError = error;

      // Log the error
      console.error(`Attempt ${attempt} failed:`, error.message);

      // Check if we should retry based on error type
      const shouldRetry =
        // Retry on network errors
        error.name === "TypeError" ||
        error.name === "AbortError" ||
        // Retry on 5xx server errors
        (error.statusCode && error.statusCode >= 500 && error.statusCode < 600);

      if (attempt === MAX_RETRIES || !shouldRetry) {
        // If this was our last attempt or error is not retryable, break out
        break;
      }

      // Wait before the next retry
      const retryDelay = RETRY_DELAY_MS * attempt; // Exponential backoff
      console.log(`Retrying in ${retryDelay}ms...`);
      await delay(retryDelay);
    }
  }

  // If we've exhausted all retries and still have an error
  throw lastError;
}
