# Moneves - Personal Budget Manager

A modern, full-stack budget tracking application built with Next.js 14, TypeScript, and the latest web technologies. Moneves helps you manage your finances with intelligent budgeting, transaction tracking, and financial goal setting.

## 🚀 Features

- 🎯 **Smart Budget Tracking** - Monitor expenses across categories with intelligent limits
- 💳 **Multi-Account Management** - Track multiple bank accounts and balances
- 📊 **Advanced Analytics** - Interactive charts and financial insights
- 🤖 **AI-Powered Categorization** - Automatic transaction categorization using AI
- 🏦 **Bunq Integration** - Direct integration with Bunq banking API
- 💰 **Savings Goals** - Set and track financial goals with progress monitoring
- 📈 **Real-time Dashboard** - Live financial metrics and spending trends
- 🎨 **Modern UI** - Beautiful design with shadcn/ui components
- 🌙 **Dark/Light Mode** - Seamless theme switching
- 📱 **Responsive Design** - Optimized for all devices
- ⚡ **Real-time Updates** - Live data synchronization with TanStack Query

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Themes**: next-themes

### Backend
- **Database**: SQLite (local) / Turso (production) with Drizzle ORM
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes
- **Validation**: Zod
- **External APIs**: Bunq Banking API, Google Generative AI

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database Management**: Drizzle Kit

## 📁 Project Structure

```
moneves/
├── README.md                    # This file
├── package.json                 # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── drizzle.config.ts           # Drizzle ORM configuration
├── components.json              # shadcn/ui configuration
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── README.md           # App structure documentation
│   │   ├── api/                # API routes
│   │   │   └── README.md       # API documentation
│   │   ├── accounts/           # Account management pages
│   │   ├── auth/               # Authentication pages
│   │   ├── budgets/            # Budget management pages
│   │   ├── reports/            # Financial reports
│   │   ├── savings-goals/      # Savings goals pages
│   │   ├── settings/           # User settings
│   │   ├── transactions/       # Transaction management
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/             # React components
│   │   ├── README.md           # Components documentation
│   │   ├── accounts/           # Account components
│   │   ├── charts/             # Data visualization
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── layout/             # Layout components
│   │   ├── transactions/       # Transaction components
│   │   ├── ui/                 # Base UI components
│   │   └── utils/              # Utility components
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── README.md           # Hooks documentation
│   │   ├── use-accounts.ts     # Account management hooks
│   │   ├── use-transactions.ts # Transaction hooks
│   │   ├── use-dashboard-metrics.ts # Dashboard data hooks
│   │   └── ...                 # Other custom hooks
│   │
│   ├── lib/                    # Core utilities and configurations
│   │   ├── README.md           # Lib documentation
│   │   ├── db/                 # Database layer
│   │   │   ├── schema.ts       # Database schema
│   │   │   ├── index.ts        # Database connection
│   │   │   └── seed.ts         # Database seeding
│   │   ├── auth.ts             # Authentication configuration
│   │   ├── constants.ts        # Application constants
│   │   ├── bunq-api-client.ts  # Bunq API integration
│   │   ├── auto-categorization.ts # AI categorization
│   │   └── utils.ts            # Utility functions
│   │
│   └── middleware.ts           # Next.js middleware
│
├── drizzle/                    # Database migrations
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd moneves
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Management

### Available Scripts

- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Drizzle Studio for database management

### Database Schema

The application uses SQLite with the following main tables:
- **users** - User accounts and preferences
- **userAccounts** - Bank accounts
- **budgetCategories** - Budget categories and limits
- **transactions** - Financial transactions
- **savingsGoals** - Financial goals

## 🎯 Features Overview

### ✅ Completed Features

#### Core Functionality
- ✅ User authentication and session management
- ✅ Multi-account bank account management
- ✅ Transaction CRUD operations with CSV import
- ✅ Budget category management with spending limits
- ✅ Savings goals tracking and progress monitoring
- ✅ Real-time dashboard with financial metrics
- ✅ Interactive charts and data visualization
- ✅ Dark/light theme support
- ✅ Responsive design for all devices

#### Advanced Features
- ✅ Bunq banking API integration
- ✅ AI-powered transaction categorization
- ✅ Bulk transaction operations
- ✅ Advanced filtering and search
- ✅ Data export capabilities
- ✅ User settings and preferences
- ✅ Subscription tier management

#### UI/UX Features
- ✅ Modern shadcn/ui component system
- ✅ Accessible design with ARIA support
- ✅ Mobile-first responsive design
- ✅ Loading states and error handling
- ✅ Optimistic updates for better UX
- ✅ Toast notifications for user feedback

### 🚧 Planned Features

- 🔄 Real-time notifications
- 📱 Mobile app (React Native)
- 🔗 Additional bank integrations
- 📊 Advanced reporting and analytics
- 👥 Multi-user collaboration
- 🔐 Enhanced security features
- 🌍 Multi-language support

## 🔌 API Documentation

### Core Endpoints

#### Accounts
- `GET /api/accounts` - Fetch user accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts` - Update account
- `DELETE /api/accounts` - Delete account

