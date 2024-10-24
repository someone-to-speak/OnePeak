import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import img1 from "../../../public/images/book.jpg";
import img2 from "../../../public/images/diary.jpg";
import img3 from "../../../public/images/studying.jpg";
import Image from "next/image";

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const slides = [
    { id: 1, src: img1, alt: "Image 1" },
    { id: 2, src: img2, alt: "Image 2" },
    { id: 3, src: img3, alt: "Image 3" }
  ];

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  return (
    <div className="embla overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex space-x-4">
        {slides.map((slide) => (
          <div key={slide.id} className="embla__slide flex-none w-64 h-40">
            <Image
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
              width={250} // w-64 (16rem) = 256px
              height={250} // h-40 (10rem) = 160px
            />
          </div>
        ))}
      </div>
    </div>
  );
}
