FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config (uses __PORT__ placeholder)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy startup script that injects PORT
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Copy static site files
COPY index.html /usr/share/nginx/html/
COPY thesis.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY iconfigwork.png /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/

# Railway injects PORT env var at runtime — default 8080
ENV PORT=8080
EXPOSE 8080

CMD ["/start.sh"]
