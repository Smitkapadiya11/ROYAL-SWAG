import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function validateAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("rs_admin_token")?.value;
  if (!token) return false;
  const session = await db.adminSession.findUnique({ where: { token } }).catch(() => null);
  return !!session && session.expiresAt > new Date();
}

export async function GET(req: NextRequest) {
  if (!(await validateAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [orders, lungTests, paid, pending, failed, revenue, totalTests, highRisk, converted] =
    await Promise.all([
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { customer: true },
      }),
      db.lungTestResult.findMany({
        orderBy: { submittedAt: "desc" },
        take: 200,
        include: { customer: true },
      }),
      db.order.count({ where: { status: "PAID" } }),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "FAILED" } }),
      db.order.aggregate({
        where: { status: "PAID" },
        _sum: { amountINR: true },
      }),
      db.lungTestResult.count(),
      db.lungTestResult.count({ where: { riskLevel: "HIGH" } }),
      db.lungTestResult.count({ where: { convertedToOrder: true } }),
    ]);

  return NextResponse.json({
    orders,
    lungTests,
    stats: {
      paidOrders: paid,
      pendingOrders: pending,
      failedOrders: failed,
      totalRevenue: revenue._sum.amountINR ?? 0,
      totalLungTests: totalTests,
      highRiskTests: highRisk,
      testConversions: converted,
    },
  });
}
