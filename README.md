# Secret Message

Secret Message is a platform for asking and answering questions anonymously. It's built using modern web technologies to ensure a seamless and secure experience.

## Features

*   **Next.js:** Fast, server-rendered React application framework.
*   **Authentication:** Secure user authentication powered by NextAuth.js.
*   **Email Verification:** Send verification emails using Resend.
*   **Tailwind CSS:** Modern utility-first CSS framework for responsive styling.
*   **Shadcn:** Modern ui for the application.
*   **React Hook Form:** Manage form state and validation with ease.
*   **Zod:** Schema-based validation for forms and inputs.
*   **MongoDB:** NoSQL database for storing user data and questions.
*   **Gemini AI:** Generate intelligent and context-aware questions automatically.
*   **Hosting:** Hosted on Vercel for lightning-fast performance.

## Project Demo

Check out the live application here: [Secret Message](https://secretmessage-sigma-flame.vercel.app/)

## Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/yourusername/secretmessage.git](https://github.com/yourusername/secretmessage.git)
    cd secretmessage
    ```
2.  Install dependencies:

    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Create a `.env.local` file in the root of your project and add the following:

    ```bash
    # MongoDB connection
    MONGODB_URI=<your_mongodb_connection_string>

    # NextAuth configuration
    NEXTAUTH_SECRET=<your_nextauth_secret>
   
    # Resend API Key
    RESEND_API_KEY=<your_resend_api_key>

    # Gemini AI API Key
    GEMINI_API_KEY=<your_gemini_api_key>
    ```
4.  Start the development server:

    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

*   **Frontend:** Next.js, React, Tailwind CSS, Shadcn/ui
*   **Authentication:** NextAuth.js
*   **Email:** Resend
*   **Form Management:** React Hook Form, Zod
*   **Database:** MongoDB (via Mongoose)
*   **AI:** Gemini AI for question generation
*   **Hosting:** Vercel

