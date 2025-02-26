FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000

RUN apt-get update && apt-get install -y shadow && \
    useradd -U -u 1000 appuser && \
    chown -R 1000:1000 /app
USER 1000

CMD ["npm", "run", "start"]