'use client';

import {usePathname} from 'next/navigation';
import HeroComponent from './HeroComponent';

export default function ConditionalHero() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return isHome ? <HeroComponent/> : null;
}
