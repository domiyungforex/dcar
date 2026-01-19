# Email Setup Instructions

To enable real email delivery for form submissions, you need to add the Resend API key to your Vercel environment.

## Step 1: Get Resend API Key

1. Go to https://resend.com
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

## Step 2: Add to Vercel

Run this command with your actual API key:

```bash
npx vercel env add RESEND_API_KEY production
# Paste your API key when prompted
```

Or use the Vercel dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project (dcarcarsellingapp2)
3. Go to Settings → Environment Variables
4. Click "Add New"
5. Name: `RESEND_API_KEY`
6. Value: Your Resend API key
7. Select "Production"
8. Click "Save"

## Step 3: Redeploy

After adding the environment variable, redeploy:

```bash
npx vercel --prod --yes
```

## Email Recipients

All form submissions will now send emails to: **dmonhaloo.gmail.com**

This includes:
- Car inquiries
- Service requests
- Newsletter signups
- Contact form submissions
- File uploads

## How It Works

When users submit forms:
1. The data is saved to Redis
2. The email service checks for `RESEND_API_KEY`
3. If found, it sends an email via Resend API
4. If not found, it tries webhook or console logging

All emails are sent from: `notifications@dcars.vercel.app`
