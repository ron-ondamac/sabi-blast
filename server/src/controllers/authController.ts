import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { pool } from '../db/pool';
import { loginSchema } from '../validation/schemas';

export async function register(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const email = parsed.data.email;
  const password = parsed.data.password;
  const hash = await bcryptjs.hash(password, 10);
  try {
    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, hash]);
    (req.session as any).userId = result.rows[0].id;
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(409).json({ error: 'Email already registered' });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const email = parsed.data.email;
  const password = parsed.data.password;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcryptjs.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  (req.session as any).userId = user.id;
  res.json({ id: user.id, email: user.email });
}

export function logout(req: Request, res: Response) {
  req.session.destroy(() => res.status(204).send());
}

export function me(req: Request, res: Response) {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json({ id: userId });
}
