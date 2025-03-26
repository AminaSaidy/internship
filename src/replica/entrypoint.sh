set -e

echo "Waiting for master to be ready..."
sleep 10

echo "Initializing Replica Database..."

PGPASSFILE=/tmp/.pgpass
echo "$POSTGRES_MASTER_HOST:5432:$POSTGRES_DB:$REPLICA_USER:$REPLICA_PASSWORD" > $PGPASSFILE
chmod 600 $PGPASSFILE
export PGPASSFILE

rm -rf "$PGDATA"/*

pg_basebackup -h "$POSTGRES_MASTER_HOST" -D /var/lib/postgresql/data -U "$REPLICA_USER" -Fp -Xs -R -P

echo "Replica database initialized."

exec postgres