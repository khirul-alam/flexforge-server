# FlexForge — Server

Backend REST API for FlexForge, a Fitness & Gym Management Platform.

## Purpose

Provides secure, role-based API endpoints for class management, bookings, favorites, trainer applications, community forum, payments (Stripe), and admin operations.

## Live API URL

https://flexforge-server.vercel.app

## Key Features

- JWT authentication with Bearer token support for cross-domain requests
- Role-based middleware (User/Trainer/Admin)
- MongoDB `$regex` search and `$in` category filtering for classes
- Server-side pagination for classes and forum posts
- Stripe payment intent creation and transaction recording
- Soft-block middleware restricting state-changing actions for blocked users
- Duplicate-prevention logic for bookings and favorites
- Per-request MongoDB connection for Vercel serverless compatibility

## NPM Packages Used

- express
- mongodb
- jsonwebtoken
- cookie-parser
- cors
- dotenv
- stripe

## Setup

```bash
npm install
cp .env.example .env 
npm run dev
```

## Environment Variables

See `.env.example` for required environment variables.