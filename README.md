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

git clone https://github.com/RedHatInsights/insights-proxy.git
cd insights-proxy
npm install
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

### insights-proxy
Move to insight-chrome/build folder and then execute:
```shell
cd insights-proxy
SPANDX_CONFIG=../xavier-ui/profiles/local-frontend-and-api.js sh scripts/run.sh
```

# Open you browser
open your browser - [https://ci.foo.redhat.com:1337/beta/migrations/migration-analytics](https://ci.foo.redhat.com:1337/beta/migrations/migration-analytics)
