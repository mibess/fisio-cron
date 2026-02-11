import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Cronograma } from '@/types/cronograma';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const text = await file.text();
        let json: Cronograma;

        try {
            json = JSON.parse(text);
        } catch {
            return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
        }

        // Basic validation
        if (!json.faseAtual || !json.fases || !Array.isArray(json.fases)) {
            return NextResponse.json({ error: 'Invalid cronograma structure' }, { status: 400 });
        }

        const stmt = db.prepare('INSERT INTO cronogramas (data) VALUES (?)');
        stmt.run(text);

        return NextResponse.json({ message: 'Upload successful' });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
