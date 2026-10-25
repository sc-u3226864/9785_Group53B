
//this component is used to create and edit projects
//it takes in an action prop which is a function that will be called when the form is submitted

type Props = { // what a page must pass in
  action: (formData: FormData) => Promise<void>;
  project?: {
    id: string;
    title: string;
    description: string;
    scope: string;
    skills: string;
  };
};

export default function PostForm({ action, project }: Props) { //reusable form for createPost and updatePost actions
  return (
    <div style={{display:"flex", justifyContent:"center"}}>
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500}}>
      {project && <input type="hidden" name="id" value={project.id} />} {/*which project is being edited */}
      

      <label>
        Title *: 
        <input className="form-input" name="title" defaultValue={project?.title} placeholder="Project Title" required />
      </label>

      <label>
        Description *: 
        <textarea className="form-input" name="description" defaultValue={project?.description} rows={5} required placeholder="Project description"/>
      </label>

      <label>
        Scope *: 
        <textarea className="form-input" name="scope" defaultValue={project?.scope} rows={5} required placeholder="Project scope"/>
      </label>

      <label>
        Skills *: 
        <textarea className="form-input" name="skills" defaultValue={project?.skills} rows={5} required placeholder="Skills required"/>
      </label>


      <button type="submit">Save</button> {/*submit button to save the form data, when clicked it will trigger the action function passed as a prop to the PostForm component*/}
    </form>
    </div>
  );
}