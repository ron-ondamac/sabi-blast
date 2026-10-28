INSERT INTO rock_types (name, specific_gravity, ucs_mpa, notes, source, is_generic) VALUES
  ('Granite', 2.7, 150, 'Hard, abrasive', 'Generic textbook range', TRUE),
  ('Basalt', 2.9, 170, 'Hard, dense', 'Generic textbook range', TRUE),
  ('Sandstone', 2.3, 60, 'Moderate strength', 'Generic textbook range', TRUE),
  ('Limestone', 2.6, 90, 'Variable, can be soft', 'Generic textbook range', TRUE),
  ('Quartzite', 2.65, 200, 'Very hard, abrasive', 'Generic textbook range', TRUE)
ON CONFLICT (name) DO NOTHING;
