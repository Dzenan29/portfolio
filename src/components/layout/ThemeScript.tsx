export const THEME_STORAGE_KEY = "dk-theme";

/**
 * Runs before first paint: applies the stored theme (dark by default) and marks JS as available,
 * so there is no flash of the wrong theme and reveal animations never hide content without JS.
 * It also unregisters any service worker left by the previous version of the site (this site uses none).
 */
export function ThemeScript() {
  const code = `(function(){try{var d=document.documentElement;d.classList.remove('no-js');var t=localStorage.getItem('${THEME_STORAGE_KEY}');d.setAttribute('data-theme',t==='light'||t==='dark'?t:'dark');}catch(e){}try{navigator.serviceWorker&&navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})})}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
