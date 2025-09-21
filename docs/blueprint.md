# **App Name**: MantraMind

## Core Features:

- User Authentication: Login/Signup page with Google and Email/Password authentication using Firebase.
- Initial User Data Collection: Collect specific user data (admin details, etc.) upon first login to personalize app experience.
- K-10 Psychological Test: Administer the K-10 psychological test to understand user's character mentality. AI analyzes results and stores it privately in Firestore.
- Wellness AI Assistant: An AI chatbot that greets the user, assesses their well-being based on a series of questions, analyzes the responses, explains the possible reasons for negative feelings, and suggests solutions, redirecting users to relevant features within the app. The assistant uses a tool to decide whether and how to incorporate user data when it replies.
- Relaxation and entertainment resources: Relaxation resources: A feature to play calming music based on scientific principles and/or provide a timer to support meditation practices.Entertainment resources: Provide access to comedic videos and motivational podcasts via the YouTube API, to support emotional well-being.
- Talk to Loved Ones (AI): Allows users to communicate with an AI-simulated version of their loved ones (chat and voice) to combat loneliness. Relies on user-provided descriptions of their loved ones' characteristics.
- Appointment Booking: Allows users to book confidential wellness appointments using the Google Calendar API.
- Admin Notification: If the Wellness AI Assistant detects an unusual situation, it notifies the admin via Cloud Functions.
- Profile logo with logout option: Enable users to view their profile information and securely log out of the application.
- Runtime <5 seconds: Optimize Firebase calls + lazy loading
- Secure with Firebase App Check: Secure with Firebase App Check

## Style Guidelines:

- Primary color: Soft lavender (#E6E6FA) for a calming and peaceful atmosphere.
- Background color: Very light gray (#F5F5F5), a desaturated shade of lavender, for a clean and unobtrusive background.
- Accent color: Pale green (#D0F0C0), an analogous hue to lavender, to highlight key actions and elements while maintaining a soothing feel.
- Body and headline font: 'PT Sans' a humanist sans-serif font known for its modern look and readability, for headlines and body text.
- Use minimalist, line-based icons to represent different features and actions, ensuring clarity and a user-friendly interface.
- Employ a clean, uncluttered layout with ample whitespace to promote relaxation and reduce visual stress.
- Use subtle animations and transitions to provide visual feedback and enhance the user experience without being distracting.