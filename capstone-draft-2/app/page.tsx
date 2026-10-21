import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <h1>Welcome to the UC Capstone Page</h1>
        <h2>Connect with Sponsors and Mentors, see available projects, and get involved in the UC Capstone Project</h2>
        <div className="flex flex-col ">
          <div className="explore-project-cta">
            <p className="text-3xl">Ready to start your capstone?</p>
            <a className="text-2xl bg-[#d3eef4] text-[#006c91] py-4 rounded-sm w-1/2 text-center" href="/projects">Explore available projects</a>
          </div>
          <Image className="z-10" src="/images/teamwork.webp" width={500} height={500} alt="Picture of the author"/>
        </div>
        <p>Quick Access Links</p>
        <div className="home-quick-links">
          <a className="link-buttons" href="/eoi">Join as a mentor or sponsor</a>
          <a className="link-buttons" href="/showcase">Explore project showcase</a>
          <a className="link-buttons" href="/mentors">See our Mentors</a>
          <a className="link-buttons" href="/sponsors">See our Sponsors</a>
        </div>

      </main>
    </div>
  );
}
