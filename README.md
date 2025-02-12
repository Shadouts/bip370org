# bip370org

[bip370.org](https://bip370.org)

A quick and dirty PSBTv2 parser and converter. This tool aims to provide an updated version of the tremendously useful [bip174.org](https://bip174.org) compatible with modern PSBT features.

### Requirements

NodeJS v20 or nvm

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

To run the app locally, just point a simple http server to the root directory.

```
$ python -m http.server
```

### Caravan

This tool relies on the
[@caravan/bitcoin](https://www.npmjs.com/package/@caravan/bitcoin) and
[@caravan/psbt](https://www.npmjs.com/package/@caravan/psbt) packages found at
[Caravan](https://github.com/caravan-bitcoin/caravan)
