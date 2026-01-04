import { NextResponse } from "next/server";

const UPSTREAM_API = "https://api.sansekai.my.id/api/dramabox";

export async function GET() {
  try {
    const response = await fetch(`${UPSTREAM_API}/latest`, {
      next: { revalidate: 300 },
    });

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
