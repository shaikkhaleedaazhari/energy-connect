# Use official NGINX image
FROM nginx:latest

# Remove default NGINX static files
RUN rm -rf /usr/share/nginx/html/*

# Copy your static site into the default NGINX folder
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
