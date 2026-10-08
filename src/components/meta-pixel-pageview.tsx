'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // The base pixel code already fired PageView on the initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (window as any).fbq?.('track', 'PageView');
  }, [pathname]);

  return null;
}
