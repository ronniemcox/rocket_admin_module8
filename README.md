# Rocket Elevators Admin (Module 8)

Admin portal for Rocket Elevators built with the MERN stack (MongoDB, Express, React, Node).
Includes Agent Management, Transaction Management, and Session-based authentication.

---

## Research: Components, Props, State

### Components
A component is a reusable building block of a React user interface. Components return UI elements and can contain logic, data, and other components. Complex applications are built by composing many small components together.

### Props
Props (short for properties) are inputs passed from a parent component to a child component. Props allow components to be reused with different data. Props are read-only inside the component that receives them.

### State
State is data that belongs to a component and can change over time. When state changes, React automatically re-renders the component to reflect the updated data. State is commonly used for form inputs, API responses, and UI controls like modals.

---

## Features (Module Requirements)

### Home Page
- Grid layout of cards
- Agent Management card
- Transaction card

### Notifications
Global success and error notifications displayed in the navbar.

### Modal Confirmations
Confirmation modals exist for:
- Create agent
- Update agent
- Delete agent
- Submit transaction

### Agent Management
- Create agents
- Update agents
- Delete agents
- Agent list table
- Agent sales updated automatically through transactions

### Transaction Management
- Shows the last 10 transactions
- Sorted by newest first
- Displays:
  - transaction date
  - transaction amount
  - agent full name
- Transaction form:
  - amount must be positive
  - dropdown lists all agents by id and full name
- If an agent is deleted, previous transactions remain visible and display:
  "Agent no longer active"

### Sessions (Authentication)
- User logs in through `/login`
- A session token is created via `/session`
- Session stored in MongoDB with TTL expiration of 24 hours
- Token saved in browser cookie
- Token validated through `/validate_token`
- Invalid or missing token redirects to login
- Username displayed in navbar
- Logout removes the session

---

## Tech Stack

Frontend
- React
- React Router
- React Bootstrap
- Vite

Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose

---

## Setup and Run

### Start Server

Navigate to the server folder:

npm install  
npm start

Server runs on:

http://localhost:5050

---

### Start Client

Navigate to the client folder:

npm install  
npm run dev

Client runs on:

http://localhost:5173

---

## API Endpoints

Authentication
POST /login  
POST /logout  
POST /register

Sessions
POST /session  
GET /validate_token

Agents
GET /record  
POST /record  
PATCH /record/:id  
DELETE /record/:id

Transactions
GET /transaction-data  
POST /transaction

---

## Notes

Development workflow uses feature branches merged into `dev`, then merged into `main` for final delivery.