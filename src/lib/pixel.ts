/**
 * Sends a tracking event to Meta (Facebook) Pixel if it is initialized.
 * Safe for Server-Side Rendering environments.
 * 
 * @param event - The name of the custom or standard event to track (e.g., 'PageView', 'Button Click').
 * @param params - Optional object containing additional metadata or parameters for the event.
 */
export function trackPixel(event: string, params?: Record<string, unknown>) {
  // typeof window !== 'undefined': Prevents crashes during server-side builds
  // by verifying the code is running in a browser.
  //
  // typeof (window as any).fbq === 'function': Ensures the official Meta Pixel script 
  // has fully loaded and initialized before attempting to call it.
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    ;(window as any).fbq('track', event, params)
  }
}
