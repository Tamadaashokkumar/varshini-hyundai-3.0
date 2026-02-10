# 🏗️ Architecture Documentation

## System Overview

The Hyundai Spares frontend is built using Next.js 14 with the App Router, providing a modern, performant, and scalable solution for an e-commerce platform.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Next.js    │  │   React 18   │  │  TypeScript  │     │
│  │  App Router  │  │  Components  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Styling Layer
                              │    ├─ Tailwind CSS
                              │    ├─ CSS Modules
                              │    └─ Framer Motion
                              │
                              ├─── State Management
                              │    └─ Zustand Store
                              │
                              ├─── API Layer
                              │    ├─ Axios (HTTP)
                              │    └─ Socket.io (WebSocket)
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       Backend API                            │
│                   Node.js + Express + MongoDB                │
└─────────────────────────────────────────────────────────────┘
```

## Core Technologies

### 1. Next.js 14 (App Router)
**Why**: Server-side rendering, automatic code splitting, optimized routing
- File-based routing system
- Built-in API routes (if needed)
- Automatic image optimization
- Fast refresh for development

### 2. TypeScript
**Why**: Type safety, better IDE support, reduced bugs
- Interfaces for all data models
- Type-safe API responses
- Better refactoring support

### 3. Tailwind CSS
**Why**: Utility-first, highly customizable, minimal bundle size
- Custom theme for Hyundai brand colors
- JIT compiler for production
- Responsive design utilities

### 4. Framer Motion
**Why**: Powerful animations, physics-based, declarative
- Page transitions
- Component animations
- Gesture recognition
- Spring physics

### 5. Zustand
**Why**: Minimal, fast, no providers needed
- Simple API
- TypeScript support
- DevTools integration
- Middleware support

### 6. Axios
**Why**: Interceptors, automatic transforms, better errors
- Request/response interceptors
- Automatic JSON transformation
- Request cancellation
- Progress tracking

### 7. Socket.io Client
**Why**: Real-time bidirectional communication
- Auto-reconnection
- Event-based messaging
- Binary data support
- Room-based broadcasting

## Data Flow

### Authentication Flow
```
User Input → useAuth Hook → apiClient (Axios)
              ↓
    JWT Tokens (Access + Refresh)
              ↓
    Stored in HTTP-only Cookies
              ↓
    Auto-attached to API Requests
              ↓
    Socket.io Connection (with token)
              ↓
    Real-time Updates for User
```

### Shopping Cart Flow
```
Add to Cart Button → API Call (POST /cart/add)
                      ↓
              Backend Updates Cart
                      ↓
           Response with Updated Cart
                      ↓
          Zustand Store Updated
                      ↓
          UI Re-renders
                      ↓
        Cart Drawer Shows Changes
```

### Real-time Order Updates Flow
```
Order Placed → Backend Emits Socket Event
                      ↓
          Socket Service Receives Event
                      ↓
           Callback Function Executed
                      ↓
              UI Updates in Real-time
                      ↓
         User Sees Live Status Change
```

## State Management Strategy

### Global State (Zustand)
```typescript
├── User State
│   ├── user: User | null
│   ├── isAuthenticated: boolean
│   └── methods: setUser(), logout()
│
├── Cart State
│   ├── cart: Cart | null
│   ├── cartItemCount: number
│   └── methods: setCart(), updateCartItemCount()
│
└── UI State
    ├── theme: 'dark' | 'light'
    ├── isCartDrawerOpen: boolean
    ├── isMobileMenuOpen: boolean
    └── methods: toggleTheme(), toggleCartDrawer(), etc.
```

### Local State (useState)
- Component-specific form inputs
- Temporary UI states (hover, focus)
- Modal open/close states
- Loading indicators

### Server State (React Query - Future Enhancement)
- API response caching
- Automatic refetching
- Optimistic updates
- Background synchronization

## API Integration

### Request Interceptor
```typescript
1. Get accessToken from cookies
2. Attach to Authorization header
3. Send request
```

### Response Interceptor
```typescript
1. Check for 401 Unauthorized
2. If 401 and not retry:
   a. Get refreshToken from cookies
   b. Call /auth/refresh-token
   c. Save new tokens
   d. Retry original request
3. If refresh fails:
   a. Clear tokens
   b. Redirect to login
