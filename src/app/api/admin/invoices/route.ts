import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const createSchema = z.object({
  organizationId: z.string(),
  customerId: z.string().optional(),
  number: z.string(),
  amount: z.number(),
  currency: z.string().default("USD"),
  status: z.string().default("draft"),
  dueDate: z.string().datetime().optional(),
  paidAt: z.string().datetime().optional(),
  externalId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const items = await prisma.invoice.findMany({
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
    const data = {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      paidAt: parsed.data.paidAt ? new Date(parsed.data.paidAt) : null,
    };
    const item = await prisma.invoice.create({
      data: data as any,
      include: { organization: true, customer: true },
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
