'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'next/navigation';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import QRCode from 'react-qr-code';
import {getChineseZodiac, getWesternZodiac} from "@/lib/astrology";

export default function ReadingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [readingData, setReadingData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'readings', id);
        const docSnap = await getDoc(docRef);
        setReadingData(docSnap.exists() ? docSnap.data() : null);
      } catch (error) {
        console.error('Chyba při načítání věštby:', error);
        setReadingData(null);
      } finally {
        setLoading(false);
      }
    };
    void fetchReading();
  }, [id]);

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `qr-reading-${id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = url;
  };

  if (loading) return <p className="text-center">Načítám...</p>;
  if (!readingData) return <p className="text-center">Věštba nebyla nalezena.</p>;
  if (typeof readingData.reading !== 'string' || readingData.reading.startsWith('⚠️')) {
    return <p className="text-center">Tato věštba nebyla validní a nebyla uložena.</p>;
  }

  const {reading, name, birthdate, createdAt} = readingData;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL || '';
  const pageUrl = `${baseUrl}/reading/${id}`;

  let chinese, western;
  if (birthdate) {
    const dateObj = new Date(birthdate);
    chinese = getChineseZodiac(dateObj.getFullYear());
    western = getWesternZodiac(dateObj.getMonth() + 1, dateObj.getDate());
  }

  return (
    <section className="section">
      <div className="page-detail">
        <h2 className="page-detail--heading">Tvoje věštba</h2>
        <div className="page-detail__reading">
          {/* Obrázek se již neukládá – zobrazíme placeholder */}
          <div className="page-detail__reading--image page-detail__reading--image-placeholder">
            🖐️
          </div>

          <div className="page-detail__reading--text">
            <div className="print-layout">
              {(name || birthdate) && (
                <div className="zodiac-info">
                  {name && <p><strong>Jméno:</strong> {name}</p>}
                  {birthdate && <p><strong>Datum narození:</strong> {birthdate}</p>}
                  {chinese && <p><strong>Čínské znamení:</strong> {chinese.emoji} {chinese.sign}</p>}
                  {western && <p><strong>Znamení horoskopu:</strong> {western.emoji} {western.sign}</p>}
                </div>
              )}
            </div>
            <p className="page-detail__reading--paragraph">{reading}</p>
            {createdAt?.toDate && (
              <p><strong>Vytvořeno:</strong> {createdAt.toDate().toLocaleString('cs-CZ')}</p>
            )}
          </div>

          <div ref={qrRef} className="page-detail__reading--qrcode">
            <p className="page-detail__reading--qrcode-text">Naskenuj QR kód pro zobrazení této věštby později:</p>
            <QRCode value={pageUrl} size={128}/>
            <div className="page-detail__reading--buttons">
              <button onClick={handleDownloadQR} className="btn_fill">Stáhnout QR kód</button>
              {typeof navigator !== 'undefined' && navigator.share ? (
                <button onClick={() => navigator.share({url: pageUrl})} className="btn_bordered">Sdílet</button>
              ) : (
                <button onClick={() => navigator.clipboard.writeText(pageUrl)} className="btn_bordered">Zkopírovat odkaz</button>
              )}
            </div>
          </div>

          <div className="page-detail__buttons">
            <button onClick={() => window.location.href = '/'} className="btn_bordered">
              Zpět na hlavní stránku
            </button>
            <button onClick={() => window.print()} className="btn_fill">
              Vytisknout věštbu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
