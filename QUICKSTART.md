# PillMatrix Website - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
The site will open at `http://localhost:3000`

### Step 3: Build for Production
```bash
npm run build
```

### Step 4: Deploy
Choose your deployment method:

#### Option A: Netlify (Easiest)
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option B: Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Option C: GitHub Pages
```bash
npm run deploy
```

---

## 📂 Project Structure

```
src/
├── pages/          # 7 main pages
├── components/     # Navbar, Footer
├── App.tsx         # Main app with routing
├── main.tsx        # Entry point
└── index.css       # Global styles
```

---

## 🎨 Customization

### Change Colors
Edit `src/index.css` and `tailwind.config.js`:
```css
--primary: #4A90E2;      /* Main blue */
--secondary: #50E3C2;    /* Teal accent */
--accent: #F5A623;       /* Orange CTA */
```

### Update Content
Edit individual page files in `src/pages/`:
- `Home.tsx` - Landing page
- `Features.tsx` - Feature showcase
- `Contact.tsx` - Contact form
- etc.

### Add New Pages
1. Create file: `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navbar.tsx`

---

## 📱 Testing

### Desktop
```bash
npm run dev
# Open http://localhost:3000
```

### Mobile
```bash
# Get your local IP
ipconfig getifaddr en0  # Mac
hostname -I            # Linux
ipconfig               # Windows

# Open http://YOUR_IP:3000 on mobile
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔧 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📋 Checklist Before Launch

- [ ] All pages load correctly
- [ ] Navigation works on mobile
- [ ] Forms submit successfully
- [ ] Links point to correct pages
- [ ] Images load properly
- [ ] Colors match brand guidelines
- [ ] Performance is acceptable
- [ ] No console errors

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
npm run build -- --debug
# Check error messages
```

---

## 📚 Learn More

- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview

---

## 🎯 Next Steps

1. **Customize**: Update content, colors, and branding
2. **Test**: Verify all pages and forms work
3. **Deploy**: Choose a deployment method
4. **Monitor**: Set up analytics and error tracking
5. **Maintain**: Keep dependencies updated

---

## 💡 Tips

- Use `npm run dev` for fast development with hot reload
- Check browser console for errors: F12 or Cmd+Option+I
- Test on mobile devices before deploying
- Use Lighthouse (DevTools) to check performance
- Keep dependencies updated: `npm outdated`

---

**Happy coding! 🚀**

For more help, see the full documentation or contact hello@pillmatrix.com
