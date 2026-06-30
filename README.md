# FlexForge — Server

Backend REST API for FlexForge, a Fitness & Gym Management Platform.

## Purpose

Provides secure, role-based API endpoints for class management, bookings, favorites, trainer applications, community forum, payments (Stripe), and admin operations.

## Live API URL

https://your-server-url.onrender.com *(update after deployment)*

## Key Features

- JWT authentication with HTTPOnly cookies and role-based middleware (User/Trainer/Admin)
- MongoDB `$regex` search and `$in` category filtering for classes
- Server-side pagination for classes and forum posts
- Stripe payment intent creation and transaction recording
- Soft-block middleware restricting state-changing actions for blocked users
- Duplicate-prevention logic for bookings and favorites

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
cp .env.example .env   # fill in your credentials
npm run dev
```