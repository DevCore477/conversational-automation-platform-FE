import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const connectUsSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email format"),
  companySize: z
    .enum(["1 - 10", "11 - 50", "51 - 100", "101 - 500", "500+"])
    .optional()
    .nullable(),
  useCase: z
    .enum([
      "Use Hexa AI for my company's phone operations",
      "I want to help my clients implement AI voice agents",
      "Build a product for my customers",
      "Whitelabel and resell Hexa AI to my clients",
      "Become a Hexa AI certified partner",
    ])
    .optional()
    .nullable(),
  implementation: z
    .enum([
      "Self-setup with my developers",
      "Managed service by Hexa AI",
      "Hybrid approach",
      "Need consulting",
    ])
    .optional()
    .nullable(),
  agentsCount: z
    .enum(["Fewer than 10", "10 - 50", "51 - 100", "101 - 500", "500+"])
    .optional()
    .nullable(),
  message: z.string().optional().nullable(),
  referralSource: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = connectUsSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 422 },
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://api.gethexa.ai";
    const response = await fetch(`${apiUrl}/connect-us`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Failed to submit form", details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Connect Us API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
