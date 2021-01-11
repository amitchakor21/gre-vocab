FROM node:lts-alpine as init
# FROM ideasinc/ideascloud:nodejs

RUN apk add --no-cache git && apk add python3 g++ make && rm -rf /var/cache/apk/*

#Make sure the angular cli doesn't collect analytics and make our build hang
ENV NG_CLI_ANALYTICS=false

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/node_modules && chmod 777 /usr/src/app -R
RUN mkdir ~/.npm-global && mkdir ~/.npm && chown -R 0:0 "/root/.npm"
ENV NPM_CONFIG_PREFIX=~/.npm-global
RUN chmod 777 ~/.npm-global -R
#Copy everything over and place in our WORKDIR
COPY . .

FROM init as install

CMD npm install

