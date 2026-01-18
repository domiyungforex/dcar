# DCAR Deployment Guide

Complete step-by-step guide to deploying DCAR to production.

## Quick Deploy (5 minutes)

### 1. Setup Vercel Project

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel
\`\`\`

Follow prompts to create new project and deploy.

### 2. Add Vercel Integrations

**In Vercel Dashboard:**

1. Go to Project > Settings > Integrations
2. Connect Vercel Blob
3. Connect Vercel KV
4. Copy tokens to environment variables

### 3. Set Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

\`\`\`
BLOB_READ_WRITE_TOKEN = [from step 2]
KV_REST_API_URL = [from step 2]
KV_REST_API_TOKEN = [from step 2]
ADMIN_PASSWORD = [create strong password]
NODE_ENV = production
\`\`\`

### 4. Redeploy

\`\`\`bash
vercel --prod
\`\`\`

## Production Checklist

- [ ] Environment variables configured
- [ ] Vercel Blob enabled
- [ ] Vercel KV enabled
- [ ] ADMIN_PASSWORD changed from default
- [ ] Domain configured (custom or vercel.app)
- [ ] HTTPS enabled (automatic)
- [ ] Error tracking enabled (optional)
- [ ] Analytics enabled (optional)

## Scaling Considerations

**Vercel Blob:**
- 1000 GB/month free tier
- Auto-scales with demand
- Geographic distribution

**Vercel KV:**
- 3000 requests/day free tier
- Great for small to medium apps
- For higher traffic, consider PostgreSQL

## Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Compute | ✓ | $0 |
| Vercel Blob | 1000GB | $0 |
| Vercel KV | 3000 req/day | $0 |
| Custom Domain | - | ~$12 |
| **Total** | | ~$12 |

## Custom Domain Setup

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records with Vercel's nameservers
4. Wait for DNS propagation (24-48 hours)

## Performance Monitoring

**Enable in Vercel Dashboard:**

- Web Analytics (free)
- Vercel Speed Insights (free)
- Error tracking via Sentry (optional)

**Monitor:**
- Load times
- API latency
- Error rates
- Traffic patterns

## Backup Strategy

**Vercel KV:**
- Daily backups (included)
- Restore from dashboard if needed

**Images (Blob):**
- Consider exporting list monthly
- Store metadata separately if critical

## Maintenance

### Regular Tasks

- Monitor error logs
- Check analytics
- Update dependencies monthly
- Review security logs

### Update Process

\`\`\`bash
# Check for updates
npm outdated

# Update packages
npm update

# Test locally
npm run dev

# Deploy
vercel --prod
\`\`\`

## Troubleshooting Deployment

### Build Fails
\`\`\`bash
# Clear cache and rebuild
vercel --prod --force
\`\`\`

### Environment Variables Not Working
1. Verify in Vercel Dashboard
2. Check format (no quotes needed)
3. Redeploy after changes

### Images Not Loading
- Check Vercel Blob token
- Verify blob URLs in KV
- Check image paths

### Performance Issues
- Check Vercel analytics
- Review slow queries
- Increase KV capacity if needed

## Rollback

\`\`\`bash
# See deployment history
vercel list

# Rollback to previous
vercel rollback
\`\`\`

## Security Hardening

For production, consider:

\`\`\`typescript
// 1. Add rate limiting to admin endpoints
// 2. Implement IP whitelist for admin
// 3. Add request signing
// 4. Enable WAF rules
// 5. Monitor for suspicious activity
\`\`\`

See `app/api/` for current endpoints to protect.

## Migration from Development

1. **Export data:**
   - Get car list from development KV
   - Download images from development Blob

2. **Import to production:**
   - Use admin panel to re-add cars
   - Upload images again

3. **Verify:**
   - Test all functionality
   - Check links
   - Verify search/filters

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
