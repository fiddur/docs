#!/bin/bash

# preinst script for Auth0-docs package

NAME="docs"
file_default="/etc/default/auth0_$NAME"
file_init="/etc/init/auth0-$NAME.conf"

# Create user and group if non-existant
if ! getent passwd auth0-$NAME > /dev/null
then
  adduser --quiet --group --system --no-create-home auth0-$NAME
  usermod -G www-data auth0-$NAME
fi

if ! getent group auth0-$NAME > /dev/null
then
 	addgroup --quiet --system auth0-$NAME
fi

# Copy actual config files for verification on the postint script
if [ -e $file_default ]
then
	cp $file_default $file_default.postinst
fi

if [ -e $file_init ]
then
	cp $file_init $file_init.postinst
fi
