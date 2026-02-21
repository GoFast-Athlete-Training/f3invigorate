import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CommitmentType, OpportunityStatus, LocationType, ServiceCause } from "@prisma/client";
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
            category: r.causes[0] ?? "COMMUNITY_GENERAL",
            commitmentType: r.commitmentType,
            isRemote: r.locationType === "REMOTE" || r.locationType === "HYBRID",
            location: r.city && r.state ? `${r.city}, ${r.state}` : null,
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
  skillsNeeded: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  commitmentType: z.nativeEnum(CommitmentType),
  hoursCommitment: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  locationType: z.nativeEnum(LocationType).default("IN_PERSON"),
  causes: z.array(z.nativeEnum(ServiceCause)).default([]),
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
        skillsNeeded: data.skillsNeeded,
        city: data.city,
        state: data.state,
        address: data.address,
        commitmentType: data.commitmentType,
        hoursCommitment: data.hoursCommitment,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        locationType: data.locationType,
        causes: data.causes,
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
