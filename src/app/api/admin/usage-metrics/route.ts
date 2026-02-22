import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const createSchema = z.object({
  organizationId: z.string(),
  metricType: z.string(),
  value: z.number(),
  period: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const items = await prisma.usageMetric.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const item = await prisma.usageMetric.create({ data: parsed.data as any });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
