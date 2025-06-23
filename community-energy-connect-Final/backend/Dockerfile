# Use official PHP Apache image
FROM php:8.1-apache

# Install PDO MySQL driver
RUN docker-php-ext-install pdo pdo_mysql

# Set working directory
WORKDIR /var/www/html

# Copy php folder and config folder preserving your structure
COPY php/ php/
COPY config/ config/

# Enable mod_rewrite (optional)
RUN a2enmod rewrite

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
