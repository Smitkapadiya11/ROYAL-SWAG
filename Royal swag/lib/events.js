export const trackEvent = (eventName, data = {}) => {
  // Fire to GA4
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, data);
  } else {
    console.warn(`GA4 (gtag) not found. Event ${eventName} not sent.`);
  }

  // Fire to Meta Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, data);
  } else {
    console.warn(`Meta Pixel (fbq) not found. Event ${eventName} not sent.`);
  }
};
