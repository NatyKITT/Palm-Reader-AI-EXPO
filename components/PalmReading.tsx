'use client';

import React, {useRef} from 'react';
import {motion} from 'framer-motion';
import {getChineseZodiac, getWesternZodiac} from '@/lib/astrology';

interface PalmReadingProps {
  reading: string;
  birthdate?: string;
  userName?: string;
  isError?: boolean;
}

const PalmReading: React.FC<PalmReadingProps> = ({reading, birthdate, userName, isError}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (isError) {
    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            className="error_box"
        >
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
    const style = document.createElement('style');
    style.id = 'palm-print-style';
    style.innerHTML = `
    @media print {
      @page { margin: 1.2cm 1.8cm; size: A4; }
      body > * { display: none !important; }
      #palm-print-root { display: block !important; position: static !important; }
    }
  `;

    const printRoot = document.createElement('div');
    printRoot.id = 'palm-print-root';
    printRoot.style.display = 'none';
    printRoot.innerHTML = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:0 auto;padding:1.2rem 1.8rem;border:1.5px solid #d0e8e6;border-radius:12px;color:#1a1a1a;font-size:9.5pt;line-height:1.65;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.8rem;padding-bottom:0.7rem;border-bottom:1px solid #eef3fb;">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span style="font-size:1.3rem;">🔮</span>
          <div>
            <div style="font-size:1.05rem;font-weight:700;color:#00847C;">Výklad z vaší dlaně</div>
            ${userName ? `<div style="font-size:0.85rem;color:#555;font-weight:500;">${userName}</div>` : ''}
          </div>
        </div>
        ${birthdate && chinese && western ? `
          <div style="display:inline-flex;align-items:center;gap:0.4rem;background:#eef7f6;border:1px solid #c8e6e4;border-radius:999px;padding:0.15rem 0.8rem;font-size:0.75rem;color:#00847C;font-weight:500;">
            <span>${western.emoji} ${western.sign}</span>
            <span style="opacity:0.4;">●</span>
            <span>${chinese.emoji} ${chinese.sign}</span>
            <span style="opacity:0.4;">●</span>
            <span>${new Date(birthdate).toLocaleDateString('cs-CZ')}</span>
          </div>
        ` : ''}
      </div>
      <div style="font-size:9pt;line-height:1.7;color:#222;white-space:pre-wrap;text-align:justify;">${reading}</div>
      <div style="margin-top:0.8rem;padding-top:0.6rem;border-top:1px solid #eef3fb;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:0.68rem;color:#aaa;">✨ Věštba je pouze pro zábavu · Career Expo · MČ Praha 6</div>
        <div style="font-size:0.72rem;font-weight:600;color:#00847C;">www.kariera6.cz</div>
      </div>
    </div>
  `;

    document.head.appendChild(style);
    document.body.appendChild(printRoot);

    window.print();

    const cleanup = () => {
      document.getElementById('palm-print-style')?.remove();
      document.getElementById('palm-print-root')?.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
  };

  const handleShare = async () => {
    const shareText = `🔮 Moje věštba z dlaně:\n\n${reading}\n\nZjisti svoji kariérní budoucnost na www.kariera6.cz`;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({title: '🔮 Moje věštba z dlaně', text: shareText});
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('✅ Text věštby zkopírován do schránky!');
    }
  };

  return (
      <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
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
                <span>{western.emoji} {western.sign}</span>
                <span className="zodiac-divider">·</span>
                <span>{chinese.emoji} {chinese.sign}</span>
                <span className="zodiac-divider">·</span>
                <span>{new Date(birthdate).toLocaleDateString('cs-CZ')}</span>
              </div>
          )}

          <p className="reading-text">{reading}</p>

          <div className="reading-card-footer">
            ✨ Věštba je pouze pro zábavu · Career Expo · MČ Praha 6
          </div>
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
  );
};

export default PalmReading;
