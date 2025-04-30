/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // No longer using body for orderId and driverId
    const { orderId, driverId } = await req.json();

    if (!orderId || !driverId) {
      return NextResponse.json(
        { message: "Missing orderId or driverId" },
        { status: 400 }
      );
    }

    // Step 1: Generate time
    const time = Date.now().toString(); // same as Postman

    // Step 2: Prepare signature
    const appSecret = process.env.LALAMOVE_SECRET!;
    const appKey = process.env.LALAMOVE_APPKEY!;
    const baseUrl = "https://rest.sandbox.lalamove.com";

    const rawSignature = `${time}\r\nGET\r\n/v3/orders/${orderId}/drivers/${driverId}\r\n\r\n`;
    const signature = crypto
      .createHmac("sha256", appSecret)
      .update(rawSignature)
      .digest("hex");

    // Step 3: Prepare headers
    const headers = {
      Authorization: `hmac ${appKey}:${time}:${signature}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      market: "PH",
    };

    // Step 4: Make actual GET request to Lalamove API
    const res = await fetch(
      `${baseUrl}/v3/orders/${orderId}/drivers/${driverId}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to get driver details" },
        { status: res.status }
      );
    }

    return NextResponse.json({ data: data.data });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
