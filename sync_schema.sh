#!/bin/bash

FILE_URL="https://raw.githubusercontent.com/danielgavidia/fractal-favorites/refs/heads/dev/backend/prisma/schema.prisma"
curl -o prisma/schema.prisma "$FILE_URL"

npx prisma generate