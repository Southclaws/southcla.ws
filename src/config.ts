export const site = {
  title: "barney's tech blog",
  description:
    "I'm a multidisciplinary maker. this site is a never-ending exploration into the details. aka southclaws.",
  url: "https://southcla.ws",
};

export function getBaseURL(host: string) {
  const scheme = host?.includes("localhost") ? "http" : "https";

  return `${scheme}://${host}`;
}
