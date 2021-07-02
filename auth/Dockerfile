# from this image:
FROM node:alpine

ENV CI=true

# set up a working directory called /app
WORKDIR /app

# copy package.json (dependencies) into . (w/c is /app 's current working dir)
COPY package.json .

# then install all dependencies (node_modules)
RUN npm install

# copy over everything from . (our current working directory), to . (/app 's current working dir)
COPY . .

# must be CMD [] -- not RUN npm start .. or else Skaffold will get stuck & be unable to deploy.
CMD ["npm", "run", "start"] 