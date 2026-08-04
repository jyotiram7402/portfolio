import Script from "next/script";

import { getProvider } from "@/config/analytics";

/**
 * Third-party analytics tags.
 *
 * Every one is `strategy="afterInteractive"`, which is the correct choice for all four: they
 * measure behaviour, so nothing needs them before the page is usable, and loading them earlier
 * would put a third-party request ahead of the site's own on the critical path. None of them
 * affects Largest Contentful Paint as a result.
 *
 * Each component returns `null` when its provider is unconfigured, so an empty environment ships
 * zero third-party requests rather than four broken ones. That is what keeps a default deploy at
 * a clean Lighthouse score.
 *
 * These are Server Components: the enabled check resolves at build time, and the disabled path
 * emits nothing at all.
 */

export function GoogleAnalytics() {
  const provider = getProvider("google");
  if (!provider?.enabled || !provider.token) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${provider.token}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${provider.token}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}

export function PlausibleAnalytics() {
  const provider = getProvider("plausible");
  if (!provider?.enabled || !provider.token) return null;

  const host = provider.host ?? "https://plausible.io";

  return (
    <>
      {/* `script.tagged-events` enables declarative event tracking via class names;
          `script.outbound-links` counts external clicks without a call site. */}
      <Script
        defer
        data-domain={provider.token}
        src={`${host}/js/script.tagged-events.outbound-links.js`}
        strategy="afterInteractive"
      />
      {/* Plausible's queue shim, so `trackEvent` calls made before the script lands
          are replayed rather than dropped. */}
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function(){(window.plausible.q = window.plausible.q || []).push(arguments)}`}
      </Script>
    </>
  );
}

export function ClarityAnalytics() {
  const provider = getProvider("clarity");
  if (!provider?.enabled || !provider.token) return null;

  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${provider.token}");
      `}
    </Script>
  );
}

export function PostHogAnalytics() {
  const provider = getProvider("posthog");
  if (!provider?.enabled || !provider.token) return null;

  const host = provider.host ?? "https://us.i.posthog.com";

  return (
    <Script id="posthog-init" strategy="afterInteractive">
      {`
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
        function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);
        t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
        (p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",
        p.async=!0,p.src=s.api_host+"/static/array.js",
        (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
        var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],
        u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),
        t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},
        o="init capture register register_once unregister identify alias people.set reset group".split(" "),
        n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('${provider.token}', {
          api_host: '${host}',
          person_profiles: 'identified_only',
          capture_pageview: true,
          persistence: 'memory'
        });
      `}
    </Script>
  );
}
