# backend/Dockerfile
FROM php:8.2-apache

# Enable necessary PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy backend code into the container
COPY . /var/www/html/

# Set working directory and permissions
WORKDIR /var/www/html

# Expose port (Apache default)
EXPOSE 80
