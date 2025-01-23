import React, { useState } from "react";

const PageLoader = (props:any) => {
  let { loading = false } = props;

  const [isLoading, setIsLoading] = useState<any>(loading); // Loader state

  return (
    <div style={{ position: "relative" }}>
      {/* Loader */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          opacity: isLoading ? 0.5 : 1, // Dim effect on content when loading
          pointerEvents: isLoading ? "none" : "auto", // Disable interaction with content while loading
          transition: "opacity 0.3s ease",
        }}
      ></div>
    </div>
  );
};

export default PageLoader;
