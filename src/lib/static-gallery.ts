export const staticGalleryPhotos = [
  "IMG_7447.jpg",
  "IMG_7448.jpg",
  "IMG_7449.jpg",
  "IMG_7450.jpg",
  "IMG_7452.jpg",
  "IMG_7453.jpg",
  "IMG_7454.jpg",
  "IMG_7455.jpg",
  "IMG_7456.jpg",
  "IMG_7457.jpg",
  "IMG_7458.jpg",
  "IMG_7459.jpg",
  "IMG_7460.jpg",
  "IMG_7461.jpg",
  "IMG_7462.jpg",
  "IMG_7464.jpg",
].map((file) => ({ src: `/images/galerie/${file}`, alt: "Photo du Domaine de la Bégude" }));

export const staticHebergementPhotos = [1, 2, 3, 4, 5].map((n) => ({
  src: `/images/hebergement/hebergement-${n}.jpg`,
  alt: "Hébergement du Domaine de la Bégude",
}));
