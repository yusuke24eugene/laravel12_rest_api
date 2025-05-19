#!/bin/sh

# Run migrations
php artisan config:clear
php artisan config:cache
php artisan migrate --force

# Start PHP-FPM
php-fpm &

# Start Nginx in foreground
nginx -g "daemon off;"
