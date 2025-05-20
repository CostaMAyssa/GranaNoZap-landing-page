
# Welcome to your GrananoZap project

## Project info

**URL**: https://lovable.dev/projects/eb4b8bc5-7d08-448d-a923-765cdcc8e637

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/eb4b8bc5-7d08-448d-a923-765cdcc8e637) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment to GitHub Pages

To deploy your project to GitHub Pages, follow these steps:

1. Update your repository details in the `deploy.sh` script:
   - Replace `<SEU_USUARIO>` with your actual GitHub username

2. Make the deployment script executable:
   ```sh
   chmod +x deploy.sh
   ```

3. Run the deployment script:
   ```sh
   ./deploy.sh
   ```

This will build your project and push it to the `gh-pages` branch of your repository.

## Payment System in Production

For the payment system to work in production:

1. Deploy your Node.js server (api/server.js) to a hosting provider like:
   - Vercel
   - Render
   - Heroku
   - Digital Ocean

2. Update your environment variables in production:
   - Set `VITE_API_URL` to point to your deployed API server
   - Configure CORS in your server to allow requests from your deployed frontend URL
   - Ensure your Stripe webhook is properly configured for production

3. Test the payment flow thoroughly after deployment

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Stripe for payments
- Supabase for backend services

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eb4b8bc5-7d08-448d-a923-765cdcc8e637) and click on Share -> Publish, or follow the GitHub Pages deployment instructions above.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
