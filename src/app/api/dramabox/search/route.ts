import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_API = "https://api.sansekai.my.id/api/dramabox";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const response = await fetch(
      `${UPSTREAM_API}/search?query=${encodeURIComponent(query)}`,
      { next: { revalidate: 120 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
