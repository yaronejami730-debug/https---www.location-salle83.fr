import "server-only";
import sharp from "sharp";
import convertHeic from "heic-convert";
import { readFile } from "fs/promises";
import { join } from "path";

const OPACITY = 0.6;
const WATERMARK_WIDTH_RATIO = 0.11;
const MARGIN_RATIO = 0.03;

let logoBuffer: Buffer | null = null;

async function getLogo() {
  if (!logoBuffer) {
    logoBuffer = await readFile(join(process.cwd(), "public", "images", "logo.png"));
  }
  return logoBuffer;
}

async function fadedLogo(width: number) {
  const { data, info } = await sharp(await getLogo())
    .resize({ width })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 3; i < data.length; i += info.channels) {
    data[i] = Math.round(data[i] * OPACITY);
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels as 4 } })
    .png()
    .toBuffer();
}

async function toDecodableBuffer(input: Buffer): Promise<Buffer> {
  try {
    await sharp(input).resize(8, 8).toBuffer();
    return input;
  } catch {
    const jpegArrayBuffer = await convertHeic({ buffer: input, format: "JPEG", quality: 0.92 });
    return Buffer.from(jpegArrayBuffer);
  }
}

export async function watermarkImage(rawInput: Buffer): Promise<Buffer> {
  const input = await toDecodableBuffer(rawInput);
  const image = sharp(input).rotate();
  const meta = await image.metadata();
  const width = meta.width ?? 1600;
  const height = meta.height ?? 1200;

  const logoWidth = Math.round(width * WATERMARK_WIDTH_RATIO);
  const logo = await fadedLogo(logoWidth);
  const logoMeta = await sharp(logo).metadata();
  const logoHeight = logoMeta.height ?? Math.round(logoWidth * 0.5);
  const margin = Math.round(width * MARGIN_RATIO);

  return image
    .composite([
      {
        input: logo,
        left: Math.max(0, width - logoWidth - margin),
        top: Math.max(0, height - logoHeight - margin),
      },
    ])
    .jpeg({ quality: 88 })
    .toBuffer();
}
