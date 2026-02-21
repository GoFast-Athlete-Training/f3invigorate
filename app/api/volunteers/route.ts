import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ServiceCause } from "@prisma/client";
import { getCurrentF3HIM } from "@/lib/auth";

export const dynamic = "force-dynamic";

const updateProfileSchema = z.object({
  photoURL: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  myCauses: z.array(z.nativeEnum(ServiceCause)).default([]),
  volunteerSkills: z.string().optional(),
  availability: z.string().optional(),
});

export async function GET() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    f3himId: f3him.id,
    photoURL: f3him.photoURL,
    bio: f3him.bio,
    phoneNumber: f3him.phoneNumber,
    city: f3him.city,
    state: f3him.state,
    myCauses: f3him.myCauses,
    volunteerSkills: f3him.volunteerSkills,
    availability: f3him.availability,
  });
}

export async function PUT(request: Request) {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const data = updateProfileSchema.parse(body);

    const updated = await prisma.f3HIM.update({
      where: { id: f3him.id },
      data: {
        photoURL: data.photoURL || null,
        bio: data.bio,
        phoneNumber: data.phoneNumber,
        city: data.city,
        state: data.state,
        myCauses: data.myCauses,
        volunteerSkills: data.volunteerSkills,
        availability: data.availability,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
