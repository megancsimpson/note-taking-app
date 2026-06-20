# Note-Taking App

## Project Description
This is a full-stack note-taking web application built with Node.js, Express, EJS, and MongoDB.

The app supports full CRUD operations for notes, uses Google OAuth authentication with Passport.js, and stores note data in MongoDB using Mongoose. It includes a rich text editor (Quill), search functionality, and a responsive interface for mobile, tablet, and desktop.

## Features
- Create, edit, and delete notes
- Rich text note editing with Quill
- Search notes by title prefix
- Google OAuth authentication with Passport.js
- MongoDB data persistence with Mongoose
- Responsive UI for mobile, tablet, and desktop

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS Templates
- Passport.js (Google OAuth 2.0)
- HTML, CSS, JavaScript
- Quill Editor

## Installation Instructions
Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/megancsimpson/note-taking-app.git 
cd <your-repo-name>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a .env file
Create a `.env` file in the project root and add the required variables.

Example:
```env
MONGO_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 4. Set up Google OAuth credentials
1. Open Google Cloud Console.
2. Create OAuth credentials (Web application).
3. Add an authorized redirect URI.

Use this redirect URI for local development:
```text
http://localhost:3000/auth/google/callback
```

Note: In this codebase, Passport currently uses `/auth/google/callback` directly in configuration. The `CALLBACK_URL` variable is included for documentation and future flexibility.

### 5. Run the application
```bash
npm start
```

The app runs on:
```text
http://localhost:3000
```

### 6. Optional: run tests
```bash
npm test
```

## Environment Variables
The following variables are required in `.env`:

- `MONGO_CONNECTION_STRING`
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CALLBACK_URL` (optional in current implementation, recommended for future config flexibility)

Example format:
```env
MONGO_CONNECTION_STRING=...
SESSION_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Project Structure
```text
note-taking-app/
├── config/
│   ├── database.js
│   ├── env.js
│   ├── methodOverride.js
│   ├── passport.js
│   └── session.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── crashController.js
│   ├── homeController.js
│   └── notesController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── logger.js
├── models/
│   └── Note.js
├── public/
│   └── styles/
│       └── styles.css
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── crash.js
│   ├── home.js
│   └── notes.js
├── test/
│   ├── about.test.js
│   ├── admin.test.js
│   ├── auth.test.js
│   ├── crash.test.js
│   ├── home.test.js
│   └── notes.test.js
├── views/
│   ├── auth/
│   ├── notes/
│   │   ├── create-note.ejs
│   │   ├── edit-note.ejs
│   │   └── notes.ejs
│   ├── pages/
│   │   ├── about.ejs
│   │   └── home.ejs
│   └── partials/
│       ├── footer.ejs
│       ├── header.ejs
│       └── ui-overrides.ejs
├── index.js
├── package.json
└── README.md
```

## Usage Instructions
### Authentication
1. Open the app in your browser.
2. Click Login and authenticate with Google.
3. After login, you can access notes routes.

### Create a note
1. Go to the Notes page.
2. Click Create.
3. Enter a title and note content in the editor.
4. Click Save.

### Edit or delete a note
1. From the Notes list, click the edit icon on a note.
2. Update the content and save, or click Delete.

### Search notes
1. Use the search input on the Notes page.
2. Enter a query to filter by note title prefix.

## Known Issues / Notes
- A Node deprecation warning may appear during auth tests from a dependency (`url.parse` warning).

## Future Improvements
- Add tags and category filtering
- Add folders/notebooks for organization
- Add dark mode theme support
- Add autosave and note history
- Add real-time sync/collaboration features

## Reflection on Development Process and Lessons Learned
- Building a full stack app from start to finish for the first time definitely had its challenges. I developed a much more indepth understanding of the MVC structure, and how different pages call eachother, are exported, and are related. I started a new project and used what we used in class to base it on, because I really needed to understand the setup, routes, controllers better and how to organize them. I was very intimidated at first but learned to really like the organization and structure it has, once I understood it more.
- I learned a lot about AI prompting, and token usage. I quickly had to let go of bad habits, as I was running out of tokens quickly and my AI was not understanding what I wanted done, specifically for the front end design aspect of this project. I was seeing the same issues not resolving, such as random text appearing, weirdly designed headers and containers, and overall bad design. I had to brush up on the AI prompting we learned in class and began to see a big change, and rather than fighting with AI (how it felt) I started to actually work with it.
- Github was a big peice of this for me. I had to get very familliar with how to create branches, switching branches, staging changes, pushing, pulling, etc. At first I was constantly looking up how to do this all, but after working with it for this project I feel a lot more confident in my abilities to use github.
- After incororating the Quill editor I encountered a lot of difficulties. I wanted to have it styled closer to apple notes, with options to bold, underline, italicize, create a checklist, etc. After creating this option, my notes preview was showing the raw HTML to the user. This was a frustrating moment, I could see it was raw HTML in the database, but I didn't want this to be visible on the user end. I needed to keep the raw HTML for editing and saving, but convert it to plain text for the viewer. After lots of troubleshooting and trying a few different ways I was able to properly keep HTML for the editing but generate plain-text previews on the server side.

## Author
**Megan Simpson**  
Software Development Student
