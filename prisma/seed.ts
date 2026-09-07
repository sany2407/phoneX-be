import { PrismaClient, Role, DiscountType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

async function main() {
  console.log('🌱 Seeding Phonex database...');

  // ─── Users ──────────────────────────────────────────────
  console.log('Creating users...');
  const superAdminHash = await hashPassword('SuperAdmin123');
  const adminHash = await hashPassword('Admin123');
  const customerHash = await hashPassword('Customer123');

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@phonex.in' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@phonex.in',
      passwordHash: superAdminHash,
      role: Role.SUPER_ADMIN,
      phone: '9000000001',
    },
  });

  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@phonex.in' },
    update: {},
    create: {
      name: 'Phonex Admin',
      email: 'admin@phonex.in',
      passwordHash: adminHash,
      role: Role.ADMIN,
      phone: '9000000002',
    },
  });

  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: customerHash,
        phone: '9876543210',
        cart: { create: {} },
        wishlist: { create: {} },
      },
    }),
    prisma.user.upsert({
      where: { email: 'priya@example.com' },
      update: {},
      create: {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        passwordHash: customerHash,
        phone: '9876543211',
        cart: { create: {} },
        wishlist: { create: {} },
      },
    }),
    prisma.user.upsert({
      where: { email: 'rahul@example.com' },
      update: {},
      create: {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        passwordHash: customerHash,
        phone: '9876543212',
        cart: { create: {} },
        wishlist: { create: {} },
      },
    }),
  ]);

  console.log(`✅ Created ${customers.length} customers, 1 admin, 1 super admin`);

  // ─── Device Brands ──────────────────────────────────────
  console.log('Creating device brands and models...');

  const apple = await prisma.deviceBrand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: { name: 'Apple', slug: 'apple', logoUrl: 'https://cdn.phonex.in/brands/apple.png' },
  });

  const samsung = await prisma.deviceBrand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: { name: 'Samsung', slug: 'samsung', logoUrl: 'https://cdn.phonex.in/brands/samsung.png' },
  });

  const oneplus = await prisma.deviceBrand.upsert({
    where: { slug: 'oneplus' },
    update: {},
    create: { name: 'OnePlus', slug: 'oneplus', logoUrl: 'https://cdn.phonex.in/brands/oneplus.png' },
  });

  // Apple models
  const appleModels = await Promise.all([
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: apple.id, slug: 'iphone-15-pro' } },
      update: {},
      create: { brandId: apple.id, name: 'iPhone 15 Pro', slug: 'iphone-15-pro' },
    }),
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: apple.id, slug: 'iphone-15-pro-max' } },
      update: {},
      create: { brandId: apple.id, name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
    }),
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: apple.id, slug: 'iphone-15' } },
      update: {},
      create: { brandId: apple.id, name: 'iPhone 15', slug: 'iphone-15' },
    }),
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: apple.id, slug: 'iphone-14-pro' } },
      update: {},
      create: { brandId: apple.id, name: 'iPhone 14 Pro', slug: 'iphone-14-pro' },
    }),
  ]);

  // Samsung models
  const samsungModels = await Promise.all([
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: samsung.id, slug: 'galaxy-s24-ultra' } },
      update: {},
      create: { brandId: samsung.id, name: 'Galaxy S24 Ultra', slug: 'galaxy-s24-ultra' },
    }),
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: samsung.id, slug: 'galaxy-s24' } },
      update: {},
      create: { brandId: samsung.id, name: 'Galaxy S24', slug: 'galaxy-s24' },
    }),
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: samsung.id, slug: 'galaxy-a55' } },
      update: {},
      create: { brandId: samsung.id, name: 'Galaxy A55', slug: 'galaxy-a55' },
    }),
  ]);

  // OnePlus models
  const oneplusModels = await Promise.all([
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: oneplus.id, slug: 'oneplus-12' } },
      update: {},
      create: { brandId: oneplus.id, name: 'OnePlus 12', slug: 'oneplus-12' },
    }),
    prisma.deviceModel.upsert({
      where: { brandId_slug: { brandId: oneplus.id, slug: 'oneplus-nord-4' } },
      update: {},
      create: { brandId: oneplus.id, name: 'OnePlus Nord 4', slug: 'oneplus-nord-4' },
    }),
  ]);

  console.log('✅ Device brands and models created');

  // ─── Categories ─────────────────────────────────────────
  console.log('Creating categories...');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'carbon' },
      update: {},
      create: { name: 'Carbon', slug: 'carbon', description: 'Premium carbon fiber finish skins' },
    }),
    prisma.category.upsert({
      where: { slug: 'matte' },
      update: {},
      create: { name: 'Matte', slug: 'matte', description: 'Smooth matte finish skins' },
    }),
    prisma.category.upsert({
      where: { slug: 'leather' },
      update: {},
      create: { name: 'Leather', slug: 'leather', description: 'Premium leather texture skins' },
    }),
    prisma.category.upsert({
      where: { slug: 'marble' },
      update: {},
      create: { name: 'Marble', slug: 'marble', description: 'Elegant marble pattern skins' },
    }),
    prisma.category.upsert({
      where: { slug: 'printed' },
      update: {},
      create: { name: 'Printed', slug: 'printed', description: 'Custom printed design skins' },
    }),
  ]);

  const [carbon, matte, leather, marble, printed] = categories;
  console.log('✅ Categories created');

  // ─── Products (Skin Designs) ────────────────────────────
  console.log('Creating products and variants...');

  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'carbon-black' },
      update: {},
      create: {
        name: 'Carbon Black',
        slug: 'carbon-black',
        description: 'Classic carbon fiber texture in deep black. Premium 3M material.',
        categoryId: carbon.id,
        images: ['https://cdn.phonex.in/products/carbon-black-1.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'carbon-red' },
      update: {},
      create: {
        name: 'Carbon Red',
        slug: 'carbon-red',
        description: 'Striking red carbon fiber texture. Turn heads everywhere.',
        categoryId: carbon.id,
        images: ['https://cdn.phonex.in/products/carbon-red-1.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'matte-black' },
      update: {},
      create: {
        name: 'Matte Black',
        slug: 'matte-black',
        description: 'Sleek matte black finish. Fingerprint resistant.',
        categoryId: matte.id,
        images: ['https://cdn.phonex.in/products/matte-black-1.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'matte-white' },
      update: {},
      create: {
        name: 'Matte White',
        slug: 'matte-white',
        description: 'Clean matte white finish. Minimal and elegant.',
        categoryId: matte.id,
        images: ['https://cdn.phonex.in/products/matte-white-1.jpg'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'brown-leather' },
      update: {},
      create: {
        name: 'Brown Leather',
        slug: 'brown-leather',
        description: 'Premium brown leather texture. Classic sophisticated look.',
        categoryId: leather.id,
        images: ['https://cdn.phonex.in/products/brown-leather-1.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'black-leather' },
      update: {},
      create: {
        name: 'Black Leather',
        slug: 'black-leather',
        description: 'Premium black leather texture for a professional look.',
        categoryId: leather.id,
        images: ['https://cdn.phonex.in/products/black-leather-1.jpg'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'marble-white' },
      update: {},
      create: {
        name: 'Marble White',
        slug: 'marble-white',
        description: 'Luxurious white marble pattern. Elegant and unique.',
        categoryId: marble.id,
        images: ['https://cdn.phonex.in/products/marble-white-1.jpg'],
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'marble-black' },
      update: {},
      create: {
        name: 'Marble Black',
        slug: 'marble-black',
        description: 'Dramatic black marble veining pattern.',
        categoryId: marble.id,
        images: ['https://cdn.phonex.in/products/marble-black-1.jpg'],
      },
    }),
  ]);

  const [carbonBlack, carbonRed, matteBlack, matteWhite, brownLeather, blackLeather, marbleWhite, marbleBlack] = products;

  // Create variants for iPhone 15 Pro
  const iphone15Pro = appleModels[0];
  const iphone15ProMax = appleModels[1];
  const galaxyS24Ultra = samsungModels[0];
  const oneplus12 = oneplusModels[0];

  const variantData = [
    // Carbon Black variants
    { productId: carbonBlack.id, deviceModelId: iphone15Pro.id, sku: 'CB-IP15P', price: 699, comparePrice: 899, stock: 50 },
    { productId: carbonBlack.id, deviceModelId: iphone15ProMax.id, sku: 'CB-IP15PM', price: 749, comparePrice: 949, stock: 40 },
    { productId: carbonBlack.id, deviceModelId: galaxyS24Ultra.id, sku: 'CB-SS24U', price: 699, comparePrice: 899, stock: 35 },
    { productId: carbonBlack.id, deviceModelId: oneplus12.id, sku: 'CB-OP12', price: 649, comparePrice: 849, stock: 30 },
    // Carbon Red
    { productId: carbonRed.id, deviceModelId: iphone15Pro.id, sku: 'CR-IP15P', price: 699, comparePrice: 899, stock: 45 },
    { productId: carbonRed.id, deviceModelId: galaxyS24Ultra.id, sku: 'CR-SS24U', price: 699, comparePrice: 899, stock: 30 },
    // Matte Black
    { productId: matteBlack.id, deviceModelId: iphone15Pro.id, sku: 'MB-IP15P', price: 599, comparePrice: 799, stock: 60 },
    { productId: matteBlack.id, deviceModelId: iphone15ProMax.id, sku: 'MB-IP15PM', price: 649, comparePrice: 849, stock: 50 },
    { productId: matteBlack.id, deviceModelId: galaxyS24Ultra.id, sku: 'MB-SS24U', price: 599, comparePrice: 799, stock: 45 },
    { productId: matteBlack.id, deviceModelId: oneplus12.id, sku: 'MB-OP12', price: 549, comparePrice: 749, stock: 40 },
    // Matte White
    { productId: matteWhite.id, deviceModelId: iphone15Pro.id, sku: 'MW-IP15P', price: 599, comparePrice: 799, stock: 3 }, // Low stock
    { productId: matteWhite.id, deviceModelId: galaxyS24Ultra.id, sku: 'MW-SS24U', price: 599, comparePrice: 799, stock: 25 },
    // Brown Leather
    { productId: brownLeather.id, deviceModelId: iphone15Pro.id, sku: 'BRL-IP15P', price: 849, comparePrice: 1099, stock: 35 },
    { productId: brownLeather.id, deviceModelId: iphone15ProMax.id, sku: 'BRL-IP15PM', price: 899, comparePrice: 1149, stock: 30 },
    // Black Leather
    { productId: blackLeather.id, deviceModelId: iphone15Pro.id, sku: 'BKL-IP15P', price: 849, comparePrice: 1099, stock: 2 }, // Very low stock
    // Marble White
    { productId: marbleWhite.id, deviceModelId: iphone15Pro.id, sku: 'MWH-IP15P', price: 799, comparePrice: 999, stock: 40 },
    { productId: marbleWhite.id, deviceModelId: galaxyS24Ultra.id, sku: 'MWH-SS24U', price: 799, comparePrice: 999, stock: 35 },
    // Marble Black
    { productId: marbleBlack.id, deviceModelId: iphone15Pro.id, sku: 'MBK-IP15P', price: 799, comparePrice: 999, stock: 30 },
  ];

  for (const v of variantData) {
    await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: {},
      create: {
        productId: v.productId,
        deviceModelId: v.deviceModelId,
        sku: v.sku,
        price: new Decimal(v.price),
        comparePrice: new Decimal(v.comparePrice),
        stock: v.stock,
      },
    });
  }

  console.log(`✅ Created ${products.length} products with ${variantData.length} variants`);

  // ─── Coupons ─────────────────────────────────────────────
  console.log('Creating coupons...');

  await prisma.coupon.upsert({
    where: { code: 'PHONEX10' },
    update: {},
    create: {
      code: 'PHONEX10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal(10),
      minOrderValue: new Decimal(499),
      maxDiscount: new Decimal(150),
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimit: 10000,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FLAT50' },
    update: {},
    create: {
      code: 'FLAT50',
      discountType: DiscountType.FLAT,
      discountValue: new Decimal(50),
      minOrderValue: new Decimal(399),
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimit: 5000,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Decimal(20),
      minOrderValue: new Decimal(599),
      maxDiscount: new Decimal(200),
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimit: 1,
    },
  });

  console.log('✅ Coupons created: PHONEX10, FLAT50, WELCOME20');

  console.log('\n🎉 Seeding completed!');
  console.log('\n📧 Test credentials:');
  console.log('   Super Admin: superadmin@phonex.in / SuperAdmin123');
  console.log('   Admin:       admin@phonex.in / Admin123');
  console.log('   Customer:    john@example.com / Customer123');
  console.log('\n🎟️  Coupons: PHONEX10 (10% off, min ₹499) | FLAT50 (₹50 off, min ₹399) | WELCOME20 (20% off, min ₹599)');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
