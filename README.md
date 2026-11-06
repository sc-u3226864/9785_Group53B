# 9785_Group53B

## Our Project Approach
We're following a SCRUM approach to manage our workflow, structured around:
* **Weekly team meetings** – clarify tasks, align expectations, resolve blockers
* **Fortnightly mentor meetings** – guidance on the build
* **Fortnightly sponsor check-ins** – clarify expectations and deliverables
* **Weekly QA sessions** – test newly added functionality

Our goal for this project is to showcase skills learnt from our combined IT and Software Engineering degrees, including programming, web development, cybersecurity, system administration, and system design, while strengthening our teamwork and producing something that could realistically be built upon in future capstone projects. We want to gain from this project more in depth knowledge on web development and design, alongside practical experience in hosting, deployment, and balancing stakeholder expectations.

## Result
Our MVP is a desktop application for capstone project allocation and Expression of Interest (EOI) submissions, which we aim to host on an AWS server to make it accessible beyond the desktop environment.

## Roles & Responsibilities
Our SCRUM roles aren't strictly defined, as we're focused on helping each other wherever needed. Currently:
* **Sophia** – SCRUM Master/Product Owner
* **Lachlan** – Developer/Product Owner
* **Danica** – Developer
* **Laiba** – Developer

These roles may shift as expectations change and blockers arise. Our goal is to support one another so we can deliver our MVP with confidence, while keeping workloads roughly equal.

| Name | Role | Scope | Responsibility |
|---|---|---|---|
| Danica: **Dani-hub433** | UX/Design |  UC theming, Poster Design, Site Design | Component design and scaffolding, styling, wireframes, accessibility checks (WCAG table), poster and slide design |
| Lachlan: **shlooop** | Hosting & Testing | Hosting (cloud/Docker/AWS), CI, Test case generation, debugging | hosting investigation, app integration, final QA and debugging, test case generation, CI pipeline setup|
| Laiba: **ahmedlaiba6** | Database Infra & Testing | Database schema, CI, Test case generation, debugging | Schema design, system architecture, data flow diagram, ERD, final QA and debugging, test case generation |
| Sophia: **sc-u3226864** & **sophiaaaaac** | Comms & Full-Stack Development | Stakeholder comms, GitHub hygiene, app logic, auth, roles & permissions, automated emails, EOI workflows, implement frontend design |  charter, project proposal, meeting planner, agendas, boilerplate endpoints, auth, roles, data flows, automation and application logic setup, implement frontend designs  |

Responsibilities are defined above, but we recognise everyone has different schedules and occasional extenuating circumstances. If something falls behind, we'll hold each other accountable and redistribute work rather than let it stall. We aim for fairness, but ultimately we'll be satisfied as long as we're happy with the result and everyone has tried their best.

Roles will stay fixed, but where confusion or blockers arise, we'll resolve them collaboratively, for example, swapping tasks if someone isn't confident in an area another team member is stronger in. We also share responsibility for:
* Reviewing each other's PRs
* Documenting Gen AI use
* Rotating a "checker" each sprint so QA isn't left to one person

## Relationships
We use a combination of Microsoft and GitHub tools to track progress, communicate, and store files:

* **GitHub Projects** – foundation of our sprints; tracks tasks and allocates responsibilities
* **Teams/Outlook** – organise weekly meetings with each other, our sponsor, and mentor; our shared 365 group enables shared emails and a shared inbox, and hosts meeting notes, resources, and files
* **OneDrive** – shared file access and simultaneous editing
* **GitHub** – tracks code iterations, allows reverting changes, and stores supporting files (wireframes, DFDs, ERDs, configuration guidance, SOPs)
* **WhatsApp** – day-to-day communication between group members

## Relationships
We track deadlines through our GitHub project and weekly scrum meetings, addressing blockers as they arise and reallocating tasks where needed. For conflict resolution, we prioritise clear communication, discussion, compromise, and voting to work through disagreements. If conflict persists despite these efforts, we'll escalate it to the lecturer for intervention.

# Getting Started
## Prerequisites

