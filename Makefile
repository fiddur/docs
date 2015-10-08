REPORTER ?= list
TEST_DB=mongodb://localhost:27017/auth11-tests
TEST_NODE_ENV=test

test: node_modules
	@db=$(TEST_DB) PORT=5050 NODE_ENV=$(TEST_NODE_ENV) BASE_URL=/docs NODE_TLS_REJECT_UNAUTHORIZED=0 \
		./node_modules/.bin/mocha --reporter $(REPORTER)

node_modules:
	@npm i

build_package: check-version-variable
	#trick npm to avoid a commit in git
	mv .git .git-back
	npm version $(VERSION_NUMBER)
	mv .git-back .git

	find . -name ".npmignore" -o -name ".gitignore" -delete

	tar -czf /tmp/auth0-docs-$(VERSION_NUMBER).tgz --exclude=".git" --exclude="$(WORKING_DIR)/test" -C .. $(WORKING_DIR)/
	mv /tmp/auth0-docs-$(VERSION_NUMBER).tgz ./auth0-docs-$(VERSION_NUMBER).tgz

	git checkout .

build_deb: check-fpm-installed check-version-variable check-deb-variables
	#
	# Accepted variables to be passed
	# WORKSPACE , GIT_URL , VERSION_NUMBER , GIT_BRANCH , GIT_COMMIT
	#
	#trick npm to avoid a commit in git
	mv .git .git-back
	npm version $(VERSION_NUMBER)
	mv .git-back .git

	find . -name ".npmignore" -o -name ".gitignore" -delete

	fpm -C $(WORKSPACE) --deb-user auth0-docs --deb-group auth0-docs \
	--before-install debian/pre_install.sh --after-install debian/post_install.sh \
	--before-remove debian/pre_rm.sh \
	--prefix /opt/auth0 --deb-upstart debian/auth0-docs --deb-default debian/auth0_docs \
	--url ' $(GIT_URL)' --version $(VERSION_NUMBER) -n auth0-docs \
	-x '**/.git*' -x '*.tgz' -x '**/test/*' \
	--description 'Jenkins build $(VERSION_NUMBER) - git commit $(GIT_BRANCH)-$(GIT_COMMIT)' \
	-t deb -s dir docs

	git checkout .

check-version-variable:
ifndef VERSION_NUMBER
	$(error VERSION_NUMBER is undefined)
endif

check-deb-variables:
ifndef WORKSPACE
	$(error WORKSPACE is undefined)
endif

check-fpm-installed:
	@command -v fpm >/dev/null 2>&1 || { echo >&2 "fpm required to build DEBs but not installed"; \
	echo >&2 "Install with: \n $ sudo apt-get install ruby-dev gcc && sudo gem install fpm"; \
	echo >&2 "Aborting"; exit 1; }

test-shrinkwrap-status:
	@./node_modules/.bin/npm-shrinkwrap
	@git status | grep npm-shrinkwrap.json ; test "$$?" -eq 1
	@echo shrinkwrap is okay

test-sec-deps:
	@./node_modules/.bin/nsp audit-shrinkwrap

.PHONY: test
