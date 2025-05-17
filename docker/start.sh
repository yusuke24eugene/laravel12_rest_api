#!/bin/sh

# Start PHP-FPM
php-fpm &

# Start Nginx in foreground
nginx -g "daemon off;"
