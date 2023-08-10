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

# It documents the ports that are intended to be used by the application.
# you still have to specify port mapping in the run command
EXPOSE 1339

CMD [ "node", "dist/index.js" ]

# docker build -t vnlkz .
# docker run --name vnlkz -dp 1339:1339 vnlkz
# docker ps
# docker logs -f vnlkz
# docker stop vnlkz