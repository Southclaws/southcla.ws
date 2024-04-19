export function getBaseURL(host: string) {
  const scheme = host?.includes("localhost") ? "http" : "https";

  return `${scheme}://${host}`;
}
