// ------ REFERENCES
/** [1]
 * Description:
 * Reference: Anthropic. (2026). Claude [Large language model]. https://claude.ai/share/0926c9f6-5f4c-4ba8-be51-df90b8462753
 */

import fs from "fs";
import path from "path";
import Carousel from "./Carousel";

// Server component: reads every image in public/showcase at build/request time [1]
export default function Showcase() {
  const dir = path.join(process.cwd(), "public", "showcase"); //location of the images in the showcase folder
  const images = fs
    .readdirSync(dir) //lists every filename in that folder
    .filter((f) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(f)) //tests if the extension matches any of these 
    .sort() //sorts files alphabetically
    .map((f) => `/showcase/${f}`); //turns the filenames into public urls

  return <Carousel images={images} />; //gives list of images to Carousel component
}