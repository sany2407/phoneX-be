-- ============================================================
-- STEP 1: Insert device type master data
-- ============================================================

INSERT INTO device_types (id, name, slug, "isActive", "createdAt", "updatedAt") VALUES
  ('dt000001-0000-0000-0000-000000000001', 'Smartphone', 'smartphone', true, NOW(), NOW()),
  ('dt000001-0000-0000-0000-000000000002', 'Laptop',     'laptop',     true, NOW(), NOW()),
  ('dt000001-0000-0000-0000-000000000003', 'Tablet',     'tablet',     true, NOW(), NOW()),
  ('dt000001-0000-0000-0000-000000000004', 'Smartwatch', 'smartwatch', true, NOW(), NOW()),
  ('dt000001-0000-0000-0000-000000000005', 'Earbuds',    'earbuds',    true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- STEP 2: Backfill deviceTypeId on existing device_models
-- Run this after Step 1
-- ============================================================

-- Smartphones: Apple iPhones
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE id IN (
  'b0000001-0000-0000-0000-000000000001'  -- placeholder, use query below
);

-- Easiest approach: update by slug patterns

-- All iPhone models → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'iphone%';

-- All MacBook models → Laptop
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'macbook%';

-- All iPad models → Tablet
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000003'
WHERE slug LIKE 'ipad%';

-- Samsung Galaxy S/A/M/Z → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'galaxy-s%'
   OR slug LIKE 'galaxy-a%'
   OR slug LIKE 'galaxy-m%'
   OR slug LIKE 'galaxy-z%';

-- Samsung Galaxy Tab → Tablet
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000003'
WHERE slug LIKE 'galaxy-tab%';

-- OnePlus phones → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'oneplus-%'
  AND slug NOT LIKE 'oneplus-pad%';

-- OnePlus Pad → Tablet
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000003'
WHERE slug LIKE 'oneplus-pad%';

-- Google Pixel → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'pixel-%';

-- Xiaomi phones → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'xiaomi-%'
  AND slug NOT LIKE 'xiaomi-pad%';

-- Xiaomi Pad → Tablet
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000003'
WHERE slug LIKE 'xiaomi-pad%';

-- Redmi phones → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'redmi-%'
  AND slug NOT LIKE 'redmi-pad%';

-- Redmi Pad → Tablet
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000003'
WHERE slug LIKE 'redmi-pad%';

-- Vivo → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'vivo-%';

-- OPPO → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug IN ('find-x9','find-x9-pro','reno-14','reno-14-pro','reno-15','reno-15-pro','k13','a6','a6x');

-- Realme → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'realme-%';

-- Motorola → Smartphone
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000001'
WHERE slug LIKE 'edge-%'
   OR slug LIKE 'moto-%'
   OR slug LIKE 'razr-%';

-- Dell → Laptop
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'inspiron%'
   OR slug LIKE 'xps%'
   OR slug LIKE 'latitude%'
   OR slug LIKE 'alienware%'
   OR slug LIKE 'vostro%'
   OR slug IN ('g15', 'g16');

-- HP → Laptop
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'omnibook%'
   OR slug LIKE 'elitebook%'
   OR slug LIKE 'probook%'
   OR slug LIKE 'victus%'
   OR slug LIKE 'omen%';

-- Lenovo laptops → Laptop
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'ideapad%'
   OR slug LIKE 'thinkpad%'
   OR slug LIKE 'yoga-slim%'
   OR slug LIKE 'yoga-pro%'
   OR slug LIKE 'loq%'
   OR slug LIKE 'legion%';

-- Lenovo tablets → Tablet
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000003'
WHERE slug LIKE 'yoga-tab%'
   OR slug LIKE 'idea-tab%'
   OR slug LIKE 'tab-m%'
   OR slug LIKE 'tab-p%';

-- ASUS → Laptop
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'vivobook%'
   OR slug LIKE 'zenbook%'
   OR slug LIKE 'proart%'
   OR slug LIKE 'tuf-gaming%'
   OR slug LIKE 'rog%';

-- Acer → Laptop
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'aspire%'
   OR slug LIKE 'swift%'
   OR slug LIKE 'nitro%'
   OR slug LIKE 'predator%'
   OR slug LIKE 'travelmate%'
   OR slug LIKE 'vero%';

-- MSI → Laptop
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'modern%'
   OR slug LIKE 'prestige%'
   OR slug LIKE 'creator%'
   OR slug LIKE 'katana%'
   OR slug LIKE 'cyborg%'
   OR slug LIKE 'stealth%'
   OR slug LIKE 'raider%'
   OR slug LIKE 'titan%';

-- Microsoft Surface → Laptop/Tablet (Surface Laptop = Laptop, Surface Pro = Tablet)
UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000002'
WHERE slug LIKE 'surface-laptop%';

UPDATE device_models SET "deviceTypeId" = 'dt000001-0000-0000-0000-000000000003'
WHERE slug LIKE 'surface-pro%';


-- ============================================================
-- STEP 3: Verify — check if any models still have no type
-- ============================================================
SELECT id, name, slug FROM device_models WHERE "deviceTypeId" IS NULL;
