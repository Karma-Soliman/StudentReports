FROM node:20-alpine

WORKDIR /app

# install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

# copy package files
COPY package*.json ./

# install dependencies
RUN npm install

# copy source
COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]