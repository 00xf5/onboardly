import React from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
}

// Usage: <OptimizedImage src="/assets/brand/logo.png" alt="O" className="w-8 h-8" />
export const OptimizedImage: React.FC<Props> = ({ src, alt, className, sizes, ...rest }) => {
  const webp = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const avif = src.replace(/\.(png|jpg|jpeg)$/i, '.avif');

  return (
    <picture>
      <source type="image/avif" srcSet={avif} />
      <source type="image/webp" srcSet={webp} />
      <img src={src} alt={alt} className={className} sizes={sizes} loading="lazy" {...rest} />
    </picture>
  );
};

export default OptimizedImage;