import { getContent } from "@/content/content";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") as string;
  if (!slug) return notFound();

  const { metadata } = await getContent(slug);

  return NextResponse.json(metadata);
}
