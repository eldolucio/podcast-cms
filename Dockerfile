FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Removed prisma as Node version is too old for it.
EXPOSE 3000

CMD ["npm", "run", "dev"]
