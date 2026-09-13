# Northstar Supply Co.

Northstar is an internship-grade MERN commerce platform for a considered collection of everyday objects. It demonstrates production-minded separation between a Vite React storefront and an Express/Mongoose API, with server-owned pricing, stock-safe checkout, JWT authentication, and role-based administration.

## Stack

React 18 + Vite, React Router, Context/useReducer, Express, MongoDB/Mongoose, JWT, bcrypt, and a CSS design system with Manrope, Playfair Display, and DM Mono.

## Local setup

1. Install Node 18+ and MongoDB 6+ (a replica set is recommended because checkout uses transactions).
2. Run `npm install`, then `npm install --prefix server` and `npm install --prefix client`.
3. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and a long `JWT_SECRET`.
4. Seed sample catalog/admin data: `node src/seed.js` from the `server` directory.
5. Start both apps with `npm run dev`. API: `http://localhost:5000`; client: `http://localhost:5173`.

The seed admin is `admin@northstar.test` / `admin1234`; change it before any shared deployment. No secret is committed.

## Architecture notes

The API validates Mongoose schemas even when requests bypass the browser. Product prices are read from MongoDB during checkout. Each line reserves stock with a `stock >= qty` guard inside a transaction, then persists the order. Product mutations, order status updates, and the admin dashboard are protected by `authenticate` plus `authorize('admin')`. Orders are scoped to the authenticated user unless the user is an admin.

## API documentation

See [API.md](API.md) for endpoint contracts. A demo video should cover catalog filtering, cart persistence, checkout, then the admin login, revenue view, order table, and product creation. LinkedIn copy is prepared in [LINKEDIN.md](LINKEDIN.md).

## Screenshots

Add storefront, checkout, and admin screenshots here after recording the walkthrough.
