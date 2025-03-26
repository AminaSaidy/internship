FROM postgres:latest

COPY entrypoint.sh /docker-entrypoint-initdb.d/replica-entrypoint.sh
RUN chmod +x /docker-entrypoint-initdb.d/replica-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]
