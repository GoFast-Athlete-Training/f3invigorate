import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CommitmentType } from "@prisma/client";
import { getCurrentF3HIM } from "@/lib/auth";

export const dynamic = "force-dynamic";

const updateProfileSchema = z.object({
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  availability: z.string().default(""),
  commitmentPreference: z.nativeEnum(CommitmentType),
  remotePreference: z.boolean().default(false),
});

export async function GET() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.volunteerProfile.findUnique({
    where: { f3himId: f3him.id },
  });

  return NextResponse.json(
    profile ?? {
      f3himId: f3him.id,
      skills: [],
      interests: [],
      availability: "",
      commitmentPreference: "ONE_TIME",
      remotePreference: false,
    }
  );
}

export async function PUT(request: Request) {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const data = updateProfileSchema.parse(body);

    const profile = await prisma.volunteerProfile.upsert({
      where: { f3himId: f3him.id },
      update: {
        skills: data.skills,
        interests: data.interests,
        availability: data.availability,
        commitmentPreference: data.commitmentPreference,
        remotePreference: data.remotePreference,
      },
      create: {
        f3himId: f3him.id,
        skills: data.skills,
        interests: data.interests,
        availability: data.availability,
        commitmentPreference: data.commitmentPreference,
        remotePreference: data.remotePreference,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Update volunteer profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
