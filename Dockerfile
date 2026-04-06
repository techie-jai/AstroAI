FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ENV VITE_API_BASE_URL=http://astroai:8000/api
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gnupg \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY jyotishganit_chart_api.py .
COPY test_jyotishganit*.py .
COPY frontend/package*.json ./frontend/
COPY frontend/src ./frontend/src
COPY frontend/index.html ./frontend/
COPY frontend/vite.config.ts ./frontend/
COPY frontend/tsconfig.json ./frontend/
COPY frontend/tsconfig.node.json ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/

RUN mkdir -p /app/new-ui

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/frontend
RUN npm ci

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV VITE_API_BASE_URL=http://astroai:8000/api
ENV VITE_FIREBASE_API_KEY=""
ENV VITE_FIREBASE_AUTH_DOMAIN=""
ENV VITE_FIREBASE_PROJECT_ID=""
ENV VITE_FIREBASE_STORAGE_BUCKET=""
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=""
ENV VITE_FIREBASE_APP_ID=""

EXPOSE 8000 3000

COPY entrypoint.sh /app/entrypoint.sh
RUN dos2unix /app/entrypoint.sh || sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

CMD ["/bin/bash", "/app/entrypoint.sh"]
