import { createBulkProducts } from "@/actions/product";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = Array.isArray(body?.products) ? body.products : [];

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No product rows were provided." },
        { status: 400 }
      );
    }

    const result = await createBulkProducts(products);

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Bulk upload API failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Bulk upload failed.",
      },
      { status: 500 }
    );
  }
}
