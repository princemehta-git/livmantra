# LivMantra - BBA Test Platform

A full-stack TypeScript application for administering the BBA (Body Type + Prakriti + Vikriti) test with a gamified, responsive UI.

## Tech Stack

- **Client**: Next.js 14, React 18, TypeScript, Material-UI, Framer Motion
- **Server**: Node.js, Express, TypeScript
- **Database**: MySQL with Prisma ORM
- **AI**: OpenAI API (optional, for future chat features)

## Project Structure

```
livmantra/
├── client/          # Next.js frontend
├── server/          # Express backend
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MySQL database (local or remote)
- (Optional) OpenAI API key for chat features

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database credentials:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/livmantra"
   PORT=4000
   OPENAI_API_KEY=your-openai-key-here
   ```

5. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

6. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:4000`

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` if your API URL differs:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The client will run on `http://localhost:3000`

## Features

### BBA Test Flow

- **36 Questions** organized in 3 sections:
  - Questions 1-6: Somatotype (Body Type)
  - Questions 7-18: Prakriti (Constitution)
  - Questions 19-36: Vikriti (Imbalance)

- **Scoring Logic**:
  - Body Type: Determined by highest count in somatotype section
  - Prakriti: Determined by highest count in prakriti section
  - Vikriti: Complex logic based on counts (>=8 indicates imbalance, dual imbalances, modifiers)

- **Result Snapshot**: Includes bodyType, prakriti, vikriti, shortEmotionalLine, and score

### User Experience

- **Guest Authentication**: Modal to collect name, email, phone before starting test
- **Progress Tracking**: LocalStorage saves progress after each question
- **Gamified UI**: XP system, level indicators, progress bars
- **Animated Results**: 3-step reveal animation for test results
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

### Authentication
- `POST /api/auth/guest` - Create or update guest user

### Test
- `POST /api/test/submit` - Submit test answers and get result
- `GET /api/test/result/:id` - Retrieve saved test result

### Chat (Future)
- `POST /api/chat` - OpenAI-powered chat assistant

## Database Schema

### User
- `id` (String, CUID)
- `name` (String)
- `email` (String, unique)
- `phone` (String)
- `createdAt`, `updatedAt` (DateTime)

### TestResponse
- `id` (String, CUID)
- `userId` (String, foreign key)
- `type` (String)
- `answers` (JSON)
- `score` (Float, optional)
- `snapshot` (JSON)
- `status` (String, default: "submitted")
- `reportUrl` (String, optional)
- `createdAt` (DateTime)

## Development Commands

### Server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### Client
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Run production build

## Production Deployment

1. Build both client and server:
   ```bash
   # Server
   cd server
   npm run build

   # Client
   cd ../client
   npm run build
   ```

2. Set production environment variables

3. Run migrations on production database

4. Start servers:
   ```bash
   # Server
   cd server
   npm start

   # Client
   cd client
   npm start
   ```

## Notes

- The scoring service is versioned to allow rule updates without breaking older results
- OpenAI integration is optional - the chat endpoint will return a stub response if no API key is configured
- Test progress is saved to localStorage and persists across page refreshes
- User information is stored in localStorage and sent with test submission

## Future Enhancements

- PDF report generation
- Paid report tiers with OpenAI-generated insights
- User accounts and test history
- Email notifications
- Admin dashboard


