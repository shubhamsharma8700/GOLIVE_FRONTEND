import React, { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHZpZXdCb3g9IjAgMCA4OCA4OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODgiIGhlaWdodD0iODgiIHJ4PSIxMiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGZpbGw9IiNkMmQyZDIiIGQ9Ik0yNCA2NEw0NCA0NEw2NCA2NEg3NEw0NCAzNEwxNCA2NEgyNFoiLz48Y2lyY2xlIGN4PSI1MiIgY3k9IjMyIiByPSI4IiBmaWxsPSIjYzBjMGMwIi8+PC9zdmc+";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

/**
 * ImageWithFallback
 * Shows fallback SVG if the main image fails to load.
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = "Image",
  className = "",
  style,
  ...rest
}) => {
  const [error, setError] = useState(false);

  return error ? (
    <div
      className={`flex items-center justify-center bg-gray-100 rounded-md ${className}`}
      style={style}
    >
      <img
        src={FALLBACK_IMAGE}
        alt="Failed to load"
        className="opacity-60"
        {...rest}
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setError(true)}
    />
  );
};
