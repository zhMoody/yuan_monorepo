FROM nginx

MAINTAINER code3006

COPY ../dist/ /usr/share/nginx/html/

COPY Docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-s", "reload"]
