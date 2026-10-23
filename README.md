# HireNest

HireNest is a job portal I built with the MERN stack. Employers can post jobs and look through applicants, and job seekers can search for openings and apply with a short cover letter.

I made it mainly to practice building a full stack app from scratch: auth, roles, a real database and a frontend that talks to all of it.

## What you can do

**As a job seeker**
- Search jobs by title, company or skill, and filter by location and job type
- Apply with a cover letter (one application per job)
- Check the status of your applications from the dashboard

**As an employer**
- Post a job and delete it later
- See everyone who applied to a job
- Mark each applicant as pending, shortlisted or rejected

## Built with

React + Vite and React Router on the frontend, Node and Express on the backend, MongoDB with Mongoose for data. Login uses JWT, and passwords are hashed with bcrypt.

## Running it on your machine

You will need Node.js and MongoDB (local or Atlas).

```
git clone https://github.com/harshit-1407/HireNest.git
cd HireNest/server
npm install
```

Make a `.env` file inside `server` with this:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/HireNest
JWT_SECRET=anything_long_and_random
```

Start the backend:

```
npm run dev
```

Then open a second terminal for the frontend:

```
cd client
npm install
npm run dev
```

The app opens at http://localhost:5173. Create one employer account and one job seeker account to see both sides.

## Project layout

```
client/   React app (pages, components, auth context)
server/   Express API (routes, Mongoose models, auth middleware)
```

## Things I want to add

- Resume upload for applicants
- Editing a job after posting it
- Pagination on the jobs page
- Email notification when the status of an application changes