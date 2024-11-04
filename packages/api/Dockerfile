FROM node:18-alpine  
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app  

COPY package*.json ./  

RUN pnpm install  

COPY . .

RUN chmod +x /usr/src/app

RUN npx prisma generate --schema=/usr/src/app/prisma/schema.prisma  

RUN pnpm run build
EXPOSE 5000

CMD ["pnpm", "run", "prod"]