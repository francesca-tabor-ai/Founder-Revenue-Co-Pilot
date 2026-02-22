import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const updateSchema = z.object({
  organizationId: z.string().optional(),
  customerId: z.string().nullable().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  effectiveDate: z.string().datetime().optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const item = await prisma.revenueEvent.findUnique({
    where: { id: (await params).id },
    include: { organization: true, customer: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const data = { ...parsed.data } as Record<string, unknown>;
    if (parsed.data.effectiveDate) data.effectiveDate = new Date(parsed.data.effectiveDate);
    const item = await prisma.revenueEvent.update({
      where: { id: (await params).id },
      data,
      include: { organization: true, customer: true },
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await prisma.revenueEvent.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
