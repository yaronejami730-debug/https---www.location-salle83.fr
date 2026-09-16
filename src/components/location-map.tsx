import { siteConfig } from "@/lib/site";

export function LocationMap() {
  return (
    <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl">
      <iframe
        title="Localisation du Domaine de la Bégude"
        src={`https://www.google.com/maps?q=${siteConfig.lat},${siteConfig.lng}&hl=fr&z=14&output=embed`}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
