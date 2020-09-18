# This is the production version Dockerfile
FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
# 'start' below is the script we have defined in package.json
CMD ["npm", "run", "start"]