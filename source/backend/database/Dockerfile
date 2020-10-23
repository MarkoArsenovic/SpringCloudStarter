FROM postgres:11-alpine

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD klasikaK1
ENV POSTGRES_DB spring_cloud_starter

ENV PGGSSENCMODE disable

ENV PGDATA /var/lib/postgresql/data

# Create database schema when container is restarted/destroy, data will be populated from mounted volume
ADD ./scripts/create_script.sql /docker-entrypoint-initdb.d/   

EXPOSE 5432