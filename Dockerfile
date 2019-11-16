FROM node:12

RUN apt-get update -qq && apt-get install -y \
        ghostscript \
        libgs-dev \
        imagemagick \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
