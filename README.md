# BookSwap Marketplace

A full-stack MERN application for exchanging used books between users.

## Project Structure

```
bookswap-marketplace/
├── client/          # React frontend
├── server/          # Express backend
└── .kiro/          # Kiro specs
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables:
   - MongoDB connection string
   - JWT secret
   - Cloudinary credentials

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` (optional)

4. Start the development server:
   ```
   npm start
   ```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)

## Tech Stack

### Frontend
- React 18
- Redux Toolkit
- React Router v6
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Multer (File Upload)

## Features

- User authentication (signup/login/logout)
- Book listing management (CRUD operations)
- Image upload to Cloudinary
- Book request system
- Request management (accept/decline)
- Protected routes and authorization

## Development

The frontend runs on `http://localhost:3000` and proxies API requests to the backend on `http://localhost:5000`.
