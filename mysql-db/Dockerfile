FROM mysql:latest

RUN chown -R mysql:root /var/lib/mysql/

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=cesi
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

ADD data.sql /etc/mysql/data.sql

RUN sed -i 's/MYSQL_DATABASE/'$MYSQL_DATABASE'/g' /etc/mysql/data.sql
RUN cp /etc/mysql/data.sql /docker-entrypoint-initdb.d

EXPOSE 3306
