# xavier-ui

## Pre requirements
- Install Nodejs
- Install npm
- Install [yarn](https://yarnpkg.com/en/docs/install)

Global npm packages needed:
```shell
npm install -g webpack-dev-server
npm install -g webpack-cli
```

**NOTE: FOR RUNNING AND DEVELOPING YOU NEED TO ACTIVATE YOUR Red Hat VPN.**

## Cloning the repositories

* You can curl a script to bypass the downloading. You will still have to run each application yourself as noted in the "Running and Developing" section below *

``` bash
sh <(curl https://gist.githubusercontent.com/carlosthe19916/d010db5b7743af4b7799e7d6cafb9bee/raw/362f69ee82641164d87b1de52f3c4d629edbf71c/analytics-ui)
```

## Setup the initial /etc/hosts entries (do this once)

```
cd insights-proxy
sudo bash scripts/patch-etc-hosts.sh
```

## Running and Developing
* You can curl a script to bypass the running
``` bash
sh <(curl https://gist.githubusercontent.com/carlosthe19916/868c50d4b05ad28fae5b5618936d88e4/raw/77c16539b83bfdebebc3c5f45723aa4b0ebf2053/analytics-ui-run)
```

Or if you prefer, you can start the projects by your own:

### analytics-ui
```shell
cd analytics-ui
yarn start
```

### insights-chrome

```shell
cd insights-chrome
yarn start
```

### insights-chrome
Move to insight-chrome/build folder and then execute:
```shell
cd insights-chrome/build
SPANDX_CONFIG=../../analytics-ui/profiles/local-frontend-and-api.js LOCAL_CHROME=true sh ../../insights-proxy/scripts/run.sh
```

### jaxrs-util-mocks
```shell
cd jaxrs-util-mocks
./mvnw compile quarkus:dev
```

# Open you browser
open your browser - [Analytics UI](https://ci.foo.redhat.com:1337/analytics/xavier/reports)
