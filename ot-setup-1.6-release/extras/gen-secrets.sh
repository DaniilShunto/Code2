#!/bin/bash

# a simple shell script, to quickly generate some secrets to place in .env file
if type "pwgen" > /dev/null; then
  echo "POSTGRES_PASSWORD=$(pwgen 32)"
  echo "KEYCLOAK_ADMIN_PASSWORD=$(pwgen 32)"
  echo "KEYCLOAK_CLIENT_SECRET_CONTROLLER=$(pwgen 32)"
  echo "KEYCLOAK_CLIENT_SECRET_OBELISK=$(pwgen 32)"
  echo "KEYCLOAK_CLIENT_SECRET_RECORDER=$(pwgen 32)"
  echo "SPACEDECK_API_TOKEN=$(pwgen 32)"
  echo "SPACEDECK_INVITE_CODE=$(pwgen 32)"
  echo "ETHERPAD_API_KEY=$(pwgen 32)"
else
  echo "the utility 'pwgen' needs to be installed."
  exit 1  
fi