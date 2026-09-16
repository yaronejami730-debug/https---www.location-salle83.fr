import "server-only";
import sharp from "sharp";
import convertHeic from "heic-convert";

async function toDecodableBuffer(input: Buffer): Promise<Buffer> {
  try {
    await sharp(input).resize(8, 8).toBuffer();
    return input;
  } catch {
    const jpegArrayBuffer = await convertHeic({ buffer: input, format: "JPEG", quality: 0.92 });
    return Buffer.from(jpegArrayBuffer);
  }
}

export async function processUploadedImage(rawInput: Buffer): Promise<Buffer> {
  const input = await toDecodableBuffer(rawInput);
  return sharp(input).rotate().jpeg({ quality: 90 }).toBuffer();
}
