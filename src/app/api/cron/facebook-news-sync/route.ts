import { NextRequest, NextResponse } from "next/server";

import { runFacebookNewsSync } from "@/lib/facebook-sync";

const isAuthorized = (req: NextRequest) => {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return false;
  }

  const bearerToken = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  const headerSecret = req.headers.get("x-cron-secret")?.trim();
  const querySecret = new URL(req.url).searchParams.get("secret")?.trim();

  return (
    bearerToken === cronSecret ||
    headerSecret === cronSecret ||
    querySecret === cronSecret
  );
};

async function handleSync(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  try {
    const result = await runFacebookNewsSync();

    return NextResponse.json({
      success: true,
      ...result,
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Facebook cron sync failed.",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}
