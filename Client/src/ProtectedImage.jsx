import { useEffect } from "react";

const optimizeImageUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('/upload/f_auto,q_auto/')) return url; // Already optimized
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
};

export default function ProtectedImage({ src, alt, className = "", loading = "lazy" }) {
  const optimizedSrc = optimizeImageUrl(src);

  useEffect(() => {
    const preventRightClick = (e) => e.preventDefault();
    const preventDrag = (e) => e.preventDefault();

    document.addEventListener("contextmenu", preventRightClick);
    document.addEventListener("dragstart", preventDrag);

    return () => {
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%", height: "100%" }}>
      <img src={optimizedSrc} alt={alt} draggable="false" className={className} loading={loading} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
}
