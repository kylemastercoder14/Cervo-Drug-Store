import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const APPKEY = process.env.LALAMOVE_APPKEY || ""; // Correct! No "NEXT_PUBLIC_"
  const SECRET = process.env.LALAMOVE_SECRET || ""; // Correct! No "NEXT_PUBLIC_"

  const { data } = await req.json();

  const method = "POST";
  const path = "/v3/quotations";
  const time = new Date().getTime().toString();
  const body = JSON.stringify({ data });

  const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${body}`;

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(rawSignature)
    .digest("hex");

  const response = await fetch(
    "https://rest.sandbox.lalamove.com/v3/quotations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `hmac ${APPKEY}:${time}:${signature}`,
        Market: "PH",
        "X-Request-Time": time,
      },
      body,
    }
  );

  const dataRes = await response.json();
  return NextResponse.json(dataRes, { status: response.status });
}
