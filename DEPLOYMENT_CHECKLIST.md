# Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment Setup

### Step 1: Local Testing

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env.local` with all required variables
- [ ] Run `npm run dev`
- [ ] Test home page loads
- [ ] Test product listing page
- [ ] Test car detail page

### Step 2: Test Admin Panel (Local)

- [ ] Navigate to `/admin`
- [ ] Enter ADMIN_ACCESS_CODE
- [ ] Access admin dashboard
- [ ] View products page
- [ ] Create a test product
- [ ] Upload test images
- [ ] View submissions
- [ ] Test file manager

### Step 3: Test Public Forms (Local)

- [ ] Test product inquiry form
  - [ ] Submit with all fields
  - [ ] Verify submission appears in admin
- [ ] Test newsletter signup
  - [ ] Submit email
  - [ ] Verify in submissions
- [ ] Test file upload
  - [ ] Upload document
  - [ ] Verify in file manager
  - [ ] Check Vercel Blob storage

### Step 4: Upstash Setup

- [ ] Create Upstash account
- [ ] Create Redis database
- [ ] Copy API credentials:
  - [ ] `KV_REST_API_URL`
  - [ ] `KV_REST_API_TOKEN`
  - [ ] `KV_REST_API_READ_ONLY_TOKEN`
  - [ ] `KV_URL` or `REDIS_URL`
- [ ] Test connection locally with credentials
- [ ] Verify in Upstash dashboard

### Step 5: Vercel Blob Setup

- [ ] Go to Vercel project > Storage > Blob
- [ ] Create Blob storage
- [ ] Copy `BLOB_READ_WRITE_TOKEN`
- [ ] Add to `.env.local`
- [ ] Test file upload locally

### Step 6: GitHub Setup

- [ ] Push code to GitHub
- [ ] Create `.env.example` with all variables
- [ ] Verify no `.env.local` is committed
- [ ] Check `.gitignore` includes:
  \`\`\`
  .env.local
  .env
  node_modules/
  .next/
  \`\`\`

## Vercel Deployment

### Step 7: Create Vercel Project

- [ ] Go to https://vercel.com
- [ ] Click "Add New Project"
- [ ] Select your GitHub repository
- [ ] Choose "Next.js" framework
- [ ] Accept default settings
- [ ] Click "Deploy"

### Step 8: Add Environment Variables

After project creates, add environment variables:

**Go to**: Project Settings > Environment Variables

**Add each variable**:

\`\`\`
KV_REST_API_URL        = https://your-instance.upstash.io
KV_REST_API_TOKEN      = your_token_here
KV_REST_API_READ_ONLY_TOKEN = your_readonly_token
KV_URL                 = rediss://default:token@instance:6379
REDIS_URL              = rediss://default:token@instance:6379
BLOB_READ_WRITE_TOKEN  = vercel_blob_rw_...
ADMIN_ACCESS_CODE      = your_secret_code
NODE_ENV               = production
\`\`\`

- [ ] Verify all 8 variables are added
- [ ] Click "Save"

### Step 9: Trigger Redeploy

- [ ] Go to "Deployments" tab
- [ ] Click "Redeploy" on latest deployment
- [ ] Wait for deployment to complete
- [ ] Verify no build errors

### Step 10: Test Production

- [ ] Visit your production URL
- [ ] Verify home page loads
- [ ] Check products display
- [ ] Test `/admin` access with code
- [ ] Create test product
- [ ] Submit test inquiry
- [ ] Verify data in Upstash dashboard

## Post-Deployment

### Step 11: Monitoring

- [ ] Set up Upstash alerts
  - [ ] Alert on high latency
  - [ ] Alert on quota exceeded
  - [ ] Alert on connection errors
- [ ] Check Vercel Analytics
  - [ ] Monitor API performance
  - [ ] Watch for errors
  - [ ] Track usage

### Step 12: Verify Data Storage

- [ ] Check Upstash dashboard
  - [ ] Verify data is being stored
  - [ ] Check storage usage
  - [ ] Review command history
- [ ] Check Vercel Blob
  - [ ] Verify uploads are stored
  - [ ] Check storage usage

### Step 13: Set Admin Password

- [ ] Change `ADMIN_ACCESS_CODE` to a strong value
- [ ] Update in Vercel environment variables
- [ ] Share secure code with team
- [ ] Document access procedure

### Step 14: Backup & Recovery

- [ ] Enable Upstash backups (if Pro plan)
- [ ] Document recovery procedure
- [ ] Test recovery process
- [ ] Document contact info for emergency

## Security Verification

### Step 15: Security Checklist

- [ ] No credentials in `.env.example`
- [ ] No credentials in README
- [ ] `.gitignore` prevents `.env` commits
- [ ] Admin code is strong (min 16 chars)
- [ ] All API endpoints verify admin code
- [ ] File uploads validate type & size
- [ ] Form inputs validated server-side
- [ ] Error messages don't leak information

### Step 16: HTTPS & SSL

- [ ] Verify site loads over HTTPS
- [ ] Check SSL certificate is valid
- [ ] Verify browser shows "Secure"
- [ ] Test all links use HTTPS

## Performance Verification

### Step 17: Performance Metrics

- [ ] Home page loads < 2s
- [ ] Admin dashboard loads < 1s
- [ ] Product save < 500ms
- [ ] Submission retrieval < 500ms
- [ ] File upload shows progress
- [ ] No 404 or 500 errors

### Step 18: Load Testing

- [ ] Simulate 10 concurrent users
- [ ] Verify performance stays < 2s
- [ ] Check error rates (should be 0%)
- [ ] Monitor Upstash metrics
- [ ] Monitor Vercel metrics

## Final Checks

### Step 19: Functionality Verification

- [ ] Create 5 test products
- [ ] Submit 3 test inquiries
- [ ] Upload 2 test files
- [ ] Sign up 1 test newsletter
- [ ] Verify all appear in admin
- [ ] Verify can edit products
- [ ] Verify can delete products
- [ ] Verify can mark submissions as read
- [ ] Verify can delete submissions

### Step 20: Documentation

- [ ] Update README with production URL
- [ ] Document admin access code (share securely)
- [ ] Document team access procedure
- [ ] Create admin user guide
- [ ] Create troubleshooting guide
- [ ] Document monitoring procedure

## Launch Readiness

### Step 21: Pre-Launch Review

- [ ] All tests pass
- [ ] Performance acceptable
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Team trained
- [ ] Support plan ready
- [ ] Analytics tracking working

### Step 22: Go Live

- [ ] Update DNS (if custom domain)
- [ ] Send announcement
- [ ] Monitor first 24 hours closely
- [ ] Respond to any issues
- [ ] Collect feedback

## Post-Launch (First Week)

- [ ] Monitor error rates daily
- [ ] Monitor performance metrics daily
- [ ] Check Upstash quota usage
- [ ] Check Blob storage growth
- [ ] Respond to user feedback
- [ ] Fix any critical issues
- [ ] Document lessons learned

## Post-Launch (First Month)

- [ ] Weekly monitoring review
- [ ] Check storage trends
- [ ] Optimize slow queries if needed
- [ ] Update documentation
- [ ] Plan improvements
- [ ] Review analytics
- [ ] Consider optimization opportunities

## Rollback Plan

If critical issues occur:

1. **Immediate**: Notify users of downtime
2. **Revert Vercel**: Go to Deployments, click "Rollback" on previous version
3. **Check Status**: Verify old version working
4. **Investigate**: Review error logs in Upstash
5. **Fix**: Address issue in code
6. **Redeploy**: Push fix and redeploy

**Estimated rollback time**: 30 seconds

## Support Contacts

| Issue | Contact | Response Time |
|-------|---------|----------------|
| Redis down | Upstash support | 15 min |
| Blob storage | Vercel support | 1 hour |
| Deployment | Vercel support | 15 min |
| Code bugs | Your team | Immediate |

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Notes**: ___________

Mark checklist items with ✓ as you complete them!
