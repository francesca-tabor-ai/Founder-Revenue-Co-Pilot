import { PrismaClient, UserRole, PlanType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = "Admin123!@#";
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@founderrevenue.com" },
    update: {},
    create: {
      email: "admin@founderrevenue.com",
      passwordHash: adminHash,
      name: "Admin User",
      role: UserRole.ADMIN,
    },
  });

  console.log("Created admin user:", admin.email);

  // Create regular user for testing
  const userPassword = "User123!@#";
  const userHash = await bcrypt.hash(userPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      passwordHash: userHash,
      name: "Demo User",
      role: UserRole.USER,
    },
  });

  // Create plans
  const individualPlan = await prisma.plan.upsert({
    where: { id: "plan-individual" },
    update: {},
    create: {
      id: "plan-individual",
      name: "Individual",
      type: PlanType.INDIVIDUAL,
      price: 29,
      currency: "USD",
      interval: "month",
      features: { seats: 1, apiCalls: 10000 },
    },
  });

  const teamPlan = await prisma.plan.upsert({
    where: { id: "plan-team" },
    update: {},
    create: {
      id: "plan-team",
      name: "Team",
      type: PlanType.TEAM,
      price: 99,
      currency: "USD",
      interval: "month",
      features: { seats: 5, apiCalls: 50000 },
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { id: "plan-enterprise" },
    update: {},
    create: {
      id: "plan-enterprise",
      name: "Enterprise",
      type: PlanType.ENTERPRISE,
      price: 299,
      currency: "USD",
      interval: "month",
      features: { seats: -1, apiCalls: -1 },
    },
  });

  console.log("Created plans:", individualPlan.name, teamPlan.name, enterprisePlan.name);

  // Create organization for the user
  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo-org",
      ownerId: user.id,
    },
  });

  // Create subscription for the org
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const existingSub = await prisma.subscription.findFirst({ where: { organizationId: org.id } });
  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        organizationId: org.id,
        planId: individualPlan.id,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });
  }

  // Create sample customers
  await prisma.customer.createMany({
    data: [
      { organizationId: org.id, email: "customer1@example.com", name: "Customer One" },
      { organizationId: org.id, email: "customer2@example.com", name: "Customer Two" },
    ],
    skipDuplicates: true,
  });

  // Create sample revenue event
  const customers = await prisma.customer.findMany({ where: { organizationId: org.id } });
  if (customers[0]) {
    await prisma.revenueEvent.create({
      data: {
        organizationId: org.id,
        customerId: customers[0].id,
        amount: 29,
        currency: "USD",
        type: "subscription",
        description: "Monthly subscription",
        effectiveDate: now,
      },
    });
  }

  // Create sample invoice
  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: customers[0]?.id,
      number: "INV-001",
      amount: 29,
      currency: "USD",
      status: "paid",
      dueDate: now,
      paidAt: now,
    },
  });

  // Create sample integration
  await prisma.integration.create({
    data: {
      organizationId: org.id,
      type: "STRIPE",
      name: "Stripe",
      config: {},
      isActive: true,
    },
  });

  console.log("Database seeded successfully!");
  console.log("Admin credentials: admin@founderrevenue.com / Admin123!@#");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