1. Install [Visual Studio Code](https://code.visualstudio.com/download) and [Git](https://git-scm.com/downloads).

2. In VS Code, select **Terminal** > **New Terminal**, then check that Git is available:

    ```bash
    git --version
    ```

    You should see a Git version number. If the command isn't found, restart VS Code after installing Git. If it still fails, see [source control troubleshooting](/docs/sourcecontrol/troubleshooting.md).


3. Set the name and email Git records as the author of your commits.

    First, check whether they're already set:

    ```bash
    git config --global user.name
    git config --global user.email
    ```

    If both commands print a value, skip to the next step. If not, run these commands, replacing the placeholders with your own details:

    ```bash
    git config --global user.name "<your-name>"
    git config --global user.email "<your-email>"
    ```

    Keep in mind:

    - These values only label your commits. They aren't your sign-in credentials.
    - `--global` makes them the default for every repository on this computer.
    - Anyone who can see commits you publish can see this name and email.

<a name="option-b-initialize-a-repository-in-a-local-folder"></a>
(source - https://code.visualstudio.com/docs/sourcecontrol/quickstart)

## Step 1: Cloning the Repo
1. Go to Source Control in the left panel - if this isn't visible check you don't have pending VSCode updates
2. Click 'Clone Repository'
3. Paste in repository URL
![Screenshot showing the Clone Repository prompt in VS Code.](https://code.visualstudio.com/assets/docs/sourcecontrol/repos-remotes/github-clone.png)
4. You'll be prompted to save your project - SAVE IT LOCALLY, saving it in the cloud causes sync issues

## Step 2: Configuring your .env file
1. In `/9785_Group53B/capstone-draft-2/.env.example` copy the file and paste it into the repo
<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/3cdd85d1-1574-4649-9e80-c4252e0dd74e" />

2. rename the file to '.env' so .gitignore picks it up - this file should NEVER be committed publicly
3. DATABASE_URL: I have sent you all a link to the Prisma Console to your UC emails. Go to Projects > capstone > Databases (left) > 'Lively Peach Colt' > Dashboard > click the Connect button > Quick Connect > copy the URL and paste into the field in your .env file
<img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/17bc06d2-c2b3-48e7-bafd-c7e34cc0df46" />


4. BETTER_AUTH_URL & BETTER_AUTH_SECRET: there are instructions on setting this up in the .env file - *hint:* http://localhost:3000/
5. SEED_CONVENER_EMAIL: when you run the seed file in future steps this is the email which will be associated with the initial convener role and you'll have to set a password for

## Step 3: Running the assignment


For Windows users, commands can be done using WSL, using the Linux install of node
1.  in your terminal make sure your in the right directory - `cd capstone-draft-2`
2. make sure you have node installed
    * check version `node -v` install v24.22.1
    * if you dont't have it follow the instructions here: [https://nodejs.org/en/download](https://nodejs.org/en/download) 
3. prisma setup, run `npm install prisma --save-dev`. After prisma is installed, run `npx prisma migrate dev` it should be already synced, but it's good practice 
4. generate the prisma client `npx prisma generate` 
5. Run the seed command to setup the Convener user: `npx prisma db seed` . After this you'll get a link in your terminal to setup a new password, **save this link for later** 
6. Lastly run `npm run dev` and open the local link, open the saved link from step 5 and setup a new password and save

Note:
Prisma ORM is used to help manage the database, for help with commands and data management see
```powershell
npx prisma
```

# The App Building Process

## Summary

Demo Video (you must be signed into the UC tenant to view i.e. example@uni.canberra.edu.au): https://unicanberraedu.sharepoint.com/:v:/s/9785-53b/IQBR3o23WGJsQbT3PAt3p3h9AUhc5FZZRopWuDyQKSjKsXg

To build our app we used a combination of research, official documentation, community forums and AI guidance. Because of blockers during the semester, inlcuding technical issues and team member capacity, we had three weeks to build the app and one week to style it. This compressed timeframe showed clearly where AI could make development more efficient, and where it still needed careful human oversight.

The app is intented to showcase mentors and sponsors to entice future connections with industry professionals. We also want to celebrate past projects with our project showcase. It also has an expression of interest form for prospective mentors and sponsors, and functionality for sponsors to submit project proposals so they can become available to students. 

## Our Stack

To choose our technologies, we asked Claude for a breakdown of the most suitable frameworks and tools for our requirements, skill levels and timeframe . It suggested .NET or a Javascript base framework. We'd all done university units on .NET before, however, we went with the Javascript option as it's more modern and widely used. We reviewed its suggestions against the official documentation, our own experience, and saught advice from our mentor (who also was team Next.js) before committing. We chose:

| Layer | Technology | Why we chose it |
|---|---|---|
| Framework | Next.js w/TypeScript | Combines frontend and backend (server actions/API routes) in one project, which reduced setup time, and typescript is an easy language to pickup |
| Database | PostgreSQL (Prisma Postgres) | Relational structure suited our linked data (users, projects, mentors, sponsors) |
| ORM | Prisma | Type-safe queries and a readable schema file; easy to share and migrate between team members |
| Authentication | Better Auth | Built-in email/password support and a Prisma adapter, so auth tables lived in the same database |
| Styling | Tailwind CSS & plain CSS | Tailwind for fast layout and utility styling; plain CSS for custom or one-off styles |
 

## Better Auth Client Setup

-   We used Better Auth's **email and password** authentication method for user accounts.
-   Better Auth's API operations handled **sign-up, login, logout and password resets**, so we didn't have to write and secure these flows ourselves.
-   We used Better Auth's **Prisma adapter**, which meant the user, session and account models were generated into our Prisma schema and stored in the same database as the rest of our app data. Data was retreived and delivered through a route handler to manage GET and POST requests.

We also implemented protected pages and actions throughout the assingnment. These were implemented in 2 ways. 
`getSession()` which was used for checking the currently signed in user from their session cookie in the header using the betterauth api operation getSession(). This was useful for pages where I needed to change the view between logged in and not logged in users, but don't need them to be redirected. for example on showcase pages to hide or unhide the create post button, without redirecting a non logged in user to the login page
`requireRole()` was used if a page is absolutely not to be entered by someone not logged in as a specific role, and as a result redirected. For example it's set on the dashboard page, the new post pages and the edit post pages, because someone who's not a convener shouldn't have any access or visibility of those functions.

Becasue we didn't finish the hosting setup, we also do our password resets locally, so the reset password link is sent to the terminal. In future iterations we recomment setting up a mail service like Resend, as it works with Node.js and has a simple REST API implementation, and a console for more hands on setup.

## Prisma Setup

-   We used a **Prisma Postgres** database as our main data store.
-   Our app performs **CRUD** operations with the Prisma client. Create, update and delete go through server actions, and reads happen in page components
-   We used the **Prisma Console** to share access to the database between team members, so we all worked against the same data.

**How our server actions are implemented**
Each action checks the user’s role, runs the Prisma query, then revalidates the page:

```typescript
export  async  function  createMentorPost(formData:  FormData) {
	await  requireRole("CONVENER");
	const  data  =  await  readMentorForm(formData); //readMentorForm collects the form data and returns an object for prisma
	await  prisma.mentorPost.create({ data });
	revalidatePath("/mentors"); //revalidates the mentors page so the new post is displayed
	redirect("/mentors");
	}
```
This table illustrates the mentor showcase post server actions, except for read which is a called on the page component. Other features like projects and sponsor posts use this same pattern:
| CRUD | Implementation|
|--|--|
| Create | `createMentorPost` which collects the form data and then submits it using `await prisma.mentorPost.create({ data });`|
| Read | Read is called on the page component `await prisma.mentorPost.findMany` is used to retrieve stored data which is rendered on the mentor showcase page using a map method|
|Update|`updateMentorPost` reads the new form data, and using `await prisma.mentorPost.update({ where: { id }, data })` updates the entry by matching the post id |
| Delete | `deleteMentorPost` deletes the post by id using `await prisma.mentorPost.delete({ where: { id } })` |


## Components

We built reusable components so that common UI elements stayed consistent across the app and only needed to be written once.
 
 One of these components is the `Navbar()` which is visible on all pages. It changes depending on login state and role; if someone is logged in they get a 'sign out' button and no 'login' button, and vice versa, conveners are also the only users who have the dashboard button. This is acheived through checking roles using the `getSession()` function.

The carousel and showcase components are used together to create the carousel on the home page. It's made using the `useState` and `useEffect` react hooks. `Showcase.tsx` reads every image in the `public/showcase` folder and returns them in a sorted list. This is passed to the `Carousel.tsx` component which loops through the list at a set interval to autoscroll through the images. It also has buttons which increase and decrease the current image index for manual scrolling. 

Our projects, sponsors and mentor pages follow a similar flow which utilitses a PostForm component and DeleteButton component which are reused throughtout the new post, edit post and root page. Here's a diagram which shows the flow: 

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e0fc7c5c-6792-4267-8e7c-462e0e1fcdbe" />


## Actions

Many of our actions shared the same structure. Once we had one working action, we could reuse it for other models by changing only the variables, such as the model name, fields or API operation. This kept our code clean and consistent, and the same functionality behaved the same way across different pages.

For example the save image and save CV functions are very similar:

```typescript
async  function  saveImage(file:  File):  Promise<string> {

	if (!file.type.startsWith("image/")) throw  new  Error("File must be an image"); // MIME type is image and the error message is specifically for images
	if (file.size  >  maxSize) throw  new  Error("Image too large (max 5 MB)"); //again, image is specified

	const  ext  = { "image/jpeg":  ".jpg", "image/png":  ".png", "image/webp":  ".webp" }[file.type]; //must be one of these image three types, if not throw error
	if (!ext) throw  new  Error("Unsupported image type");
	const  filename  =  `${crypto.randomUUID()}${ext}`; //same filename generation method
	const  dir  =  path.join(process.cwd(), "public", "uploads"); //saves image at public/uploads

	await  mkdir(dir, { recursive:  true }); 
	await  writeFile(path.join(dir, filename), Buffer.from(await  file.arrayBuffer())); 

return  `/uploads/${filename}`;

}
```
**VS**
```typescript
export  async  function  saveFile(file:  File):  Promise<string> { 

	if (!file.type.startsWith("application/")) throw  new  Error("Must be a document"); // MIME type is application and the error message is specifically for documents
	if (file.size  >  maxSize) throw  new  Error("File too large (max 5 MB)");
	
	const  ext  = { "application/pdf":  ".pdf", "application/msword":  ".doc", "application/vnd.openxmlformats-officedocument.wordprocessingml.document":  ".docx" }[file.type]; //different specified document types
	if (!ext) throw  new  Error("Unsupported document type");
	const  filename  =  `${crypto.randomUUID()}${ext}`; //identical file name creation pattern
	const  dir  =  path.join(process.cwd(), "public", "cvs"); // saves to a different area in the directory

	await  mkdir(dir, { recursive:  true }); 
	await  writeFile(path.join(dir, filename), Buffer.from(await  file.arrayBuffer())); 

return  `/cvs/${filename}`;

}
```

## Pages, Layout and Flow

-   The **mentor** and **sponsor** pages have an identical layout, so we built it once and reused it.
-   We then adapted that layout to build the **showcase** and **projects** pages, which saved time and kept the design consistent.

## AI Usage Throughout the Assignment

### Context

Early in the semester, our sponsor encouraged us to use AI throughout the project, because they wanted to see how much more efficient it could make the development process. With that in mind, we used AI across most stages of the assignment, including:

-   **Planning:** recommending a technology stack suited to our requirements, skills and timeframe
-   **Setup:** building a draft application with Claude Code and configuring the project for our chosen stack
-   **Development:** for our final app we used regular Claude for writing reusable, efficient code for actions and components, and giving guidance on page layouts
-   **Security:** advising on authentication and the validation of inputs and outputs
-   **Documentation:** helping write guides and documentation, and pointing us to resources for further research
-   **Referencing:** Claude code was used for reformatting our references into APA style to meet UC guidelines. Descriptions, explanations and comments were done without AI
- **Transcription:** for our demo video we used  ElevenLabs text to speech generation

### Benefits

**Speed of setup.** AI made the initial setup much faster. Tasks that would usually take a day of reading documentation and fixing configuration errors were done in hours, which mattered a lot given our three-week build window.

**Clean, reusable code.** The code it produced was generally clean and consistent. Many of our actions are reused across the app with only the variable names or API operations changed (see _Actions_), which made the codebase easier to maintain and extend.

**Writing better prompts.** AI was also useful for writing prompts. Because it "knows" what information it needs to give a good answer. Asking it to help structure a prompt (for example, which requirements, constraints and context to include) led to more accurate and relevant responses [ref].

**Demo video.** We used ElevenLabs text to speech generation for our demo video, and the result sounded surprisingly natural.

### Limitations and Challenges

**Output must be verified.** AI is good at writing code, but its output should never be taken at face value. Even though most of the code was clean, logical and functional, we still went through it line by line and cross-referenced it against the official documentation to confirm it did what we needed. This review took a few hours, so even though it was produced fast, gains were smaller than they first appeared.

**Frontend work.** In our experience, AI is less reliable for frontend and styling work. Its layouts often didn't match our design, so it was faster to style the app manually.

**Over-reach without clear boundaries.** AI tools can be invasive if you don't set clear parameters. When testing Claude Code on a draft version of the app, it ran multiple scripts and changed files I hadn't asked it to touch. I also had to keep reminding it to simplify its output, because it added extra code and features we didn't need. For this reason, we didn't use Claude Code to build the final application. We only used it to reformat our references into APA style, and used the regular Claude chat for guidance where we kept full control over what went into the codebase.

**Fabricated references.** When we asked for sources to support its code or explanations, the AI sometimes gave references to pages that didn't exist. This reinforced that every claim and source it gives must be checked independently, and that reviewing its reasoning is an essential, time consuming part of using it responsibly.

### Reflection

Overall, AI made our development process far more efficient. Because of the blockers during the semester, the app had to be built in a limited timeframe, and without AI we likely would not have completed the MVP to the standard our group wanted. However, the benefit depended on how we used it: it worked best as an assistant whose output we reviewed, not as a replacement for understanding the code ourselves.

AI tools are becoming more common, and often encouraged, in the workplace, especially in tech, where they are used for planning, coding, testing and troubleshooting. Learning to use them effectively, including knowing their limits, is a skill worth developing.

## References
**app/actions/actions.ts**

1.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d](https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d)
2.  Vercel. (n.d.). revalidatePath. Next.js Documentation. [https://nextjs.org/docs/app/api-reference/functions/revalidatePath#usage](https://nextjs.org/docs/app/api-reference/functions/revalidatePath#usage)
3.  Zod. (n.d.). Intro. [https://zod.dev/](https://zod.dev/)
4.  MDN Contributors. (n.d.). FormData. MDN Web Docs. [https://developer.mozilla.org/en-US/docs/Web/API/FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
5.  Better Auth. (n.d.). Email & password: Sign out. [https://better-auth.com/docs/authentication/email-password#sign-out](https://better-auth.com/docs/authentication/email-password#sign-out)
6.  Better Auth. (n.d.). Email & password: Request password reset. [https://better-auth.com/docs/authentication/email-password#request-password-reset](https://better-auth.com/docs/authentication/email-password#request-password-reset)
7.  MDN Contributors. (n.d.). encodeURIComponent(). MDN Web Docs. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
8.  Chandan. (2026, March 25). File uploads in Next.js (complete guide with server actions). CodeToDeploy. Medium. [https://medium.com/codetodeploy/file-uploads-in-next-js-complete-guide-with-server-actions-83a5ad4ece5b](https://medium.com/codetodeploy/file-uploads-in-next-js-complete-guide-with-server-actions-83a5ad4ece5b)
9.  MDN Contributors. (n.d.). File. MDN Web Docs. [https://developer.mozilla.org/en-US/docs/Web/API/File](https://developer.mozilla.org/en-US/docs/Web/API/File)
10.  Mimo. (n.d.). TypeScript promise: Syntax, usage, and examples. [https://mimo.org/glossary/typescript/promise](https://mimo.org/glossary/typescript/promise)
11.  Devcode Hunter. (2024, September 12). Mastering buffers in Node.js: A complete guide with examples. Medium. [https://medium.com/@devcodehunter/mastering-buffers-in-node-js-a-complete-guide-with-examples-e8e6f8e07408](https://medium.com/@devcodehunter/mastering-buffers-in-node-js-a-complete-guide-with-examples-e8e6f8e07408)
12.  MDN Contributors. (n.d.). FormData: get() method. MDN Web Docs. [https://developer.mozilla.org/en-US/docs/Web/API/FormData/get](https://developer.mozilla.org/en-US/docs/Web/API/FormData/get)
13.  Prisma. (n.d.). Transactions in Prisma ORM. Prisma Documentation. [https://www.prisma.io/docs/orm/fundamentals/transactions](https://www.prisma.io/docs/orm/fundamentals/transactions)
14.  Prisma. (n.d.). Prisma Client API (Prisma ORM v7): update. Prisma Documentation. [https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#update](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#update)
15.  Prisma. (n.d.). Prisma Client API (Prisma ORM v7): create. Prisma Documentation. [https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#create](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#create)
16.  Better Auth. (n.d.). Email & password: API method request password reset. [https://better-auth.com/docs/authentication/email-password#api-method-request-password-reset](https://better-auth.com/docs/authentication/email-password#api-method-request-password-reset)
17.  GeeksforGeeks. (2021, February 1). Node.js fs.rm() method. [https://www.geeksforgeeks.org/node-js/node-js-fs-rm-method/](https://www.geeksforgeeks.org/node-js/node-js-fs-rm-method/)

**app/api/auth/[...all]/route.ts**

1.  Better Auth. (n.d.). Next.js integration: Create a client. [https://better-auth.com/docs/integrations/next#create-a-client](https://better-auth.com/docs/integrations/next#create-a-client)

**app/components/Carousel.tsx**

1.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/0926c9f6-5f4c-4ba8-be51-df90b8462753](https://claude.ai/share/0926c9f6-5f4c-4ba8-be51-df90b8462753)
2.  W3Schools. (n.d.). React useEffect. [https://www.w3schools.com/react/react_useeffect.asp](https://www.w3schools.com/react/react_useeffect.asp)

**app/components/Navbar.tsx**

1.  W3Schools. (n.d.). CSS horizontal navigation bar. [https://www.w3schools.com/css/css_navbar_horizontal.asp](https://www.w3schools.com/css/css_navbar_horizontal.asp)

**app/components/Showcase.tsx**

1.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/0926c9f6-5f4c-4ba8-be51-df90b8462753](https://claude.ai/share/0926c9f6-5f4c-4ba8-be51-df90b8462753)

**app/dashboard/page.tsx**, **app/eoi/page.tsx**, **app/mentors/page.tsx**

1.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d](https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d)

**app/layout.tsx**

1.  Vercel. (n.d.). Font optimization. Next.js Documentation. [https://nextjs.org/docs/app/getting-started/fonts](https://nextjs.org/docs/app/getting-started/fonts)

**app/lib/auth.ts**

1.  Better Auth. (n.d.). Installation. [https://better-auth.com/docs/installation](https://better-auth.com/docs/installation)
2.  Better Auth. (n.d.). Email & password: Configuration. [https://better-auth.com/docs/authentication/email-password#configuration](https://better-auth.com/docs/authentication/email-password#configuration)
3.  Better Auth. (n.d.). Email & password: Request password reset. [https://better-auth.com/docs/authentication/email-password#request-password-reset](https://better-auth.com/docs/authentication/email-password#request-password-reset)
4.  Better Auth. (n.d.). Next.js integration: Server action cookies. [https://better-auth.com/docs/integrations/next#server-action-cookies](https://better-auth.com/docs/integrations/next#server-action-cookies)

**app/lib/prisma.ts**

1.  Prisma. (n.d.). How to use Prisma ORM and Prisma Postgres with Better Auth and Next.js: Set up a global Prisma client. Prisma Documentation. [https://www.prisma.io/docs/guides/authentication/better-auth/nextjs#24-set-up-a-global-prisma-client](https://www.prisma.io/docs/guides/authentication/better-auth/nextjs#24-set-up-a-global-prisma-client)

**app/lib/session.ts**

1.  Next.js. (n.d.). headers. Next.js Documentation. [https://nextjs.org/docs/app/api-reference/functions/headers](https://nextjs.org/docs/app/api-reference/functions/headers)
2.  Better Auth. (n.d.). API: Body, headers, query. [https://better-auth.com/docs/concepts/api#body-headers-query](https://better-auth.com/docs/concepts/api#body-headers-query)
3.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d](https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d)

**app/login/page.tsx**

1.  Vercel. (n.d.). page.js: Displaying content based on params. Next.js Documentation. [https://nextjs.org/docs/app/api-reference/file-conventions/page#displaying-content-based-on-params](https://nextjs.org/docs/app/api-reference/file-conventions/page#displaying-content-based-on-params)
2.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d](https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d)

**app/page.tsx**

1.  Tailwind Labs. (n.d.). Styling with utility classes. Tailwind CSS. [https://tailwindcss.com/docs/styling-with-utility-classes](https://tailwindcss.com/docs/styling-with-utility-classes)
2.  University of Canberra. (n.d.). MyUC home. [https://www.canberra.edu.au/content/myuc/home.html](https://www.canberra.edu.au/content/myuc/home.html)
3.  Delesign Graphics. (n.d.). Free teamwork illustration [Illustration]. IconScout. [https://iconscout.com/free-illustration/free-teamwork-illustration_1785594](https://iconscout.com/free-illustration/free-teamwork-illustration_1785594)

**app/showcase/PostForm.tsx**

1.  Crisologo, J. (2020, January 28). How to dynamically populate a year dropdown with JavaScript. Better Programming. Medium. [https://medium.com/better-programming/how-to-dynamically-populate-a-year-dropdown-with-javascript-bcf4f849bc4f](https://medium.com/better-programming/how-to-dynamically-populate-a-year-dropdown-with-javascript-bcf4f849bc4f)

**prisma/schema.prisma**

1.  Prisma. (n.d.). Author the Prisma ORM contract in PSL. Prisma Documentation. [https://pris.ly/d/prisma-schema](https://pris.ly/d/prisma-schema)
2.  Prisma Schema Builder. (n.d.). Schemas. [https://www.prismabuilder.io/schemas](https://www.prismabuilder.io/schemas)
3.  Prisma Schema Builder. (n.d.). Prisma schema builder. [https://www.prismabuilder.io/](https://www.prismabuilder.io/)
4.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d](https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d)
5.  Prisma. (n.d.). Relational data modeling in Prisma ORM. Prisma Documentation. [https://www.prisma.io/docs/orm/data-modeling/relational-databases](https://www.prisma.io/docs/orm/data-modeling/relational-databases)
6.  Prisma. (n.d.). Relations and joins in Prisma ORM. Prisma Documentation. [https://www.prisma.io/docs/orm/fundamentals/relations-and-joins](https://www.prisma.io/docs/orm/fundamentals/relations-and-joins)

**prisma/seed.ts**

1.  Prisma. (n.d.). Seeding (Prisma ORM v7). Prisma Documentation. [https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/seeding](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/seeding)
2.  Anthropic. (2026). Claude [Large language model]. [https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d](https://claude.ai/share/b2c8d32a-bef3-4292-92c7-eb976901ee3d)
3.  Better Auth. (n.d.). Email & password: API method request password reset. [https://better-auth.com/docs/authentication/email-password#api-method-request-password-reset](https://better-auth.com/docs/authentication/email-password#api-method-request-password-reset)

**Other references**
Test app (deleted) creation prompts:
{
Anthropic. (2026). _Full-stack application infrastructure setup_ [Generative AI chat]. Claude. [https://claude.ai/share/b98af9e5-3942-4375-988f-6763c12a7976](https://claude.ai/share/b98af9e5-3942-4375-988f-6763c12a7976)

Anthropic. (2026). _Project setup guide_ [Generative AI artifact]. Claude. [https://claude.ai/artifact/7LE1McfJRaAcGNt7mJGCZN](https://claude.ai/artifact/7LE1McfJRaAcGNt7mJGCZN)

Anthropic. (2026). _Step-by-step guide with explanations_ [Generative AI artifact]. Claude. [https://claude.ai/artifact/V2iFntBQ1TCrfrBGuSppaf](https://claude.ai/artifact/V2iFntBQ1TCrfrBGuSppaf)
}

Reference formatting
Anthropic. (2026). *Reference cleanup and APA formatting* [Generative AI chat]. Claude Code. https://claude.ai/artifact/AxUuKiPVPXxidB9Zb5ERXd

## AI Acknowledgement

I have used the following Generative Artificial Intelligence (GenAI) tools/services in the preparation of this assessment:


• GenAI service name and version: Claude Code
• Link to the GenAI service: https://claude.ai/code
• Ways this GenAI service was used: creating a draft application, turning our urls referenced in comments throughout the code into APA 7 references. 


• GenAI service name and version: Claude
• Link to the GenAI service: https://claude.ai/new
• Ways this GenAI service was used: help with creating code, project setup, planning and decision making, helping to generate prompts, providing references for further reasearch

• GenAI service name and version: ElevenLabs
• Link to the GenAI service: https://elevenlabs.io/
• Ways this GenAI service was used: generating transcript for demo video using text to speach tool

I confirm that I have not used the Generative Artificial Intelligence service in development of this work for assessment other than what I have declared and acknowledged above and I have cited and referenced any GenAI content in my assessment submission, applying the relevant referencing style. I understand that providing false or misleading information in this declaration and acknowledgement
may constitute a breach of the University of Canberra (Student Conduct) Rules 2023.
