export const openSmartLinkAd = () => {
  setTimeout(() => {
    // Replace with your actual Smart Link Ad URL (Direct Link)
    const SMART_LINK_URL = 'https://www.profitablecpmrate.com/YOUR_SMART_LINK_ID'; 
    
    // Try opening in new tab first
    const adWindow = window.open(SMART_LINK_URL, '_blank');
    
    // If popup blocked, redirect the current page
    if (!adWindow) {
      window.location.href = SMART_LINK_URL;
    }
  }, 1000);
};
