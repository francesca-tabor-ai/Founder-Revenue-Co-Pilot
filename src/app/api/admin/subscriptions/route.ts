import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const createSchema = z.object({
  organizationId: z.string(),
  planId: z.string(),
  status: z.string().default("active"),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  externalId: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const items = await prisma.subscription.findMany({
    include: { organization: true, plan: true },
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
    const data = {
      ...parsed.data,
      currentPeriodStart: new Date(parsed.data.currentPeriodStart),
      currentPeriodEnd: new Date(parsed.data.currentPeriodEnd),
    };
    const item = await prisma.subscription.create({
      data: data as any,
      include: { organization: true, plan: true },
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
