// REFERENCES
// [1] https://tailwindcss.com/docs/styling-with-utility-classes
// [2] styling inspired by https://www.canberra.edu.au/content/myuc/home.html

import Image from "next/image";

export default function Home() {
  return (
    <main>
      <h1 className="bg-[#00809f] text-white">Welcome to the UC Capstone Page</h1>
      <h2 className="bg-[#00809f]">Connect with Sponsors and Mentors, see available projects, and get involved in the UC Capstone Project</h2>
      <div className="explore-project-cta flex flex-row ">
        <div className="flex flex-col gap-10 justify-center">
          <p className="text-3xl text-white">Ready to start your capstone?</p>
          <a className="text-2xl bg-[#d3eef4] text-[#006c91] py-4 rounded-sm text-center hover:bg-[#d3eef4]/50" href="/projects">Explore available projects</a>
        </div>
        <Image src="/images/teamwork.webp" width={500} height={500} alt="Picture of the author"/> {/* https://iconscout.com/free-illustration/free-teamwork-illustration_1785594 */}
      </div>
      <p className="text-[#006c91] pl-[40px] pt-4 pb-4 text-xl bg-[#d3eef4]">Quick Access Links</p>
      <div className="home-quick-links">
        <a className="link-buttons" href="/eoi">Join as a mentor or sponsor</a>
        <a className="link-buttons" href="/showcase">Explore project showcase</a>
        <a className="link-buttons" href="/mentors">See our Mentors</a>
        <a className="link-buttons" href="/sponsors">See our Sponsors</a>
      </div>
    </main>
  );
}
