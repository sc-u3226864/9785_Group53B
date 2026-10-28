

//this component is used to create and edit showcase posts
//it takes in an action prop which is a function that will be called when the form is submitted

type Props = { // what a page must pass in
  action: (formData: FormData) => Promise<void>;
  post?: {
    id: string;
    title: string;
    semcompleted: string;
    yearcompleted: string;
    sponsor: string;
    mentor: string;
    organisation?: string | null;
    student1: string;
    student2?: string | null;
    student3?: string | null;
    student4?: string | null;
    description: string;
    showcaseImageURL: string | null;
  };
};

export default function PostForm({ action, post }: Props) { //reusable form for createPost and updatePost actions
  return (
    <div style={{display:"flex", justifyContent:"center"}}>
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500}}>
      {post && <input type="hidden" name="id" value={post.id} />} {/*which post is being edited */}    
      {post?.showcaseImageURL && (
        <img src={post.showcaseImageURL} alt="Current showcase image" width={200} />)}  

      <label>
        Title *: 
        <input className="form-input" name="title" defaultValue={post?.title} placeholder="Big App" required />
      </label>

      <label>
        Semester completed *: 
        <select className="form-input" id="semcompleted" name="semCompleted" required>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
        </select>
      </label>

      <label>
        Year completed *: 
        <select className="form-input" id="completed-year" name="yearCompleted" required>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
      </label>

      <label>
        Sponsor *: 
        <input className="form-input" name="sponsor" defaultValue={post?.sponsor} placeholder="John Doe" required />
      </label>

      <label>
        Mentor *: 
        <input className="form-input" name="mentor" defaultValue={post?.mentor} placeholder="Jane Smith" required />
      </label>

      <label>
        Organisation: 
        <input className="form-input" name="organisation" defaultValue={post?.organisation ?? ""} placeholder="University of Canberra"/>
      </label>

      <label>
        Student 1 *: 
        <input className="form-input" name="student1" defaultValue={post?.student1} placeholder="John Smith" required />
      </label>

      <label>
        Student 2: 
        <input className="form-input" name="student2" defaultValue={post?.student2 ?? ""} placeholder="Jane Doe"/>
      </label>

      <label>
        Student 3: 
        <input className="form-input" name="student3" defaultValue={post?.student3 ?? ""} placeholder="Bob Johnson"/>
      </label>

      <label>
        Student 4: 
        <input className="form-input" name="student4" defaultValue={post?.student4 ?? ""} placeholder="Alice Williams"/>
      </label>

      <label>
        Description *: 
        <textarea className="form-input" name="description" defaultValue={post?.description} rows={5} required placeholder="Describe your showcase post..."/>
      </label>

      <label>
        
        Showcase Image URL (leave blank for none):
        <input className="hover:text-[#009abc] cursor-pointer border-black border-1 pl-1 rounded-md" name="showcaseImage" type="file" accept="image/*" />
      </label>

      <button type="submit">Save</button> {/*submit button to save the form data, when clicked it will trigger the action function passed as a prop to the PostForm component*/}
    </form>
    </div>
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