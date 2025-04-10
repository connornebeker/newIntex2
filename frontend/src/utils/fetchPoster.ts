export default function fetchPoster(title: string): string {
  const encodedTitle = encodeURIComponent(title.trim());
  const posterUrl = `https://moviesforintex.blob.core.windows.net/movies/${encodedTitle}.jpg`;

  // Use JavaScript image loading to check if the image exists — but that has to be done elsewhere in React
  // Here, we just return the poster URL and let the frontend handle fallback logic

  return posterUrl;
}
