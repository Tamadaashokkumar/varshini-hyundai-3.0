# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check
```bash
node --version  # Should be v16 or higher
npm --version   # Should be v7 or higher
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- Zustand
- Socket.io Client
- Lucide React
- React Hot Toast

### 3. Environment Setup

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit the file with your backend URLs:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NODE_ENV=development
```

### 4. Verify Backend Connection

Make sure your backend is running:
```bash
# In your backend directory
npm run dev
```

Backend should be accessible at:
- API: http://localhost:5000/api
- Socket.io: http://localhost:5000

### 5. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 📋 First Time Setup Checklist

- [ ] Node.js 16+ installed
- [ ] Backend server running on port 5000
- [ ] `.env.local` file created with correct URLs
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Browser opened to localhost:3000

## 🎨 What You Should See

1. **Hero Section**: Full-screen animated hero with gradient background
2. **Product Grid**: Glassmorphism cards with hover effects
3. **Navbar**: Sticky navigation with cart and user menu
4. **Theme Toggle**: Switch between dark/light modes
5. **WhatsApp Widget**: Floating button in bottom right

## 🔧 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: API connection failed
**Solution**: 
1. Check backend is running
2. Verify `.env.local` URLs are correct
3. Check for CORS issues in backend

### Issue: Images not loading
**Solution**: 
1. Check Cloudinary URLs in backend
2. Verify Next.js image domains in `next.config.js`

### Issue: Socket.io not connecting
**Solution**: 
1. Verify backend Socket.io server is running
2. Check authentication token is valid
3. Check browser console for connection errors

## 📱 Testing Different Features

### Test Authentication
1. Go to `/login`
2. Use test credentials or register new account
3. Verify JWT tokens in browser cookies

### Test Product Browsing
1. Homepage shows product grid
2. Try search functionality
3. Filter by categories
4. Click on product cards

### Test Shopping Cart
1. Add items to cart
2. Open cart drawer (click cart icon)
3. Modify quantities
4. Verify price calculations

### Test Real-time Features
1. Place an order
2. Watch for order status updates
3. Check Socket.io connection in DevTools

## 🎓 Understanding the Code Structure

### Key Files to Explore

1. **`src/app/page.tsx`** - Home page with hero and products
2. **`src/components/ProductCard.tsx`** - Product display component
3. **`src/services/apiClient.ts`** - API setup with interceptors
4. **`src/hooks/useAuth.ts`** - Authentication logic
5. **`src/store/useStore.ts`** - Global state management

### Styling System

- **Tailwind**: Utility classes for layout
- **CSS Modules**: Component-specific styles
- **Global CSS**: Theme variables and animations

## 🚀 Next Steps

1. **Customize Theme**: Edit colors in `tailwind.config.js`
2. **Add Pages**: Create new routes in `src/app/`
3. **Build Features**: Add components in `src/components/`
4. **Connect APIs**: Add services in `src/services/`

## 💡 Tips for Development

1. Use React DevTools for debugging
2. Check Network tab for API calls
3. Monitor console for errors
4. Use Lighthouse for performance checks
5. Test on multiple devices/browsers

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)

---

Need help? Check the main README.md or contact support.
