import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_CHEESY_HIRE_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_CHEESY_HIRE_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: "API configuration is missing" },
        { status: 500 },
      );
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error for jobs API:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
