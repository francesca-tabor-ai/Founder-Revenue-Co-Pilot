import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const updateSchema = z.object({
  organizationId: z.string().optional(),
  planId: z.string().optional(),
  status: z.string().optional(),
  currentPeriodStart: z.string().datetime().optional(),
  currentPeriodEnd: z.string().datetime().optional(),
  externalId: z.string().optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const item = await prisma.subscription.findUnique({
    where: { id: (await params).id },
    include: { organization: true, plan: true },
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
    if (parsed.data.currentPeriodStart) data.currentPeriodStart = new Date(parsed.data.currentPeriodStart);
    if (parsed.data.currentPeriodEnd) data.currentPeriodEnd = new Date(parsed.data.currentPeriodEnd);
    const item = await prisma.subscription.update({
      where: { id: (await params).id },
      data,
      include: { organization: true, plan: true },
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  await prisma.subscription.delete({ where: { id: (await params).id } });
  return NextResponse.json({ ok: true });
}
