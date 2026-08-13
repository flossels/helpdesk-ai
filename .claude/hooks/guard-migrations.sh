#!/bin/bash
command=$(jq -r '.tool_input.command' <<<"$(cat)")

case "$command" in
  *"prisma migrate reset"*|*"prisma db push"*)
    echo "Refused: this rewrites the development database. Run it yourself." >&2
    exit 2
    ;;
esac

exit 0
