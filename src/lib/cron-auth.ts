import { NextRequest } from "next/server";

export const isAuthorizedCronRequest = (req: NextRequest) => {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return false;
  }

  const bearerToken = req.headers
    .get("authorization")
    ?.replace("Bearer ", "")
    .trim();
  const headerSecret = req.headers.get("x-cron-secret")?.trim();
  const querySecret = new URL(req.url).searchParams.get("secret")?.trim();

  return (
    bearerToken === cronSecret ||
    headerSecret === cronSecret ||
    querySecret === cronSecret
  );
};
