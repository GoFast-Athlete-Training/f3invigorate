import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentF3HIM } from "@/lib/auth";

export const dynamic = "force-dynamic";

const commitSchema = z.object({
  note: z.string().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const f3him = await getCurrentF3HIM();
    if (!f3him) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: opportunityId } = await params;
    const body = await request.json().catch(() => ({}));
    const data = commitSchema.parse(body);

    const commitment = await prisma.volunteerCommitment.create({
      data: {
        f3himId: f3him.id,
        opportunityId,
        note: data.note,
      },
    });

    return NextResponse.json(commitment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Commit to opportunity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
