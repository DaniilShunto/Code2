FROM tiangolo/nginx-rtmp

EXPOSE 80
EXPOSE 1935

RUN mkdir -p /var/www/hls/live
RUN mkdir -p /var/www/videos

COPY webroot /var/www/html

COPY nginx.conf /etc/nginx/nginx.conf
