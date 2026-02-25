'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {getChineseZodiac, getWesternZodiac} from '@/lib/astrology';

interface PalmReadingProps {
  reading: string;
  birthdate?: string;
  isError?: boolean;
}

const PalmReading: React.FC<PalmReadingProps> = ({reading, birthdate, isError}) => {
  if (isError) {
    return <p className="text-center">{reading}</p>;
  }

  let chinese, western;

  if (birthdate) {
    const dateObj = new Date(birthdate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    chinese = getChineseZodiac(year);
    western = getWesternZodiac(month, day);
  }

  return (<motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      className="reading-container"
  >
    <h2 className="h2 text-center mb-4">
      Výklad z vaší dlaně
    </h2>

    {birthdate && (<div className="zodiac-info text-center mb-4">
      <p><strong>Čínské znamení:</strong> {chinese?.emoji} {chinese?.sign}</p>
      <p><strong>Horoskop:</strong> {western?.emoji} {western?.sign}</p>
    </div>)}

    <p className="p14 reading-text">
      {reading}
    </p>
  </motion.div>);
};

export default PalmReading;