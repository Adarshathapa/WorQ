export const openSmartLinkAd = () => {
  setTimeout(() => {
    // Replace with your actual Smart Link Ad URL (Direct Link)
    const SMART_LINK_URL = 'https://www.profitablecpmratenetwork.com/w19eufniu9?key=9bab8fd8de7bd260a7d94381f4812e34'; 
    
    // Try opening in new tab first
    const adWindow = window.open(SMART_LINK_URL, '_blank');
    
    // If popup blocked, redirect the current page
    if (!adWindow) {
      window.location.href = SMART_LINK_URL;
    }
  }, 1000);
};
