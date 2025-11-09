import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: string[];
  interval?: number; // Intervalo de auto-deslizamiento en ms
}

export default function ImageCarousel({ images, interval = 5000 }: ImageCarouselProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función para avanzar automáticamente
  const advanceSlide = useCallback(() => {
    setDirection((prev) => (prev === 'left' ? 'right' : 'left'));
    setPrevSlideIndex(currentSlideIndex);
    setCurrentSlideIndex((prev) => (prev + 1) % images.length);
  }, [currentSlideIndex, images.length]);

  // Efecto para controlar el auto-avance
  useEffect(() => {
    // No iniciar un nuevo temporizador si una transición manual está en curso
    if (prevSlideIndex === null) {
      timeoutRef.current = setTimeout(advanceSlide, interval);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [advanceSlide, interval, prevSlideIndex]); // Se re-ejecuta cuando prevSlideIndex cambia

  // Función para la navegación manual
  const goToSlide = (idx: number) => {
    // Prevenir clics si una transición ya está en marcha o si se hace clic en el punto activo
    if (prevSlideIndex !== null || idx === currentSlideIndex) return;

    // Limpiar el temporizador actual para evitar un doble avance
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newDirection = idx > currentSlideIndex ? 'left' : 'right';
    setDirection(newDirection);
    setPrevSlideIndex(currentSlideIndex);
    setCurrentSlideIndex(idx);
  };
  
  // Calcula las variables CSS para la animación
  const getAnimationVariables = (index: number) => {
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
    } as React.CSSProperties;
  };
  
  // Determina la clase CSS para una imagen
  const getClassName = (index: number) => {
    // Durante una transición
    if (prevSlideIndex !== null) {
      if (index === currentSlideIndex) {
        return 'carousel-image enter';
      }
      if (index === prevSlideIndex) {
        return 'carousel-image exit';
      }
    }
    // Estado estático (sin transición)
    else if (index === currentSlideIndex) {
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
              // Una vez que la animación de salida termina, resetea el prevSlideIndex
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
            onClick={() => goToSlide(idx)} // Añadido el evento onClick
          ></span>
        ))}
      </div>
    </div>
  );
}
