FROM node:18-alpine3.16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY ./dist ./dist
RUN npx prisma generate
CMD ["npm", "run", "start:dev"]