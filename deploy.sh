#!/bin/bash

set -e

cd ~/fe/front

git fetch origin main
git reset --hard origin/main

/opt/homebrew/bin/podman build -t docker.io/chaejunlee/focus-monster-fe .

/opt/homebrew/bin/podman rm -f focus-monster-fe

/opt/homebrew/bin/podman run -d -p 4173:4173 --restart unless-stopped --name focus-monster-fe docker.io/chaejunlee/focus-monster-fe
