#!/bin/bash

# Postinst script for Auth0-docs package

NAME="docs"
file_default="/etc/default/auth0_$NAME"
file_init="/etc/init/auth0-$NAME.conf"

if [ -e $file_default ]; then newhash_file_default=$(md5sum < $file_default); fi
if [ -e $file_default.postinst ]; then oldhash_file_default=$(md5sum < $file_default.postinst); fi
if [ -e $file_init ]; then newhash_file_init=$(md5sum < $file_init); fi
if [ -e $file_init.postinst ]; then oldhash_file_init=$(md5sum < $file_init.postinst); fi

# Check if one of the files changed. If so, restart; if not, reload
if [ -e $file_default.postinst ] && [ -e $file_init.postinst ]
then
	if [ "$newhash_file_default" != "$oldhash_file_default" ] || [ "$newhash_file_init" != "$oldhash_file_init" ]
	then
		echo "Init or default file changed, restarting"
		service auth0-$NAME stop || true
		service auth0-$NAME start
	else
		echo "Reloading"
		service auth0-$NAME reload || service auth0-$NAME restart
	fi
else
	echo "Restarting"
	service auth0-$NAME stop || true
	service auth0-$NAME start
fi

# Delete the files if they exists
rm $file_default.postinst $file_init.postinst 2> /dev/null || true

# Copy logrotate script
cp /opt/auth0/auth0-$NAME/debian/auth0-$NAME-logs /etc/logrotate.d/
