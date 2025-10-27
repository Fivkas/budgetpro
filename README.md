# 💰 BudgetPro

A full-stack personal finance manager built with **NestJS**, **PostgreSQL**, and **Next.js 15**.

Manage your transactions, categories, and visualize your financial data — all with a clean modern UI and secure authentication.

---

## 🚀 Tech Stack

### Backend
- [NestJS](https://nestjs.com/) (TypeScript)
- [Prisma ORM](https://www.prisma.io/)
- PostgreSQL (via Docker)
- JWT Authentication

### Frontend
- [Next.js 15 (App Router)](https://nextjs.org/)
- React 19 (use client components)
- TailwindCSS (Dark / Light Theme)
- Recharts (Analytics dashboard)

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Fivkas/budgetpro.git
cd budgetpro
```

---

### 2. Start the backend (NestJS API)

```bash
cd api
npm install
docker-compose up -d
npx prisma migrate dev
npm run seed
npm run start:dev
```

Runs on **http://localhost:4000**

---

### 3. Start the frontend (Next.js app)

```bash
cd ../web
npm install
npm run dev
```

Runs on **http://localhost:3000**

---

## 🔐 Authentication

1. Register at `http://localhost:3000/auth/register`
2. Login at `http://localhost:3000/auth/login`
3. Your JWT token is stored locally and used automatically for all API requests.
4. Logout from the sidebar.

---

## 📊 Features

✅ User registration & login (JWT-based)  
✅ Add, edit, delete transactions  
✅ Create and manage categories  
✅ Filtered totals (Income, Expense, Balance)  
✅ Analytics dashboard with charts  
✅ Dark/Light theme toggle  
✅ Fully responsive UI  

---

## 🧱 Project Structure

```
budgetpro/
├── api/                # NestJS backend
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── transactions/
│   │   ├── categories/
│   │   └── main.ts
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
├── web/                # Next.js frontend
│   ├── src/app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── transactions/
│   │   │   ├── analytics/page.tsx
│   │   │   └── page.tsx
│   │   ├── categories/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── utils/auth.ts
│
├── infra/
│    ├── docker-compose.yml
│
└── docs/ # project screenshots
```

---

## 🧩 Environment Variables

Create `.env` in both `api` and `web` directories.

### api/.env
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/budgetpro"
JWT_SECRET="supersecretkey"
```

### web/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🧑‍💻 Developer Notes

- Theme preference is stored in `localStorage`
- Protected routes require JWT
- Prisma auto-generates models from schema
- All timestamps are in UTC
- Default seeded user:
  - **Email:** `fivos@example.com`
  - **Password:** `1234`

---

## 🖼️ Screenshots

![Screenshot](docs/screenshot-dark.png)
![Screenshot](docs/screenshot-light.png)
![Screenshot](docs/dashboard.png)
![Screenshot](docs/transactions.png)
![Screenshot](docs/categories.png)
![Screenshot](docs/analytics.png)

---

## 👨‍💻 Author

**Fivos Kapsalis**
🔗 GitHub: [Fivkas](https://github.com/Fivkas)