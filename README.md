# cml-ip-checker
Check if cmlab's server IP banned by NTU

## Usage

Clone it, and set up config.

```bash
$ git clone https://github.com/SSARCandy/cml-ip-checker.git
$ cd cml-ip-checker/
$ npm install
$ cp config/default.js config/config.js
$ vim config/config.js # fill-up data
```

Add into cronjob

```bash
$ crontab -e
# add this line
# 0 0 * * * node <path>/index.js
```

