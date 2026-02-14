import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CommitmentType, OpportunityCategory, OpportunityStatus } from "@prisma/client";
import type { DisplayOpportunity } from "@/lib/volunteer-fake-data";
import { FAKE_OPPORTUNITIES } from "@/lib/volunteer-fake-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.volunteerOpportunity.findMany({
      where: { status: "OPEN" },
      include: { organization: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const opportunities: DisplayOpportunity[] =
      rows.length > 0
        ? rows.map((r) => ({
            id: r.id,
            slug: null,
            title: r.title,
            description: r.description,
            organizationName: r.organization.name,
            category: r.category,
            commitmentType: r.commitmentType,
            isRemote: r.isRemote,
            location: r.location ?? null,
          }))
        : FAKE_OPPORTUNITIES;
    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error("List opportunities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createOpportunitySchema = z.object({
  organizationId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  category: z.nativeEnum(OpportunityCategory),
  location: z.string().optional(),
  commitmentType: z.nativeEnum(CommitmentType),
  estimatedHours: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isRemote: z.boolean().default(false),
  requiredSkills: z.array(z.string()).default([]),
  volunteersNeeded: z.number().int().min(1).default(1),
  status: z.nativeEnum(OpportunityStatus).default(OpportunityStatus.OPEN),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createOpportunitySchema.parse(body);

    const opportunity = await prisma.volunteerOpportunity.create({
      data: {
        organizationId: data.organizationId,
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        commitmentType: data.commitmentType,
        estimatedHours: data.estimatedHours,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isRemote: data.isRemote,
        requiredSkills: data.requiredSkills,
        volunteersNeeded: data.volunteersNeeded,
        status: data.status,
      },
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Create opportunity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
