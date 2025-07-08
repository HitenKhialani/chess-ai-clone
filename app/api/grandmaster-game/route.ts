import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const event = searchParams.get('event');
  const opponent = searchParams.get('opponent');

  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
  }

  // Path to the SQLite DB
  const dbPath = path.join(process.cwd(), 'backend', 'chess.db');
  const db = new Database(dbPath, { readonly: true });

  // Build the query based on provided parameters
  let query = `SELECT pgn, event, site, date, round, white, black, result, eco, opening 
               FROM grandmaster_games 
               WHERE (LOWER(white) LIKE ? OR LOWER(black) LIKE ?)`;
  let params = [`%${name.toLowerCase()}%`, `%${name.toLowerCase()}%`];

  if (event) {
    query += ` AND LOWER(event) LIKE ?`;
    params.push(`%${event.toLowerCase()}%`);
  }

  if (opponent) {
    query += ` AND (LOWER(white) LIKE ? OR LOWER(black) LIKE ?)`;
    params.push(`%${opponent.toLowerCase()}%`, `%${opponent.toLowerCase()}%`);
  }

  query += ` LIMIT 1`;

  // Try to find a game where the grandmaster is either white or black
  const stmt = db.prepare(query);
  const row = stmt.get(...params);
  db.close();

  if (!row) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  const { pgn, ...info } = row;
  return NextResponse.json({ pgn, info });
} 