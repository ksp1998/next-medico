# Next Medico

**Next Medico** is a web application designed to streamline the administrative processes of a medical store. The project is built using **Next.js**, **React's**, **TypeScript**, and **MongoDB**. It encompasses features such as customer management, supplier management, sales and purchase tracking, medicine stock management, as well as invoice generation and management.

### Live URL: https://next-medico.vercel.app

## Demo User Account
I have created a demo user account to facilitate exploration of the system. The demo user account has specific limitations and capabilities:

* Create, Update, and Delete Actions: Disabled
* Data Retrieval: The demo user can request data from the database.
* Profile Update and Password Change: Not allowed for demo users.

## Installation Guide

*  Clone the repository to your local machine using the following command: ```git clone REPO_URL```
*  Install the project dependencies by running either of the following commands: ```npm i``` or ```npm insatll```
*  Create a `.env` file locally and add the necessary fields as outlined below:

```
NODE_ENV='development'
SITE_URL=YOUR_LIVE_SITE_URL // Optional: Add only if you are hosting it
MONGODB_URL=YOUR_MONGODB_DATABASE_CLUSTER_URL

NEXTAUTH_URL=YOUR_LIVE_SITE_URL // Either localhost:YOUR_PORT or live site url
NEXTAUTH_SECRET=NEXT_AUTH_SECRET_KEY
```
[Next Auth Environment Variables](https://next-auth.js.org/configuration/options#environment-variables)