# Next Medico

**Next Medico** is a web application designed to streamline the administrative processes of a medical store. The project is built using **Next.js**, **React's**, **TypeScript**, and **MongoDB**. It encompasses features such as customer management, supplier management, sales and purchase tracking, medicine stock management, as well as invoice generation and management.

### Demo URL: https://next-medico.vercel.app

## Demo User Account
I have created a demo user account to facilitate exploration of the system. The demo user account has specific limitations and capabilities:

* Create, Update, and Delete Actions: Disabled
* Data Retrieval: The demo user can request data from the database.
* Profile Update and Password Change: Not allowed for demo users.

```
username: demo
password: Demo@123
```

## Installation Guide

*  Clone the repository to your local machine using the following command: ```git clone REPO_URL```
*  Install the project dependencies by running either of the following commands: ```npm i``` or ```npm install```
*  Copy the example environment file and fill in your values:
    ```bash
    cp .env.example .env.local
    ```
*  Update `.env.local` with your credentials:

    | Variable | Description |
    |---|---|
    | `NODE_ENV` | Set to `development` for local development |
    | `SITE_URL` | Your live site URL (optional, only needed for production) |
    | `MONGODB_URL` | Your MongoDB database cluster connection string |
    | `NEXTAUTH_URL` | `http://localhost:3000` for local or your live site URL |
    | `NEXTAUTH_SECRET` | A random secret key for NextAuth ([learn more](https://next-auth.js.org/configuration/options#environment-variables)) |