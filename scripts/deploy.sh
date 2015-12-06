#!/usr/bin/env bash

SCRIPT=$(readlink -f "$0");
BASE_DIR=$(dirname "$SCRIPT");

cd $BASE_DIR/..;

git checkout develop
git pull --rebase

npm i

pm2 start back-end -n develop -i 0
