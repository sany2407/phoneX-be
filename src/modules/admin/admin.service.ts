import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination';

export async function getDashboardStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    pendingOrders,
    totalCustomers,
    lowStockCount,
    revenueData,
    todayRevenueData,
  ] = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
    prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
    prisma.productVariant.count({ where: { isActive: true, stock: { lt: 5 } } }),
    prisma.order.aggregate({
      where: { status: { in: ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'] } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart },
        status: { in: ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'] },
      },
      _sum: { total: true },
    }),
  ]);

  return {
    totalOrders,
    todayOrders,
    pendingOrders,
    totalCustomers,
    lowStockProducts: lowStockCount,
    totalRevenue: Number(revenueData._sum.total || 0),
    todayRevenue: Number(todayRevenueData._sum.total || 0),
  };
}

export async function getOrderStatusBreakdown() {
  const breakdown = await prisma.order.groupBy({ by: ['status'], _count: true });
  return breakdown.map((b: { status: string; _count: number }) => ({
    status: b.status,
    count: b._count,
  }));
}

export async function getTopProducts(limit = 10) {
  const results = await prisma.orderItem.groupBy({
    by: ['variantId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: limit,
  });

  const variantIds = results.map((r: { variantId: string }) => r.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: { select: { name: true, slug: true, images: true } },
      deviceModel: { include: { brand: { select: { name: true } } } },
    },
  });

  return results.map((r: { variantId: string; _sum: { quantity: number | null } }) => ({
    variantId: r.variantId,
    totalSold: r._sum.quantity,
    variant: variants.find((v: { id: string }) => v.id === r.variantId),
  }));
}

export async function getSalesAnalytics(query: { from?: string; to?: string }) {
  const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = query.to ? new Date(query.to) : new Date();

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      status: { in: ['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'] },
    },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const dailyMap = new Map<string, { revenue: number; orders: number }>();
  orders.forEach((o: { total: { toString: () => string }; createdAt: Date }) => {
    const day = o.createdAt.toISOString().split('T')[0];
    const existing = dailyMap.get(day) || { revenue: 0, orders: 0 };
    dailyMap.set(day, { revenue: existing.revenue + Number(o.total), orders: existing.orders + 1 });
  });

  return Array.from(dailyMap.entries()).map(([date, data]: [string, { revenue: number; orders: number }]) => ({
    date,
    ...data,
  }));
}

export async function getCustomerStats(query: { from?: string; to?: string }) {
  const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = query.to ? new Date(query.to) : new Date();

  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER', createdAt: { gte: from, lte: to } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const dailyMap = new Map<string, number>();
  users.forEach((u: { createdAt: Date }) => {
    const day = u.createdAt.toISOString().split('T')[0];
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
  });

  return Array.from(dailyMap.entries()).map(([date, newCustomers]: [string, number]) => ({
    date,
    newCustomers,
  }));
}

export async function listUsers(query: {
  page?: string;
  limit?: string;
  role?: string;
  search?: string;
  isActive?: string;
}) {
  const { page, limit, skip } = parsePagination(query);
  const where: Record<string, unknown> = {};
  if (query.role) where.role = query.role;
  if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, isActive: true, createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
  ]);
  return { users, pagination: buildPaginationMeta(total, page, limit) };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, isActive: true, createdAt: true,
      _count: { select: { orders: true } },
      orders: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, total: true, createdAt: true },
      },
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
}

export async function updateUserRole(id: string, role: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found', 404);
  return prisma.user.update({
    where: { id },
    data: { role: role as never },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
}
