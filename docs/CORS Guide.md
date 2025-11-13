# CORS Configuration Guide

## Overview

Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers to restrict cross-origin HTTP requests. This guide provides professional solutions for handling CORS issues in full-stack applications.

CORS errors occur when a web application running on one origin (domain, protocol, or port) attempts to access resources from a different origin. Browsers enforce the Same-Origin Policy for security reasons, and CORS provides a way to safely relax these restrictions.

**Common CORS Error:**

```
Access to fetch at 'http://localhost:3000/api/message' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

---

## Solution 1: Development Proxy

### Overview

A development proxy routes API requests through the development server, eliminating CORS issues during development. This is ideal for local development but **not suitable for production**.

### Configuration

#### Vite Configuration

Add the following proxy configuration to your `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
```

#### Configuration Options

| Option         | Description                           | Value                   |
| -------------- | ------------------------------------- | ----------------------- |
| `target`       | Backend server URL                    | `http://localhost:3000` |
| `changeOrigin` | Changes the origin of the host header | `true`                  |
| `secure`       | Verify SSL certificates               | `false` (for local dev) |
| `rewrite`      | Modify the request path               | Optional                |

### Client-Side Implementation

**Before (Direct API Call):**

```javascript
// This will cause CORS errors
const response = await fetch("http://localhost:3000/api/message");
```

**After (Using Proxy):**

```javascript
// Proxy handles the cross-origin request
const response = await fetch("/api/message");
```

### Limitations

⚠️ **Important Limitations:**

- **Development Only**: Proxy configuration only works with the Vite development server
- **Build Exclusion**: Proxy settings are ignored in production builds
- **Manual Configuration**: Requires different setup for production deployment

---

## Summary

| Method       | Development | Production       | Recommendation   |
| ------------ | ----------- | ---------------- | ---------------- |
| Proxy        | ✅ Works    | ❌ Not available | Development only |
| Backend CORS | ✅ Works    | ✅ Works         | **Recommended**  |

### Quick Decision Guide

- **For local development only**: Use proxy configuration
- **For production deployment**: Configure CORS on the backend
- **For maximum compatibility**: Implement backend CORS from the start

---

## Additional Resources

- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [Vite Server Options](https://vitejs.dev/config/server-options.html)

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Compatibility:** Express.js 4.x, Vite 4.x+
