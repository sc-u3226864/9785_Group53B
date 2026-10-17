import Image from "next/image";
import Link from "next/dist/client/link";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <h1>Welcome to the UC Capstone Page</h1>
        <h2>Connect with Sponsors and Mentors, see available projects, and get involved in the UC Capstone Project</h2>
        <div>
          <p>Ready to start your capstone?</p>
          <a href="capstone-draft-2/app/projects">Explore available projects</a>
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
