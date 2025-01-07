
From node:18

WORKDIR  /app

COPY package*.json /src

COPY . .

EXPOSE 3000

CMD ['npm' "start"]

