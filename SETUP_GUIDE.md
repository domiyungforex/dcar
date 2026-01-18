# DCAR Setup Guide

## Complete Step-by-Step Installation

### Step 1: Prerequisites

Ensure you have:
- Node.js 18 or higher (`node --version`)
- npm or yarn
- GitHub account (optional, for deployment)
- Vercel account (free tier is fine)

### Step 2: Get Vercel Blob Token

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select or create a project
3. Go to **Settings > Storage**
4. Click **Create Database > Blob**
5. Name it (e.g., "dcar-storage")
6. Copy the `BLOB_READ_WRITE_TOKEN`
7. Save it securely (you'll need it in Step 4)

### Step 3: Clone or Create Project

**Option A: Clone from GitHub**
\`\`\`bash
git clone https://github.com/yourusername/dcar.git
cd dcar
\`\`\`

**Option B: Start from scratch**
\`\`\`bash
npx create-next-app@latest dcar --typescript --tailwind
cd dcar
\`\`\`

Then copy the provided files into your project.

### Step 4: Install Dependencies

\`\`\`bash
npm install
\`\`\`

This installs all required packages including:
- Next.js 16
- React 19
- Tailwind CSS
- shadcn/ui components
- Vercel Blob SDK

**Dependencies removed** (not needed for this streamlined approach):
- ~~Express.js~~ (using Next.js serverless)
- ~~MongoDB/Mongoose~~ (using Vercel Blob)
- ~~Bcrypt~~ (no user auth)
- ~~JWT~~ (no sessions needed)
- ~~Cloudinary~~ (using Vercel Blob)

### Step 5: Configure Environment Variables

1. Create `.env.local` in project root:

\`\`\`bash
# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx

# Admin Panel Access
ADMIN_ACCESS_CODE=my-secret-code-change-this
\`\`\`

2. Replace values:
   - `vercel_blob_rw_xxxxxxxxxxxxx` → Token from Step 2
   - `my-secret-code-change-this` → Your own access code (any string)

### Step 6: Run Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` in your browser.

**What you should see:**
- Home page with hero section
- Featured products area
- Navigation menu

### Step 7: Test Admin Panel

1. Go to `http://localhost:3000/admin`
2. Enter your **Admin Access Code** (from Step 5)
3. You should see the admin dashboard with:
   - Products section
   - Submissions section
   - Files section

### Step 8: Test Forms

#### Create a Test Product
1. In admin panel, click **Products > Add Product**
2. Fill in details (all fields required)
3. Click **Create Product**
4. Return to Products list to verify

#### Test Inquiry Form
1. On home page, find a product
2. Click on it to see details
3. Fill in inquiry form
4. Submit
5. Check admin panel > Submissions to see the inquiry

#### Test Newsletter Signup
1. Scroll to footer
2. Enter email in newsletter form
3. Submit
4. Check admin panel > Submissions > Newsletter tab

### Step 9: Deploy to Vercel

**Option A: Use Vercel Git Integration (Easiest)**

1. Push your code to GitHub:
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New > Project**
4. Select your GitHub repository
5. **Environment Variables**: Add
   - `BLOB_READ_WRITE_TOKEN` = your token
   - `ADMIN_ACCESS_CODE` = your code
6. Click **Deploy**

**Option B: Deploy from CLI**

\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

Follow prompts to link project and add environment variables.

### Step 10: Customize for Your Use Case

#### Update Branding

**Colors** (`app/globals.css`):
\`\`\`css
:root {
  --primary: oklch(0.2 0 0);        /* Change this */
  --accent: oklch(0.55 0.2 40);     /* And this */
  /* ... */
}
\`\`\`

**Text** (`app/page.tsx`):
- Update hero title
- Update meta description in `app/layout.tsx`

**Logo**: Replace favicon in `public/icon.svg`

#### Add Your Forms

Add the pre-built components to any page:

\`\`\`tsx
import ProductInquiryForm from "@/components/ProductInquiryForm"
import NewsletterForm from "@/components/NewsletterForm"
import FileUploadForm from "@/components/FileUploadForm"

export default function MyPage() {
  return (
    <div>
      <ProductInquiryForm productId="prod-123" />
      <NewsletterForm />
      <FileUploadForm />
    </div>
  )
}
\`\`\`

#### Add More Product Fields

Edit `lib/product-storage.ts`:
\`\`\`typescript
export interface Product {
  // ... existing fields ...
  warranty?: string        // Add new field
  serviceHistory?: string  // Add new field
}
\`\`\`

Update the form in `app/admin/products/new/page.tsx`:
\`\`\`tsx
<input
  type="text"
  name="warranty"
  placeholder="e.g., 2 years"
/>
\`\`\`

#### Add Admin-Only Pages

1. Create new route in `/admin`
2. Verify code with:
\`\`\`tsx
import { getAdminCode } from "@/lib/admin-helpers"

export default function MyAdminPage() {
  const code = getAdminCode()
  if (!code) return <AdminCodeEntry />
  // ... page content ...
}
\`\`\`

### Troubleshooting

#### "Cannot find module '@vercel/blob'"
\`\`\`bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### Admin code verification fails
- Check `.env.local` has correct `ADMIN_ACCESS_CODE`
- Restart dev server after changing .env
- Clear browser cache/localStorage

#### Forms not submitting
1. Check browser console for errors
2. Verify API route exists at `/api/submissions/`
3. Check Vercel Blob token is valid
4. Verify CORS is not blocking requests

#### Blob storage not working on production
- Ensure `BLOB_READ_WRITE_TOKEN` is set in Vercel project settings
- Don't commit `.env.local` to git
- Use Vercel's environment variable UI

#### Can't see uploaded files
- Check admin > Files section
- Verify file size < 50MB
- Check browser console for upload errors

### Next Features to Add

**1. Email Notifications**
\`\`\`bash
npm install resend
# Set RESEND_API_KEY in environment
\`\`\`

**2. Payment Integration (Stripe)**
\`\`\`bash
npm install @stripe/react-js
# Add STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY
\`\`\`

**3. Search Functionality**
- Add search box on products page
- Filter by brand, year, price

**4. User Accounts** (if needed)
- Consider adding Supabase Auth
- Or simple form-based verification

**5. Advanced Analytics**
- Install Vercel Analytics
- Track form submissions and user behavior

### Performance Optimization

**Caching**
- Static generation: Add `export const revalidate = 60`
- Incremental updates: Products update cache on change

**Images**
- Use Next.js Image component
- Optimize product images before uploading
- WebP format recommended

**Database Queries**
- Submissions list filtered client-side
- Products fetched once on page load
- Implement search indexing if 1000+ products

### Security Checklist

- [ ] Change `ADMIN_ACCESS_CODE` from default
- [ ] Never commit `.env.local` to git
- [ ] Use HTTPS in production (automatic on Vercel)
- [ ] Validate all form inputs (already done)
- [ ] Monitor Blob storage for unusual activity
- [ ] Regular backups of important submissions

### Need Help?

- Check GitHub Issues
- Review code comments in `/lib` folder
- Consult Next.js docs: https://nextjs.org/docs
- Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob

---

**You're all set!** Your DCAR platform is ready. Start selling products and managing inquiries. 🚀
