# Vercel Deployment Guide

This guide will help you deploy the Claru app to Vercel.

## Prerequisites

1. **Turso Account**: Sign up at [turso.tech](https://turso.tech) for a cloud SQLite database
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Database Setup (Turso)

1. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Create a new database:
   ```bash
   turso db create moneves-prod
   ```

3. Get your database URL and auth token:
   ```bash
   turso db show moneves-prod
   ```

4. Run migrations on the production database:
   ```bash
   DATABASE_URL="libsql://your-db-url" DATABASE_AUTH_TOKEN="your-token" npm run db:push
   ```

## Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables
- `DATABASE_URL`: Your Turso database URL (starts with `libsql://`)
- `DATABASE_AUTH_TOKEN`: Your Turso auth token
- `NEXTAUTH_SECRET`: A random secret key (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
- `DATABASE_ENCRYPTION_KEY`: A 32-character encryption key

### Optional Variables
- `BUNQ_API_URL`: Your Bunq API URL (if using external Bunq service)
- `NEXT_PUBLIC_APP_VERSION`: App version for display
- `NEXT_PUBLIC_BUILD_DATE`: Build date
- `NEXT_PUBLIC_COMMIT_HASH`: Git commit hash
- `NEXT_PUBLIC_BRANCH`: Git branch name

## Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel

2. **Set Environment Variables**: Add all required environment variables in Vercel dashboard

3. **Deploy**: Vercel will automatically build and deploy your app

4. **Verify**: Check that your app is working correctly

## Database Migration

The app automatically handles database schema migrations. On first deployment, the database will be initialized with the required tables.

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` and `DATABASE_AUTH_TOKEN` are correct
- Check that your Turso database is accessible

### Build Errors
- Ensure all dependencies are properly installed
- Check that environment variables are set correctly

### Runtime Errors
- Check Vercel function logs for detailed error messages
- Verify all required environment variables are set

## Local Development

For local development, the app will use a local SQLite database (`sqlite.db`) when `DATABASE_URL` is not set.

## Security Notes

- Never commit environment variables to your repository
- Use strong, unique secrets for production
- Regularly rotate your database auth tokens
- Keep your encryption key secure and backed up
