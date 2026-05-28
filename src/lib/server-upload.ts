import AWS from "aws-sdk";
import fs from "fs/promises";
import path from "path";

const S3_REGION = "ap-southeast-2";

const hasS3Config = () =>
  Boolean(
    process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID &&
      process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY &&
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
  );

const createS3Client = () => {
  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  });

  return new AWS.S3({
    params: {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    },
    region: S3_REGION,
  });
};

export async function uploadBufferToPublicStorage({
  buffer,
  key,
  contentType,
}: {
  buffer: Buffer;
  key: string;
  contentType?: string;
}) {
  const normalizedKey = key.replace(/^\/+/, "").replace(/\\/g, "/");

  if (hasS3Config()) {
    const s3 = createS3Client();

    await s3
      .putObject({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: normalizedKey,
        Body: buffer,
        ContentType: contentType,
      })
      .promise();

    return {
      url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${normalizedKey}`,
    };
  }

  const publicPath = path.join(process.cwd(), "public", normalizedKey);
  await fs.mkdir(path.dirname(publicPath), { recursive: true });
  await fs.writeFile(publicPath, buffer);

  return {
    url: `/${normalizedKey}`,
  };
}
