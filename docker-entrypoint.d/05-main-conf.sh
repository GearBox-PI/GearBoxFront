#!/bin/sh
set -e

: "${WORKER_PROCESSES:=4}"

envsubst '$WORKER_PROCESSES' \
    < /etc/nginx/main.conf.template \
    > /etc/nginx/nginx.conf
