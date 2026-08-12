# Stage 1: Builder
FROM node:20-alpine AS builder

# Cài đặt OpenSSL cho Alpine Linux
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Sao chép package.json và prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Cài đặt toàn bộ dependencies
RUN npm ci

# Sao chép mã nguồn
COPY . .

# Khởi tạo Prisma Client và build ứng dụng
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner Production
FROM node:20-alpine AS runner

# Cài đặt OpenSSL cho Alpine Linux
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Cài đặt dependencies production
RUN npm ci --only=production

# Sao chép Prisma Client và bản build từ builder stage
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

# Tạo thư mục uploads
RUN mkdir -p /app/uploads /app/prisma

EXPOSE 3000

# Khởi chạy db push tự động tạo CSDL nếu chưa có, sau đó chạy ứng dụng
CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]
