#!/bin/bash
echo "window.__env = {" > ./src/assets/env.js
while read -r line || [[ -n "$line" ]]; do
  key=$(echo "$line" | cut -d '=' -f 1)
  value=$(echo "$line" | cut -d '=' -f 2-)
  echo "  $key: \"$value\"," >> ./src/assets/env.js
done < .env
echo "};" >> ./src/assets/env.js
