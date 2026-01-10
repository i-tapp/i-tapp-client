import { useEffect, useState } from "react";

const useIsResponsive = () => {
  // Initialize with false to avoid hydration mismatch, update in useEffect
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //   (()=>()())

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { collapsed, isMobile, setCollapsed, setIsMobile };
};

export default useIsResponsive;
