# Free Deployment Guide

This project has a Vite frontend and an Express/MongoDB backend.

## 1. Database: MongoDB Atlas Free Tier

1. Create a free cluster at MongoDB Atlas.
2. Create a database user.
3. Allow network access from `0.0.0.0/0` for free hosting providers.
4. Copy the connection string and use it as `MONGO_URI`.

## 2. Backend: Render Free Web Service

Create a new Render Web Service from this repo.

- Root Directory: `Backend`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

```text
MONGO_URI=your MongoDB Atlas connection string
JWT_SECRET=any long random secret
CLIENT_ORIGIN=https://your-site-name.netlify.app
```

After deploy, Render gives a free URL like:

```text
https://your-backend-name.onrender.com
```

## 3. Frontend: Netlify Free Site

Create a new Netlify site from this repo.

- Base directory: `Frontend`
- Build command: `npm run build`
- Publish directory: `Frontend/dist`

Environment variable:

```text
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
```

Netlify gives a free subdomain like:

```text
https://your-site-name.netlify.app
```

Put that frontend URL into the backend `CLIENT_ORIGIN` value, then redeploy the backend.

## Notes

- A completely free custom `.com` domain is not normally available. Free hosts provide subdomains such as `.netlify.app`, `.vercel.app`, and `.onrender.com`.
- Render free services may sleep after inactivity, so the first request can be slow.
