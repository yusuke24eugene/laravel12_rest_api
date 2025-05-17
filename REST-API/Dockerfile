# Base image
FROM php:8.2-fpm

# Set working dir inside the container
WORKDIR /var/www

# Copy only laravel-app contents
COPY ./RESTAPI/composer.json ./composer.json
COPY ./RESTAPI/composer.lock ./composer.lock

# Install system deps
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath

# Install composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --optimize-autoloader --no-dev

# Now copy the full Laravel app code
COPY ./RESTAPI/ .

# Expose the port
EXPOSE 8000

# Start Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
