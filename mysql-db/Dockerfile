FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=cesi
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

ADD ./mysql_scripts/data.sql /docker-entrypoint-initdb.d/data.sql

EXPOSE 3306
