# Upstash Redis Setup Guide

## Quick Start

### 1. Create Free Upstash Account

- Visit: https://console.upstash.io
- Sign up with GitHub/Google/Email
- Free tier includes:
  - 10GB storage
  - 10,000 commands/day
  - 1 database

### 2. Create Redis Database

1. Click "Create Database"
2. Choose "Redis"
3. Select Region (pick closest to your app)
4. Select Plan ("Free" for testing, "Pay as you go" for production)
5. Click "Create"

### 3. Get Connection Credentials

In your database details, you'll see:

\`\`\`
Endpoint:     https://your-instance.upstash.io
Token:        your_read_write_token
Read Token:   your_read_only_token
Redis URL:    rediss://default:token@instance.upstash.io:6379
\`\`\`

### 4. Add to Your Project

#### For Local Development

Create `.env.local`:

\`\`\`bash
KV_REST_API_URL=https://your-instance.upstash.io
KV_REST_API_TOKEN=your_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token
KV_URL=rediss://default:token@instance.upstash.io:6379
REDIS_URL=rediss://default:token@instance.upstash.io:6379
\`\`\`

#### For Vercel Production

1. Go to Vercel Project Settings
2. Click "Environment Variables"
3. Add each variable individually:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`
   - `REDIS_URL`
4. Deploy!

## Usage Examples

### Using the Storage Layer

\`\`\`typescript
import { setData, getData, deleteData } from "@/lib/upstash-storage"

// Save data
await setData("user:123", { name: "John", email: "john@example.com" })

// Retrieve data
const user = await getData("user:123")

// Delete data
await deleteData("user:123")

// List all keys matching pattern
const keys = await listKeys("user:*")
\`\`\`

### Using Submissions

\`\`\`typescript
import { saveSubmission, getSubmissions } from "@/lib/redis-submissions"

// Save inquiry
const inquiry = await saveSubmission("inquiry", "customer@example.com", {
  productId: "prod-123",
  message: "Interested in this car",
})

// Fetch all inquiries
const allInquiries = await getSubmissions("inquiry")

// Fetch all submissions (all types)
const all = await getSubmissions()
\`\`\`

### Using Products

\`\`\`typescript
import { saveProduct, getProducts, getProduct } from "@/lib/redis-products"

// Create product
const product = await saveProduct({
  name: "2023 Tesla Model 3",
  brand: "Tesla",
  year: 2023,
  price: 45000,
  // ... other fields
})

// Fetch all products
const allProducts = await getProducts()

// Get single product
const product = await getProduct("prod-123")
\`\`\`

## Monitoring & Analytics

### Upstash Dashboard

- **Logs Tab**: See all requests in real-time
- **Insights Tab**: Usage analytics and statistics
- **Settings Tab**: Upgrade plan, rotate tokens
- **Backups Tab**: Automatic daily backups (paid plans)

### Key Metrics

Track in your application:

\`\`\`typescript
// Monitor API latency
const start = Date.now()
const data = await getData("key")
const latency = Date.now() - start
console.log(`Query took ${latency}ms`)

// Count operations
let operationCount = 0
operationCount++ // for each Redis operation
\`\`\`

## Rate Limits & Quotas

### Free Plan
- 10GB storage
- 10,000 commands/day
- 1 request/second max
- 7-day retention

### Pro Plan ($15/mo)
- Unlimited storage
- Unlimited commands
- 10 requests/second
- Unlimited retention
- Daily backups

### Business Plan
- All Pro features
- Custom rate limits
- Priority support
- SLA guarantee

## Security Best Practices

1. **Rotate Tokens Regularly**
   - Go to Settings > Regenerate Token
   - Update `.env` files
   - Restart applications

2. **Use Read-Only Token Where Possible**
   - Use `KV_REST_API_READ_ONLY_TOKEN` for read operations
   - Use full token only for writes

3. **Keep Tokens Secret**
   - Never commit to git
   - Use `.env.local` for local development
   - Use Vercel's environment variables for production

4. **Monitor Upstash Logs**
   - Check for suspicious activity
   - Review error patterns
   - Monitor unusual request volumes

## Troubleshooting

### "403 Unauthorized" Error

\`\`\`
Error: Unauthorized (redis status reply)
\`\`\`

**Solution**:
- Verify token in `.env` is correct
- Check token hasn't been revoked
- Regenerate new token in Upstash console
- Ensure token has read-write permissions

### "Connection Timeout"

\`\`\`
Error: Connection timeout
\`\`\`

**Solution**:
- Check internet connection
- Verify Upstash service is up (check status.upstash.com)
- Use closest region to your app
- Check firewall isn't blocking Redis

### "Database in Cooldown"

\`\`\`
Warning: Database in cooldown mode
\`\`\`

**Solution**:
- Free tier databases pause after 7 days of inactivity
- Upgrade to Pro plan for 24/7 availability
- Or wait for automatic wake-up (takes ~30 seconds)

### High Latency

**Solution**:
1. Select region closest to your app location
2. Upgrade to Pro plan for better resources
3. Batch multiple operations together
4. Use pipelining if using Redis directly

## Migration from Other Services

### From Redis Cloud

\`\`\`bash
# Old credentials
REDIS_URL=rediss://old-instance.redis.com:6380

# New Upstash credentials
REDIS_URL=rediss://default:token@instance.upstash.io:6379
\`\`\`

### From AWS ElastiCache

\`\`\`bash
# Update connection string to Upstash REST API
KV_REST_API_URL=https://instance.upstash.io
KV_REST_API_TOKEN=token
\`\`\`

## Performance Optimization

### Caching Strategy

\`\`\`typescript
// Cache product list for 5 minutes
const CACHE_TTL = 300

const cachedProducts = await getData("products:cache")
if (!cachedProducts) {
  const products = await fetchFromDatabase()
  await setData("products:cache", { products }, CACHE_TTL)
  return products
}
return cachedProducts
\`\`\`

### Batch Operations

\`\`\`typescript
// Instead of this (slow)
for (const id of ids) {
  await getData(id)
}

// Do this (faster)
const keys = ids.map((id) => `key:${id}`)
const results = await Promise.all(keys.map(getData))
\`\`\`

## Additional Resources

- **Official Docs**: https://upstash.com/docs
- **API Reference**: https://upstash.com/docs/redis/features/rest-api
- **Status Page**: https://status.upstash.com
- **Community**: https://discord.com/invite/upstash
