import { useState, useEffect, useRef } from "react";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null, clientX: null, clientY: null });
  const clientRef = useRef({ x: null, y: null });

  useEffect(() => {
    const sync = (clientX, clientY) => {
      clientRef.current = { x: clientX, y: clientY };
      setMousePosition({
        x: clientX + window.scrollX,
        y: clientY + window.scrollY,
        clientX,
        clientY,
      });
    };

    const updateMousePosition = (e) => {
      sync(e.clientX, e.clientY);
    };

    const updatePositionOnScroll = () => {
      const { x, y } = clientRef.current;
      if (x == null || y == null) return;
      setMousePosition({
        x: x + window.scrollX,
        y: y + window.scrollY,
        clientX: x,
        clientY: y,
      });
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("scroll", updatePositionOnScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("scroll", updatePositionOnScroll);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
