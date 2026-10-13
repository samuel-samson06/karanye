"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmbla from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";

interface HeroSlide {
  src: string;
  alt: string;
}

// Autoscrolling hero imagery, in the approved order. No arrows, dots, or
// dragging — pure 5s autoscroll on all devices. Alts derive from filenames;
// TODO(content): replace with real garment descriptions.
const slides: HeroSlide[] = [
  { src: "/images/style_01.jpeg", alt: "Karanyé editorial look — style 01" },
  { src: "/images/style_05.jpeg", alt: "Karanyé editorial look — style 05" },
  { src: "/images/style_03.jpeg", alt: "Karanyé editorial look — style 03" },
  { src: "/images/style_07.jpeg", alt: "Karanyé editorial look — style 07" },
];

export default function ScrollImages() {
  const autoplay = useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: false }),
    []
  );
  const [viewportRef] = useEmbla({ loop: true, watchDrag: false }, [autoplay]);

  // Static first frame for visitors who prefer reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.stop();
    }
  }, [autoplay]);

  return (
    <div
      ref={viewportRef}
      aria-roledescription="carousel"
      aria-label="Karanyé editorial looks"
      className="absolute inset-0 overflow-hidden"
    >
      <div className="flex h-full">
        {slides.map((slide, position) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${slides.length}`}
            className="relative h-full min-w-0 flex-[0_0_100%]"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={position === 0}
              sizes="100vw"
              className="object-cover object-[center_25%]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
