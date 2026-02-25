'use client';

import React from 'react';
import Link from 'next/link';

const HeroComponent: React.FC = () => {
  return (
      <section className="hero_banner" style={{backgroundImage: "url('/img/illustrations/palm-reader-banner.png')"}}>
        <div className="grid_lt_wd">
          <div className="hero_text">
            <h1 className="hero_heading">Palm Reader</h1>
            <h2>Oficiální AI aplikace pro věštění z ruky MČ Praha 6</h2>
            <Link href="#how-to-use" className="btn_bordered">
              Jak to funguje?
            </Link>
          </div>
        </div>
      </section>
  );
};

export default HeroComponent;