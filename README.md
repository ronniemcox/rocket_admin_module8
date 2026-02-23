# Rocket Elevators Admin — Module 7 (MERN)

This project is a Rocket Elevators Back Office Admin application built using the official MongoDB MERN tutorial as a foundation, then adapted to manage Rocket Elevators Agents and secured with a login system.

---

## Source Tutorial

MongoDB MERN Tutorial (official):  
https://www.mongodb.com/resources/languages/mern-stack-tutorial

---

## Tech Stack

- **Backend:** Node.js, Express (ES Modules), MongoDB Atlas, Mongoose
- **Frontend:** React (Vite), React Router
- **Database:** MongoDB Atlas

---

## Data Models

### Agent (MongoDB collection: `records`)

Fields:
- `first_name` (string)
- `last_name` (string)
- `email` (string)
- `region` (string; allowed values: `north`, `south`, `east`, `west`)
- `fee` (number)
- `rating` (number)
- `sales` (number)

Validation is enforced at the route level using middleware before controller logic executes.

---

### User (MongoDB collection: `users`)

Fields:
- `first_name` (string)
- `last_name` (string)
- `email` (string)
- `password` (string)

This schema is used for login authentication.

---

## How to Run the Project Locally

### Backend

```bash
cd mern/server
npm install
npm start
```

### Frontend

```bash
cd mern/client
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

# Documentation — React

### What is the difference between React, React JS, and React Native?

**React** (often called React JS) is a JavaScript library used to build web user interfaces.

**React JS** simply refers to React when it is used for building web applications in the browser.

**React Native** uses the same component-based model as React, but instead of rendering to the browser DOM, it renders to native mobile UI components for iOS and Android applications.

---

### Is React a framework or a library? What is the difference?

React is a **library** focused primarily on building user interfaces.

A **framework** typically provides a full, opinionated structure for building applications (routing, state management, build tooling, etc.). React focuses on the view layer and allows developers to choose additional tools like React Router and Vite separately.

---

### What are the differences between HTML and JSX?

**HTML** is a markup language interpreted directly by the browser.

**JSX** is a syntax extension for JavaScript that looks similar to HTML but is compiled into JavaScript (React elements).

Key differences:

- JSX allows embedding JavaScript expressions using `{ }`
- JSX uses `className` instead of `class`
- JSX must return a single parent element
- JSX is compiled before being rendered in the browser

---

### What makes React attractive for our case?

React is attractive for this admin application because:

- The UI updates automatically when application state changes
- Component-based architecture promotes reuse (forms, tables, pages)
- Faster rendering through a virtual DOM
- Ideal for dynamic dashboards and CRUD-based admin tools

---

# Documentation — MERN Stack

### What are a few alternate tech stacks?

Some alternate full-stack technology stacks include:

- **MEAN:** MongoDB, Express, Angular, Node
- **LAMP:** Linux, Apache, MySQL, PHP
- **Django + PostgreSQL + React**
- **Ruby on Rails + PostgreSQL**

---

### Why is MERN a good choice for full development?

MERN is a strong choice because:

- JavaScript is used across the entire stack (frontend and backend)
- Express simplifies REST API creation
- MongoDB allows flexible schema design
- React provides a modern, reactive frontend
- Development speed is increased by using one primary language

---

# MERN Templates Research

### MERN Boilerplate (djizco/mern-boilerplate)

Link:  
https://github.com/djizco/mern-boilerplate

This template includes authentication with Passport.js and Redux integration. It demonstrates a more production-ready structure with user management and API organization already configured.

---

### MERN Starter (moeezali2375/MERN-Starter)

Link:  
https://github.com/moeezali2375/MERN-Starter

This project uses Vite with React 18 and includes a complete authentication flow. The clean separation between client and server makes it a strong example of scalable MERN architecture.

---

# Authentication Flow

- Protected routes: `/`, `/create`, `/edit/:id`
- If not logged in → redirected to `/login`
- Successful login → redirected to `/`
- Failed login → redirected to `/unauthorized`
- Route protection is implemented using a `ProtectedRoute` wrapper component

---

# CRUD Functionality (Agents)

- Create Agent
- Read Agent list
- Update Agent
- Delete Agent

All CRUD operations are connected to MongoDB Atlas and persist data.

Validation is applied at the **route level middleware** before controller execution.

---

# Project Status

This project satisfies all core Module 7 grading requirements:

- Private GitHub repository
- Dev branch workflow
- MongoDB schemas for Agent and User
- Login route and authentication flow
- Protected admin routes
- Full CRUD functionality
- Research documentation included