FROM ubuntu:yakkety
RUN apt-get update
RUN apt-get install -y npm curl
RUN npm install -g n
RUN n 6.5.0
RUN ln -sf /usr/local/n/versions/node/6.5.0/bin/node /usr/bin/node 

WORKDIR /app

# Install dependencies
COPY package.json /app/package.json
RUN npm install && npm ls
RUN mv /app/node_modules /node_modules

COPY . /app

CMD ["npm", "start"]
