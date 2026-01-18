# CollabHub

CollabHub is a dynamic platform designed to bridge the gap between companies and talented developers/designers. It facilitates project-based collaborations, allowing companies to post projects and find the right talent, while developers can browse opportunities and apply for projects that match their skills.

The platform features separate dashboards for companies and developers, a real-time project feed, an AI-powered proposal generator, and a complete authentication and application management system.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **Deployment:** Configured for [Netlify](https://www.netlify.com/)

## Key Features

- **Dual User Roles:** Separate registration and dashboards for 'Companies' and 'Developers'.
- **Project Posting:** Companies can post new projects with details like budget, deadline, and required tech stack.
- **Live Project Feed:** A real-time, "Available Projects" dashboard for developers, and a "Featured Projects" section on the homepage.
- **Application System:** Developers can apply for projects, submitting their details, resume, and a custom proposal.
- **AI Proposal Assistant:** An integrated Genkit flow helps developers craft compelling proposals.
- **Application Management:** Companies can review incoming applications and update their status (In Review, Shortlisted, Accepted, etc.) directly from their dashboard.
- **Secure Authentication:** Robust sign-up and login flow powered by Firebase Authentication, with role-based access control.
- **Real-time Updates:** Built with Firestore's real-time capabilities to ensure data is always in sync.

## Getting Started

To get the project running locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Firebase and Genkit API keys.

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
