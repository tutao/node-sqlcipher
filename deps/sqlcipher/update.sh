#!/bin/sh
set -e
set -x

tag=${1?Pass a valid sqlcipher version as an argument}

rm -rf .tmp/sqlcipher
git clone --branch $tag --filter=blob:none git@github.com:sqlcipher/sqlcipher.git .tmp/sqlcipher
cd .tmp/sqlcipher
./configure --enable-update-limit
make sqlite3.h sqlite3.c sqlite3ext.h shell.c
cd -

cp -rf .tmp/sqlcipher/sqlite3.h ./
cp -rf .tmp/sqlcipher/sqlite3.c ./
cp -rf .tmp/sqlcipher/LICENSE.md ./
