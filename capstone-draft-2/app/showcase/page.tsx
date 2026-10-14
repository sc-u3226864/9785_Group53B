import prisma from "../lib/prisma";
import { getSession } from "../lib/session";
import { createShowcasePost } from "../actions/actions";

export default async function ShowcasePage() {
  const session = await getSession();
  const posts = await prisma.showcasePost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main>
      <h1>Showcase</h1>
      {session?.user.role === "CONVENER" && (  //showcase post form
        <form action={createShowcasePost}>
          <input name="title" placeholder="Title" required />
          <label htmlFor="semcompleted">Semester completed</label>
          <select id="semcompleted" name="semcompleted" required>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>
          <select id="completed-year" name="completed-year">
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <input name="sponsor" placeholder="Sponsor" required/>
          <input name="mentor" placeholder="Mentor" required />
          <input name="organisation" placeholder="Organisation" />
          <input name="student1" placeholder="Student 1" required />
          <input name="student2" placeholder="Student 2" />
          <input name="student3" placeholder="Student 3" />
          <input name="student4" placeholder="Student 4" />
          <textarea name="description" placeholder="Description" />
          <button>Publish</button>
        </form>
      )}
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
        </article>
      ))}
    </main>
  );
}

// Date selection dropdown script
//https://medium.com/better-programming/how-to-dynamically-populate-a-year-dropdown-with-javascript-bcf4f849bc4f

const currentYear = new Date().getFullYear(); //gets current year
const earliestYear = 1967;     //year that UC started
const years = Array.from(
  {length:currentYear - earliestYear +1},
  (_,i) => currentYear - i
);
