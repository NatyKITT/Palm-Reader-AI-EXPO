'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { getChineseZodiac, getWesternZodiac } from '@/lib/astrology';

interface PalmReadingProps {
  reading: string;
  birthdate?: string;
  userName?: string;
  isError?: boolean;
}

const PalmReading: React.FC<PalmReadingProps> = ({ reading, birthdate, userName, isError }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isError) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="error_box">
        {reading}
      </motion.div>
    );
  }

  let chinese: ReturnType<typeof getChineseZodiac> | undefined;
  let western: ReturnType<typeof getWesternZodiac> | undefined;

  if (birthdate) {
    const dateObj = new Date(birthdate);
    chinese = getChineseZodiac(dateObj.getFullYear());
    western = getWesternZodiac(dateObj.getMonth() + 1, dateObj.getDate());
  }

  const handleDownload = async () => {
    const el = cardRef.current;
    if (!el) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `vestba${userName ? `-${userName}` : ''}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Nepodařilo se stáhnout obrázek. Zkuste tisk.');
    }
  };

  const handlePrint = () => {
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  };

  const handleShare = async () => {
    const shareText = `🔮 Moje věštba z dlaně:\n\n${reading}\n\nZjisti svoji kariérní budoucnost na www.kariera6.cz`;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: '🔮 Moje věštba z dlaně', text: shareText });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('✅ Text věštby zkopírován do schránky!');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="reading-container"
      >
        <div ref={cardRef} className="reading-card-printable">
          <div className="reading-card-header">
            <span className="reading-card-icon">🔮</span>
            <h2 className="reading-card-title">Výklad z vaší dlaně</h2>
            {userName && <p className="reading-card-name">{userName}</p>}
          </div>

          {birthdate && chinese && western && (
            <div className="zodiac-info">
              <span>
                {western.emoji} {western.sign}
              </span>
              <span className="zodiac-divider">·</span>
              <span>
                {chinese.emoji} {chinese.sign}
              </span>
              <span className="zodiac-divider">·</span>
              <span>{new Date(birthdate).toLocaleDateString('cs-CZ')}</span>
            </div>
          )}

          <p className="reading-text">{reading}</p>

          <div className="reading-card-footer">✨ Věštba je pouze pro zábavu · Career Expo · MÚČ Praha 6</div>
        </div>

        <div className="reading-actions">
          <button className="btn-action btn-action--filled" onClick={handleDownload}>
            📥 Stáhnout obrázek
          </button>
          <button className="btn-action btn-action--outlined" onClick={handlePrint}>
            🖨️ Vytisknout
          </button>
          <button className="btn-action btn-action--filled" onClick={handleShare}>
            📲 Sdílet
          </button>
        </div>
      </motion.div>

      {mounted
        ? createPortal(
            <div id="palm-print-root" aria-hidden="true">
              <div className="palm-print-card">
                <div className="palm-print-header">
                  <div className="palm-print-header-left">
                    <span className="palm-print-icon">🔮</span>
                    <div>
                      <div className="palm-print-title">Výklad z vaší dlaně</div>
                      {userName ? <div className="palm-print-name">{userName}</div> : null}
                    </div>
                  </div>

                  {birthdate && chinese && western ? (
                    <div className="palm-print-zodiac">
                      <span>
                        {western.emoji} {western.sign}
                      </span>
                      <span className="palm-print-dot">●</span>
                      <span>
                        {chinese.emoji} {chinese.sign}
                      </span>
                      <span className="palm-print-dot">●</span>
                      <span>{new Date(birthdate).toLocaleDateString('cs-CZ')}</span>
                    </div>
                  ) : null}
                </div>

                <div className="palm-print-reading">{reading}</div>

                <div className="palm-print-footer">
                  <span>✨ Věštba je pouze pro zábavu · Career Expo · MÚČ Praha 6</span>
                  <span>www.kariera6.cz</span>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default PalmReading;
