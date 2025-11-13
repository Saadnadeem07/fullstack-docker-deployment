# CORS Configuration Guide

## Overview

Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers to restrict cross-origin HTTP requests. This guide provides professional solutions for handling CORS issues in full-stack applications.

## Table of Contents

1. [Understanding CORS](#understanding-cors)
2. [Solution 1: Development Proxy](#solution-1-development-proxy)
3. [Solution 2: Backend Configuration](#solution-2-backend-configuration)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Understanding CORS

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

## Solution 2: Backend Configuration

### Overview

Configuring CORS on the backend is the **recommended production solution**. It works in both development and production environments.

### Express.js Implementation

#### Option A: Using the `cors` Package (Recommended)

**Installation:**

```bash
npm install cors
```

**Basic Configuration:**

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Your routes
app.get("/api/message", (req, res) => {
  res.json({ message: "CORS configured successfully" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**Advanced Configuration:**

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// Whitelist specific origins
const corsOptions = {
  origin: [
    "http://localhost:5173", // Development
    "https://yourdomain.com", // Production
    "https://www.yourdomain.com", // Production with www
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Your routes here
```

#### Option B: Manual CORS Headers

```javascript
const express = require("express");
const app = express();

// Custom CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5173", "https://yourdomain.com"];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Your routes here
```

### Environment-Based Configuration

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://yourdomain.com", "https://www.yourdomain.com"]
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
```

---

## Best Practices

### 1. Security Considerations

✅ **Do:**

- Whitelist specific origins instead of using `*`
- Use environment variables for origin configuration
- Validate and sanitize all inputs
- Implement proper authentication and authorization

❌ **Don't:**

- Use `Access-Control-Allow-Origin: *` with credentials
- Expose sensitive headers unnecessarily
- Allow all origins in production

### 2. Development vs Production

**Development:**

```javascript
// More permissive for local testing
origin: ["http://localhost:5173", "http://localhost:3000"];
```

**Production:**

```javascript
// Strict whitelist
origin: ["https://yourdomain.com", "https://www.yourdomain.com"];
```

### 3. Environment Variables

Create a `.env` file:

```env
# Development
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:3000

# Production (example)
# CLIENT_URL=https://yourdomain.com
# API_URL=https://api.yourdomain.com
```

Use in your application:

```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: CORS Error Persists After Configuration

**Solution:**

- Clear browser cache and cookies
- Restart both frontend and backend servers
- Verify the origin URL matches exactly (including protocol and port)

#### Issue 2: Preflight Request Failing

**Solution:**

```javascript
// Ensure OPTIONS method is handled
app.options("*", cors()); // Enable preflight for all routes
```

#### Issue 3: Credentials Not Working

**Solution:**

```javascript
// Backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Must be true
  })
);

// Frontend
fetch("/api/data", {
  credentials: "include", // Must include credentials
});
```

#### Issue 4: Multiple CORS Headers

**Solution:**

- Remove duplicate CORS middleware
- Ensure CORS is configured only once, before routes
- Check for conflicting middleware

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
