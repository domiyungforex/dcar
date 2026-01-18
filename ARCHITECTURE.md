# DCAR E-Commerce Platform - Architecture Documentation

## Overview

A streamlined, authentication-free e-commerce platform for managing products, customer inquiries, and file uploads using Vercel Blob for storage and serverless functions for processing.

## Technology Stack

- **Frontend**: Next.js 16 (App Router) with React
- **Storage**: Vercel Blob (all data and file management)
- **Serverless**: Next.js API Routes
- **Styling**: Tailwind CSS v4 with shadcn/ui
- **Access Control**: Simple code-based session storage (no auth library)

## Key Features

### 1. Product Management (Admin Only - Code Protected)
- Create, read, update, delete products
- Upload and manage product images
- Store all data as JSON in Vercel Blob
- Products stored in `products/` directory

### 2. Form Submissions
- Product inquiries with customer details
- Newsletter signup
- File uploads from customers
- All submissions stored as JSON in `submissions/` directory

### 3. File Management (Admin Only)
- Browse all uploaded files
- View file metadata (size, date, type)
- Delete files
- Files stored in `uploads/` directory

### 4. Admin Panel
- Code-based access (no authentication)
- Access code stored in browser session only
- Dashboard with quick navigation
- Submission management with status tracking
- File manager with storage statistics

## Directory Structure

\`\`\`
app/
├── admin/
│   ├── page.tsx                 # Admin dashboard
│   ├── submissions/
│   │   └── page.tsx            # View form submissions
│   ├── files/
│   │   └── page.tsx            # File manager
│   └── products/
│       ├── page.tsx            # Product listing
│       ├── new/
│       │   └── page.tsx        # Create product
│       └── [id]/
│           └── page.tsx        # Edit product
├── api/
│   ├── submissions/
│   │   ├── inquiry/route.ts    # Product inquiry API
│   │   ├── newsletter/route.ts # Newsletter signup API
│   │   └── file-upload/route.ts # File upload API
│   └── admin/
│       ├── verify-code/route.ts      # Verify access code
│       ├── submissions/route.ts      # Get/update submissions
│       ├── files/route.ts            # List/delete files
│       ├── products/route.ts         # Product CRUD
│       └── products/[id]/
│           └── upload-image/route.ts # Upload product images
└── (public pages)
    ├── page.tsx               # Home page
    └── ...

lib/
├── blob-storage.ts          # Low-level Blob operations
├── data-storage.ts          # Submission storage
├── product-storage.ts       # Product storage
└── admin-helpers.ts         # Admin session management

components/
├── ProductInquiryForm.tsx   # Inquiry form
├── NewsletterForm.tsx       # Newsletter form
├── FileUploadForm.tsx       # File upload form
└── AdminCodeEntry.tsx       # Admin code entry
\`\`\`

## Data Storage Structure

### Vercel Blob Directories

\`\`\`
/products/
  ├── prod-xxx-1.json         # Product data
  ├── prod-xxx-2.json
  └── prod-xxx-1/
      ├── image1.jpg          # Product images
      └── image2.jpg

/submissions/
  ├── inquiry-xxx-1.json      # Inquiry submissions
  ├── newsletter-xxx-1.json   # Newsletter signups
  └── file-upload-xxx-1.json  # File upload records

/uploads/
  ├── 1234567890-file1.pdf    # Customer uploaded files
  ├── 1234567890-file2.docx
  └── ...
\`\`\`

## API Endpoints

### Public Endpoints (No Auth)

- `POST /api/submissions/inquiry` - Submit product inquiry
- `POST /api/submissions/newsletter` - Subscribe to newsletter
- `POST /api/submissions/file-upload` - Upload customer file

### Admin Endpoints (Code-Protected)

All admin endpoints require `x-admin-code` header with correct code.

- `POST /api/admin/verify-code` - Verify access code
- `GET /api/admin/submissions?type=[type]` - List submissions
- `PATCH /api/admin/submissions` - Update submission status
- `DELETE /api/admin/submissions` - Delete submission
- `GET /api/admin/files?category=uploads` - List files
- `DELETE /api/admin/files` - Delete file
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products` - Update product
- `DELETE /api/admin/products` - Delete product
- `POST /api/admin/products/[id]/upload-image` - Upload product image

## Access Control

### Admin Panel Access

1. Navigate to `/admin`
2. Enter access code (from `ADMIN_ACCESS_CODE` environment variable)
3. Code is stored in browser session storage only
4. Code is cleared when browser is closed

No persistent authentication, passwords, or database records needed.

## Environment Variables

\`\`\`bash
# Required
BLOB_READ_WRITE_TOKEN=          # Vercel Blob API token

# Admin
ADMIN_ACCESS_CODE=secret123     # Simple access code for admin panel

# Optional
ADMIN_NOTIFICATION_EMAIL=       # Email for notifications (future feature)
\`\`\`

## Security Considerations

- Access code is simple and URL-based, suitable for internal/personal use
- For production with sensitive data, consider upgrading to proper authentication
- File uploads are limited to 50MB
- All data stored in Vercel Blob is immutable and versioned
- Session storage clears when browser closes

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Configure Vercel Blob integration (one click)
4. Deploy automatically on git push

### Environment Variables to Add

\`\`\`
BLOB_READ_WRITE_TOKEN = [Copy from Vercel Blob dashboard]
ADMIN_ACCESS_CODE = [Set your own secure code]
\`\`\`

## Scaling Considerations

- Vercel Blob handles unlimited files and data
- API routes scale automatically
- No database bottlenecks
- JSON file operations are fast for typical e-commerce volumes
- For millions of submissions, consider migrating to database

## Future Enhancements

- Email notifications for new submissions
- Dashboard analytics and statistics
- Advanced product filtering
- Payment integration (Stripe)
- Customer accounts and order history
- Product reviews and ratings
- Inventory management
\`\`\`

\`\`\`env.local file=".env.local"
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token_here

# Admin Access
ADMIN_ACCESS_CODE=secret123

# Optional Email Notifications
ADMIN_NOTIFICATION_EMAIL=admin@example.com
