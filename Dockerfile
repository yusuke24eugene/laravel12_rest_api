# Stage 1: Build stage
FROM php:8.2-cli-alpine as builder

WORKDIR /var/www

# Install system dependencies
RUN apk add --no-cache \
    git \
    unzip \
    curl \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \

    # Install Composer
    COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy only what's needed for composer install
COPY REST-API/composer.json REST-API/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --ignore-platform-reqs

# Copy the rest of the application
COPY REST-API/ .

# Finish composer install
RUN composer dump-autoload --optimize && \
    composer run-script post-autoload-dump

# Generate application key if not exists
RUN if [ ! -f .env ]; then cp .env.example .env && php artisan key:generate; fi

# Stage 2: Production stage
FROM php:8.2-fpm-alpine

WORKDIR /var/www

# Install runtime dependencies and PostgreSQL support
RUN apk add --no-cache \
    nginx \
    libzip \
    libpng \
    libjpeg-turbo \
    freetype \
    bash \
    curl \
    libpq \
    postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copy PHP config and extensions
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/

# Copy app
COPY --from=builder /var/www /var/www

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# PHP-FPM config (optional)
# COPY docker/www.conf /usr/local/etc/php-fpm.d/www.conf

# Configure PHP settings
RUN echo "memory_limit = 512M" > /usr/local/etc/php/conf.d/memory.ini && \
    echo "upload_max_filesize = 128M" >> /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size = 128M" >> /usr/local/etc/php/conf.d/uploads.ini

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Copy entrypoint script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 8000

# Start both PHP-FPM and Nginx
CMD ["/start.sh"]
