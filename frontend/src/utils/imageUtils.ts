export const getImageUrl = (imageUrl: string | null): string => {
  return imageUrl ?? "https://placehold.co/600x400?text=No+Image";
};
