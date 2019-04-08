#!/bin/sh
export $(egrep -v '^#' .env | xargs) && node -r dotenv/config `which npx` semantic-release && rm .npmrc && git push
