import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const createSchema = z.object({
  organizationId: z.string(),
  customerId: z.string().optional(),
  amount: z.number(),
  currency: z.string().default("USD"),
  type: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  effectiveDate: z.string().datetime(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const items = await prisma.revenueEvent.findMany({
    include: { organization: true, customer: true },
    orderBy: { createdAt: "desc" },
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
    const data = { ...parsed.data, effectiveDate: new Date(parsed.data.effectiveDate) };
    const item = await prisma.revenueEvent.create({
      data: data as any,
      include: { organization: true, customer: true },
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
