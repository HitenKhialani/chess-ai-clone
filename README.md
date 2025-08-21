# Chess AI Clone

A comprehensive chess application with AI analysis, puzzles, and learning features.

## Features

- Chess game analysis with Stockfish engine
- Interactive puzzles and tactics training
- Grandmaster game database
- User authentication and progress tracking
- PGN import and analysis
- Learning courses and lessons

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Databases**: MongoDB (user data), SQLite (puzzles and games)
- **Chess Engine**: Stockfish
- **Authentication**: JWT

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chess-ai-clone-main
```

2. Install dependencies (this will automatically set up the database):
```bash
npm install
cd backend && npm install
cd ..
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start both frontend and backend
npm run dev-full

# Or start them separately:
npm run dev          # Frontend (port 3000)
npm run backend      # Backend (port 5000)
```

**Note**: The database file (`backend/chess.db`) is not included in the repository and will be created automatically when you run `npm install`. This ensures each developer has their own local database with all puzzles pre-loaded.

## Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file and create both services

### Option 2: Manual Setup

#### Backend Service

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Environment**: Node

4. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string

#### Frontend Service

1. Create another **Web Service** on Render
2. Connect the same GitHub repository
3. Configure the service:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Add environment variables:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend service URL (e.g., `https://your-backend.onrender.com`)

### Environment Variables

#### Backend Required Variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Set to `production`

#### Frontend Required Variables:
- `NEXT_PUBLIC_BACKEND_URL`: URL of your backend service
- `NODE_ENV`: Set to `production`

### Database Setup

The application uses two databases:

1. **MongoDB**: For user data, authentication, and game analysis
2. **SQLite**: For puzzles and PGN storage (automatically created)

Make sure your MongoDB database is accessible from Render's servers.

### Health Checks

- Backend health check: `/health`
- Frontend health check: `/`

## Project Structure

```
chess-ai-clone-main/
├── app/                    # Next.js app directory
├── backend/               # Express.js backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── scripts/          # Database scripts
│   └── server.js         # Main server file
├── components/           # React components
├── lib/                  # Utility libraries
├── public/              # Static assets
└── render.yaml          # Render deployment config
```

## API Endpoints

- `POST /api/analysis/analyze` - Analyze chess position
- `GET /api/analysis/history` - Get analysis history
- `POST /api/pgns` - Upload PGN file
- `GET /api/pgns` - Get all PGNs
- `GET /api/puzzles` - Get puzzles
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

## Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version (requires 18+)
2. **Database connection errors**: Verify MongoDB URI and network access
3. **CORS errors**: Ensure frontend URL is in backend CORS configuration
4. **SQLite errors**: Database file should be created automatically

### Logs

Check Render logs for detailed error information:
- Backend logs: Render dashboard → Backend service → Logs
- Frontend logs: Render dashboard → Frontend service → Logs

## Support

For deployment issues, check:
1. Render documentation: https://render.com/docs
2. Next.js deployment guide: https://nextjs.org/docs/deployment
3. Express.js deployment: https://expressjs.com/en/advanced/best-practices-production.html
