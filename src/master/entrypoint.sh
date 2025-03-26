set -e 

echo "Initializing Master Database"

docker-entrypoint.sh postgres &

sleep 5

psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1;" || (
echo "Setting up database..."
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
    CREATE USER $REPLICA_USER REPLICATION LOGIN CONNECTION LIMIT 5 ENCRYPTED PASSWORD '$REPLICA_PASSWORD';
EOSQL
)

echo "Master database initialized."

pg_ctl -D "$PGDATA" -m fast -w stop

exec postgres