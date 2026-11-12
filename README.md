# Mini-Amazon

A full-stack e-commerce web application inspired by Amazon, built with **Node.js, Express and MongoDB**. It covers the core buyer flow: sign up, browse products, manage a cart and wishlist, save addresses, check out, and track orders. It also includes a secure OTP-based password reset.

> **Status: work in progress.** The buyer-side flow is implemented. The seller side, search and filtering, and online payments are still on the roadmap (see [Future Improvements](#future-improvements)).

## Features

- **Authentication**
  - Signup and login with passwords hashed using `bcrypt`
  - JWT sessions stored in cookies, with middleware protecting private pages and API routes
- **Password reset with email OTP**
  - A one-time code is emailed via Nodemailer (Gmail)
  - The OTP is stored only as a bcrypt hash and expires after 10 minutes
  - Limited to 5 wrong attempts, with a 60-second cooldown on resend
- **Product catalog**
  - Products are separate from seller listings, so several sellers can sell the same product at different prices and stock levels
  - Home page and product detail pages
- **Cart and wishlist**
  - Add, remove, and increase or decrease quantity, with stock checks at every step
  - Wishlist stores products, while the cart stores specific seller listings
- **Address book**
  - Add, list and delete saved addresses
  - Profile viewing and editing
- **Checkout and orders**
  - Cash on Delivery (COD) orders with a readable unique order ID
  - The address and item prices are copied into the order, so later changes don't alter past orders
  - Stock is decremented atomically with a conditional update (`stock >= quantity`), so two buyers can never push stock below zero
  - Stock is restored if saving the order fails, and listings that reach zero are marked `out_of_stock`
  - Order confirmation page and order history
- **React auth UI**
  - The signup, login and address screens are a React + TypeScript + Tailwind (Vite) component that is mounted into the server-rendered EJS pages

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime / server | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jsonwebtoken`), `bcrypt`, `cookie-parser` |
| Email | Nodemailer |
| Views | EJS, plus CSS and vanilla JS in `public/` |
| Auth UI | React 19, TypeScript, Vite, Tailwind CSS, Motion |

## Project Structure

```
├── app.js                # Express app setup and route mounting
├── connect.js            # MongoDB connection, then starts the server on port 3000
├── seed.js               # Seeds sample sellers, products and listings
├── controller/           # Request handlers (pages and actions)
├── routes/               # staticRoutes (pages), dynamicRoutes (actions / API)
├── middleware/           # JWT auth guards
├── model/                # Mongoose schemas: user, seller, product, listing, order
├── services/             # JWT helper, OTP mailer
├── views/                # EJS templates
├── public/               # CSS and client-side JS
└── client/               # React + Vite auth UI (builds to client/dist)
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or MongoDB Atlas)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833), only needed for the password-reset emails

### Installation

```bash
git clone https://github.com/Jashnoor2206/mini-Amazon.git
cd mini-Amazon
npm install

# build the React auth UI
cd client
npm install
npm run build
cd ..
```

### Environment variables

Create a `.env` file in the project root:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

### Seed sample data (optional)

```bash
node seed.js
```

> Warning: the seed script deletes all existing products, sellers and listings before inserting the sample data.

### Run

```bash
npx nodemon app.js
```

Open **http://localhost:3000/amazon-clone**

## Main Routes

| Route | Description |
|---|---|
| `GET /amazon-clone/` | Home page |
| `GET /amazon-clone/product/:listingId` | Product page |
| `GET /amazon-clone/cart`, `/wishlist`, `/checkout`, `/orders` | Protected pages |
| `POST /user/createUser`, `/user/login`, `/user/logout` | Auth |
| `POST /user/forgot-password`, `/verify-otp`, `/resend-otp`, `/reset-password` | OTP password reset |
| `PATCH /user/cart/add`, `/cart/incrementQuantity`, `/cart/decrementQuantity`, `/cart/removeItem` | Cart API |
| `PATCH /user/wishlist/add`, `/wishlist/remove` | Wishlist API |
| `DELETE /user/address/:addressId` | Remove an address |
| `POST /user/placeOrder` | Place an order |

## Future Improvements

- Seller login and dashboard for managing listings (the seller and listing models exist, but there are no seller routes or pages yet)
- Admin tools to add and delist products (products are currently added through the seed script)
- Online payments (only COD is supported now)
- Product search and filtering (by category, brand, price and rating). A text index already exists on the product model, but there is no search endpoint or UI yet
- Ratings and reviews
- Automated tests

## Author

**Jashnoor Singh**: [GitHub](https://github.com/Jashnoor2206)
