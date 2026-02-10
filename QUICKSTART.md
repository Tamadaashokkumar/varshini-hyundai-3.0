# 🚀 Hyundai Spares Frontend - Quick Start

## What You've Received

A complete, production-ready Next.js frontend with:

✅ **Stunning Visuals**: Cinematic UI with glassmorphism and animations
✅ **Full Authentication**: JWT-based with auto-refresh
✅ **Real-time Features**: Socket.io for live order updates
✅ **Shopping Cart**: Animated drawer with live calculations
✅ **Product Catalog**: Advanced filtering and search
✅ **Responsive Design**: Perfect on all devices
✅ **Dark/Light Themes**: Hyundai-branded color schemes
✅ **WhatsApp Widget**: Floating support button

## 📦 Extract the Project

```bash
tar -xzf hyundai-spares-frontend.tar.gz
cd hyundai-spares-frontend
```

## ⚡ 3-Minute Setup

### 1. Install Dependencies (2 minutes)
```bash
npm install
```

### 2. Configure Environment (30 seconds)
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server (30 seconds)
```bash
npm run dev
```

Visit: **http://localhost:3000**

## 🎯 What Works Out of the Box

### ✅ Homepage
- Cinematic hero section with animations
- Product grid with glassmorphism cards
- Category filtering
- Real-time search

### ✅ Authentication
- Login page at `/login`
- JWT token management
- Automatic token refresh
- Secure cookie storage

### ✅ Shopping Cart
- Click cart icon in navbar
- Add/remove items
- Update quantities
- Live price calculations

### ✅ Real-time Updates
- Order status changes
- Payment notifications
- Live inventory updates

### ✅ Theme Switching
- Click sun/moon icon
- Smooth transitions
- Persistent preference

## 📁 Project Structure

```
hyundai-spares-frontend/
├── src/
│   ├── app/                   # Pages (Next.js App Router)
│   │   ├── page.tsx          # Home page
│   │   ├── login/            # Login page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   │
│   ├── components/            # React components
│   │   ├── Navbar.tsx        # Navigation
│   │   ├── ProductCard.tsx   # Product display
│   │   ├── CartDrawer.tsx    # Shopping cart
│   │   └── WhatsAppWidget.tsx # Support button
│   │
│   ├── hooks/                 # Custom hooks
│   │   └── useAuth.ts        # Authentication
│   │
│   ├── services/              # API & WebSocket
│   │   ├── apiClient.ts      # Axios with interceptors
│   │   └── socketService.ts  # Socket.io client
│   │
│   └── store/                 # State management
│       └── useStore.ts       # Zustand store
│
├── public/                    # Static files
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind setup
├── next.config.js            # Next.js config
├── README.md                 # Main documentation
├── SETUP.md                  # Detailed setup guide
└── ARCHITECTURE.md           # Technical architecture
```

## 🔑 Key Files Explained

### 1. `src/services/apiClient.ts`
**Your API Client**: Handles all HTTP requests with automatic:
- JWT token attachment
- Token refresh on expiry
- Error handling
- Request/response transformation

### 2. `src/services/socketService.ts`
**Real-time Connection**: Manages WebSocket for:
- Order status updates
- Payment notifications
- Live inventory changes
- Admin notifications

### 3. `src/hooks/useAuth.ts`
**Authentication Hook**: Provides:
- login()
- register()
- logout()
- updateProfile()
- changePassword()

### 4. `src/components/ProductCard.tsx`
**Product Display**: Features:
- Glassmorphism design
- Hover animations
- Stock status badges
- Add to cart button

### 5. `src/store/useStore.ts`
**Global State**: Manages:
- User authentication state
- Shopping cart data
- UI state (theme, drawers)
- Loading states

## 🎨 Customization Guide

### Change Brand Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  hyundai: {
    midnight: '#002C5F',  // Change this
    blue: '#00AAD2',      // And this
    // ... etc
  }
}
```

### Update WhatsApp Number
Edit `src/components/WhatsAppWidget.tsx`:
```typescript
const phoneNumber = '919876543210'; // Your number
```

### Add New Pages
Create in `src/app/`:
```
src/app/about/page.tsx        → /about
src/app/products/[id]/page.tsx → /products/123
```

### Modify Animations
All animations use Framer Motion:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 🧪 Testing the Features

### Test Authentication
1. Go to http://localhost:3000/login
2. Try login with backend credentials
3. Check cookies in DevTools
4. Verify JWT token in Application tab

### Test Shopping Cart
1. Browse products on homepage
2. Click "Add to Cart" button
3. Click cart icon in navbar
4. Modify quantities
5. Verify live price updates

### Test Real-time Updates
1. Place an order
2. Open DevTools → Network → WS
3. See Socket.io connection
4. Watch for real-time events

### Test Responsive Design
1. Open DevTools (F12)
2. Toggle device toolbar
3. Try mobile, tablet, desktop views
4. Check navbar, cart drawer

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### API connection failed
1. Check backend is running
2. Verify URLs in `.env.local`
3. Check CORS settings in backend

### Images not loading
1. Verify Cloudinary setup in backend
2. Check `next.config.js` image domains

### Socket not connecting
1. Backend Socket.io server must be running
2. Check authentication token
3. See console for errors

## 📚 Documentation Files

1. **README.md** - Overview and features
2. **SETUP.md** - Detailed setup instructions
3. **ARCHITECTURE.md** - Technical architecture
4. **This file** - Quick start guide

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Environment Variables
Set in hosting platform:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
NODE_ENV=production
```

## 💡 Pro Tips

1. **Use React DevTools**: Install browser extension
2. **Check Network Tab**: Monitor API calls
3. **Watch Console**: Catch errors early
4. **Test on Real Devices**: Mobile experience matters
5. **Use Lighthouse**: Performance audits

## 📞 Support & Resources

- **Backend API Docs**: See API_DOCUMENTATION.md in backend
- **Next.js Docs**: https://nextjs.org/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

## ✨ What's Included

### Core Features
✅ Authentication (Login/Register/Logout)
✅ Product browsing with filters
✅ Shopping cart with live updates
✅ Real-time order tracking
✅ Theme switching (Dark/Light)
✅ Responsive design
✅ WhatsApp support widget

### Design Features
✅ Glassmorphism effects
✅ Smooth page transitions
✅ Hover animations
✅ Scroll reveals
✅ Loading states
✅ Toast notifications

### Technical Features
✅ TypeScript for type safety
✅ JWT token management
✅ Automatic token refresh
✅ Socket.io integration
✅ State management with Zustand
✅ API client with interceptors

## 🎯 Next Steps

1. **Explore the code**: Start with `src/app/page.tsx`
2. **Test features**: Login, add to cart, place order
3. **Customize**: Change colors, fonts, content
4. **Add pages**: Create new routes as needed
5. **Deploy**: Push to production when ready

---

**You're all set! Start building amazing e-commerce experiences.** 🚀

For questions or issues, refer to the detailed documentation files or check the comments in the code.

**Happy Coding!** 💙
