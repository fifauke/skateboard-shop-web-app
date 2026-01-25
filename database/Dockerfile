FROM postgres:16-alpine
ENV POSTGRES_PASSWORD=paint
ENV POSTGRES_USER=paint_user
ENV POSTGRES_DB=PAINT_database
COPY db.sql /docker-entrypoint-initdb.d/