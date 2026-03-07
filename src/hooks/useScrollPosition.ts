import { useState, useEffect } from "react";

interface UseScrollPositionReturn {
  isVisible: boolean;
  isScrolling: boolean;
}

export function useScrollPosition(): UseScrollPositionReturn {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button when at the top
      if (currentScrollY < 50) {
        setIsVisible(true);
      }
      // Hide button when scrolling down
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      // Show button when scrolling up
      else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      setIsScrolling(true);

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Hide scrolling indicator after user stops scrolling
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  return { isVisible, isScrolling };
}
