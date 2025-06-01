// AWS upload functionality
import { uploadData } from "aws-amplify/storage";

const CLOUDFRONT_DOMAIN = "https://djuov8miln44j.cloudfront.net";

export const uploadToS3 = async (file) => {
  try {
    // Convert file to blob
    const response = await fetch(file.uri);
    const blob = await response.blob();

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.fileName
      ? file.fileName.split(".").pop()
      : file.type?.includes("image")
      ? "jpg"
      : "jpg";
    const filename = `designs/${timestamp}-${randomId}.${fileExtension}`;

    // Upload to S3 with guest access (public)
    const result = await uploadData({
      key: filename,
      data: blob,
      options: {
        contentType: file.type || "image/jpeg",
        contentDisposition: "inline",
        accessLevel: "guest",
      },
    }).result;

    console.log("Upload successful:", result);

    // Get the public URL using CloudFront
    const publicUrl = `${CLOUDFRONT_DOMAIN}/public/${filename}`;

    return {
      key: filename,
      url: publicUrl,
      success: true,
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};