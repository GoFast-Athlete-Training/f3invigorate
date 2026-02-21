import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const createOrganizationSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  contactEmail: z.string().email().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
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
        website: data.website,
        logoUrl: data.logoUrl,
        city: data.city,
        state: data.state,
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
