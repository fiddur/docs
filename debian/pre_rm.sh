#!/bin/bash

# prerm script for Auth0-docs package

NAME="docs"

service auth0-$NAME stop || true
rm -f /etc/logrotate.d/auth0-$NAME-logs
