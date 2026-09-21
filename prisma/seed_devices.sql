-- ============================================================
-- DEVICE BRANDS & MODELS SEED
-- Run this after your migrations are applied
-- ============================================================

-- ─── Brands ─────────────────────────────────────────────────

INSERT INTO device_brands (id, name, slug, "logoUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Apple',    'apple',    NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000002', 'Samsung',  'samsung',  NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000003', 'OnePlus',  'oneplus',  NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000004', 'Google',   'google',   NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000005', 'Xiaomi',   'xiaomi',   NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000006', 'Redmi',    'redmi',    NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000007', 'Vivo',     'vivo',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000008', 'OPPO',     'oppo',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000009', 'Realme',   'realme',   NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000010', 'Motorola', 'motorola', NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000011', 'Nothing',  'nothing',  NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000012', 'iQOO',     'iqoo',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000013', 'ASUS',     'asus',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000014', 'Sony',     'sony',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000015', 'Honor',    'honor',    NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000016', 'Tecno',    'tecno',    NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000017', 'Infinix',  'infinix',  NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000018', 'Nokia',    'nokia',    NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000019', 'Lava',     'lava',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000020', 'Dell',     'dell',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000021', 'HP',       'hp',       NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000022', 'Lenovo',   'lenovo',   NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000023', 'Acer',     'acer',     NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000024', 'MSI',      'msi',      NULL, true, NOW(), NOW()),
  ('b0000001-0000-0000-0000-000000000025', 'Microsoft','microsoft',NULL, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;


-- ─── Device Models ───────────────────────────────────────────
-- ────────────────────────────────────────────────────────────
-- SMARTPHONES
-- ────────────────────────────────────────────────────────────

-- Apple iPhones
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0001001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'iPhone 18 Pro',      'iphone-18-pro',       NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'iPhone 18 Pro Max',  'iphone-18-pro-max',   NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'iPhone 17',          'iphone-17',           NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'iPhone Air',         'iphone-air',          NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', 'iPhone 17 Pro',      'iphone-17-pro',       NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000001', 'iPhone 17 Pro Max',  'iphone-17-pro-max',   NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000001', 'iPhone 16',          'iphone-16',           NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000001', 'iPhone 16 Plus',     'iphone-16-plus',      NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000001', 'iPhone 16 Pro',      'iphone-16-pro',       NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000001', 'iPhone 16 Pro Max',  'iphone-16-pro-max',   NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001', 'iPhone 16e',         'iphone-16e',          NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000001', 'iPhone 15',          'iphone-15',           NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000001', 'iPhone 15 Plus',     'iphone-15-plus',      NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000001', 'iPhone 15 Pro',      'iphone-15-pro',       NULL, true, NOW(), NOW()),
  ('m0001001-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000001', 'iPhone 15 Pro Max',  'iphone-15-pro-max',   NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Samsung
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0002001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002', 'Galaxy S26',         'galaxy-s26',          NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'Galaxy S26+',        'galaxy-s26-plus',     NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002', 'Galaxy S26 Ultra',   'galaxy-s26-ultra',    NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000002', 'Galaxy S26 Edge',    'galaxy-s26-edge',     NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Z Fold8',     'galaxy-z-fold8',      NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Z Flip8',     'galaxy-z-flip8',      NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002', 'Galaxy A57',         'galaxy-a57',          NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000002', 'Galaxy A37',         'galaxy-a37',          NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000002', 'Galaxy A27',         'galaxy-a27',          NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000002', 'Galaxy M57',         'galaxy-m57',          NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000002', 'Galaxy M47',         'galaxy-m47',          NULL, true, NOW(), NOW()),
  ('m0002001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000002', 'Galaxy M37',         'galaxy-m37',          NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- OnePlus
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0003001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003', 'OnePlus 15',         'oneplus-15',          NULL, true, NOW(), NOW()),
  ('m0003001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003', 'OnePlus 15R',        'oneplus-15r',         NULL, true, NOW(), NOW()),
  ('m0003001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000003', 'OnePlus 13',         'oneplus-13',          NULL, true, NOW(), NOW()),
  ('m0003001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000003', 'OnePlus 13R',        'oneplus-13r',         NULL, true, NOW(), NOW()),
  ('m0003001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Nord 6',     'oneplus-nord-6',      NULL, true, NOW(), NOW()),
  ('m0003001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Nord CE6',   'oneplus-nord-ce6',    NULL, true, NOW(), NOW()),
  ('m0003001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Nord 5',     'oneplus-nord-5',      NULL, true, NOW(), NOW()),
  ('m0003001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Nord CE5',   'oneplus-nord-ce5',    NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Google Pixel (6 through 11 Pro XL)
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0004001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000004', 'Pixel 6',            'pixel-6',             NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000004', 'Pixel 6 Pro',        'pixel-6-pro',         NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000004', 'Pixel 6a',           'pixel-6a',            NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000004', 'Pixel 7',            'pixel-7',             NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000004', 'Pixel 7 Pro',        'pixel-7-pro',         NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000004', 'Pixel 7a',           'pixel-7a',            NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000004', 'Pixel 8',            'pixel-8',             NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000004', 'Pixel 8 Pro',        'pixel-8-pro',         NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000004', 'Pixel 8a',           'pixel-8a',            NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000004', 'Pixel 9',            'pixel-9',             NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000004', 'Pixel 9 Pro',        'pixel-9-pro',         NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000004', 'Pixel 9 Pro XL',     'pixel-9-pro-xl',      NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000004', 'Pixel 9a',           'pixel-9a',            NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000004', 'Pixel 10',           'pixel-10',            NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000004', 'Pixel 10 Pro',       'pixel-10-pro',        NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000004', 'Pixel 10 Pro XL',    'pixel-10-pro-xl',     NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000004', 'Pixel 10a',          'pixel-10a',           NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000004', 'Pixel 11',           'pixel-11',            NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000004', 'Pixel 11 Pro',       'pixel-11-pro',        NULL, true, NOW(), NOW()),
  ('m0004001-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000004', 'Pixel 11 Pro XL',    'pixel-11-pro-xl',     NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Xiaomi
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0005001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000005', 'Xiaomi 17',          'xiaomi-17',           NULL, true, NOW(), NOW()),
  ('m0005001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000005', 'Xiaomi 17 Pro',      'xiaomi-17-pro',       NULL, true, NOW(), NOW()),
  ('m0005001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000005', 'Xiaomi 15',          'xiaomi-15',           NULL, true, NOW(), NOW()),
  ('m0005001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000005', 'Xiaomi 15 Ultra',    'xiaomi-15-ultra',     NULL, true, NOW(), NOW()),
  -- Xiaomi Tablets
  ('m0005001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000005', 'Xiaomi Pad 7',       'xiaomi-pad-7',        NULL, true, NOW(), NOW()),
  ('m0005001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000005', 'Xiaomi Pad 7 Pro',   'xiaomi-pad-7-pro',    NULL, true, NOW(), NOW()),
  ('m0005001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000005', 'Xiaomi Pad 8',       'xiaomi-pad-8',        NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Redmi
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0006001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000006', 'Redmi Note 15',      'redmi-note-15',       NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000006', 'Redmi Note 15 Pro',  'redmi-note-15-pro',   NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000006', 'Redmi Note 15 Pro+', 'redmi-note-15-pro-plus', NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000006', 'Redmi 15',           'redmi-15',            NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000006', 'Redmi 15 5G',        'redmi-15-5g',         NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000006', 'Redmi A5',           'redmi-a5',            NULL, true, NOW(), NOW()),
  -- Redmi Tablets
  ('m0006001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000006', 'Redmi Pad 2',        'redmi-pad-2',         NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000006', 'Redmi Pad 2 Pro',    'redmi-pad-2-pro',     NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000006', 'Redmi Pad 2 Pro 5G', 'redmi-pad-2-pro-5g',  NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000006', 'Redmi Pad 2 Wi-Fi',  'redmi-pad-2-wifi',    NULL, true, NOW(), NOW()),
  ('m0006001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000006', 'Redmi Pad 2 Cellular','redmi-pad-2-cellular',NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Vivo
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0007001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000007', 'Vivo X300',          'vivo-x300',           NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000007', 'Vivo X300 Pro',      'vivo-x300-pro',       NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000007', 'Vivo X300 FE',       'vivo-x300-fe',        NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000007', 'Vivo V70',           'vivo-v70',            NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000007', 'Vivo V70 FE',        'vivo-v70-fe',         NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000007', 'Vivo T5',            'vivo-t5',             NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000007', 'Vivo T5x',           'vivo-t5x',            NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000007', 'Vivo Y400',          'vivo-y400',           NULL, true, NOW(), NOW()),
  ('m0007001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000007', 'Vivo Y300',          'vivo-y300',           NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- OPPO
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0008001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000008', 'Find X9',            'find-x9',             NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000008', 'Find X9 Pro',        'find-x9-pro',         NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000008', 'Reno 14',            'reno-14',             NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000008', 'Reno 14 Pro',        'reno-14-pro',         NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000008', 'Reno 15',            'reno-15',             NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000008', 'Reno 15 Pro',        'reno-15-pro',         NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000008', 'K13',                'k13',                 NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000008', 'A6',                 'a6',                  NULL, true, NOW(), NOW()),
  ('m0008001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000008', 'A6x',                'a6x',                 NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Realme
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0009001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000009', 'Realme 16',          'realme-16',           NULL, true, NOW(), NOW()),
  ('m0009001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000009', 'Realme 16 Pro',      'realme-16-pro',       NULL, true, NOW(), NOW()),
  ('m0009001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000009', 'Realme 16 Pro+',     'realme-16-pro-plus',  NULL, true, NOW(), NOW()),
  ('m0009001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000009', 'Realme P4',          'realme-p4',           NULL, true, NOW(), NOW()),
  ('m0009001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000009', 'Realme P4 Pro',      'realme-p4-pro',       NULL, true, NOW(), NOW()),
  ('m0009001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000009', 'Realme P4x',         'realme-p4x',          NULL, true, NOW(), NOW()),
  ('m0009001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000009', 'Realme GT 7',        'realme-gt-7',         NULL, true, NOW(), NOW()),
  ('m0009001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000009', 'Realme GT 7 Pro',    'realme-gt-7-pro',     NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Motorola
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0010001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000010', 'Edge 70',            'edge-70',             NULL, true, NOW(), NOW()),
  ('m0010001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000010', 'Edge 70 Pro',        'edge-70-pro',         NULL, true, NOW(), NOW()),
  ('m0010001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000010', 'Edge 60',            'edge-60',             NULL, true, NOW(), NOW()),
  ('m0010001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000010', 'Edge 60 Pro',        'edge-60-pro',         NULL, true, NOW(), NOW()),
  ('m0010001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000010', 'Moto G86',           'moto-g86',            NULL, true, NOW(), NOW()),
  ('m0010001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000010', 'Moto G76',           'moto-g76',            NULL, true, NOW(), NOW()),
  ('m0010001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000010', 'Razr 70',            'razr-70',             NULL, true, NOW(), NOW()),
  ('m0010001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000010', 'Razr 70 Ultra',      'razr-70-ultra',       NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- LAPTOPS
-- ────────────────────────────────────────────────────────────

-- Apple MacBooks (brand already inserted above)
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0001002-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'MacBook Air 13-inch',  'macbook-air-13',       NULL, true, NOW(), NOW()),
  ('m0001002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'MacBook Air 15-inch',  'macbook-air-15',       NULL, true, NOW(), NOW()),
  ('m0001002-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'MacBook Pro 14-inch',  'macbook-pro-14',       NULL, true, NOW(), NOW()),
  ('m0001002-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'MacBook Pro 16-inch',  'macbook-pro-16',       NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Dell
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0020001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000020', 'Inspiron 14',          'inspiron-14',          NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000020', 'Inspiron 15',          'inspiron-15',          NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000020', 'Inspiron 16',          'inspiron-16',          NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000020', 'XPS 13',               'xps-13',               NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000020', 'XPS 14',               'xps-14',               NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000020', 'XPS 16',               'xps-16',               NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000020', 'Latitude 14',          'latitude-14',          NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000020', 'Latitude 15',          'latitude-15',          NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000020', 'G15',                  'g15',                  NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000020', 'G16',                  'g16',                  NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000020', 'Alienware 16',         'alienware-16',         NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000020', 'Vostro 14',            'vostro-14',            NULL, true, NOW(), NOW()),
  ('m0020001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000020', 'Vostro 15',            'vostro-15',            NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- HP
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0021001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000021', 'OmniBook 3',           'omnibook-3',           NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000021', 'OmniBook 5',           'omnibook-5',           NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000021', 'OmniBook 7',           'omnibook-7',           NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000021', 'OmniBook X',           'omnibook-x',           NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000021', 'OmniBook Ultra',       'omnibook-ultra',       NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000021', 'EliteBook 8',          'elitebook-8',          NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000021', 'ProBook',              'probook',              NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000021', 'Victus 15',            'victus-15',            NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000021', 'Victus 16',            'victus-16',            NULL, true, NOW(), NOW()),
  ('m0021001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000021', 'OMEN 16',              'omen-16',              NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Lenovo
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0022001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000022', 'IdeaPad Slim 3',       'ideapad-slim-3',       NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000022', 'IdeaPad Slim 5',       'ideapad-slim-5',       NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000022', 'IdeaPad Pro 5',        'ideapad-pro-5',        NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000022', 'ThinkPad E14',         'thinkpad-e14',         NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000022', 'ThinkPad E16',         'thinkpad-e16',         NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000022', 'ThinkPad T14',         'thinkpad-t14',         NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000022', 'ThinkPad X1',          'thinkpad-x1',          NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000022', 'Yoga Slim',            'yoga-slim',            NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000022', 'Yoga Pro',             'yoga-pro',             NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000022', 'LOQ 15',               'loq-15',               NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000022', 'LOQ 16',               'loq-16',               NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000022', 'Legion 5',             'legion-5',             NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000022', 'Legion 7',             'legion-7',             NULL, true, NOW(), NOW()),
  -- Lenovo Tablets
  ('m0022001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000022', 'Yoga Tab Plus',        'yoga-tab-plus',        NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000022', 'Idea Tab',             'idea-tab',             NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000022', 'Idea Tab Plus',        'idea-tab-plus',        NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000022', 'Idea Tab Pro',         'idea-tab-pro',         NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000022', 'Tab M',                'tab-m',                NULL, true, NOW(), NOW()),
  ('m0022001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000022', 'Tab P',                'tab-p',                NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- ASUS
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0013001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000013', 'Vivobook 15',          'vivobook-15',          NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000013', 'Vivobook 16',          'vivobook-16',          NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000013', 'Zenbook 14',           'zenbook-14',           NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000013', 'Zenbook Duo',          'zenbook-duo',          NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000013', 'ProArt Studiobook',    'proart-studiobook',    NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000013', 'TUF Gaming A15',       'tuf-gaming-a15',       NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000013', 'TUF Gaming F15',       'tuf-gaming-f15',       NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000013', 'ROG Strix G16',        'rog-strix-g16',        NULL, true, NOW(), NOW()),
  ('m0013001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000013', 'ROG Zephyrus G14',     'rog-zephyrus-g14',     NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Acer
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0023001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000023', 'Aspire 3',             'aspire-3',             NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000023', 'Aspire 5',             'aspire-5',             NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000023', 'Swift 14',             'swift-14',             NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000023', 'Swift 16',             'swift-16',             NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000023', 'Nitro 5',              'nitro-5',              NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000023', 'Nitro 16',             'nitro-16',             NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000023', 'Predator Helios 16',   'predator-helios-16',   NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000023', 'Predator Triton 16',   'predator-triton-16',   NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000023', 'TravelMate P4',        'travelmate-p4',        NULL, true, NOW(), NOW()),
  ('m0023001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000023', 'Vero 14',              'vero-14',              NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- MSI
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0024001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000024', 'Modern 14',            'modern-14',            NULL, true, NOW(), NOW()),
  ('m0024001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000024', 'Prestige 13',          'prestige-13',          NULL, true, NOW(), NOW()),
  ('m0024001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000024', 'Creator Z16',          'creator-z16',          NULL, true, NOW(), NOW()),
  ('m0024001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000024', 'Katana 15',            'katana-15',            NULL, true, NOW(), NOW()),
  ('m0024001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000024', 'Cyborg 15',            'cyborg-15',            NULL, true, NOW(), NOW()),
  ('m0024001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000024', 'Stealth 16',           'stealth-16',           NULL, true, NOW(), NOW()),
  ('m0024001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000024', 'Raider GE78',          'raider-ge78',          NULL, true, NOW(), NOW()),
  ('m0024001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000024', 'Titan GT77',           'titan-gt77',           NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Microsoft Surface
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0025001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000025', 'Surface Laptop',       'surface-laptop',       NULL, true, NOW(), NOW()),
  ('m0025001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000025', 'Surface Laptop Go',    'surface-laptop-go',    NULL, true, NOW(), NOW()),
  ('m0025001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000025', 'Surface Pro',          'surface-pro',          NULL, true, NOW(), NOW()),
  ('m0025001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000025', 'Surface Pro 11',       'surface-pro-11',       NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- TABLETS
-- ────────────────────────────────────────────────────────────

-- Apple iPads (brand already inserted)
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0001003-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'iPad',                 'ipad',                 NULL, true, NOW(), NOW()),
  ('m0001003-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'iPad mini',            'ipad-mini',            NULL, true, NOW(), NOW()),
  ('m0001003-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'iPad Air 11-inch',     'ipad-air-11',          NULL, true, NOW(), NOW()),
  ('m0001003-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'iPad Air 13-inch',     'ipad-air-13',          NULL, true, NOW(), NOW()),
  ('m0001003-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', 'iPad Pro 11-inch',     'ipad-pro-11',          NULL, true, NOW(), NOW()),
  ('m0001003-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000001', 'iPad Pro 13-inch',     'ipad-pro-13',          NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- Samsung Tablets (brand already inserted)
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0002002-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Tab S11',       'galaxy-tab-s11',       NULL, true, NOW(), NOW()),
  ('m0002002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Tab S11 Ultra', 'galaxy-tab-s11-ultra', NULL, true, NOW(), NOW()),
  ('m0002002-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Tab S10 FE',    'galaxy-tab-s10-fe',    NULL, true, NOW(), NOW()),
  ('m0002002-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Tab S10 FE+',   'galaxy-tab-s10-fe-plus',NULL, true, NOW(), NOW()),
  ('m0002002-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Tab S10 Lite',  'galaxy-tab-s10-lite',  NULL, true, NOW(), NOW()),
  ('m0002002-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000002', 'Galaxy Tab A11+',      'galaxy-tab-a11-plus',  NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;

-- OnePlus Tablets (brand already inserted)
INSERT INTO device_models (id, "brandId", name, slug, "imageUrl", "isActive", "createdAt", "updatedAt") VALUES
  ('m0003002-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Pad',          'oneplus-pad',          NULL, true, NOW(), NOW()),
  ('m0003002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Pad 2',        'oneplus-pad-2',        NULL, true, NOW(), NOW()),
  ('m0003002-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Pad 3',        'oneplus-pad-3',        NULL, true, NOW(), NOW()),
  ('m0003002-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Pad Go',       'oneplus-pad-go',       NULL, true, NOW(), NOW()),
  ('m0003002-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000003', 'OnePlus Pad Go 2',     'oneplus-pad-go-2',     NULL, true, NOW(), NOW())
ON CONFLICT ("brandId", slug) DO NOTHING;
