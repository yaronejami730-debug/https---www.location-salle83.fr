"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
  author: z.string().min(2, "Nom requis"),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, "Merci de détailler un peu votre avis"),
});

export type SubmitReviewInput = z.infer<typeof schema>;

export async function submitReview(input: SubmitReviewInput) {
  const values = schema.parse(input);

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("reviews").insert({
    author: values.author.trim(),
    rating: values.rating,
    text: values.text.trim(),
    published: false,
  });

  if (error) throw new Error("insert_failed");
}
