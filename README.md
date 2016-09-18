# TindergramVacationPlanner
A mashup of Tinder and Instagram with data from XE.com to help you plan your next vacation based on your pairwise preferences and currency exchange rate trends. A Hack the North 2016 project.

## Setup From a Fresh Ubuntu Linode Image
- `apt install git`
- Git clone this repo.
- `apt install npm`
- `npm install -g n`
- `n latest`
- `npm install`
- Cd to `/tmp`.
- Install CockroachDB by following [these instructions](https://www.cockroachlabs.com/docs/install-cockroachdb.html).
- Move the unzipped Cockroach executable to `/usr/bin`.
- Cd to the repo directory.
- `cockroach start --background`
- Run `bash init.sh` and input your Facebook app's client ID and client secret.
- `export PORT=80` to change running port from 3000 to 80.
- `npm start`
