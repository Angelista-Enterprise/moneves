# Moneves - Personal Budget Manager

A modern, full-stack budget tracking application built with Next.js 15, TypeScript, and the latest web technologies. Moneves helps you manage your finances with intelligent budgeting, transaction tracking, and financial goal setting. Ready for deployment on Vercel with cloud database support.

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
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Themes**: next-themes

### Backend
- **Database**: SQLite (local) / Turso (production) with Drizzle ORM
- **Database Client**: libSQL (Turso-compatible)
- **Authentication**: NextAuth.js v5
- **API**: Next.js API Routes
- **Validation**: Zod
- **Encryption**: AES-256-GCM for sensitive data
- **External APIs**: Bunq Banking API, Google Generative AI

### Development & Deployment
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database Management**: Drizzle Kit
- **Deployment**: Vercel-ready with cloud database

## 📁 Project Structure

```
moneves/
├── README.md                    # This file
├── DEPLOYMENT.md               # Vercel deployment guide
├── DATABASE_ENCRYPTION.md      # Database encryption documentation
├── package.json                 # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── drizzle.config.ts           # Drizzle ORM configuration
├── vercel.json                 # Vercel deployment configuration
├── components.json             # shadcn/ui configuration
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── budgets/        # Budget management endpoints
│   │   │   ├── transactions/   # Transaction endpoints
│   │   │   ├── savings-goals/  # Savings goals endpoints
│   │   │   └── user-settings/  # User settings endpoints
│   │   ├── auth/               # Authentication pages
│   │   ├── budgets/            # Budget management pages
│   │   ├── reports/            # Financial reports
│   │   ├── savings-goals/      # Savings goals pages
│   │   ├── settings/           # User settings
│   │   ├── transactions/       # Transaction management
│   │   ├── setup/              # Initial setup flow
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Dashboard home page
│   │
│   ├── components/             # React components
│   │   ├── budgets/            # Budget components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── reports/            # Report components
│   │   ├── transactions/       # Transaction components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   ├── utils/              # Utility components
│   │   └── bug-report/         # Bug reporting components
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTransactions.ts  # Transaction management hooks
│   │   ├── useBudgets.ts       # Budget management hooks
│   │   ├── useSavingsGoals.ts  # Savings goals hooks
│   │   ├── useBunqAccounts.ts  # Bunq integration hooks
│   │   └── useUnifiedTransactions.ts # Combined transaction data
│   │
│   ├── lib/                    # Core utilities and configurations
│   │   ├── db/                 # Database layer
│   │   │   ├── schema.ts       # Database schema
│   │   │   ├── index.ts        # Database connection (libSQL)
│   │   │   └── encrypted-db.ts  # Encrypted database wrapper
│   │   ├── encryption/         # Data encryption utilities
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── query-client.ts     # TanStack Query setup
│   │   └── utils.ts            # Utility functions
│   │
│   ├── services/               # Business logic services
│   │   ├── categories.ts       # Category management
│   │   ├── savingsGoals.ts    # Savings goals logic
│   │   ├── budgetAnalytics.ts  # Budget analytics
│   │   └── autoCategorization.ts # AI categorization
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── api/                # API response types
│   │   ├── database/           # Database types
│   │   └── bunq/               # Bunq API types
│   │
│   └── middleware.ts           # Next.js middleware
│
├── drizzle/                    # Database migrations
├── migrations/                 # Custom SQL migrations
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm
- Git

### Local Development Setup

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
   Create a `.env.local` file with the following variables:
   ```bash
   # Database (leave empty for local SQLite)
   DATABASE_URL=
   DATABASE_AUTH_TOKEN=

   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # Database Encryption
   DATABASE_ENCRYPTION_KEY=your-32-character-encryption-key

   # Optional: Bunq API
   BUNQ_API_URL=http://localhost:8000
   ```

4. **Set up the database:**
   ```bash
   npm run db:push
   npm run db:seed-test
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

For production deployment on Vercel, see the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

## 📊 Database Management

### Available Scripts

- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed-test` - Seed database with test data
- `npm run db:studio` - Open Drizzle Studio for database management

### Database Configuration

- **Local Development**: Uses SQLite file (`sqlite.db`)
- **Production**: Uses Turso cloud database (libSQL)
- **Encryption**: Sensitive fields are encrypted with AES-256-GCM
- **ORM**: Drizzle ORM with type-safe queries

### Database Schema

The application uses SQLite with the following main tables:
- **users** - User accounts, preferences, and Bunq API keys
- **userAccounts** - Manual bank accounts
- **accountMappings** - Bunq account mappings
- **budgetCategories** - Budget categories with advanced features
- **transactions** - Manual financial transactions
- **transactionCategorizations** - Bunq transaction categorizations
- **savingsGoals** - Financial goals and progress tracking
- **transactionCategories** - Predefined transaction categories

## 🎯 Features Overview

### ✅ Completed Features

#### Core Functionality
- ✅ User authentication with NextAuth.js v5
- ✅ Multi-account bank account management
- ✅ Transaction CRUD operations with real-time updates
- ✅ Budget category management with advanced analytics
- ✅ Savings goals tracking and progress monitoring
- ✅ Real-time dashboard with financial metrics
- ✅ Interactive charts and data visualization
- ✅ Dark/light theme support with next-themes
- ✅ Responsive design for all devices

#### Advanced Features
- ✅ Bunq banking API integration with production tokens
- ✅ AI-powered transaction categorization using Google AI
- ✅ Bulk transaction operations and categorization
- ✅ Advanced filtering and search capabilities
- ✅ Data export and deletion capabilities
- ✅ Comprehensive user settings and preferences
- ✅ Subscription tier management system
- ✅ Database encryption for sensitive data

#### Technical Features
- ✅ Vercel-ready deployment with cloud database
- ✅ Type-safe database operations with Drizzle ORM
- ✅ Real-time data synchronization with TanStack Query
- ✅ Encrypted database fields with AES-256-GCM
- ✅ Comprehensive error handling and validation
- ✅ Performance optimizations and caching

#### UI/UX Features
- ✅ Modern shadcn/ui component system
- ✅ Accessible design with ARIA support
- ✅ Mobile-first responsive design
- ✅ Loading states and error boundaries
- ✅ Optimistic updates for better UX
- ✅ Toast notifications and user feedback
- ✅ Bug reporting system

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

#### Authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

#### Budget Categories
- `GET /api/budget-categories` - Fetch budget categories
- `POST /api/budget-categories` - Create budget category
- `GET /api/budget-categories/[id]` - Get specific category
- `PUT /api/budget-categories/[id]` - Update category
- `DELETE /api/budget-categories/[id]` - Delete category

#### Budgets (Advanced)
- `GET /api/budgets` - Fetch budgets with analytics
- `POST /api/budgets` - Create budget
- `GET /api/budgets/[id]` - Get specific budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget
- `POST /api/budgets/bulk-delete` - Bulk delete budgets
- `GET /api/budgets/[id]/filters` - Get budget filters

#### Transactions
- `GET /api/transactions` - Fetch transactions (unified)
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/bulk-delete` - Bulk delete transactions
- `POST /api/transactions/categorize` - Categorize transactions

#### Savings Goals
- `GET /api/savings-goals` - Fetch savings goals
- `POST /api/savings-goals` - Create savings goal
- `GET /api/savings-goals/[id]` - Get specific goal
- `PUT /api/savings-goals/[id]` - Update goal
- `DELETE /api/savings-goals/[id]` - Delete goal
- `POST /api/savings-goals/bulk-delete` - Bulk delete goals

#### User Settings
- `GET /api/user-settings` - Fetch user settings
- `PUT /api/user-settings` - Update user settings
- `PUT /api/user-settings/bunq-api-key` - Update Bunq API key
- `POST /api/user-settings/reset` - Reset user data

#### Categories
- `GET /api/categories` - Fetch transaction categories
- `GET /api/categories/[id]` - Get specific category

#### Data Management
- `POST /api/user-data/delete` - Delete all user data

## 🏗️ Architecture

### Frontend Architecture
- **Next.js 15 App Router** - File-based routing with server components
- **React Server Components** - Server-side rendering for performance
- **Client Components** - Interactive UI elements with hydration
- **TanStack Query** - Server state management and caching
- **Custom Hooks** - Reusable stateful logic and API integration
- **Context Providers** - Global state management (formatting, themes)

### Backend Architecture
- **Next.js API Routes** - RESTful API endpoints with middleware
- **Drizzle ORM** - Type-safe database operations with migrations
- **NextAuth.js v5** - Authentication and session management
- **Zod** - Runtime type validation and schema validation
- **libSQL/Turso** - Cloud-compatible SQLite database
- **AES-256-GCM Encryption** - Field-level data encryption

### Database Architecture
- **Local Development**: SQLite file with better-sqlite3 compatibility
- **Production**: Turso cloud database with libSQL client
- **Encryption Service**: Automatic encryption/decryption of sensitive fields
- **Migration System**: Drizzle Kit for schema management
- **Type Safety**: Full TypeScript integration with Drizzle ORM

### Data Flow
1. **User Interaction** → React Components
2. **State Management** → Custom Hooks + TanStack Query
3. **API Calls** → Next.js API Routes
4. **Authentication** → NextAuth.js middleware
5. **Database Operations** → Drizzle ORM + Encryption Service
6. **Response** → Client State Update + Cache Invalidation

## 🔧 Development

### Code Quality
- **TypeScript** - Full type safety with strict mode
- **ESLint** - Code linting and formatting
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Runtime type validation

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run linting and type checking
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database management UI

### Performance Optimizations
- **Code Splitting** - Route-based splitting with Next.js
- **Image Optimization** - Next.js Image component
- **Caching** - TanStack Query caching with invalidation
- **Server Components** - Reduced client-side JavaScript
- **Database Encryption** - Efficient field-level encryption

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