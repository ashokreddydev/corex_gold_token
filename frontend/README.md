# Frontend Setup Instructions

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
# Create .env.local file with local configuration
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Folder Structure

- `src/pages/` - Application pages (Dashboard, Mint, Burn, etc.)
- `src/components/` - Reusable components (Layout, ProtectedRoute, etc.)
- `src/services/` - API and Web3 service calls
- `src/hooks/` - Custom React hooks
- `src/store/` - Redux store configuration
- `src/styles/` - Global styles

## Key Technologies

- React 18
- Vite
- Redux Toolkit
- Ant Design
- Ethers.js
- React Router

## Environment Variables

See `.env.example` for all required environment variables.

## Features

- Email/Password login
- MetaMask Web3 login
- Token balance display
- Mint tokens
- Burn tokens
- Transaction history
- Profile management
- Admin dashboard (for admins)
