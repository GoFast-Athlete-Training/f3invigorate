import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentF3HIM } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.volunteerApplication.findMany({
    where: { volunteerId: f3him.id },
    include: {
      opportunity: {
        include: { organization: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}
