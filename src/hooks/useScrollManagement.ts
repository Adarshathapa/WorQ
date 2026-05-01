import { useEffect, useCallback, useRef } from 'react';

export const useScrollManagement = () => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Disable native scroll restoration so we can handle it manually
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        const currentScrollY = window.scrollY;
        if (window.history.state) {
          window.history.replaceState({ ...window.history.state, scrollPos: currentScrollY }, '');
        } else {
          window.history.replaceState({ scrollPos: currentScrollY }, '');
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle popstate/route changes
  useEffect(() => {
    const handleNavigation = (e: PopStateEvent) => {
      setTimeout(() => {
        // We use window for scrolling now
        document.documentElement.style.scrollBehavior = 'auto'; // Temporary disable smooth scroll
        
        if (e && e.state && typeof e.state.scrollPos === 'number') {
          window.scrollTo({ top: e.state.scrollPos, left: 0, behavior: 'instant' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        
        document.documentElement.style.scrollBehavior = '';
      }, 0);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  // Intercept anchor clicks for smooth scrolling with offset
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (!link) return;

      const href = link.getAttribute('href');
      
      // Check if it's an anchor link on the same page
      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Adjust this value based on your sticky header height
          const headerOffset = 80; 
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Optional: Update URL hash without jumping
          window.history.pushState(null, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Provide manual scroll to top function 
  const scrollToTop = useCallback((smooth = false) => {
    if (!smooth) document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'instant',
    });
    if (!smooth) document.documentElement.style.scrollBehavior = '';
  }, []);

  return { scrollToTop };
};
