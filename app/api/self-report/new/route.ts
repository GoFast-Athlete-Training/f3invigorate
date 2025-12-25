import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentF3HIM } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent build-time execution
export const dynamic = "force-dynamic";

const selfReportSchema = z.object({
  category: z.enum([
    "FELLOWSHIP",
    "SERVICE",
    "MARRIAGE_FAMILY",
    "DIET_QUEEN",
    "MENTAL_HEALTH",
    "SPIRITUAL",
  ]),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const f3him = await getCurrentF3HIM();
    if (!f3him) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = selfReportSchema.parse(body);

    // Create self-report entry (deprecated UX, kept for data retention)
    await prisma.selfReportEntry.create({
      data: {
        f3HIMId: f3him.id,
        category: validated.category,
        note: validated.note || null,
      },
    });

    return NextResponse.json({ success: true, message: "Self-report created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Error creating self-report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

