# MzansiFix

MzansiFix is a community-driven platform designed to empower South African citizens to report and track local infrastructure issues. It acts as a centralized hub for citizens to bring attention to problems like potholes, faulty streetlights, illegal dumping, and more, making it easier for municipalities to be aware of and address these issues.

## Core Features:

*   **Issue Reporting:** Users can easily report new issues, providing details and location information.
*   **Issue Tracking:** Reported issues are tracked, allowing users to see the status and progress of resolution.
*   **Issue Categories:** Issues are categorized for better organization and analysis.
*   **User Authentication:** Secure user authentication allows for personalized experiences and issue ownership.
*   **Admin Dashboard:** A dedicated dashboard for administrators to manage reported issues.

## How it Works:

Users report issues through the MzansiFix web application. The reported data, including details and location, is stored securely. The platform allows for tracking the status of reported issues as they are addressed. An AI component assists in categorizing issues.

## Tech Stack:

*   **Frontend:** The application is built using Next.js with TypeScript.
*   **Backend:**
    *   **Data Storage:** Firebase is used for storing application data, including user information and reported issues.
    *   **AI Integration:** Genkit is utilized for AI-powered features, specifically for suggesting issue categories based on reported descriptions. The backend also includes Node.js components for handling various application logic and interacting with Firebase and Genkit.

To get started, explore the project files, starting with the frontend in `/src/app/page.tsx`.

