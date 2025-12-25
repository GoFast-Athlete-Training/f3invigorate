import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentF3HIM } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent build-time execution
export const dynamic = "force-dynamic";

const weeklyReflectionSchema = z.object({
  mood: z.string().optional(),
  wins: z.string().optional(),
  struggles: z.string().optional(),
  intention: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const f3him = await getCurrentF3HIM();
    if (!f3him) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = weeklyReflectionSchema.parse(body);

    // Create weekly reflection (deprecated UX, kept for data retention)
    await prisma.weeklyReflection.create({
      data: {
        f3HIMId: f3him.id,
        mood: validated.mood || null,
        wins: validated.wins || null,
        struggles: validated.struggles || null,
        intention: validated.intention || null,
      },
    });

    return NextResponse.json({ success: true, message: "Reflection saved successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Error saving reflection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

