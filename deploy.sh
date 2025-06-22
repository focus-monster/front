#!/bin/bash

set -e

cd ~/fe/front

git pull origin main

podman build -t docker.io/chaejunlee/focus-monster-fe .

podman rm -f focus-monster-fe

podman run -d -p 4173:4173 --restart unless-stopped --name focus-monster-fe docker.io/chaejunlee/focus-monster-fe
