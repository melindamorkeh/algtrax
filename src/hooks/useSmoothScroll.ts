import { useEffect, useRef } from 'react';

export const useSmoothScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const scrollSpeed = 0.5;
      const delta = e.deltaY * scrollSpeed;
      
      element.scrollTop += delta;
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return scrollRef;
}; 