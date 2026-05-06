import AWS from "aws-sdk";

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

export async function upload(
  file: File,
  progressCallback?: (progress: number) => void
) {
  try {
    if (
      !process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID ||
      !process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY ||
      !process.env.NEXT_PUBLIC_S3_BUCKET_NAME
    ) {
      throw new UploadError(
        "Image uploads are temporarily unavailable. Please try again later."
      );
    }

    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: "ap-southeast-2",
    });

    const file_key = `uploads/${Date.now().toString()}_${file.name.replace(
      / /g,
      "-"
    )}`;

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        const progress = Math.round((evt.loaded / evt.total) * 100);
        if (progressCallback) {
          progressCallback(progress); // Call the progress callback if provided
        }
      })
      .promise();

    await upload;

    console.log("Successfully uploaded to S3:", file_key);

    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${file_key}`;
    return { url };
  } catch (error) {
    console.error("Error uploading to S3:", error);

    if (error instanceof UploadError) {
      throw error;
    }

    const awsError = error as {
      code?: string;
      message?: string;
      statusCode?: number;
    };

    if (
      awsError.code === "CredentialsError" ||
      awsError.code === "InvalidAccessKeyId" ||
      awsError.code === "SignatureDoesNotMatch"
    ) {
      throw new UploadError(
        "We could not verify the upload service right now. Please try again later."
      );
    }

    if (
      awsError.code === "NetworkingError" ||
      awsError.code === "TimeoutError" ||
      awsError.statusCode === 408
    ) {
      throw new UploadError(
        "Your image could not be uploaded because the connection timed out. Please check your internet and try again."
      );
    }

    if (awsError.code === "RequestEntityTooLarge") {
      throw new UploadError(
        "This image file is too large to upload. Please choose a smaller file."
      );
    }

    if (awsError.code === "AccessDenied") {
      throw new UploadError(
        "Image upload permission is currently unavailable. Please try again later."
      );
    }

    throw new UploadError(
      awsError.message ||
        "We could not upload your image right now. Please try again in a moment."
    );
  }
}
