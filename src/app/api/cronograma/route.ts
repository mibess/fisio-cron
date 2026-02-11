import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const stmt = db.prepare('SELECT data FROM cronogramas ORDER BY id DESC LIMIT 1');
        const row = stmt.get() as { data: string } | undefined;

        if (!row) {
            return NextResponse.json({ error: 'No cronograma found' }, { status: 404 });
        }

        const json = JSON.parse(row.data);
        return NextResponse.json(json);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
