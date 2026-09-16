import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { WasteSortingPdfDocument } from "@/lib/waste-sorting-pdf";

export async function GET() {
  let logoDataUri: string | null = null;
  try {
    const logoBuffer = await readFile(path.join(process.cwd(), "public/images/logo.png"));
    logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    logoDataUri = null;
  }

  const buffer = await renderToBuffer(<WasteSortingPdfDocument logoDataUri={logoDataUri} />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="tri-selectif-domaine-de-la-begude.pdf"`,
    },
  });
}
