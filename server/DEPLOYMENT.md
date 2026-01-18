# DCAR Backend Deployment Guide

## Prerequisites
- Node.js project deployed on a platform (Vercel, Railway, Heroku, AWS, etc.)
- MongoDB Atlas account with database
- Cloudinary account with API credentials
- Environment variables configured

## Deployment Steps

### 1. Prepare Backend for Deployment

#### Update server.js for production
\`\`\`javascript
// Add in server.js
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))
\`\`\`

#### Update .env.example with all required variables
\`\`\`
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend-domain.com
\`\`\`

### 2. Deploy to Railway

1. Connect GitHub repository
2. Create new service from repository
3. Select "server" as root directory
4. Set environment variables in Railway dashboard
5. Deploy

Backend URL will be provided by Railway.

### 3. Deploy to Vercel

Note: Vercel primarily handles frontend. For backend, use:
- Railway
- Heroku
- AWS
- DigitalOcean
- Render

### 4. Update Frontend Environment

Update `NEXT_PUBLIC_API_URL` to point to deployed backend:
\`\`\`
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
\`\`\`

## Security Checklist

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable HTTPS for all connections
- [ ] Set secure CORS origin to frontend domain only
- [ ] Keep dependencies updated
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting on API endpoints
- [ ] Set up monitoring and error tracking
- [ ] Configure database backups

## Monitoring

### Recommended Services
- Sentry for error tracking
- Uptime monitors for health checks
- Database monitoring tools
- Log aggregation services

### Health Check Endpoint
\`\`\`
GET /health
\`\`\`

## Scaling Considerations

- Use MongoDB connection pooling
- Implement caching strategies
- Set up CDN for Cloudinary images
- Monitor API rate limits
- Scale horizontally with load balancers
