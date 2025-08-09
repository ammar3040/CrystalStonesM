import { useEffect } from "react";

export default function ProtectedImage({ src, alt }) {
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
    <div style={{ position: "relative", display: "inline-block" }}>
      <img src={src} alt={alt} draggable="false" />
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