```

### Error Handling
```typescript
try {
  const response = await apiClient.get('/endpoint');
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle API error
    const message = error.response?.data?.error;
    toast.error(message);
  } else {
    // Handle unexpected error
    toast.error('An unexpected error occurred');
  }
}
```

## Component Architecture

### Presentational Components
- Pure, functional components
- Receive data via props
- No direct API calls
- Focus on UI rendering

Example: `ProductCard.tsx`

### Container Components
- Handle business logic
- Make API calls
- Manage local state
- Pass data to presentational components

Example: `page.tsx` (Home)

### Custom Hooks
- Encapsulate reusable logic
- Abstract complex operations
- Provide clean API

Example: `useAuth.ts`

### Services
- External API communication
- WebSocket management
- Third-party integrations

Example: `apiClient.ts`, `socketService.ts`

## Performance Optimizations

### 1. Code Splitting
- Automatic route-based splitting
- Dynamic imports for heavy components
- Lazy loading for modals/drawers

### 2. Image Optimization
```typescript
<Image
  src={url}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  priority={isAboveFold}
/>
```

### 3. Memoization
```typescript
// Expensive computations
const value = useMemo(() => expensiveFunction(), [deps]);

// Stable callbacks
const callback = useCallback(() => {}, [deps]);
```

### 4. Debouncing
```typescript
// Search input
const debouncedSearch = useDebounce(searchQuery, 500);
```

### 5. Virtual Scrolling
```typescript
// For long lists (future enhancement)
<VirtualList
  items={products}
  height={600}
  itemHeight={200}
  renderItem={(item) => <ProductCard product={item} />}
/>
```

## Security Measures

### 1. JWT Token Storage
- HTTP-only cookies (preferred)
- Secure flag in production
- SameSite=Strict
- Short expiration (15 min)

### 2. XSS Prevention
- React automatically escapes
- Sanitize user input
- Content Security Policy headers

### 3. CSRF Protection
- CSRF tokens for state-changing requests
- SameSite cookie attribute
- Verify origin header

### 4. API Security
- Never expose API keys in client
- Use environment variables
- HTTPS in production

## Testing Strategy

### Unit Tests
```typescript
// Component tests
describe('ProductCard', () => {
  it('renders product information', () => {
    // Test
  });
});

// Hook tests
describe('useAuth', () => {
  it('handles login successfully', () => {
    // Test
  });
});
```

### Integration Tests
```typescript
// API integration
describe('API Client', () => {
  it('refreshes token on 401', () => {
    // Test
  });
});
```

### E2E Tests
```typescript
// User flows
describe('Shopping Flow', () => {
  it('adds product to cart and checks out', () => {
    // Test
  });
});
```

## Deployment

### Build Process
```bash
1. npm run build
   ├─ TypeScript compilation
   ├─ CSS optimization
   ├─ Code minification
   └─ Static generation

2. Output: .next/ directory
```

### Environment Variables
```env
# Production
NEXT_PUBLIC_API_URL=https://api.hyundaispares.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.hyundaispares.com
NODE_ENV=production
```

### Hosting Options
1. **Vercel** (Recommended)
   - One-click deployment
   - Automatic HTTPS
   - Global CDN
   - Preview deployments

2. **Netlify**
   - Git-based deploys
   - Form handling
   - Serverless functions

3. **Custom Server**
   - Docker container
   - PM2 process manager
   - Nginx reverse proxy

## Monitoring & Analytics

### Performance Monitoring
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
// etc.
```

### Error Tracking
```typescript
// Sentry integration (future)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

### User Analytics
```typescript
// Google Analytics (future)
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>
```

## Future Enhancements

1. **Progressive Web App (PWA)**
   - Offline support
   - Install to home screen
   - Push notifications

2. **Internationalization (i18n)**
   - Multiple languages
   - Currency conversion
   - Localized content

3. **Advanced Search**
   - Algolia/Elasticsearch integration
   - Faceted search
   - Auto-suggestions

4. **Wishlist Feature**
   - Save favorite products
   - Share wishlists
   - Price drop notifications

5. **Product Reviews**
   - User ratings
   - Photo uploads
   - Verified purchases

6. **Live Chat**
   - Real-time support
   - Chat history
   - File sharing

## Maintenance

### Code Quality
- ESLint for linting
- Prettier for formatting
- Husky for git hooks
- TypeScript for type checking

### Documentation
- Component Storybook (future)
- API documentation
- Architecture decisions (ADRs)

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update safely
npm update

# Major version updates
npm install package@latest
```

---

**Last Updated**: December 2024
**Version**: 1.0.0
