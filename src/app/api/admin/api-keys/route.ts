import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const createSchema = z.object({
  organizationId: z.string(),
  name: z.string(),
  expiresAt: z.string().datetime().optional(),
});

function generateKey() {
  return `frcp_${crypto.randomBytes(32).toString("hex")}`;
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const items = await prisma.apiKey.findMany({
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
    const rawKey = generateKey();
    const keyHash = await bcrypt.hash(rawKey, 12);
    const keyPrefix = rawKey.slice(0, 12) + "...";
    const item = await prisma.apiKey.create({
      data: {
        organizationId: parsed.data.organizationId,
        name: parsed.data.name,
        keyHash,
        keyPrefix,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
      include: { organization: true },
    });
    return NextResponse.json({ ...item, rawKey });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
