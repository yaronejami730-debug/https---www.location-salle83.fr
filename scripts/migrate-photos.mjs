import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("Target project:", process.env.NEXT_PUBLIC_SUPABASE_URL);

async function migrateFolder(localDir, page) {
  const dir = join(process.cwd(), "public", "images", localDir);
  const files = readdirSync(dir).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  let order = 0;
  for (const file of files) {
    const buffer = readFileSync(join(dir, file));
    const storagePath = `${page}/${file}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(storagePath, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });
    if (uploadError) {
      console.error(`Upload failed ${file}:`, uploadError.message);
      continue;
    }

    const { error: insertError } = await supabase.from("media").insert({
      storage_path: storagePath,
      page,
      alt: `Photo du Domaine de la Bégude — ${page}`,
      sort_order: order,
    });
    if (insertError) {
      console.error(`Insert failed ${file}:`, insertError.message);
      continue;
    }

    console.log(`OK ${page}/${file}`);
    order += 1;
  }
}

await migrateFolder("galerie", "galerie");
await migrateFolder("hebergement", "hebergement");

const { data: check, error: checkErr } = await supabase.from("media").select("page").order("page");
console.log("Post-migration row count:", check?.length, checkErr ? `ERROR: ${checkErr.message}` : "");
console.log("Done.");
