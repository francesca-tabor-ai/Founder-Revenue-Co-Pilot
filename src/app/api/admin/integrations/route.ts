import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const createSchema = z.object({
  organizationId: z.string(),
  type: z.enum(["STRIPE", "BILLING", "CUSTOM"]),
  name: z.string(),
  config: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const items = await prisma.integration.findMany({
    include: { organization: true },
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
    const item = await prisma.integration.create({
      data: parsed.data as any,
      include: { organization: true },
    });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
