# xavier-ui
[![Build Status](https://travis-ci.org/project-xavier/xavier-ui.svg?branch=master)](https://travis-ci.org/project-xavier/xavier-ui)
[![codecov](https://codecov.io/gh/project-xavier/xavier-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/project-xavier/xavier-ui)


## Pre requirements
- Install Nodejs (v10.16.0 or later)
- Install npm (6.9.0 or later)

Global npm packages needed:
```shell
npm install -g webpack-dev-server
npm install -g webpack-cli
```

**NOTE: FOR RUNNING AND DEVELOPING YOU NEED TO ACTIVATE YOUR Red Hat VPN.**

## Cloning the repositories
You'll need to clone these repositories:

``` bash
git clone https://github.com/project-xavier/xavier-ui.git
cd xavier-ui
npm ci

git clone https://github.com/RedHatInsights/insights-chrome
cd insights-chrome
npm install

git clone https://github.com/RedHatInsights/insights-proxy.git
cd insights-proxy
npm install
```

(Optional) You can also clone jaxrs-util-mocks for having jax-rs mocks in order to be able to develop locally without any need of having a running backend
``` bash
git clone https://github.com/carlosthe19916/jaxrs-util-mocks.git
cd jaxrs-util-mocks
mvn install
```

## Setup the initial /etc/hosts entries (do this once)

```
cd insights-proxy
sudo bash scripts/patch-etc-hosts.sh
```

## Running and Developing

### xavier-ui
```shell
cd xavier-ui
npm ci # Always execute this when package.json changed
npm run start
```

### insights-chrome

```shell
cd insights-chrome
npm run start
```

### insights-proxy
Move to insight-chrome/build folder and then execute:
```shell
cd insights-chrome/build
SPANDX_CONFIG=../../xavier-ui/profiles/local-frontend-and-api.js LOCAL_CHROME=true sh ../../insights-proxy/scripts/run.sh
```

### (Optional) jaxrs-util-mocks
```shell
cd jaxrs-util-mocks
./mvnw compile quarkus:dev
```

# Open you browser
open your browser - [https://ci.foo.redhat.com:1337/staging/migration-analytics](https://ci.foo.redhat.com:1337/staging/migration-analytics)
