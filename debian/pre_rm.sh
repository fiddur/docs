#!/bin/bash

# prerm script for Auth0-docs package

NAME="docs"

case "$1" in
  remove)
  echo "Removing $NAME"
  echo "Stopping service"
  service auth0-$NAME stop || true
  rm -f /etc/logrotate.d/auth0-$NAME-logs
  ;;
esac
