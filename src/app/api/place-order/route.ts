/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { quotation, recipientName, recipientRemarks } = await req.json();

    // Check if quotation is provided
    if (!quotation || !quotation.data) {
      return NextResponse.json(
        { message: "Quotation data is missing or invalid." },
        { status: 400 }
      );
    }

    const time = new Date().getTime().toString();
    const method = "POST";
    const path = "/v3/orders";

    const bodyObj = {
      data: {
        quotationId: quotation.data.quotationId,
        sender: {
          stopId: quotation.data.stops[0]?.stopId,
          name: "Cervo Drug Store and Medical Clinic",
          phone: "+639755906889",
        },
        recipients: [
          {
            stopId: quotation.data.stops[1]?.stopId,
            name: recipientName,
            phone: "+639152479693",
            remarks: recipientRemarks,
          },
        ],
        isPODEnabled: true,
        isRecipientSMSEnabled: true,
        partner: "CervoDrugStore",
      },
    };

    const body = JSON.stringify(bodyObj);
    const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${body}`;
    const signature = crypto
      .createHmac("sha256", process.env.LALAMOVE_SECRET!)
      .update(rawSignature)
      .digest("hex");

    const response = await fetch(
      "https://rest.sandbox.lalamove.com/v3/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `hmac ${process.env.LALAMOVE_APPKEY}:${time}:${signature}`,
          Market: "PH",
          "X-Request-Time": time,
        },
        body,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ message: data.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
