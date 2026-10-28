exports.up = (pgm) => {
  pgm.createTable('rock_types', {
    id: 'id',
    name: { type: 'text', notNull: true, unique: true },
    specific_gravity: { type: 'numeric', notNull: true },
    ucs_mpa: { type: 'numeric', notNull: true },
    notes: { type: 'text' },
    source: { type: 'text' },
    is_generic: { type: 'boolean', notNull: true, default: true }
  });

  pgm.createTable('explosive_types', {
    id: 'id',
    name: { type: 'text', notNull: true, unique: true },
    density: { type: 'numeric', notNull: true },
    water_resistant: { type: 'boolean', notNull: true, default: false },
    vod_m_s: { type: 'numeric' },
    default_cartridge_diameter_mm: { type: 'numeric' },
    relative_weight_strength: { type: 'numeric' },
    source: { type: 'text' },
    is_generic: { type: 'boolean', notNull: true, default: true }
  });

  pgm.createTable('users', {
    id: 'id',
    email: { type: 'text', notNull: true, unique: true },
    password_hash: { type: 'text', notNull: true },
    created_at: { type: 'timestamptz', default: pgm.func('now()') }
  });

  pgm.createTable('rounds', {
    id: 'id',
    opening_type: { type: 'text', notNull: true },
    width_m: { type: 'numeric', notNull: true },
    height_or_diameter_m: { type: 'numeric', notNull: true },
    advance_required_m: { type: 'numeric', notNull: true },
    desired_fragmentation: { type: 'text' },
    environment: { type: 'text', notNull: true },
    rock_type_id: { type: 'integer', references: 'rock_types' },
    recommended_explosive_id: { type: 'integer', references: 'explosive_types' },
    total_explosive_kg: { type: 'numeric' },
    achieved_advance_m: { type: 'numeric' },
    created_at: { type: 'timestamptz', default: pgm.func('now()') }
  });

  pgm.createTable('round_holes', {
    id: 'id',
    round_id: { type: 'integer', references: 'rounds', onDelete: 'CASCADE' },
    role: { type: 'text', notNull: true },
    position_x: { type: 'numeric', notNull: true },
    position_y: { type: 'numeric', notNull: true },
    angle_deg: { type: 'numeric', default: 0 },
    depth_m: { type: 'numeric', notNull: true },
    diameter_mm: { type: 'numeric', notNull: true },
    charge_kg: { type: 'numeric', notNull: true }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('round_holes');
  pgm.dropTable('rounds');
  pgm.dropTable('users');
  pgm.dropTable('explosive_types');
  pgm.dropTable('rock_types');
};
