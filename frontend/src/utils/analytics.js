/**
 * Yuktha Platform Analytics Utility
 * Supports Google Analytics 4 (GA4) with graceful fallback to client-side event bus.
 */

// Initialize GA4 if measurement ID is supplied
export function initAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

  if (typeof window !== 'undefined' && measurementId && !window.gtag) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      send_page_view: false, // We trigger page views manually on route change
    })
    console.log('[Analytics] Google Analytics initialized with ID:', measurementId)
  }
}

/**
 * Track route / page changes
 */
export function trackPageView(path, title = '') {
  const pageTitle = title || document.title || 'Yuktha'
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/')

  if (typeof window !== 'undefined' && window.gtag) {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: currentPath,
      send_to: measurementId,
    })
  }

  // Developer logging in non-production
  if (import.meta.env.DEV) {
    console.info(`[Analytics] PageView: "${pageTitle}" -> ${currentPath}`)
  }
}

/**
 * Track custom user interactions (e.g. CTA clicks, role selections, assessment starts)
 */
export function trackEvent(category, action, label = '', value = null) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }

  if (import.meta.env.DEV) {
    console.info(`[Analytics Event] [${category}] ${action} ${label ? `(${label})` : ''}`)
  }
}
