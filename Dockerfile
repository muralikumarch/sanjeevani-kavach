FROM node:20-alpine
WORKDIR /app

# Enable legacy peer deps explicitly via npmrc
RUN echo "legacy-peer-deps=true" > .npmrc

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
