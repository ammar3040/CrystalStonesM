# Backend Production Build & Deployment Guide

This guide explains how to prepare and deploy the backend for **Crystal Stones Mart**.

## 1. Environment Configuration
Create a `.env` file in the `Server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
ALLOWED_ORIGINS=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 2. Install Production Dependencies
Run the following command to install only necessary packages:

```bash
npm install --production
```

## 3. Deployment Steps

Since this project uses plain JavaScript (Node.js/Express), there is no heavy "build" step like React or TypeScript.

### Method A: Traditional VPS (PM2)
If you are using a VPS (like AWS EC2, DigitalOcean, etc.):

1. **Install PM2**: `npm install -g pm2`
2. **Start Server**: `pm2 start app.js --name "crystal-backend"`
3. **Set to Auto-restart**: `pm2 startup` and `pm2 save`

### Method B: Docker (Recommended)
You can create a `Dockerfile` in the `Server` directory:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "app.js"]
```

## 4. Serving the Frontend
If you want the backend to serve the frontend:
1. Build the frontend: `npm run build` in the `Client` directory.
2. Copy the `dist` folder to `Server/public`.
3. Add this to `app.js` (if not already there):

```javascript
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
```

---
**Note:** Always ensure your MongoDB is secured and backups are enabled.
