FROM node:alpine

ENV CI=true

WORKDIR /app
COPY package.json .
# RUN npm config get proxy --> prints null
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]