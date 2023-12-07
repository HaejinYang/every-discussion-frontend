#!/bin/bash
cd app/every-discussion-frontend
git pull
sudo docker compose down
sudo docker compose up -d --build
