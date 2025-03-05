FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./
COPY .env ./
RUN npm install
COPY . .

EXPOSE 3000

RUN useradd -U -u 1337 appuser && \
    chown -R 1337:1337 /app
USER 1337

CMD ["npm", "run", "start"]