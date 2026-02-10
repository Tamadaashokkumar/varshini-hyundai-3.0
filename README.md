# 🚗 Hyundai Spares Frontend

A stunning, cinematic Next.js frontend for the Hyundai Spares e-commerce platform. Built with cutting-edge technologies and premium automotive aesthetics.

## ✨ Features

### 🎨 Visual Excellence
- **Cinematic UI**: Premium automotive-inspired design with metallic accents
- **Glassmorphism Effects**: Modern card designs with backdrop blur
- **Smooth Animations**: Powered by Framer Motion for fluid page transitions
- **Dark/Light Modes**: Hyundai Midnight Blue dark theme with elegant light mode
- **Micro-interactions**: Delightful hover effects and animations throughout

### 🛠️ Core Functionality
- **Authentication**: Secure JWT-based login/register with refresh tokens
- **Product Catalog**: Advanced filtering, search, and category navigation
- **Real-time Cart**: Slide-out drawer with live updates
- **Order Tracking**: Real-time order status via Socket.io
- **WhatsApp Support**: Floating chat widget for customer support
- **Responsive Design**: Perfect on all devices from mobile to desktop

### ⚡ Performance
- **Next.js 14 App Router**: Latest features and optimizations
- **Optimized Images**: Next/Image for automatic optimization
- **Code Splitting**: Automatic for faster load times
- **Lazy Loading**: Components and images loaded on demand

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Modules
- **Animations**: Framer Motion
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **Real-time**: Socket.io Client
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
hyundai-spares-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Home page
│   │   ├── page.module.css      # Home page styles
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── ProductCard.tsx      # Product card component
│   │   ├── ProductCard.module.css
│   │   ├── CartDrawer.tsx       # Shopping cart drawer
│   │   ├── WhatsAppWidget.tsx   # Support widget
│   │   └── ThemeProvider.tsx    # Theme management
│   ├── hooks/                   # Custom React hooks
│   │   └── useAuth.ts           # Authentication hook
│   ├── services/                # API services
│   │   ├── apiClient.ts         # Axios instance with interceptors
│   │   └── socketService.ts     # Socket.io client
│   └── store/                   # State management
│       └── useStore.ts          # Zustand store
├── public/                      # Static assets
├── .env.example                # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend API running (see backend documentation)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
cd hyundai-spares-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NODE_ENV=development
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Key Components

### 1. API Client (`src/services/apiClient.ts`)
Centralized Axios instance with:
- JWT token management
- Automatic token refresh
- Request/response interceptors
- Error handling

### 2. Socket Service (`src/services/socketService.ts`)
Real-time WebSocket client for:
- Order status updates
- Payment notifications
- Live inventory updates
- Admin notifications

### 3. Auth Hook (`src/hooks/useAuth.ts`)
Complete authentication solution:
- Login/Register/Logout
- Profile management
- Token refresh
- Auth state persistence

### 4. Product Card (`src/components/ProductCard.tsx`)
Premium animated product display with:
- Glassmorphism effect
- Hover animations
- Stock status badges
- Discount indicators
- Quick actions

### 5. Cart Drawer (`src/components/CartDrawer.tsx`)
Animated slide-out cart with:
- Real-time updates
- Quantity controls
- Price calculations
- Checkout flow

## 🎨 Design System

### Colors
```css
--hyundai-midnight: #002C5F
--hyundai-blue: #00AAD2
--hyundai-silver: #C0C0C0
--hyundai-platinum: #E5E4E2
--hyundai-obsidian: #0A0E27
--accent-gold: #D4AF37
--accent-electric: #00F0FF
```

### Typography
- **Display Font**: Orbitron (headings, logos)
- **Body Font**: Inter (content, UI)

### Animations
- Page transitions: 0.6s ease-out
- Hover effects: 0.3s cubic-bezier
- Micro-interactions: Spring physics
- Scroll reveals: Staggered delays

## 🔐 Authentication Flow

1. User enters credentials
2. API returns access + refresh tokens
3. Tokens stored in secure HTTP-only cookies
4. Access token added to all API requests
5. On 401 error, automatic refresh attempt
6. Socket.io connects with valid token
7. Real-time updates for authenticated user

## 🛒 Shopping Flow

1. Browse products with filters
2. Add items to cart (updates via API)
3. View cart in slide-out drawer
4. Modify quantities or remove items
5. Proceed to checkout
6. Complete payment
7. Receive real-time order updates via Socket.io

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

### API Endpoints
Configure in `.env.local`:
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_SOCKET_URL`: WebSocket server URL

### WhatsApp Widget
Update phone number in `src/components/WhatsAppWidget.tsx`:
```typescript
const phoneNumber = '919876543210'; // Your number
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

```bash
npm run build
npm start
```

### Other Platforms

Build the project:
```bash
npm run build
```

The output will be in `.next/` directory.

## 🎯 Performance Optimizations

- ✅ Image optimization with Next/Image
- ✅ Code splitting and lazy loading
- ✅ CSS optimization with Tailwind purge
- ✅ Font optimization with next/font
- ✅ API response caching
- ✅ Debounced search input
- ✅ Virtualized lists for large datasets

## 🔒 Security Features

- ✅ JWT token refresh mechanism
- ✅ HTTP-only cookies for token storage
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Secure WebSocket connections
- ✅ Input validation
- ✅ Rate limiting awareness

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 💬 Support

For support, email support@hyundaispares.com or use the WhatsApp widget in the app.

## 🙏 Acknowledgments

- Hyundai for brand inspiration
- Next.js team for the amazing framework
- Framer Motion for animation library
- Tailwind CSS for utility-first styling

---

**Built with ❤️ for the automotive industry**
