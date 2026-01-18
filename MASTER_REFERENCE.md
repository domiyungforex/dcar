# Master Reference Guide

Your complete reference for the DCAR Platform.

## Table of Contents

1. [Quick Links](#quick-links)
2. [Getting Started](#getting-started)
3. [Key Technologies](#key-technologies)
4. [Project Structure](#project-structure)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)
7. [Resources](#resources)

## Quick Links

### Documentation

| Document | When to Read |
|----------|-------------|
| [QUICK_START.md](./QUICK_START.md) | First time setup |
| [README.md](./README.md) | Project overview |
| [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md) | Understanding the system |
| [UPSTASH_SETUP.md](./UPSTASH_SETUP.md) | Redis configuration |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Before going live |
| [FILE_INVENTORY.md](./FILE_INVENTORY.md) | Understanding all files |

### Code Locations

| Task | File |
|------|------|
| View products | `lib/redis-products.ts` |
| View submissions | `lib/redis-submissions.ts` |
| Redis operations | `lib/upstash-storage.ts` |
| Product inquiry | `components/ProductInquiryForm.tsx` |
| Admin access | `app/admin/page.tsx` |

### External Links

- [Upstash Console](https://console.upstash.io)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Repository](https://github.com)
- [Next.js Docs](https://nextjs.org/docs)

## Getting Started

### First Time Setup

\`\`\`bash
# 1. Clone and install
git clone <repo> && cd dcar-platform && npm install

# 2. Add credentials to .env.local (from Upstash & Vercel)
# Copy from UPSTASH_SETUP.md

# 3. Run locally
npm run dev

# 4. Test
# - Visit http://localhost:3000
# - Go to /admin with your code
\`\`\`

### For Existing Team Members

\`\`\`bash
# Get latest code
git pull

# Install any new dependencies
npm install

# Add .env.local (get from team lead)
# Never commit this file!

# Run locally
npm run dev
\`\`\`

## Key Technologies

### Frontend
- **Next.js 16**: React framework with serverless functions
- **React 19.2**: UI library
- **Tailwind CSS v4**: Styling framework
- **shadcn/ui**: Pre-built components
- **TypeScript**: Type-safe JavaScript

### Backend Storage
- **Upstash Redis**: Fast data store (sub-millisecond)
- **Vercel Blob**: File/image storage

### Deployment
- **Vercel**: Hosting platform (auto-deploys on git push)
- **GitHub**: Code repository

## Project Structure

\`\`\`
dcar-platform/
├── app/                       # Next.js pages & API routes
│   ├── page.tsx              # Home page
│   ├── cars/                 # Car pages
│   ├── admin/                # Admin panel
│   ├── api/                  # Serverless APIs
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   └── [custom]              # Custom components
├── lib/                       # Utilities & data layer
│   ├── upstash-storage.ts    # Redis operations
│   ├── redis-products.ts     # Product operations
│   ├── redis-submissions.ts  # Submission operations
│   └── types.ts              # TypeScript types
├── public/                    # Static files
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.mjs           # Next.js config
└── README.md                 # Main documentation
\`\`\`

## Common Tasks

### Add a Product (Programmatically)

\`\`\`typescript
import { saveProduct } from "@/lib/redis-products"

const newProduct = await saveProduct({
  name: "2023 Tesla Model 3",
  brand: "Tesla",
  year: 2023,
  price: 45000,
  mileage: 5000,
  condition: "excellent",
  fuel: "electric",
  transmission: "automatic",
  description: "Pristine condition, fully loaded",
  images: ["https://url-to-image.jpg"],
})
\`\`\`

### Get All Products

\`\`\`typescript
import { getProducts } from "@/lib/redis-products"

const products = await getProducts()
console.log(products) // Array of all products
\`\`\`

### Get All Submissions

\`\`\`typescript
import { getSubmissions } from "@/lib/redis-submissions"

const inquiries = await getSubmissions("inquiry")
const newsletters = await getSubmissions("newsletter")
const uploads = await getSubmissions("file-upload")
const all = await getSubmissions() // All submissions
\`\`\`

### Update Submission Status

\`\`\`typescript
import { updateSubmissionStatus } from "@/lib/redis-submissions"

await updateSubmissionStatus("inquiry-12345", "read")
// Status: "new" | "read" | "resolved"
\`\`\`

### Store Data in Redis

\`\`\`typescript
import { setData, getData, deleteData } from "@/lib/upstash-storage"

// Save
await setData("user:123", { name: "John", email: "john@example.com" })

// Retrieve
const user = await getData("user:123")

// Delete
await deleteData("user:123")
\`\`\`

### Call Admin API (Frontend)

\`\`\`typescript
// Get products
const res = await fetch("/api/admin/products", {
  headers: { "x-admin-code": "mysecretcode123" }
})

// Create product
const res = await fetch("/api/admin/products", {
  method: "POST",
  headers: { "x-admin-code": "mysecretcode123" },
  body: JSON.stringify({ name: "Car", price: 30000, ... })
})
\`\`\`

## Troubleshooting

### Redis Connection Error
\`\`\`
Error: Connection refused / Unauthorized
\`\`\`
**Solution**:
- Check `KV_REST_API_URL` in `.env.local`
- Verify token is correct from Upstash
- Try regenerating token in Upstash console

### Blob Upload Failed
\`\`\`
Error: Unauthorized / Failed to upload
\`\`\`
**Solution**:
- Check `BLOB_READ_WRITE_TOKEN` in `.env.local`
- Verify in Vercel project settings
- Ensure file size < 50MB

### Admin Access Denied
\`\`\`
Error: Unauthorized
\`\`\`
**Solution**:
- Verify `ADMIN_ACCESS_CODE` header is sent
- Check value matches `.env.local`
- No spaces or typos in code

### Build Error
\`\`\`
Error: Cannot find module '@upstash/redis'
\`\`\`
**Solution**:
\`\`\`bash
npm install
npm run dev
\`\`\`

### Data Not Showing
\`\`\`
No products/submissions visible
\`\`\`
**Solution**:
- Check Upstash dashboard - verify data exists
- Review request in browser DevTools
- Check for JavaScript errors in console

## Environment Variables Reference

### Redis (Upstash)

\`\`\`bash
# REST API (recommended)
KV_REST_API_URL=https://your-instance.upstash.io
KV_REST_API_TOKEN=token_...
KV_REST_API_READ_ONLY_TOKEN=token_readonly_...

# Direct Connection (alternative)
KV_URL=rediss://default:token@instance.upstash.io:6379
REDIS_URL=rediss://default:token@instance.upstash.io:6379
\`\`\`

### File Storage (Vercel)

\`\`\`bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
\`\`\`

### Admin Access

\`\`\`bash
ADMIN_ACCESS_CODE=your_secret_code_min_8_chars
\`\`\`

## Performance Tips

### Optimize Data Fetching

\`\`\`typescript
// Instead of fetching all products then filtering
const allProducts = await getProducts()
const expensive = allProducts.filter(p => p.price > 50000)

// Consider storing filtered data separately
// Or add search/filter to API
\`\`\`

### Cache Frequently Accessed Data

\`\`\`typescript
// Set with expiration
await setData("cache:products", products, 300) // 5 min expiry
\`\`\`

### Batch Operations

\`\`\`typescript
// Instead of multiple calls
for (const id of ids) {
  await getData(id)  // Slow - n requests
}

// Use Promise.all
const promises = ids.map(id => getData(id))
const results = await Promise.all(promises)  // Faster
\`\`\`

## Security Checklist

Before deploying:

- [ ] `ADMIN_ACCESS_CODE` is 16+ characters
- [ ] No credentials in `.env.example`
- [ ] `.env.local` is in `.gitignore`
- [ ] All form inputs validated
- [ ] File uploads have size limits
- [ ] File types are validated
- [ ] Error messages don't leak info
- [ ] Redis token not exposed

## Monitoring

### Check Upstash Health
\`\`\`
https://console.upstash.io → Select DB → Logs Tab
\`\`\`

### Check Vercel Deployment
\`\`\`
https://vercel.com → Project → Deployments
\`\`\`

### Monitor Performance
\`\`\`
https://vercel.com → Project → Analytics
\`\`\`

## Useful Commands

\`\`\`bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Production
vercel                   # Deploy to Vercel
vercel env:pull          # Get Vercel env vars locally
\`\`\`

## Deployment Steps

1. **Local Testing**: `npm run dev` → Test all features
2. **Push Code**: `git add . && git commit -m "message" && git push`
3. **Monitor Build**: Check Vercel dashboard
4. **Verify Production**: Visit live URL
5. **Check Data**: Verify in Upstash dashboard

## Important Notes

### Never

- ❌ Commit `.env.local`
- ❌ Share `ADMIN_ACCESS_CODE` publicly
- ❌ Use weak admin codes
- ❌ Remove error handling
- ❌ Store secrets in comments

### Always

- ✅ Use environment variables for secrets
- ✅ Validate user input
- ✅ Test before deploying
- ✅ Monitor production health
- ✅ Keep docs updated

## Getting Help

### Documentation

- [README.md](./README.md) - Project overview
- [QUICK_START.md](./QUICK_START.md) - Quick setup
- [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md) - Deep dive

### External Resources

- [Upstash Docs](https://upstash.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Redis Docs](https://redis.io/docs)

### Issues

- Create GitHub issue
- Check existing issues first
- Include error message & steps to reproduce

## Quick Reference Table

| What | Where | How |
|------|-------|-----|
| Add Product | Admin panel | `/admin/products/new` |
| View Submissions | Admin panel | `/admin/submissions` |
| Browse Products | Home | `/` or `/cars` |
| Submit Inquiry | Product page | Inquiry form |
| Upload File | Product page | File form |
| Check Data | Upstash | Console → Database → Logs |
| Deploy | Vercel | Git push to main |

## Credits & Resources

**Built with**:
- Next.js by Vercel
- Redis by Upstash
- shadcn/ui by Shadcn
- Tailwind CSS by Tailwind Labs

**Hosted on**:
- Vercel (Frontend & Serverless)
- Upstash (Database)

---

**Last Updated**: January 17, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

**Need help?** Check the docs or create an issue!
