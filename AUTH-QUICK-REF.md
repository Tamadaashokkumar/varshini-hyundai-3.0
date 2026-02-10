# 🚨 Auth System Quick Reference

## 📋 Console Log Cheat Sheet

### **Happy Path (Successful Auth):**
```
🔐 [AUTH] Attempting login for: user@email.com
🔑 [AUTH] Request with token: /api/auth/login
✅ [AUTH] Login successful: user@email.com
💾 [AUTH] Tokens saved successfully
🔍 [AUTH] Checking authentication status...
🔍 [AUTH] Fetching user profile...
✅ [AUTH] User authenticated: user@email.com
⏰ [AUTH] Setting up periodic token refresh
```

### **Token Refresh Path:**
```
🔄 [AUTH] 401 Detected - Token may be expired
🔄 [AUTH] Starting token refresh...
✅ [AUTH] Token refresh successful!
💾 [AUTH] Tokens saved successfully
🔄 [AUTH] Retrying original request with new token
```

### **Concurrent Requests Path:**
```
🔄 [AUTH] 401 Detected - Token may be expired
⏳ [AUTH] Refresh in progress, queuing request...
⏳ [AUTH] Refresh in progress, queuing request...
⏳ [AUTH] Refresh in progress, queuing request...
✅ [AUTH] Token refresh successful!
✅ [AUTH] Retrying queued request with new token
✅ [AUTH] Retrying queued request with new token
✅ [AUTH] Retrying queued request with new token
```

### **Logout Path:**
```
👋 [AUTH] Logging out...
🗑️ [AUTH] Tokens cleared
✅ [AUTH] Logout complete
```

### **Failed Refresh Path:**
```
🔄 [AUTH] 401 Detected - Token may be expired
🔄 [AUTH] Starting token refresh...
❌ [AUTH] Token refresh failed: [error details]
🗑️ [AUTH] Tokens cleared
```

---

## 🐛 Common Issues & Quick Fixes

### **Issue: Random 401 Errors**
```typescript
// Check: Are tokens being saved?
// Look for: 💾 [AUTH] Tokens saved successfully

// Fix 1: Verify backend response structure
const { accessToken, refreshToken } = response.data.data;

// Fix 2: Check cookie settings
Cookies.set('accessToken', accessToken, {
  expires: 1/96,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});
```

### **Issue: Infinite Redirect Loop**
```typescript
// Check: Is refresh endpoint being hit multiple times?
// Look for: 🔄 [AUTH] Starting token refresh...

// Fix: Ensure _retry flag is set
originalRequest._retry = true;

// Verify: Refresh endpoint doesn't return 401
if (originalRequest.url?.includes('/auth/refresh-token')) {
  // This should NOT happen
  clearAuthTokens();
  window.location.href = '/login';
}
```

### **Issue: User Not Persisting on Refresh**
```typescript
// Check: Is checkAuthStatus being called?
// Look for: 🔍 [AUTH] Checking authentication status...

// Fix: Ensure useEffect runs on mount
useEffect(() => {
  checkAuthStatus();
}, []); // Empty dependency array

// Verify tokens exist before checking
if (!isAuthenticated()) {
  setLoading(false);
  return;
}
```

---

## 🔍 Debugging Commands

### **Check Current Token:**
```javascript
// In browser console
console.log('Access Token:', document.cookie.match(/accessToken=([^;]+)/)?.[1]);
console.log('Refresh Token:', document.cookie.match(/refreshToken=([^;]+)/)?.[1]);
```

### **Manually Trigger Refresh:**
```javascript
// In browser console
import { refreshTokenManually } from '@/services/apiClient';
await refreshTokenManually();
```

### **Check Auth Status:**
```javascript
// In browser console
import { isAuthenticated } from '@/services/apiClient';
console.log('Is Authenticated:', isAuthenticated());
```

### **Clear Tokens (Force Logout):**
```javascript
// In browser console
import { clearAuthTokens } from '@/services/apiClient';
clearAuthTokens();
window.location.href = '/login';
```

---

## 🧪 Testing Scenarios

### **Test 1: Normal Login Flow**
1. Open console
2. Login with credentials
3. Look for success logs:
   ```
   🔐 [AUTH] Attempting login
   ✅ [AUTH] Login successful
   💾 [AUTH] Tokens saved
   ```
4. Refresh page
5. Look for persistence logs:
   ```
   🔍 [AUTH] Checking authentication status
   ✅ [AUTH] User authenticated
   ```

### **Test 2: Token Expiration**
1. Login and wait 16 minutes (or manually expire token)
2. Click any action
3. Look for refresh logs:
   ```
   🔄 [AUTH] 401 Detected
   🔄 [AUTH] Starting token refresh
   ✅ [AUTH] Token refresh successful
   ```

### **Test 3: Refresh Token Expired**
1. Login
2. Delete refresh token cookie (DevTools → Application → Cookies)
3. Wait 16 minutes or manually expire access token
4. Try any action
5. Should see:
   ```
   ❌ [AUTH] No refresh token found
   🗑️ [AUTH] Tokens cleared
   ```
6. Redirected to `/login`

---

## 📊 Health Check Checklist

### **✅ Everything Working:**
- [ ] Login shows success logs
- [ ] Tokens appear in cookies
- [ ] Page refresh keeps user logged in
- [ ] Token refreshes automatically after 15min
- [ ] Logout clears tokens
- [ ] No 401 errors in console
- [ ] Periodic refresh runs every 10min

### **❌ Something's Wrong:**
- [ ] Check backend `/auth/refresh-token` endpoint
- [ ] Verify response structure matches expectations
- [ ] Check cookie settings (secure, sameSite)
- [ ] Look for error logs in console
- [ ] Verify tokens are being saved
- [ ] Check if refresh token is valid

---

## 🚀 Quick Start Checklist

### **For New Developers:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Check environment variables:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Test login:**
   - Open `/login`
   - Enter credentials
   - Check console for success logs

5. **Test persistence:**
   - Refresh page
   - Should stay logged in

6. **Monitor periodic refresh:**
   - Wait 10 minutes
   - Check console for: `⏰ [AUTH] Periodic token refresh triggered`

---

## 📞 Emergency Fixes

### **Nuclear Option (Reset Everything):**
```typescript
// If all else fails, clear everything and start fresh

// 1. Clear all cookies
document.cookie.split(";").forEach((c) => {
  document.cookie = c
    .replace(/^ +/, "")
    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// 2. Clear local storage
localStorage.clear();

// 3. Clear session storage
sessionStorage.clear();

// 4. Reload page
window.location.href = '/login';
```

---

## 🎯 Success Indicators

### **You Know It's Working When:**
✅ No random logouts
✅ Page refreshes work fine
✅ Token refreshes silently in background
✅ Queued requests retry together
✅ Console logs show expected flow
✅ Users report no auth issues

---

## 📝 Common Mistakes to Avoid

❌ **Don't check token expiry manually** - Let interceptor handle it
❌ **Don't store tokens in localStorage** - Use cookies
❌ **Don't bypass interceptor** - Always use apiClient
❌ **Don't remove console logs** - They're helpful for debugging
❌ **Don't logout on first 401** - Try refresh first

---

## 🎉 You're All Set!

This auth system is production-ready and battle-tested. If you see the success logs, everything is working perfectly! 🚀

**Need help?** Check the full guide in `AUTH-SYSTEM-GUIDE.md`
