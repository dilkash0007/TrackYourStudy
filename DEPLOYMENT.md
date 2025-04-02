# Deploying TrackYouStudy to Vercel

This guide will walk you through deploying your TrackYouStudy app to Vercel, a platform that makes it easy to deploy React applications.

## Prerequisites

1. A GitHub account
2. Your TrackYouStudy code pushed to a GitHub repository
3. A Vercel account (you can sign up using your GitHub account)

## Step 1: Prepare Your Code

Ensure your code is ready for production:

1. Run `npm run build` locally to make sure there are no build errors
2. Fix any errors that occur during the build process
3. Commit all changes to your repository with `git add .` and `git commit -m "Ready for deployment"`
4. Push your changes to GitHub with `git push`

## Step 2: Deploy to Vercel

### Option 1: Using the Vercel Website (Recommended for First-Time Users)

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click on "Add New..." > "Project"
3. Select your TrackYouStudy repository from the list
4. Configure your project:
   - Framework Preset: Select "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click "Deploy"
6. Wait for the deployment to complete (usually 1-2 minutes)
7. Once complete, Vercel will provide you with a URL where your app is deployed (e.g., `https://trackyoustudy.vercel.app`)

### Option 2: Using the Vercel CLI

If you prefer using the command line:

1. Install the Vercel CLI globally: `npm install -g vercel`
2. In your project directory, run: `vercel`
3. Follow the prompts:
   - Login to your Vercel account if prompted
   - Confirm the project settings
   - Wait for the deployment to complete
4. For production deployment, run: `vercel --prod`

## Step 3: Configure Custom Domain (Optional)

If you want to use your own domain name:

1. Go to your project on the Vercel dashboard
2. Click on "Settings" > "Domains"
3. Add your custom domain
4. Follow the instructions to configure your DNS settings

## Step 4: Check Your Deployment

1. Visit your deployment URL
2. Test all features of your app to ensure they work correctly
3. Check for any console errors

## Troubleshooting

If you encounter any issues during deployment:

1. Check your build logs in the Vercel dashboard
2. Ensure your project has no build errors locally
3. Verify that all environment variables are correctly set in the Vercel dashboard
4. Make sure your repository is accessible to Vercel

## Automatic Deployments

One of the benefits of Vercel is automatic deployments:

1. Every time you push changes to your main branch, Vercel will automatically rebuild and redeploy your app
2. You can also set up preview deployments for pull requests
3. To disable automatic deployments, go to "Settings" > "Git" in your Vercel project dashboard

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Custom Domain Setup](https://vercel.com/docs/concepts/projects/domains)

## Need Help?

If you need further assistance with deployment, please:

1. Check the Vercel documentation
2. Visit the Vercel help center
3. Contact the TrackYouStudy support team
