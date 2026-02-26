#!/bin/sh
# Replace __PORT__ placeholder with the actual PORT env var (Railway injects this)
sed -i "s/__PORT__/${PORT:-8080}/g" /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
