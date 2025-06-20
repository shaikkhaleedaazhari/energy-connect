# Use official Nginx image
FROM nginx:alpine

# Clean default nginx html folder
RUN rm -rf /usr/share/nginx/html/*

# Copy your static frontend files to nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80
