import {NextRequest, NextResponse} from 'next/server';
import {generatePalmReading} from '@/lib/aiModels';
import {isRateLimited} from '@/lib/rateLimiter';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    if (await isRateLimited(ip)) {
      return NextResponse.json(
          {error: 'Příliš mnoho požadavků. Zkuste to za chvíli.'},
          {status: 429}
      );
    }

    const {imageData, userName, birthDate, gender} = await request.json();

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json(
          {error: 'Chybí obrázek.'},
          {status: 400}
      );
    }

    if (imageData.length > 6_000_000) {
      return NextResponse.json(
          {error: 'Obrázek je příliš velký. Max. 4 MB.'},
          {status: 413}
      );
    }

    const {reading, isError} = await generatePalmReading(
        imageData,
        userName,
        birthDate,
        gender,
    );

    return NextResponse.json({reading, isError});
  } catch (error: any) {
    console.error('Chyba v /api/analyze:', error);
    return NextResponse.json(
        {error: 'Interní chyba serveru', details: error?.message},
        {status: 500}
    );
  }
}
