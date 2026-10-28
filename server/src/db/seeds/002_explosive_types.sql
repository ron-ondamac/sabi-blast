INSERT INTO explosive_types (name, density, water_resistant, vod_m_s, default_cartridge_diameter_mm, relative_weight_strength, source, is_generic) VALUES
  ('ANFO', 0.85, FALSE, 4200, 89, 100, 'Generic ANFO -- representative industry values', TRUE),
  ('Bulk Emulsion', 1.15, TRUE, 5500, 89, 110, 'Generic bulk emulsion -- representative industry values', TRUE),
  ('Packaged Emulsion', 1.2, TRUE, 5000, 32, 105, 'Generic packaged emulsion -- representative industry values', TRUE),
  ('Watergel', 1.3, TRUE, 4800, 32, 95, 'Generic watergel -- representative industry values', TRUE),
  ('Packaged Dynamite-class', 1.4, TRUE, 6000, 25, 120, 'Generic dynamite-class product -- representative industry values', TRUE)
ON CONFLICT (name) DO NOTHING;
