

"use client"; //using client component because it uses useState and useEffect which are client-side hooks

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Carousel({ images, interval = 4000 }: { images: string[]; interval?: number }) { //declares props for carousel component, interval is how long each image displays, images is an array of image URLs
  const [index, setIndex] = useState(0); //tracks the slide thats showing

  const next = () => setIndex((i) => (i + 1) % images.length); //this increases the current index of the image showing by 1 so it shows the next image in the array
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length); //^ this is the same but decreases the index

  // Auto-advance, restarting the timer whenever the slide changes
  useEffect(() => {
    if (images.length < 2) return; //if there are 0 or 1 image it returns nothing or stays on that image
    const id = setTimeout(next, interval); //calls next to autoscroll after the interval time has passed https://www.w3schools.com/react/react_useeffect.asp
    return () => clearTimeout(id); //cleanup function
  }, [index, images.length, interval]); //dependancy array: the useEffect hook will re-run if any of these values change

  if (images.length === 0) return null; //if there are no images render nothing

  return (
    <div className="flex relative mx-auto w-2/3 aspect-video overflow-hidden rounded-xl bg-black mt-2 mb-5">
      {images.map((src, i) => (
        <Image
          key={src} //unique id for each image because src is always unique
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <button
        onClick={prev} //button for prev
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-1 text-2xl text-white hover:bg-black/60"
      >
        ‹
      </button>
      <button
        onClick={next} //button for next
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-1 text-2xl text-white hover:bg-black/60"
      >
        ›
      </button>

      {/* Dots for navigation */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}