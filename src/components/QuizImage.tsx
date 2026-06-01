interface QuizImageProps {
  src: string;
  alt: string;
  className?: string;
  maxWidthClass?: string;
}

/** Static SVG/PNG from /public — native img avoids Next image optimizer issues. */
export function QuizImage({
  src,
  alt,
  className = "mx-auto h-auto w-full",
  maxWidthClass = "max-w-md",
}: QuizImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={640}
      height={320}
      loading="lazy"
      decoding="async"
      className={`${className} ${maxWidthClass}`}
    />
  );
}
