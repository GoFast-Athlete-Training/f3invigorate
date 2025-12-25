import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentF3HIM } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent build-time execution
export const dynamic = "force-dynamic";

const createBackblastSchema = z.object({
  ao: z.string().min(1, "AO is required"),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  pax: z.string().min(1, "PAX is required"),
});

export async function POST(request: NextRequest) {
  try {
    const f3him = await getCurrentF3HIM();
    if (!f3him) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createBackblastSchema.parse(body);

    // Parse date (handle both ISO string and YYYY-MM-DD format)
    const date = validated.date.includes("T")
      ? new Date(validated.date)
      : new Date(validated.date + "T12:00:00");
    date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

    // Parse PAX emails
    const emails = validated.pax
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emails.length === 0) {
      return NextResponse.json({ error: "No valid emails provided" }, { status: 400 });
    }

    // Resolve each email to F3HIM ID
    const f3hims = await prisma.f3HIM.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });

    if (f3hims.length === 0) {
      return NextResponse.json(
        { error: "No F3HIMs found for provided emails" },
        { status: 404 }
      );
    }

    // Create attendance records for each F3HIM
    const attendanceRecords = f3hims.map((him) => ({
      f3HIMId: him.id,
      aoId: validated.ao,
      date: date,
      source: "BACKBLAST" as const,
    }));

    await prisma.attendanceRecord.createMany({
      data: attendanceRecords,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: `Created ${f3hims.length} attendance record(s)`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Error creating backblast:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

