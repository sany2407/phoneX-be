-- ============================================================
-- CATEGORIES SEED
-- ============================================================

INSERT INTO categories (id, name, slug, description, "imageUrl", "parentId", "isActive", "createdAt", "updatedAt") VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Anime',      'anime',      'Anime themed designs',          NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000002', 'Gaming',     'gaming',     'Gaming themed designs',         NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000003', 'Cyberpunk',  'cyberpunk',  'Cyberpunk themed designs',      NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000004', 'Cars',       'cars',       'Cars themed designs',           NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000005', 'Minimal',    'minimal',    'Minimal themed designs',        NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000006', 'Abstract',   'abstract',   'Abstract themed designs',       NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000007', 'Nature',     'nature',     'Nature themed designs',         NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000008', 'Marble',     'marble',     'Marble themed designs',         NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000009', 'Space',      'space',      'Space themed designs',          NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000010', 'Typography', 'typography', 'Typography themed designs',     NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000011', 'Music',      'music',      'Music themed designs',          NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000012', 'Sports',     'sports',     'Sports themed designs',         NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000013', 'Art',        'art',        'Art themed designs',            NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000014', 'Luxury',     'luxury',     'Luxury themed designs',         NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000015', 'Retro',      'retro',      'Retro themed designs',          NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000016', 'Dark',       'dark',       'Dark themed designs',           NULL, NULL, true, NOW(), NOW()),
  ('c0000001-0000-0000-0000-000000000017', 'Cute',       'cute',       'Cute themed designs',           NULL, NULL, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
