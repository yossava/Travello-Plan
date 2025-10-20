# Vercel Deployment Guide for Travel Planner

This guide will walk you through deploying the Travel Planner application to Vercel step by step.

## Prerequisites

Before you begin, make sure you have:

1. A [Vercel account](https://vercel.com/signup) (free tier is fine)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account with a database set up
3. An [OpenAI API key](https://platform.openai.com/api-keys)
4. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Database

### MongoDB Atlas Setup

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (if you haven't already)
3. Click on "Database Access" in the left sidebar
4. Create a database user with a username and password (save these credentials)
5. Click on "Network Access" in the left sidebar
6. Add IP address `0.0.0.0/0` to allow access from anywhere (required for Vercel)
7. Go to "Database" and click "Connect" on your cluster
8. Select "Connect your application"
9. Copy the connection string - it should look like:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
10. **Important:** Add the database name `travel-planner` to the connection string:
    ```
    mongodb+srv://<username>:<password>@cluster.mongodb.net/travel-planner?retryWrites=true&w=majority
    ```

## Step 2: Prepare Environment Variables

You'll need the following environment variables for deployment:

1. **MONGO_URI** - Your MongoDB connection string from Step 1
2. **DATABASE_URL** - Same as MONGO_URI (Prisma uses this)
3. **NEXTAUTH_URL** - Your Vercel app URL (you'll get this after deployment)
4. **NEXTAUTH_SECRET** - A secure random string
5. **OPENAI_API_KEY** - Your OpenAI API key

### Generate NEXTAUTH_SECRET

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Save the output - you'll use it as your `NEXTAUTH_SECRET`.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for first-time users)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository:
   - If not connected, click "Import Git Repository" and authorize Vercel to access your GitHub/GitLab/Bitbucket
   - Select the repository containing your travel-planner project
4. Configure the project:
   - **Framework Preset:** Next.js (should be auto-detected)
   - **Root Directory:** `travel-planner` (if your project is in a subdirectory)
   - **Build Command:** Leave default or use `prisma generate && next build`
   - **Install Command:** Leave default (`npm install`)
5. Click "Environment Variables" section
6. Add the following environment variables (click "Add" for each):

   | Name | Value | Environment |
   |------|-------|-------------|
   | MONGO_URI | `mongodb+srv://username:password@cluster.mongodb.net/travel-planner?retryWrites=true&w=majority` | Production, Preview, Development |
   | DATABASE_URL | Same as MONGO_URI | Production, Preview, Development |
   | NEXTAUTH_SECRET | (your generated secret from Step 2) | Production, Preview, Development |
   | OPENAI_API_KEY | `sk-...` (your OpenAI API key) | Production, Preview, Development |
   | NEXTAUTH_URL | (leave empty for now) | |

   **Note:** Replace the placeholders with your actual values.

7. Click "Deploy"
8. Wait for the deployment to complete (usually 2-5 minutes)

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd travel-planner
   ```

3. Run the deployment command:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? (Press enter to use default or type a custom name)
   - In which directory is your code located? **./travel-planner** (or press enter if already in the directory)

5. Add environment variables via CLI:
   ```bash
   vercel env add MONGO_URI
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add OPENAI_API_KEY
   ```
   For each command, paste the value when prompted and select which environments (production, preview, development).

6. Deploy to production:
   ```bash
   vercel --prod
   ```

## Step 4: Update NEXTAUTH_URL

After your first deployment:

1. Copy your Vercel app URL (e.g., `https://your-app.vercel.app`)
2. Go to your Vercel project dashboard
3. Navigate to "Settings" → "Environment Variables"
4. Add or update `NEXTAUTH_URL`:
   - Name: `NEXTAUTH_URL`
   - Value: `https://your-app.vercel.app` (your actual Vercel URL)
   - Environment: Production, Preview
5. Click "Save"
6. Redeploy your application:
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

## Step 5: Initialize Database Schema

Your database schema needs to be set up with Prisma:

1. The `vercel.json` file includes `prisma generate` in the build command, which will generate the Prisma client
2. Prisma with MongoDB will automatically create collections when data is first inserted
3. No additional migration commands are needed for MongoDB

## Step 6: Verify Deployment

1. Visit your deployed app URL
2. Test the following functionality:
   - User registration and login
   - Creating a new travel plan
   - Generating an itinerary (tests OpenAI integration)
   - Viewing saved plans

## Step 7: Set Up Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to update your DNS settings
5. After the domain is verified, update `NEXTAUTH_URL` to use your custom domain

## Troubleshooting

### Build Failures

**Issue:** Build fails with Prisma errors

**Solution:**
- Ensure `DATABASE_URL` is set correctly in environment variables
- The `vercel.json` includes `prisma generate` in the build command
- Check that your MongoDB connection string is correct

**Issue:** Build fails with missing dependencies

**Solution:**
- Run `npm install` locally and make sure `package-lock.json` is committed
- Check that all dependencies are in `dependencies`, not just `devDependencies`

### Runtime Errors

**Issue:** 500 error or authentication not working

**Solution:**
- Verify all environment variables are set correctly
- Make sure `NEXTAUTH_URL` matches your actual deployment URL
- Check that `NEXTAUTH_SECRET` is set and is a strong random string

**Issue:** Database connection errors

**Solution:**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check that your database user has proper read/write permissions
- Ensure the database name is included in the connection string

**Issue:** OpenAI API errors

**Solution:**
- Verify your OpenAI API key is valid and has credits
- Check the OpenAI API status page for outages
- Review your OpenAI usage limits

### Viewing Logs

1. Go to your Vercel project dashboard
2. Click on "Deployments"
3. Click on the deployment you want to inspect
4. View "Build Logs" or "Runtime Logs" for error details

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:

- **Production:** Pushes to the `main` or `master` branch
- **Preview:** Pushes to any other branch or pull requests

To disable auto-deployment:
1. Go to "Settings" → "Git"
2. Configure deployment settings as needed

## Environment Variables Management

To update environment variables:

1. Go to "Settings" → "Environment Variables"
2. Update the value
3. Redeploy your application for changes to take effect

## Performance Optimization

### Enable Edge Caching

The Next.js app is already optimized for Vercel's Edge Network. No additional configuration needed.

### Monitor Performance

1. Go to "Analytics" tab in your Vercel dashboard
2. Monitor page load times, Web Vitals, and traffic
3. Use "Speed Insights" to identify performance bottlenecks

## Security Checklist

- [ ] All environment variables are set and kept secret
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] OpenAI API key is kept secure
- [ ] Custom domain has SSL/TLS enabled (automatic with Vercel)
- [ ] Regular security updates for dependencies (`npm audit`)

## Next Steps

- Set up monitoring and error tracking (e.g., Sentry)
- Configure custom domain
- Set up email notifications for deployment failures
- Review and optimize API routes for performance
- Set up staging environment for testing

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
