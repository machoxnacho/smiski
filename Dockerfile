# Step 1: Build frontend
FROM node:18 AS builder

WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Step 2: Run backend with frontend build
FROM node:18

WORKDIR /app
COPY backend ./backend
COPY --from=builder /app/frontend/build ./backend/build

WORKDIR /app/backend
RUN npm install

EXPOSE 5000
CMD ["node", "server.js"]
