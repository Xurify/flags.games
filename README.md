# flags.games - Flag Guessing Game

A country flag guessing game built with Next.js, TypeScript, and WebSocket technology.

## Features

- **Singleplayer Mode**: Practice flag recognition with different difficulty levels
- **Multiplayer Mode**: Real-time competitive flag guessing with friends

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Multiplayer Setup

The multiplayer functionality requires a WebSocket server. The server repository can be found at: [flags.games_server](https://github.com/Xurify/flags.games_server)

To run the server:

```bash
cd flags.games_server
bun install
bun run dev
```

The server will run on `http://localhost:3001` by default.

## How to Play

### Single Player
1. Select your difficulty level
2. Guess the country name for each flag
3. Try to get the highest score!

### Multiplayer
1. Click "Multiplayer" on the home page
2. Create a room or join with an invite code
3. Wait for the host to start the game
4. Answer questions in real-time with other players
5. Compete for the highest score on the leaderboard

## Game Modes

- **Classic**: Standard flag guessing with multiple choice
- **Speed**: Quick-fire questions with shorter timers
- **Elimination**: Players are eliminated after incorrect answers

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Real-time**: WebSocket
- **State Management**: React Context
- **Package Manager**: pnpm

## Project Structure

```
flags.games/
├── app/                    # Next.js app directory
│   ├── flags/             # Single player game
│   ├── lobby/             # Multiplayer lobby
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── multiplayer/       # Multiplayer-specific components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── context/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
└── public/               # Static assets
    └── images/
        └── flags/        # Flag SVG files
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
