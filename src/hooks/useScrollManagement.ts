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
    const main = document.getElementById('main-content');
    if (!main) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        const currentScrollY = main.scrollTop;
        if (window.history.state) {
          window.history.replaceState({ ...window.history.state, scrollPos: currentScrollY }, '');
        } else {
          window.history.replaceState({ scrollPos: currentScrollY }, '');
        }
      }, 100);
    };

    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle popstate/route changes
  useEffect(() => {
    const handleNavigation = (e: PopStateEvent) => {
      requestAnimationFrame(() => {
        const main = document.getElementById('main-content');
        if (main) {
          main.style.scrollBehavior = 'auto'; // Temporary disable smooth scroll
          
          if (e && e.state && typeof e.state.scrollPos === 'number') {
            main.scrollTo({ top: e.state.scrollPos, left: 0, behavior: 'instant' });
          } else {
            main.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }
          
          main.style.scrollBehavior = '';
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      });
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
          const main = document.getElementById('main-content');
          
          if (main) {
            // Because main is position: relative/static, target element's top is relative to document.
            // But main is the scroll container.
            const mainRect = main.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            const offsetPosition = targetRect.top - mainRect.top + main.scrollTop - headerOffset;
            
            main.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
    
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }

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
    const main = document.getElementById('main-content');
    if (main) {
      if (!smooth) main.style.scrollBehavior = 'auto';
      main.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'instant',
      });
      if (!smooth) main.style.scrollBehavior = '';
    } else {
      window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'instant',
      });
    }
  }, []);

  return { scrollToTop };
};
