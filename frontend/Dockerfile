# ── Stage 1 : build React ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

# ── Stage 2 : Nginx ──────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Config nginx optimisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build
COPY --from=builder /app/dist /usr/share/nginx/html

# Utilisateur non-root
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
