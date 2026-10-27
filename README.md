# Ticketly

Ticketly is a React/Vite ticket-booking application with an Express and
MongoDB authentication and ticket backend, using Stripe Checkout for payments.

## MongoDB and backend setup

1. Create a MongoDB Atlas cluster or choose an existing MongoDB deployment.
2. In `main_Server`, copy `.env.example` to `.env`.
3. Replace the `MongoDB` placeholder with your MongoDB connection string. Include
   the database name `ticketly` in the URI path, and URL-encode special
   characters in the database username or password.
4. Replace `JWT_SECRETkey` with a long, random secret. Keep `.env` private; it is
   ignored by Git.
5. In Atlas, allow network access from the machine running the backend and give
   your database user read/write access to the selected database.
6. From the repository root, run `npm run dev`. This starts the backend and
   frontend together. The backend connects to MongoDB before listening on port
   5000; Vite serves the frontend on its usual development URL.

To run them separately, use `npm run dev:backend` and `npm run dev:frontend` in
separate terminals.

The backend creates the `users` collection when the first account is registered.
It stores normalized email addresses and bcrypt-hashed passwords; duplicate
emails are rejected. MongoDB creates the database and collection on the first
successful write, so no manual collection-creation step is needed.

## Stripe checkout and deployment

1. Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `FRONTEND_URL` to
   `main_Server/.env`. Use Stripe test keys while developing. Never put secret
   keys in frontend environment variables or commit them.
2. For local testing, install and authenticate the Stripe CLI, then run
   `stripe listen --forward-to localhost:5000/api/payment/webhook`. Copy the
   `whsec_...` signing secret printed by the CLI into
   `STRIPE_WEBHOOK_SECRET` in `main_Server/.env`, then restart the backend.
3. Configure the webhook to receive `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, and `checkout.session.expired`.
4. In deployment, set `NODE_ENV=production`, use your Stripe live secret key,
   set `FRONTEND_URL` to the deployed HTTPS frontend origin, and configure the
   Stripe Dashboard webhook URL as
   `https://<your-api-host>/api/payment/webhook` with its signing secret.
   Production deliberately rejects test keys; non-production deliberately
   rejects live keys.
5. Configure the deployed frontend host to serve the SPA entry point for
   `/payment/success`, `/payment/cancelled`, and `/ticket/:ticketId`.

The backend calculates prices from `shared/ticket-pricing.json`; it does not
trust a price submitted by the browser. Checkout creates a pending ticket
record in MongoDB. Only a valid Stripe-signed webhook confirming a paid
Checkout Session that matches the saved ticket, user, amount, and currency
changes it to confirmed. The success redirect alone never issues a ticket or QR
code. After confirmation, the ticket page displays a QR code linking to public
ticket verification and lets the customer download the QR as a PNG image.
Seat availability is read from MongoDB and unique, temporary seat reservations
prevent overlapping checkouts from selling the same seat. Reservations are
released when Stripe checkout expires/fails and retained for paid tickets until
four hours after the show. Movie prices and all event prices are in INR and are
maintained in the shared pricing file.

Live checkout must not be tested by making an unapproved real charge. Verify
the full flow using Stripe test credentials and webhook forwarding first; live
processing requires an active Stripe account, enabled INR payment methods,
production credentials, and the deployed HTTPS webhook.

## Movie and event catalog

The 30 movie and 30 event entries are local demo catalog data in
`src/data/catalog.js`. Catalog images are served by Unsplash; cards switch to a
fallback image if a selected image cannot load. Catalog entries are not stored
in MongoDB.

## Frontend scripts

- `npm run dev` starts both the backend and Vite frontend.
- `npm run dev:backend` starts only the backend.
- `npm run dev:frontend` starts only the Vite frontend.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
