# #!/bin/bash
#

if [ -d "docs" ]; then
  pushd docs
  rm -rf .git
fi
