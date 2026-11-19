'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface MetaPixelProps {
  pixelId: string;
}

/**
 * Meta's base pixel code. The root layout renders it on the production site
 * only. Meta's own page-change tracking is switched off (disablePushState) so
 * this component sends exactly one PageView per route change.
 */
export function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    // /register only redirects to the sign-up form, so it isn't a page view.
    if (lastPathname.current === pathname || pathname === '/register') return;
    lastPathname.current = pathname;
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq.disablePushState=true;
fbq('init',${JSON.stringify(pixelId)});
fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
