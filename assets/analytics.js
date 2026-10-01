// Google Analytics (GA4) for yayzu.com. Google's tag loads only after the page has finished
// loading, so it never slows the first paint, and only on the live site, so local testing doesn't
// show up in the reports.
//
// No cookie banner: in the EEA, the UK and Switzerland, analytics cookies stay off (Google Consent
// Mode sends cookieless pings instead), and ad storage is off everywhere since the site has no ads.
(() => {
  if (location.hostname !== "yayzu.com") {
    window.gtag = () => {}; // pages can still call gtag() safely
    return;
  }
  const ID = "G-E8T0QTBJXZ";
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  const noAds = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  // prettier-ignore
  const askFirst = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV",
    "LI", "LT", "LU", "MT", "NL", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", "CH",
  ];
  gtag("consent", "default", { ...noAds, analytics_storage: "denied", region: askFirst });
  gtag("consent", "default", { ...noAds, analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", ID);

  const load = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    document.head.append(script);
  };
  if (document.readyState === "complete") load();
  else window.addEventListener("load", load);
})();
