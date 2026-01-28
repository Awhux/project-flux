#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE postgres_shadow;
    GRANT ALL PRIVILEGES ON DATABASE postgres_shadow TO $POSTGRES_USER;
EOSQL

