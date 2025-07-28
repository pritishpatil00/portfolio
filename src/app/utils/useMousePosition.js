import { useState, useEffect } from "react";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [lastClientPosition, setLastClientPosition] = useState({ x: null, y: null });

  const updateMousePosition = e => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    setLastClientPosition({ x: clientX, y: clientY });
    setMousePosition({ 
      x: clientX + window.scrollX, 
      y: clientY + window.scrollY 
    });
  };

  const updatePositionOnScroll = () => {
    if (lastClientPosition.x !== null && lastClientPosition.y !== null) {
      setMousePosition({ 
        x: lastClientPosition.x + window.scrollX, 
        y: lastClientPosition.y + window.scrollY 
      });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("scroll", updatePositionOnScroll);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("scroll", updatePositionOnScroll);
    };
  }, [lastClientPosition.x, lastClientPosition.y]);

  return mousePosition;
};

export default useMousePosition;