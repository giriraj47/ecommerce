# 🛒 E-Commerce Platform

A modern, full-stack E-Commerce application built with **React** (Vite + Material-UI) on the frontend and **Node.js** (Express + MongoDB) on the backend. This project features user authentication (local & Google OAuth), image upload using Cloudinary, payment gateway integration using Razorpay, caching and token blacklisting using Redis, and a complete order management workflow.

---

## 🚀 Features

### 🔐 Authentication & Security

- **Local Auth**: User registration and login with passwords hashed using `bcrypt` and session management.
- **Google OAuth 2.0**: Single sign-on authentication via Google.
- **JWT & Sessions**: Secure endpoints using custom JWT verifications and HTTP-only cookies.
- **Token Blacklisting**: Revoking logged-out tokens using high-performance **Redis** storage.

### 📦 Product Management

- **Catalog**: Browse, search, filter, and view detailed product listings.
- **Admin Controls**: CRUD operations on products including support for multi-image uploads.
- **Image Hosting**: Integrated with **Cloudinary** for scalable media storage.

### 🛒 Cart & Checkout

- **Shopping Cart**: Real-time persistent cart management per user.
- **Payment Gateway**: Secured checkout powered by **Razorpay API** with order validation and verification.
- **Mailing System**: Order confirmations and registration emails dispatched via **Nodemailer**.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React 19](https://react.dev/) (Vite-powered environment)
- **UI Library**: [Material-UI (MUI)](https://mui.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Styles**: [Sass (SCSS)](https://sass-lang.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Caching & Sessions**: [Redis](https://redis.io/)
- **OAuth & Auth**: [Passport.js](http://www.passportjs.org/)
- **Payments**: [Razorpay SDK](https://razorpay.com/docs/payments/server-integration/nodejs/)
- **Storage**: [Cloudinary](https://cloudinary.com/) & [Multer](https://github.com/expressjs/multer)
- **Emails**: [Nodemailer](https://nodemailer.com/)

---

## 📁 Repository Structure

```text
ecom/
├── Backend/               # Express REST API
│   ├── src/
│   │   ├── config/        # Passport, DB, Redis, and Razorpay configs
│   │   ├── controllers/   # Route handlers (auth, cart, orders, products, etc.)
│   │   ├── middleware/    # Auth, upload, and error middlewares
│   │   ├── models/        # Mongoose schemas (User, Product, Order, Cart, Blacklist)
│   │   ├── routes/        # Router endpoint mappings
│   │   └── services/      # Business logic (email, token, verification)
│   ├── server.js          # App bootstrap / startup entrypoint
│   └── package.json
│
└── Frontend/              # React single page app
    ├── src/
    │   ├── components/    # Reusable shared UI elements
    │   ├── features/      # Feature-based folder structures (auth, products, cart, orders)
    │   ├── App.jsx        # Main component
    │   ├── app.routes.jsx # React Router configuration
    │   └── styles.scss    # Custom global styles
    ├── index.html
    └── package.json
```

---

## 🔧 Installation & Configuration

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16.x or later)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cloud cluster)
- [Redis](https://redis.io/) (Local instance or Cloud database)

---

### 1. Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `Backend/` directory and configure the environment variables:

   ```env
   # Database & Server
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
   SESSION_SECRET=your_express_session_secret

   # Authentication & JWT
   JWT_SECRET=your_jwt_secret

   # Google OAuth 2.0
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Redis
   REDIS_URL=redis://<username>:<password>@<host>:<port>

   # Cloudinary (Image Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay (Payments)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret

   # Email Service (Nodemailer)
   EMAIL_USER=your_email@gmail.com
   REFRESH_TOKEN=your_oauth_refresh_token
   ```

4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend API will run on **`http://localhost:3000`**.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Configure custom environment variables if needed by creating a `.env` file:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The web application will launch at **`http://localhost:5173`** (or next available port).

---

## 🔗 Main API Endpoints

| Endpoint                    | Method | Description                                 | Auth Required |
| :-------------------------- | :----- | :------------------------------------------ | :------------ |
| **`/api/auth/register`**    | `POST` | Register a new user                         | No            |
| **`/api/auth/login`**       | `POST` | Authenticate user & issue token             | No            |
| **`/api/auth/google`**      | `GET`  | Initiate Google OAuth flow                  | No            |
| **`/api/auth/logout`**      | `POST` | Invalidate token and destroy session        | Yes           |
| **`/api/products`**         | `GET`  | List all products (with pagination/filters) | No            |
| **`/api/products/:id`**     | `GET`  | View a single product's details             | No            |
| **`/api/products`**         | `POST` | Create a new product (Multipart Upload)     | Yes (Admin)   |
| **`/api/cart`**             | `GET`  | Fetch items in user's cart                  | Yes           |
| **`/api/cart`**             | `POST` | Add/Update items in cart                    | Yes           |
| **`/api/orders`**           | `POST` | Place a new order                           | Yes           |
| **`/api/payment/checkout`** | `POST` | Create a Razorpay Order ID                  | Yes           |
| **`/api/payment/verify`**   | `POST` | Verify Razorpay payment signature           | Yes           |
