import { LOCALE_STORAGE_KEY } from "@/i18n/config";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Static hosting has no server-side redirects, so "/" picks the language in the browser:
 * stored preference first, then the browser language, English otherwise.
 */
export default function RootPage() {
  const script = `(function(){var l='en';try{var s=localStorage.getItem('${LOCALE_STORAGE_KEY}');if(s==='en'||s==='de'){l=s}else if((navigator.language||'').toLowerCase().indexOf('de')===0){l='de'}}catch(e){}location.replace('${base}/'+l+'/');})();`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${base}/en/`} />
      </noscript>
      <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", color: "#e8edf2", background: "#080b10", minHeight: "100vh" }}>
        <p>
          <a href={`${base}/en/`} style={{ color: "#3fd8f2" }}>English</a> ·{" "}
          <a href={`${base}/de/`} style={{ color: "#3fd8f2" }}>Deutsch</a>
        </p>
      </main>
    </>
  );
}
