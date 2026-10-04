import { getRSS } from "@/content/rss";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await getRSS(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
