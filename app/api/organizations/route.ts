import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createOrganizationSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  contactEmail: z.string().email(),
  website: z.string().optional(),
  location: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createOrganizationSchema.parse(body);

    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        description: data.description,
        contactEmail: data.contactEmail,
        website: data.website || undefined,
        location: data.location,
      },
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Create organization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
