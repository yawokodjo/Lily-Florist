#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py loaddata apps/products/fixtures/initial_products.json

exec "$@"
