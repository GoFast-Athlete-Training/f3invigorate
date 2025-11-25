import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const weeklyReflectionSchema = z.object({
  mood: z.string().optional(),
  wins: z.string().optional(),
  struggles: z.string().optional(),
  intention: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const athlete = await getCurrentAthlete();
    if (!athlete) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = weeklyReflectionSchema.parse(body);

    // Create weekly reflection
    await prisma.weeklyReflection.create({
      data: {
        athleteId: athlete.id,
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

