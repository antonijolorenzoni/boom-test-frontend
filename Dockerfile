FROM node:12-alpine as builder

ENV NODE_ENV=production

WORKDIR /
RUN mkdir code
RUN mkdir code/ui-boom-components
RUN mkdir code/platform
RUN mkdir code/platform-guest

# copying workspaces dependencies files
WORKDIR /code
COPY ./yarn.lock ./yarn.lock
COPY ./package.json ./package.json

# copying projects cross dependencies
WORKDIR /code/ui-boom-components
COPY ./ui-boom-components/src ./src
COPY ./ui-boom-components/package.json ./package.json
COPY ./ui-boom-components/index.d.ts ./index.d.ts
COPY ./ui-boom-components/tsconfig.json ./tsconfig.json
COPY ./ui-boom-components/webpack.config.js ./webpack.config.js

# copying platform source files
WORKDIR /code/platform
COPY ./platform/src ./src
COPY ./platform/public ./public
COPY ./platform/package.json ./package.json
COPY ./platform/index.d.ts ./index.d.ts
COPY ./platform/tsconfig.json ./tsconfig.json
COPY ./platform/.env ./.env

# copying platform-guest source files
WORKDIR /code/platform-guest
COPY ./platform-guest/src ./src
COPY ./platform-guest/public ./public
COPY ./platform-guest/package.json ./package.json
COPY ./platform-guest/tsconfig.json ./tsconfig.json
COPY ./platform-guest/.env ./.env

# building, --production flag to false to install also dev dependencies needed to build
WORKDIR /code
RUN yarn --production=false

RUN yarn workspace platform build
RUN yarn workspace platform-guest build