#!/bin/bash
source .env
npx ng serve --host 0.0.0.0 --port "$FRONTEND_PORT"