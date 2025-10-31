# PillMatrix Website - Deployment Guide

## Quick Start

### Prerequisites
- Node.js 16+ and npm installed
- Git repository initialized
- Netlify account (for Netlify deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The site will open at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deployment Options

### Option 1: Netlify (Recommended)

#### Method A: Git Integration (Automatic Deployments)

1. **Push code to GitHub/GitLab/Bitbucket:**
   ```bash
   git add .
   git commit -m "Initial PillMatrix website commit"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

3. **Automatic deployments:**
   - Every push to main branch triggers a new build
   - Preview deployments for pull requests

#### Method B: Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **For automatic deployments:**
   - Connect your Git repository to Vercel dashboard
   - Vercel automatically deploys on push

### Option 3: GitHub Pages

1. **Update package.json:**
   ```json
   "homepage": "https://yourusername.github.io/pillmatrix-website"
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy scripts to package.json:**
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 4: AWS S3 + CloudFront

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Invalidate CloudFront cache:**
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

### Option 5: Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine
   WORKDIR /app
   RUN npm install -g serve
   COPY --from=build /app/dist ./dist
   EXPOSE 3000
   CMD ["serve", "-s", "dist", "-l", "3000"]
   ```

2. **Build Docker image:**
   ```bash
   docker build -t pillmatrix-website .
   ```

3. **Run container:**
   ```bash
   docker run -p 3000:3000 pillmatrix-website
   ```

## Environment Variables

Create `.env.local` for development:
```
VITE_API_URL=https://api.pillmatrix.com
VITE_ANALYTICS_ID=your-google-analytics-id
```

For production, set these in your deployment platform's environment settings.

## Performance Optimization

### Build Optimization
- Tree-shaking removes unused code
- Code splitting for faster initial load
- Minification and compression enabled
- Source maps disabled in production

### Runtime Optimization
- Lazy loading for routes
- Image optimization
- CSS purging with Tailwind
- Gzip compression enabled

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Enable analytics (Google Analytics, Mixpanel)
- Monitor performance (Web Vitals)

## Security Checklist

- [ ] HTTPS enabled (automatic on Netlify/Vercel)
- [ ] Security headers configured (in netlify.toml)
- [ ] Environment variables not committed
- [ ] Dependencies kept up to date
- [ ] Regular security audits: `npm audit`
- [ ] Content Security Policy headers set
- [ ] X-Frame-Options header configured

## Post-Deployment

1. **Test the live site:**
   - Check all pages load correctly
   - Test navigation and links
   - Verify forms work
   - Test on mobile devices
   - Check performance metrics

2. **Set up monitoring:**
   - Configure error tracking
   - Set up analytics
   - Monitor uptime
   - Track performance metrics

3. **Configure domain:**
   - Update DNS records
   - Set up SSL certificate
   - Configure email forwarding if needed

4. **Set up CI/CD:**
   - Configure automated tests
   - Set up linting checks
   - Enable preview deployments

## Rollback Procedure

### Netlify
1. Go to Deploys tab
2. Find the previous successful deployment
3. Click "Publish deploy"

### Vercel
1. Go to Deployments
2. Find the previous deployment
3. Click the three dots menu
4. Select "Promote to Production"

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Pages Not Loading
- Check netlify.toml redirects
- Verify build output in dist folder
- Check browser console for errors

### Slow Performance
- Run: `npm run build` and check bundle size
- Use Lighthouse for performance audit
- Enable caching headers

### Environment Variables Not Working
- Verify variables are set in deployment platform
- Check variable names match code
- Restart deployment after adding variables

## Support

For deployment issues:
1. Check Netlify/Vercel documentation
2. Review build logs in deployment dashboard
3. Contact support@pillmatrix.com

---

**Last Updated:** October 2024
