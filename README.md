# bip370org

[bip370.org](https://bip370.org)

A quick and dirty PSBTv2 parser and converter. This tool aims to provide an updated version of the tremendously useful [bip174.org](https://bip174.org) compatible with modern PSBT features.

### Requirements

NodeJS v24 or nvm

### Build

If using nvm:

```
$ nvm use
```

Install dependencies and build:

```
$ npm i
$ npm run build
```

### Run

#### Using docker

To run from a docker container:

```
$ docker build -t bip370org .
$ docker run -p 8080:80 bip370org
```

And then navigate a browser to http://localhost:8080/

#### On host

To run the app on your host machine, just point a simple http server to the `dist` directory. From `dist`, run:

```
$ python -m http.server 8080
```

And then navigate a browser to http://localhost:8080/

### Development

To run a local development server with hot module replacement:

```
$ npm run dev
```

This will start a Vite dev server, typically at http://localhost:5173/

### Caravan

This tool relies on the
[@caravan/bitcoin](https://www.npmjs.com/package/@caravan/bitcoin) and
[@caravan/psbt](https://www.npmjs.com/package/@caravan/psbt) packages found at
[Caravan](https://github.com/caravan-bitcoin/caravan)
