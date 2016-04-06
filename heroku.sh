# #!/bin/bash
#

curl -L -o master.zip https://github.com/auth0/docs/archive/master.zip
unzip master.zip
cp -r docs-master/* docs
rm -rf docs-master
rm master.zip
