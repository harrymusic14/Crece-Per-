import { useState, useEffect, useRef, useCallback } from 'react';
import type { CSSProperties } from 'react';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: string[];
  interval?: number; // Intervalo de auto-deslizamiento en ms
}

export default function ImageCarousel({ images, interval = 5000 }: ImageCarouselProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  
  // Se usa tipo compatible con navegador
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advanceSlide = useCallback(() => {
    setDirection((prev) => (prev === 'left' ? 'right' : 'left'));
    setPrevSlideIndex(currentSlideIndex);
    setCurrentSlideIndex((prev) => (prev + 1) % images.length);
  }, [currentSlideIndex, images.length]);

  useEffect(() => {
    if (prevSlideIndex === null) {
      timeoutRef.current = setTimeout(advanceSlide, interval);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [advanceSlide, interval, prevSlideIndex]);

  const goToSlide = (idx: number) => {
    if (prevSlideIndex !== null || idx === currentSlideIndex) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newDirection = idx > currentSlideIndex ? 'left' : 'right';
    setDirection(newDirection);
    setPrevSlideIndex(currentSlideIndex);
    setCurrentSlideIndex(idx);
  };
  
  // El parámetro index no se usa internamente; se deja con guion bajo para indicar intención
  const getAnimationVariables = (_index: number): CSSProperties => {
    let panStart = '0%';
    let panEnd = '-5%';
    let slideFrom = '100%';
    let slideTo = '-100%';

    if (direction === 'right') {
      panStart = '-5%';
      panEnd = '0%';
      slideFrom = '-100%';
      slideTo = '100%';
    }
    
    return {
      '--pan-start': panStart,
      '--pan-end': panEnd,
      '--slide-from': slideFrom,
      '--slide-to': slideTo,
      '--pan-duration': `${interval}ms`,
    } as unknown as CSSProperties;
  };
  
  const getClassName = (index: number) => {
    if (prevSlideIndex !== null) {
      if (index === currentSlideIndex) return 'carousel-image enter';
      if (index === prevSlideIndex) return 'carousel-image exit';
    } else if (index === currentSlideIndex) {
      return 'carousel-image active';
    }
    return 'carousel-image';
  };
  
  return (
    <div className="image-carousel-container">
      <div className="carousel-track">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={getClassName(index)}
            style={getAnimationVariables(index)}
            onAnimationEnd={() => {
              if (index === prevSlideIndex) {
                setPrevSlideIndex(null);
              }
            }}
          />
        ))}
      </div>
      <div className="carousel-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentSlideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
}
// ...existing code...