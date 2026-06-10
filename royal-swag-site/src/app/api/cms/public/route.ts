import { NextResponse } from "next/server";
import { getCmsSections } from "@/lib/cms";

export const revalidate = 60;

export async function GET() {
  const sections = await getCmsSections();
  return NextResponse.json(
    { sections },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
