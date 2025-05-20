import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  const marqueeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle mouse down
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition(vertical ? e.clientY : e.clientX);
    setScrollPosition(vertical ? marqueeRef.current.scrollTop : marqueeRef.current.scrollLeft);
  };

  // Handle mouse move (dragging)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = (vertical ? e.clientY : e.clientX) - startPosition;
    if (marqueeRef.current) {
      if (vertical) {
        marqueeRef.current.scrollTop = scrollPosition - delta;
      } else {
        marqueeRef.current.scrollLeft = scrollPosition - delta;
      }
    }
  };

  // Handle mouse up (stop dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      {...props}
      ref={marqueeRef}
      className={cn(
        "group flex overflow-hidden p-2 cursor-grab active:cursor-grabbing [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop dragging when cursor leaves
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
