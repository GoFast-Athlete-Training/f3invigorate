import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const manualEffortSchema = z.object({
  calories: z.coerce.number().int().positive("Calories must be positive"),
  durationMinutes: z.coerce.number().int().positive("Duration must be positive"),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export async function POST(request: NextRequest) {
  try {
    const athlete = await getCurrentAthlete();
    if (!athlete) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = manualEffortSchema.parse(body);

    // Parse date (handle both ISO string and YYYY-MM-DD format)
    const date = validated.date.includes("T")
      ? new Date(validated.date)
      : new Date(validated.date + "T12:00:00");
    date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

    // Convert minutes to seconds
    const durationSec = validated.durationMinutes * 60;

    // Compute calories per minute
    const calPerMin = validated.calories / validated.durationMinutes;

    // Create effort record
    await prisma.effortRecord.create({
      data: {
        athleteId: athlete.id,
        date: date,
        calories: validated.calories,
        durationSec: durationSec,
        calPerMin: calPerMin,
      },
    });

    return NextResponse.json({ success: true, message: "Effort logged successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Error logging effort:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

