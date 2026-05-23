const EVENTS = {
  PAGE_VIEW: 'page_view',
  HERO_CTA: 'hero_cta_click',
  BUNDLE_SELECT: 'bundle_select',
  CHECKOUT_INIT: 'checkout_init',
  PURCHASE: 'purchase',
  LUNG_TEST_START: 'lung_test_start',
  BREATH_TEST_START: 'breath_test_start',
  LEAD_CAPTURE: 'lead',
  VIDEO_PLAY: 'video_play',
  SECTION_VIEW: 'section_view',
}

export function trackEvent(name, data = {}) {
  const payload = { ...data, timestamp: Date.now(), url: window.location.pathname }
  
  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, payload)
  }
  
  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    const pixelMap = {
      [EVENTS.PAGE_VIEW]: () => window.fbq('track', 'PageView'),
      [EVENTS.CHECKOUT_INIT]: () => window.fbq('track', 'InitiateCheckout', data),
      [EVENTS.PURCHASE]: () => window.fbq('track', 'Purchase', { value: data.value, currency: 'INR' }),
      [EVENTS.LEAD_CAPTURE]: () => window.fbq('track', 'Lead', data),
    }
    pixelMap[name]?.()
  }
  
  // Supabase events table
  if (typeof window !== 'undefined') {
    const sessionId = sessionStorage.getItem('rs_session') || crypto.randomUUID()
    sessionStorage.setItem('rs_session', sessionId)
    fetch('/api/track', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ event_name: name, session_id: sessionId, data: payload })
    }).catch(() => {}) // silent fail — never block UI
  }
}

export { EVENTS }
