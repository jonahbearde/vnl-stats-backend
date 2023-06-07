FROM node:lts as base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies but not the dev dependencies
COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=base /usr/src/app/dist ./dist

CMD [ "node", "dist/index.js" ]