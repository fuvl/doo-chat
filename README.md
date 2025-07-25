# Doodle Chat

A real-time messaging application built with React, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doodle-message
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_BASE_URL=<your-api-base-url>
   VITE_AUTH_TOKEN=<your-auth-token>
   ```

   Example:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   VITE_AUTH_TOKEN=super-secret-doodle-token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Running Production Build

To test the production build locally:

```bash
# Build and preview in one command
npm start

# Or separately:
npm run build    # Creates optimized production build in dist/
npm run preview  # Serves the production build locally
```

The production preview will be available at `http://localhost:4173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm start` - Build and preview production version
- `npm run lint` - Run ESLint

## Features

- Real-time messaging with automatic polling
- Infinite scroll for message history
- Responsive design for mobile and desktop
- Accessibility features (ARIA labels, keyboard navigation)
- Message timestamps with proper formatting
- HTML entity decoding for special characters

## Usage

1. Open the application in your browser
2. Enter your username on the login screen
3. Start chatting! Messages are synced in real-time
4. Scroll to the top to load older messages
5. Press Enter to send messages, Shift+Enter for new lines

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vite
- ESLint