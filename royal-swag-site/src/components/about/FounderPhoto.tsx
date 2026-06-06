"use client";

type FounderPhotoProps = {
  src: string;
  alt: string;
};

export function FounderPhoto({ src, alt }: FounderPhotoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "400px",
        objectFit: "contain",
        objectPosition: "center top",
        display: "block",
      }}
      onError={(e) => {
        const el = e.currentTarget;
        el.style.display = "none";
        const parent = el.parentElement;
        if (parent) {
          parent.style.background =
            "linear-gradient(160deg, #324023, #495738)";
          const fallback = document.createElement("div");
          fallback.style.cssText =
            "color:rgba(255,255,255,0.3);font-size:14px;padding:40px;text-align:center;";
          fallback.textContent = "Photo coming soon";
          parent.appendChild(fallback);
        }
      }}
    />
  );
}
