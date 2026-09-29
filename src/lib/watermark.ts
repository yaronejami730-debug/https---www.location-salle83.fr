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

// Nothing on the site renders wider than a full-bleed hero, so 2400px covers retina screens.
// Capping the size (and using mozjpeg) keeps Supabase storage well inside the free 1 GB.
const MAX_DIMENSION_PX = 2400;

export async function processUploadedImage(rawInput: Buffer): Promise<Buffer> {
  const input = await toDecodableBuffer(rawInput);
  return sharp(input)
    .rotate()
    .resize({ width: MAX_DIMENSION_PX, height: MAX_DIMENSION_PX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
