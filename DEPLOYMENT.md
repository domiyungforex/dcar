# DCAR Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] `.env.local` NOT committed to git
- [ ] Project tested locally
- [ ] Admin panel access code set
- [ ] Blob storage token obtained
- [ ] All forms tested and working

## Vercel Deployment (Recommended)

### Step 1: Connect Repository

1. Push code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **Add New > Project**
4. Select your GitHub repository
5. Click **Import**

### Step 2: Configure Environment

1. Before deploying, click **Environment Variables**
2. Add variables:

| Name | Value |
|------|-------|
| `BLOB_READ_WRITE_TOKEN` | Your Vercel Blob token |
| `ADMIN_ACCESS_CODE` | Your secure access code |

3. Click **Deploy**

### Step 3: Verify Deployment

1. Wait for deployment to complete (usually 2-5 minutes)
2. Click **Visit** to open the live site
3. Test on `/admin` with your access code
4. Test a form submission

### Step 4: Post-Deployment

\`\`\`bash
# Optionally, add a custom domain
# In Vercel project > Settings > Domains
# Add your domain (e.g., dcar.example.com)

# Setup automatic deployments
# Your repo is already connected - deploys on git push
\`\`\`

## Other Platforms

### Railway

\`\`\`bash
# Connect GitHub and add environment variables
# Automatically detects Next.js
# Free tier available
\`\`\`

### Netlify

\`\`\`bash
# Connect GitHub and set build command: npm run build
# Set environment variables
# May require manual API route setup
\`\`\`

### Self-Hosted (AWS, DigitalOcean, etc.)

\`\`\`bash
# Build for production
npm run build

# Start server
npm run start

# Set environment variables before running
export BLOB_READ_WRITE_TOKEN=xxx
export ADMIN_ACCESS_CODE=xxx
npm run start
\`\`\`

## Production Optimization

### Enable Caching

\`\`\`typescript
// app/page.tsx
export const revalidate = 3600  // Revalidate every hour
\`\`\`

### Image Optimization

- Use Next.js Image component
- Compress product images before upload
- Use WebP format when possible

### Monitoring

1. Enable Vercel Analytics:
\`\`\`tsx
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout() {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
\`\`\`

2. Setup error tracking (optional):
   - Vercel Insights
   - Sentry
   - LogRocket

### Performance Monitoring

\`\`\`bash
# Test performance
npm run build
npm run start

# Local performance testing with lighthouse
# Or use PageSpeed Insights on production
\`\`\`

## Rollback

### Revert to Previous Deployment

1. Go to Vercel project > Deployments
2. Find previous successful deployment
3. Click ⋮ menu > Promote to Production

### Revert Code

\`\`\`bash
git revert <commit-hash>
git push origin main
# Vercel auto-deploys new commit
\`\`\`

## Database Backups

**Vercel Blob** handles versioning automatically:
- All file versions kept
- 180-day retention
- Automatic snapshots

To backup manually:

\`\`\`bash
# Export all data
# Create a script that fetches all submissions and products
# Save as JSON files locally
\`\`\`

## Troubleshooting Deployment

### Deployment fails with "Environment variable not set"

1. Check Vercel project settings
2. Verify variable names match exactly
3. Redeploy after adding variables

### Forms not working after deployment

1. Check API route paths
2. Verify Blob token is valid
3. Check browser console for errors

### Admin panel gives "Invalid code"

1. Verify `ADMIN_ACCESS_CODE` in Vercel settings
2. Wait 5 minutes for propagation
3. Clear browser cache
4. Redeploy if needed

### File uploads failing

1. Check file size < 50MB
2. Verify Blob token has write permissions
3. Check browser network tab for errors

## Security for Production

- [ ] Change `ADMIN_ACCESS_CODE` from default
- [ ] Never expose Blob token in client code (already protected)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Setup rate limiting if needed
- [ ] Regular security audits
- [ ] Monitor access logs

## Performance in Production

**Expected metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

Monitor with:
- Vercel Analytics
- PageSpeed Insights
- WebPageTest

## Scaling Strategy

### Current Capacity
- Unlimited files (Vercel Blob)
- Unlimited products (JSON storage)
- Auto-scaling API routes

### If You Hit Limits
1. Implement search indexing (1000+ products)
2. Add database for analytics (Vercel KV)
3. Implement caching layer
4. Consider content delivery optimization

## Monitoring & Alerts

### Vercel Monitoring
- Go to project > Monitoring
- View function execution times
- Monitor error rates
- Track uptime

### Custom Alerts

Setup notifications for:
- Deployment failures
- High error rates
- Performance degradation

## Cost Management

**Free tier includes:**
- 100 GB storage (Blob)
- Unlimited requests
- Unlimited deployments
- Basic analytics

**Paid if you exceed:**
- Additional Blob storage ($0.6/GB)
- Additional bandwidth

## Migration Path

**If you outgrow this setup:**

1. **To Database**: Migrate submissions to PostgreSQL
2. **To Auth**: Add Supabase Auth when needed
3. **To Payments**: Integrate Stripe checkout
4. **To CDN**: Already using Vercel CDN

All easily possible without major refactoring.

---

**Deployment complete! Your DCAR platform is live.** 🚀
