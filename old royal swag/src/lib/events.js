export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('event', eventName, eventParams)
    }
    if (window.fbq) {
      window.fbq('trackCustom', eventName, eventParams)
    }
  }
}
