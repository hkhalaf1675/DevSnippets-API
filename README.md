# 📘 DevSnippets API

# DevSnippets API

A RESTful API for managing and sharing code snippets with authentication and authorization features.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](running-the-project)
- [API Endpoints Overview](#API-endpoints-overview)
- [Authentication](#authentication)

## Features

- ✅ User authentication (register/login) with JWT
- 📝 CRUD operations for code snippets
- 🏷️ Tag system for organizing snippets
- 🔍 Search functionality
- 📄 Pagination
- ⏱️ Rate limiting
- ✔️ Input validation
- 🛑 Error handling

## Technologies

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Node-Input-Validator** - Input validation
- **Dotenv** - Environment variables
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hkhalaf1675/DevSnippets-API.git
cd DevSnippets-API

# Install dependencies
npm install
```
## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=7000
MONGODB_URI=mongodb://localhost:27017/dev_snippets
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
ALLOWED_ORIGINS=*
```

## 🧪 Running the Project

To start the DevSnippets API locally, follow these steps:

### 1. Install Dependencies

```bash
npm install
```
### 2. Run Project 
```bash
npm run start-dev
```

## 📚 API Endpoints Overview

### 🧑 User Routes

| Method | Endpoint              | Description                         | Auth Required |
|--------|-----------------------|-------------------------------------|---------------|
| POST   | `/auth/register` | Register a new user                 | ❌ No         |
| POST   | `/auth/login`    | Login and receive JWT token         | ❌ No         |
| GET    | `/users`          | Get all users (with filters, pagination) | ✅ Yes    |

### 📄 Snippet Routes

| Method | Endpoint              | Description                          | Auth Required |
|--------|-----------------------|--------------------------------------|---------------|
| POST   | `/snippets`       | Create a new code snippet            | ✅ Yes        |
| GET    | `/snippets`       | Get snippets (paginated, filtered)   | ✅ Yes        |
| GET    | `/snippets/:id`   | Get a snippet by its ID              | ✅ Yes        |
| PUT    | `/snippets/:id`   | Update a snippet by its ID           | ✅ Yes        |
| DELETE | `/snippets/:id`   | Delete a snippet by its ID           | ✅ Yes        |

> ✅ **Auth Required** means you must include a valid JWT token in the `Authorization` header as:  
> `Authorization: Bearer <your_token_here>`
