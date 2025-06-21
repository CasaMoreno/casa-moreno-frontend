# Estágio 1: Build da Aplicação
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Imagem de Produção Final
FROM node:20-alpine
WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV=production

# --- ALTERAÇÃO AQUI: Define a porta via variável de ambiente ---
ENV PORT=3001

# Copia a pasta 'public' do estágio de build
COPY --from=builder /app/public ./public

# Copia a saída 'standalone' e 'static' do build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expõe a porta definida na variável de ambiente
EXPOSE 3001

# --- ALTERAÇÃO AQUI: Remove o argumento -p, pois a ENV PORT será usada ---
CMD ["node", "server.js"]