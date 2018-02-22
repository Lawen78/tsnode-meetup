# Primo Step

Creo la struttura:

```
-src
  -models
    - mongodb
      user.ts
    - postgresql
  -controllers
  -config
    configServer.ts
  -api
  server.ts
```

Per usare Promise metto nel tsconfig.json il valore:

```json
"lib": ["es2015"],
```

```bash
npm i -S express bcryptjs mongoose body-parser passport passport-jwt moment jsonwebtoken

npm i -D typescript ts-node nodemon @types/express @types/bcryptjs @types/mongoose @types/body-parser  @types/passport @types/passport-jwt @types/jsonwebtoken
```

in configServer.ts inserisco:

```js
export const config = {
  server: {
    FACEBOOK_APP_ID: "29--insert-here--72",
    FACEBOOK_APP_SECRET: "eb--------insert-here--------bb",
    PORT: 8080,
    COOKIE_KEY: 'mystupidtokencookie'
  },
  mongodb: {

  },
  postgreSql: {

  }
}
```