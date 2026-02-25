'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {collection, getDocs, orderBy, query, Timestamp} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {useRouter} from 'next/navigation';
import {Card, CardContent} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {getCookie, setCookie} from 'cookies-next';
import {v4 as uuidv4} from 'uuid';
import {getChineseZodiac, getWesternZodiac} from '@/lib/astrology';

interface Reading {
  id: string;
  imageUrl: string | null;
  createdAt: Timestamp;
  reading: string;
  name?: string;
  birthdate?: string;
  ownerToken?: string;
}

const PastReadingsGallery: React.FC = () => {
  const [pastReadings, setPastReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        let token = getCookie('user_token') as string | undefined;
        if (!token) {
          token = uuidv4();
          setCookie('user_token', token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        }

        const q = query(collection(db, 'readings'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const dataMap = new Map<string, Reading>();
        querySnapshot.docs.forEach(doc => {
          const docData = doc.data() as Omit<Reading, 'id'>;
          const reading = {...docData, id: doc.id};
          if (reading.ownerToken === token) {
            dataMap.set(doc.id, reading);
          }
        });

        const filteredReadings = Array.from(dataMap.values()).filter(
          (r) => !r.reading.startsWith('⚠️') && !r.reading.startsWith('🖐️')
        );
        setPastReadings(filteredReadings);
      } catch (error) {
        console.error('Chyba při načítání věšteb:', error);
        setPastReadings([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchReadings();
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleString('cs-CZ', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }, []);

  const handleClick = (id: string) => router.push(`/reading/${id}`);

  return (
    <section className="section readings-gallery">
      <div>
        <h2>Minulé věštby</h2>
        {loading ? (
          <p>Načítání...</p>
        ) : pastReadings.length === 0 ? (
          <p>Zatím nejsou k dispozici žádné věštby.</p>
        ) : (
          <Card className="gallery-card">
            <CardContent>
              <ScrollArea className="gallery-scrollarea">
                <div className="gallery-grid">
                  {pastReadings.map((reading, index) => {
                    let chinese, western;
                    if (reading.birthdate) {
                      const dateObj = new Date(reading.birthdate);
                      chinese = getChineseZodiac(dateObj.getFullYear());
                      western = getWesternZodiac(dateObj.getMonth() + 1, dateObj.getDate());
                    }

                    return (
                      <div key={reading.id} className="gallery-item cursor-pointer" onClick={() => handleClick(reading.id)}>
                        <Card className="reading-card">
                          <CardContent className="no-padding">
                            {/* Obrázky se již neukládají – zobrazíme placeholder */}
                            <div className="reading-thumb reading-thumb--placeholder">
                              🖐️
                            </div>
                            <div className="reading-info">
                              {(reading.name || reading.birthdate) && (
                                <div className="zodiac-info">
                                  {reading.name && <p>Jméno: {reading.name}</p>}
                                  {reading.birthdate && <p>Datum narození: {reading.birthdate}</p>}
                                  {chinese && <p>Čínské znamení: {chinese.emoji} {chinese.sign}</p>}
                                  {western && <p>Znamení horoskopu: {western.emoji} {western.sign}</p>}
                                </div>
                              )}
                              <p className="reading-snippet">{reading.reading}</p>
                              <p className="reading-date">Vytvořeno: {formatDate(reading.createdAt.toDate())}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PastReadingsGallery;
