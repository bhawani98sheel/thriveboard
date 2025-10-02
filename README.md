# ThriveBoard

A modern personal productivity dashboard application built with the MERN stack.

## Features

- User authentication
- Profile management
- Daily planner
- File management
- Dark/Light theme support

## Tech Stack

### Frontend
- React
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer (file uploads)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd thriveboard
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create `.env` file in the server directory:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
npm run dev
```

## Project Structure

```
thriveboard/
├── client/                # React Frontend
│   ├── public/           # Static files
│   └── src/
│       ├── assets/      # App assets
│       ├── components/  # Reusable components
│       ├── context/    # React context
│       ├── hooks/      # Custom hooks
│       ├── pages/      # Route components
│       ├── services/   # API services
│       └── styles/     # Global styles
│
├── server/              # Node/Express Backend
│   ├── controllers/    # Route controllers
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── config/        # Configuration
```

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Profile
- GET /api/profile - Get user profile
- PUT /api/profile - Update profile
- POST /api/profile/avatar - Upload avatar

### Planner
- GET /api/planner - Get all tasks
- POST /api/planner - Create task
- PUT /api/planner/:taskId - Update task
- DELETE /api/planner/:taskId - Delete task

### Files
- POST /api/files/upload - Upload file
- GET /api/files/user/:userId - Get user files
- DELETE /api/files/:fileId - Delete file

## License

MIT