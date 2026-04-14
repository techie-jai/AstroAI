FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ENV VITE_API_BASE_URL=http://astroai:8000/api
RUN npm run build

FROM node:18-alpine AS admin-builder

WORKDIR /app/admin-panel
COPY admin-panel/package*.json ./
RUN npm ci
COPY admin-panel/ .
# Admin panel environment - will be overridden at runtime
ENV VITE_ADMIN_API_URL=http://astroai:8000
ENV VITE_FIREBASE_PROJECT_ID=""
ENV VITE_FIREBASE_API_KEY=""
ENV VITE_FIREBASE_AUTH_DOMAIN=""
ENV VITE_FIREBASE_STORAGE_BUCKET=""
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=""
ENV VITE_FIREBASE_APP_ID=""
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gnupg \
    wget \
    dos2unix \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY jyotishganit_chart_api.py .
COPY test_jyotishganit*.py .
COPY world_cities_with_tz.csv .

# Verify CSV file was copied
RUN ls -lh /app/world_cities_with_tz.csv && echo "CSV file copied successfully"

# Create users directory for local Kundli storage with hash-based naming
RUN mkdir -p /app/users
RUN echo "Created users directory for local Kundli storage"

RUN find /app -name "*.py" -type f -exec sed -i 's/\r$//' {} \;

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=admin-builder /app/admin-panel/dist ./admin-panel/dist

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

# Backend Environment Variables
ENV FIREBASE_CREDENTIALS_PATH=/app/firebase-credentials.json
ENV FIREBASE_STORAGE_BUCKET=""
ENV GEMINI_API_KEY=""
ENV ENVIRONMENT=production
ENV DEBUG=False

# Bot Integration Environment Variables
ENV WHATSAPP_PHONE_NUMBER_ID=""
ENV WHATSAPP_BUSINESS_ACCOUNT_ID=""
ENV WHATSAPP_ACCESS_TOKEN=""
ENV WHATSAPP_WEBHOOK_VERIFY_TOKEN=""
ENV WHATSAPP_APP_SECRET=""
ENV TELEGRAM_BOT_TOKEN=""

EXPOSE 8000 3000 3001

COPY entrypoint.sh /app/entrypoint.sh
RUN dos2unix /app/entrypoint.sh || sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

CMD ["/bin/bash", "/app/entrypoint.sh"]
