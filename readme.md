# URL Shortener API

A **URL shortening service** with user authentication, password reset, and API documentation.

## Features

- User **signup** and **login** with JWT
- **Forget Password** & **Reset Password** via email
- **Create short URLs** and retrieve original URLs
- **Get all URLs** of a user
- **Delete URLs**
- Fully documented with **Swagger**

## Tech Stack

- **Node.js** / **Express**
- **PostgreSQL**
- **JWT** for authentication
- **bcrypt** for password hashing
- **crypto** for generating short codes & reset tokens
- **Swagger** for API docs
- **Nodemailer** 

## Installation

```bash
git clone https://github.com/MohammedMashal/url-shortener.git
cd url-shortener
npm install
```

## Create a .env file:

```bash
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
NODE_ENV=development
```
