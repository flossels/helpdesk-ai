#!/bin/bash
set -euo pipefail
BACKUP_DIR="/opt/helpdesk-ai/backups"
FILENAME="helpdesk_$(date +%Y%m%d_%H%M%S).sql.gz"

docker compose --env-file .env.production -f docker-compose.prod.yml exec -T db \
  pg_dump -U helpdesk helpdesk_production | gzip > "${BACKUP_DIR}/${FILENAME}"

find "${BACKUP_DIR}" -name '*.sql.gz' -mtime +7 -delete