#### Transactions
- `GET /api/transactions` - Fetch transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions` - Update transaction
- `DELETE /api/transactions` - Delete transaction
- `POST /api/transactions/import` - CSV import

#### Budget Categories
- `GET /api/budget-categories` - Fetch categories
- `POST /api/budget-categories` - Create category
- `PUT /api/budget-categories` - Update category
- `DELETE /api/budget-categories` - Delete category

#### Savings Goals
- `GET /api/savings-goals` - Fetch goals
- `POST /api/savings-goals` - Create goal
- `PUT /api/savings-goals` - Update goal
- `DELETE /api/savings-goals` - Delete goal

### External Integrations

#### Bunq API
- `GET /api/bunq/accounts` - Sync Bunq accounts
- `GET /api/bunq/transactions` - Sync Bunq transactions
- `GET /api/bunq/scheduled-payments` - Sync scheduled payments

## 🏗️ Architecture

### Frontend Architecture
- **Next.js 14 App Router** - File-based routing
- **React Server Components** - Server-side rendering
- **Client Components** - Interactive UI elements
- **TanStack Query** - Server state management
- **Custom Hooks** - Reusable stateful logic

### Backend Architecture
- **Next.js API Routes** - RESTful API endpoints
- **Drizzle ORM** - Type-safe database operations
- **NextAuth.js** - Authentication and session management
- **Zod** - Runtime type validation
- **SQLite** - Lightweight database

### Data Flow
1. **User Interaction** → React Components
2. **State Management** → Custom Hooks
3. **API Calls** → TanStack Query
4. **Backend Processing** → API Routes
5. **Database Operations** → Drizzle ORM
6. **Response** → Client State Update

## 🔧 Development

### Code Quality
- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks

### Testing Strategy
- **Unit Tests** - Component and utility testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - User flow testing
- **Type Tests** - TypeScript type checking

### Performance Optimizations
- **Code Splitting** - Route-based splitting
- **Image Optimization** - Next.js Image component
- **Caching** - TanStack Query caching
- **Bundle Analysis** - Webpack bundle analyzer

## 🚀 Deployment

### Vercel Deployment (Recommended)

The app is now configured for easy deployment on Vercel with cloud database support.

#### Quick Deploy
1. **Connect to Vercel**: Import your GitHub repository to Vercel
2. **Set Environment Variables**: Add the required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your app

#### Required Environment Variables
```bash
# Database (Turso - Cloud SQLite)
DATABASE_URL=libsql://your-turso-db-url
DATABASE_AUTH_TOKEN=your-turso-auth-token

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.vercel.app

# Database Encryption
DATABASE_ENCRYPTION_KEY=your-32-character-encryption-key

# Optional
BUNQ_API_URL=https://api.bunq.com
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Database Setup (Turso)
1. **Install Turso CLI**: `curl -sSfL https://get.tur.so/install.sh | bash`
2. **Create Database**: `turso db create moneves-prod`
3. **Get Credentials**: `turso db show moneves-prod`
4. **Run Migrations**: `DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:push`

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Local Development
```bash
npm run build
npm run start
```

### Other Deployment Platforms
- **Netlify** - Alternative platform
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with proper tests
4. **Run quality checks** (`npm run check`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Ensure all checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **shadcn/ui** - For the beautiful component library
- **TanStack** - For the excellent query library
- **Drizzle** - For the type-safe ORM
- **Bunq** - For the banking API integration

## 📞 Support

- **Documentation** - Check the README files in each directory
- **Issues** - Report bugs via GitHub Issues
- **Discussions** - Join GitHub Discussions for questions
- **Email** - Contact us at support@moneves.com

---

**Built with ❤️ for better financial management**