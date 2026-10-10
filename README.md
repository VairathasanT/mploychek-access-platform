# MPloyChek – Access & Verification Platform

MPloyChek is a full-stack web application built for a software-intern assignment. It allows users to log in with a User ID, password, and role, view verification records relevant to their access level, and manage registered users if they are an administrator. The project demonstrates full-stack development, authentication, role-based access control, MongoDB integration, and API communication.

## 1. Project Overview

This project is a simple access-control application for employee verification data. It has two user roles:

- General User
- Admin

The frontend is built with Angular and the backend is built with Node.js and Express. The backend stores users and records in MongoDB, uses JWT for authenticated requests, and restricts access based on the user's role.

## 2. Technologies Used

| Technology | Purpose in this project |
| --- | --- |
| Angular | Frontend single-page application for login, dashboard, and admin screens. |
| TypeScript | Used in both frontend and backend code for cleaner and safer development. |
| HTML and CSS | Build the user interface and styling for the app. |
| Node.js | Runs the backend server and API. |
| Express.js | Handles API routes, middleware, and request processing. |
| MongoDB | Stores user and verification record data. |
| Mongoose | Connects Node.js to MongoDB with schemas and models. |
| JWT authentication | Creates and verifies tokens for authenticated API access. |
| bcryptjs | Hashes passwords before storing them in the database. |
| RxJS and Angular HttpClient | Handle asynchronous HTTP requests in the frontend. |
| CORS | Allows the Angular frontend to communicate with the backend API. |
| dotenv | Loads environment variables from the backend `.env` file. |
| Git and GitHub | Used for version control and repository management. |

## 3. Key Features

- Login using User ID, password, and selected role.
- Separate access for Admin and General User accounts.
- Dashboard that displays verification records allowed for the logged-in user.
- Admin user management: create, edit, and delete users.
- Admin-only records that are hidden from General Users.
- JWT-based authentication for protected API routes.
- Password hashing with bcryptjs.
- Simulated API delay and loading indicators in the dashboard.

## 4. Project Structure

```text
mploychek-access-platform/
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── seed.ts
│   │   ├── record.seed.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── node_modules/
├── frontend/
│   ├── .gitignore
│   ├── angular.json
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   └── node_modules/
├── README.md
└── ...
```

### Main folders

- `backend/`: Node.js + Express API, MongoDB models, routes, services, and seed scripts.
- `frontend/`: Angular app with login page, dashboard, and admin user-management screens.

## 5. How to Run the Project

Assume Node.js, npm, VS Code, and Angular CLI are already installed.

### STEP 1 — Open the project

Open the project folder in VS Code.

### STEP 2 — Configure the backend environment

Create a `.env` file inside the `backend` folder if it does not already exist.

Use the environment variables required by the backend:

```env
PORT=5000
MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
JWT_SECRET=<YOUR_LONG_RANDOM_SECRET>
```

- `PORT` is the backend port.
- `MONGODB_URI` is your MongoDB connection string.
- `JWT_SECRET` is used to sign JWT tokens.

Do not upload `.env` files to GitHub. Keep your MongoDB credentials and JWT secret private.

### STEP 3 — Start the backend

Open a terminal in the `backend` folder and run:

```bash
cd backend
npm run dev
```

This starts the backend API in development mode.

### STEP 4 — Start the frontend

Open a second, separate VS Code terminal and run:

```bash
cd frontend
npm start
```

The frontend runs separately from the backend and both terminals must stay open while working locally.

### STEP 5 — Open the website

Open the browser at:

```text
http://localhost:4200
```

The backend health endpoint is:

```text
http://localhost:5000/api/health
```

### STEP 6 — Database setup

The backend includes demo seed scripts.

Run the demo user seed once:

```bash
cd backend
npm run seed
```

Run the demo record seed to insert example verification records:

```bash
cd backend
npm run seed:records
```

Important:

- `npm run seed` creates the initial demo users.
- `npm run seed:records` deletes existing records before inserting the demo records.
- These scripts should usually be run once for local testing.

### Run both terminals together

| Terminal | Purpose | Command |
| --- | --- | --- |
| Terminal 1 | Backend | `cd backend && npm run dev` |
| Terminal 2 | Frontend | `cd frontend && npm start` |

## 6. Demo Login

The backend seed script creates these demo accounts:

| Role | User ID | Password |
| --- | --- | --- |
| Admin | `ADM001` | `Admin@12345` |
| General User | `USR001` | `User@12345` |

These are local testing credentials only and should not be used in production.

## 7. How It Works

1. User opens the Angular login page.
2. User enters User ID, password, and role.
3. Angular sends the login request to the backend.
4. The backend checks the user and validates the password.
5. If valid, the backend creates a JWT token and returns it.
6. The frontend stores the token and user info.
7. The user opens the dashboard.
8. The dashboard calls the record API with the JWT token.
9. MongoDB returns only the records allowed for that role.
10. Angular shows the records in the dashboard.

### Admin vs General User

- General User: can log in and view records marked as `ALL` only.
- Admin: can view all records, including admin-only ones, and manage users.

## 8. API Overview

| Method | Endpoint | Purpose | Required role |
| --- | --- | --- | --- |
| GET | `/api/health` | Backend health check | None |
| POST | `/api/auth/login` | User login | None |
| GET | `/api/records` | Get accessible records | Any authenticated user |
| GET | `/api/records/:recordId` | Get one record if allowed | Any authenticated user |
| POST | `/api/records` | Create a record | Admin |
| GET | `/api/users` | List users | Admin |
| POST | `/api/users` | Create a user | Admin |
| PUT | `/api/users/:id` | Edit a user | Admin |
| DELETE | `/api/users/:id` | Delete a user | Admin |

Protected API routes require a JWT token in the header:

```http
Authorization: Bearer <token>
```

## 9. Troubleshooting

- MongoDB connection failure: check the `MONGODB_URI` and database access.
- Port already in use: stop the app using the port or change the backend port in `.env`.
- Frontend cannot reach backend: confirm the backend is running and the frontend points to `http://localhost:5000/api`.
- Invalid login: verify User ID, password, and selected role.
- No records displayed: seed demo records and check the logged-in user role.

## 10. Security

- Do not upload `.env` files to GitHub.
- Passwords are stored as bcrypt hashes, not plain text.
- JWT protects authenticated API requests.
- Role checks restrict admin-only routes.
- Demo credentials are for local testing only.

## 11. Assignment Summary

This project demonstrates full-stack web development with Angular, Express, MongoDB, role-based access control, authentication, API communication, and asynchronous processing. It is a clear example of how a real application separates frontend, backend, database logic, and security rules.

---

This README was prepared based on the actual project files and package scripts in the repository.
