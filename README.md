# ShiftSwap - Backend 🚀

![ShiftSwap Logo](https://github.com/Saurabh1590/shift-swap-backend/blob/main/assets/ShiftSwapLogo.png?raw=true)

This repository contains the backend server for the ShiftSwap application, a modern employee shift management system. It's built with Node.js, Express, and MongoDB and features a robust REST API to handle all application logic.

---

## ✨ Key Features

- **Secure JWT Authentication:** Role-based access control for `employee` and `admin` users.
- **Automated Schedule Generation:** Automatically creates a cyclical, 90-day rolling shift schedule for new employees with a unique weekly off-day.
- **Smart Swap & Leave Logic:** Enforces business rules, such as an 8-hour time limit for trades, and intelligently handles both "shift trades" and "shift covers".
- **Admin Management:** Secure endpoints for administrators to manage requests and view all users.
- **Email Notifications:** Integrates with Nodemailer to send real-time updates to users about their request statuses.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Real-time:** Nodemailer (for email notifications)
- **Environment:** dotenv

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- MongoDB (local or cloud instance like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/shift-swap-backend.git](https://github.com/your-username/shift-swap-backend.git)
    cd shift-swap-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:

    ```env
    PORT=5000
    DATABASE_URL=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key

    # For Email Notifications
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-16-character-app-password
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:5000`.

---

## API Endpoints

A brief overview of the main API routes:

- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Log in a user and receive a JWT cookie.
- `GET /api/shifts/my`: Get the logged-in user's shift schedule.
- `POST /api/leave`: Create a new leave request.
- `POST /api/swap`: Propose a new shift swap.
- `POST /api/swap/:id/accept`: Accept an open swap request.

**Admin Only:**

- `GET /api/admin/summary`: Get dashboard statistics.
- `GET /api/admin/users`: Get a list of all users.
- `PUT /api/leave/:id/:status`: Approve or reject a leave request.
- `PUT /api/swap/:id/status`: Approve or reject a swap request.
