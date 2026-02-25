'use client';

import React from 'react';
import {BookCheck, Clock, Search, Upload} from 'lucide-react';
import {motion} from 'framer-motion';

const steps = [
  {
    icon: <Upload/>,
    title: 'Nahraj nebo vyfoť',
    description: 'Nahraj fotografii své dlaně nebo ji pořiď pomocí kamery.',
  },
  {
    icon: <Search/>,
    title: 'Spusť analýzu',
    description: 'Klikni na tlačítko „Získat věštbu“ a AI věštkyně se pustí do práce.',
  },
  {
    icon: <Clock/>,
    title: 'Počkej',
    description: 'Naše věštkyně analyzuje čáry života, hlavy a srdce.',
  },
  {
    icon: <BookCheck/>,
    title: 'Přečti si výklad',
    description: 'Zobrazí se ti osobní věštba na základě tvé dlaně.',
  },
];

const HowToUse: React.FC = () => {
  const handleScroll = () => {
    const section = document.getElementById('palm-reading');
    section?.scrollIntoView({behavior: 'smooth'});
  };

  return (
      <section className="howto_section" id="how-to-use">
        <h2>Jak aplikace funguje</h2>
        <div className="steps_grid">
          {steps.map((step, index) => (
              <motion.div
                  key={index}
                  className="step_box cursor-pointer"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.5, delay: index * 0.15}}
                  onClick={handleScroll}
              >
                <div className="icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
          ))}
        </div>
      </section>
  );
};

export default HowToUse;

