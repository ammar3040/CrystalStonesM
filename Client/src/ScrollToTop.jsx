import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Add slight delay to allow page components to mount
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",  // or "auto"
      });
    }, 50); // 50ms delay ensures smoother behavior

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
