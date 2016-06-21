# #!/bin/bash
#

if [ ! -d "docs" ]; then
  git clone -b ${DOCS_CONTENT_BRANCH:-master} https://github.com/auth0/docs.git
  pushd docs
  git reset --hard ${DOCS_CONTENT_VERSION:-HEAD}
fi
