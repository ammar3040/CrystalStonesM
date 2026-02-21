import React from "react";
import ReactImageMagnify from "react-image-magnify";

export default function ProductImageZoom({ img }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}>
      {/* Left side small image */}
      <div style={{ width: "400px" }}>
        <ReactImageMagnify
          {...{
            smallImage: {
              alt: "Product Image",
              isFluidWidth: true,
              src: img
            },
            largeImage: {
              src: img,
              width: 1600,
              height: 2400
            },
            enlargedImagePosition: "beside",
            enlargedImageContainerStyle: {
              position: "fixed", // fixed so it stays in place
              top: "50%",
              left: "60%",
              transform: "translateY(-50%)",
              zIndex: 9999,
              background: "#fff",
              borderRadius: "0.75rem",
              boxShadow:
                "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              padding: "10px"
            },
            isHintEnabled: true,
            lensStyle: {
              backgroundColor: "rgba(0,0,0,0.2)",
              border: "1px solid #fff"
            }
          }}
        />
      </div>
    </div>
  );
}
