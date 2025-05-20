"use client";

import { useCallback, useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  theta: 0.15,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 30000,
  mapBrightness: 6,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [0.1, 0.8, 1],
  glowColor: [0.1, 0.8, 1],
  markers: [
    { location: [40.7128, -74.0060], size: 0.1 },
    { location: [51.5074, -0.1278], size: 0.1 },
    { location: [35.6762, 139.6503], size: 0.1 },
    { location: [-33.8688, 151.2093], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
  ],
};

export default function Globe({ className }) {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const velocityRef = useRef(0.002); // Initial automatic rotation speed
  const lastTimeRef = useRef(0);
  const frameRef = useRef();
  const isDraggingRef = useRef(false);

  const initGlobe = useCallback(() => {
    if (!canvasRef.current || globeRef.current) return;

    globeRef.current = createGlobe(canvasRef.current, {
      ...GLOBE_CONFIG,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: 0,
      onRender: (state) => {
        const now = performance.now();
        const delta = now - (lastTimeRef.current || now);
        lastTimeRef.current = now;

        if (!isDraggingRef.current) {
          // Automatic rotation when not dragging
          phiRef.current += velocityRef.current * delta;
          
          // Gradually return to automatic rotation speed after interaction
          if (Math.abs(velocityRef.current - 0.002) > 0.0001) {
            velocityRef.current += (0.002 - velocityRef.current) * 0.01;
          }
        } else {
          // Apply damping when dragging ends
          velocityRef.current *= 0.98;
        }

        state.phi = phiRef.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 100);
  }, []);

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    isDraggingRef.current = value !== null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const handlePointerDown = (e) => {
    pointerInteractionMovement.current = 0;
    updatePointerInteraction(e.clientX);
    lastTimeRef.current = performance.now();
  };

  const handlePointerMove = (e) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (deltaTime > 0) {
        // Calculate velocity based on movement speed
        velocityRef.current = delta / deltaTime * 0.01;
      }

      phiRef.current += delta * 0.01;
      pointerInteracting.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    updatePointerInteraction(null);
  };

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth;
      if (globeRef.current) {
        globeRef.current.resize(widthRef.current * 2, widthRef.current * 2);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    initGlobe();

    return () => {
      window.removeEventListener("resize", onResize);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
      cancelAnimationFrame(frameRef.current);
    };
  }, [initGlobe, onResize]);

  return (
    <div className={cn(
      "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
      className
    )}>
      <canvas
        ref={canvasRef}
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size] cursor-grab",
          "hover:opacity-100"
        )}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
        onTouchStart={(e) => handlePointerDown(e.touches[0])}
        onTouchMove={(e) => handlePointerMove(e.touches[0])}
        onTouchEnd={handlePointerUp}
      />
    </div>
  );
}