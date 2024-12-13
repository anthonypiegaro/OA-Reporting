# OA Reporting

![Made with React](https://img.shields.io/badge/made%20with-react-61DAFB?logo=react)
![Made with TypeScript](https://img.shields.io/badge/made%20with-typescript-007ACC?logo=typescript)
![Made with Next.js](https://img.shields.io/badge/made%20with-next.js-000000?logo=next.js)
![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-vercel-000000?logo=vercel)
![Using Drizzle ORM](https://img.shields.io/badge/using-drizzle-3A86FF?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSAwTDkuMzcgMTEuNDE0SDQuNjM2TDAgMTUiIGZpbGw9IiMzQTg2RkYiLz48L3N2Zz4=)
![Using Clerk](https://img.shields.io/badge/auth-clerk-512bd4?logo=clerk)

OA Reporting is an athlete report and management tool designed to give athletic trainers the ability to manage their athletes and automate evaluation reports.

## Features

- **User Creation**: Easily create users in the Users Dashboard. Add details such as their playing level and  email. Assign roles in the dashboard to provide role based authorization.
- **Custom Assessments**: Create, update and delete your own custom assessments in the Assessments dashboard. The asseessment types were abstracted to allow you to cover a large portion of use cases.
- **Custom Evaluations**: Create, update and delete your own custom evaluations. Evaluations are a collection of assessments that tests an athletes current ability.
- **Custom Templates**: Create custom templates to speed up the evaluation process. Add assessments to your template in any order you like, then use the template when ever wanting to create a common evaluation.
- **Evaluation Reports**: Once an evaluation is finished, it automatically creates an Evaluation Report for that athlete. This report gives the athlete a score and actionable insights into their performance, configured by the trainer.
- **Analytics**: All features are occompanied by analytics so the trainer and athlete can make data driven descisions with their training.

## Installation
To install the project, follow these steps:
1. **Clone the Repository**
   
First, clone the project from the GitHub repository:
```
git clone https://github.com/anthonypiegaro/oa-reporting
```

2. **Navigate to the Project Directory**
   
Move into the project folder:
```
cd oa-reporting
```

3. **Install Dependencies**
   
```
npm i --legacy-peer-deps
```

4. **Add Environment Variables**

This project relies on some 3rd party services. It uses [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) for the database, [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) as an object storage service and [Clerk](https://clerk.com/) as an auth service. You will need to sign up for these services or use your own solutions. If you do decide to use these services, add your api keys to your local environment. Each service has documentation on how to set these up.

6. **Run the app**

At this point, you can now run the app locally by running:
```
npm run dev
```
