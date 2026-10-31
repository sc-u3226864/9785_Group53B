// ------ REFERENCES
/** [1]
 * Description:
 * Reference: Tailwind Labs. (n.d.). Styling with utility classes. Tailwind CSS. https://tailwindcss.com/docs/styling-with-utility-classes
 */
/** [2]
 * Description: styling inspired by
 * Reference: University of Canberra. (n.d.). MyUC home. https://www.canberra.edu.au/content/myuc/home.html
 */
/** [3]
 * Description:
 * Reference: Delesign Graphics. (n.d.). Free teamwork illustration [Illustration]. IconScout. https://iconscout.com/free-illustration/free-teamwork-illustration_1785594
 */

import Image from "next/image";
import Showcase from "./components/Showcase";


export default function Home() {
  return (
    <main> {/*[1] [2]*/}
      <h1 className="bg-[#00809f] text-white">Welcome to the UC Capstone Page</h1>
      <h2 className="bg-[#00809f]">Connect with Sponsors and Mentors, see available projects, and get involved in the UC Capstone Project</h2>
      <div className="explore-project-cta flex flex-row ">
        <div className="flex flex-col gap-10 justify-center">
          <p className="text-3xl text-white">Ready to start your capstone?</p>
          <a className="text-2xl bg-[#d3eef4] text-[#006c91] py-4 rounded-sm text-center shadow-xl transition-colors duration-300 hover:bg-[#d3eef4]/50" href="/projects">Explore available projects</a>
        </div>
        <Image src="/images/teamwork.webp" width={500} height={500} alt="Picture of the author"/> {/*[3]*/}
      </div>
      <p className="text-[#006c91] pl-[40px] pt-4 pb-4 text-2xl bg-[#d3eef4]">Quick Access Links</p>
      <div className="home-quick-links">
        <a className="link-buttons" href="/eoi">Submit your EOI</a>
        <a className="link-buttons" href="/mentors">See our Mentors</a>
        <a className="link-buttons" href="/sponsors">See our Sponsors</a>
      </div>
      <div className="flex flex-row mx-3 bg-[#00537a] my-2 rounded-2xl pr-4 pt-4 pl-2">
        <div className="flex flex-col items-center text-center gap-4 ">
          <h1 className="text-[#ffffff]">Our Project Showcase</h1>
          <p className="text-wrap text-[#92d6e3] pr-2 text-xl">Browse our showcase gallery to explore past projects and celebrate the achievements of our talented students.</p>
          <a className="link-buttons" href="/showcase">Explore project showcase</a>
        </div>
        <Showcase />
      </div>
    </main>
  );
}
