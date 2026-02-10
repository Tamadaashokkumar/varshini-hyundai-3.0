# Chat Feature Integration Instructions - Frontend

## Installation Steps

### 1. Install Dependencies

```bash
npm install socket.io-client lucide-react
```

### 2. Environment Variables

Create/update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Usage

The ChatComponent is ready to use. Import it in any page:

```jsx
import ChatComponent from '@/components/ChatComponent';

<ChatComponent
  currentUserId={user._id}
  otherUserId={adminId}
  otherUserModel="Admin"
  token={accessToken}
  apiUrl={process.env.NEXT_PUBLIC_API_URL}
/>
```

### 4. Get Admin ID

You'll need to get the admin ID from your backend. Either:

A. Hardcode it (not recommended for production):
```javascript
const adminId = '507f1f77bcf86cd799439011';
```

B. Fetch from API (recommended):
```javascript
const response = await fetch(`${apiUrl}/api/admin/profile`, {
  headers: { Authorization: `Bearer ${token}` }
});
const admin = await response.json();
const adminId = admin.data._id;
```

### 5. Tailwind Configuration

Ensure your `tailwind.config.js` includes:

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Features Included

✅ Real-time messaging
✅ Image & video upload/sharing
✅ Online/offline status
✅ Typing indicators
✅ Read receipts (✓✓)
✅ WhatsApp-like UI
✅ Mobile responsive

## Testing

1. Start backend: `npm run dev` (in backend directory)
2. Start frontend: `npm run dev` (in frontend directory)
3. Login as a user
4. Navigate to `/chat`
5. Send messages, upload files, and test features

## Troubleshooting

- **Socket not connecting**: Check NEXT_PUBLIC_API_URL
- **Images not rendering**: Verify Cloudinary URLs are accessible
- **Typing indicator stuck**: Refresh page (known React state issue)
