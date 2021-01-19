# --
# -- Commit Message Linting
# --

.PHONY: \
	commit.lint

commit.lint:
	npx commitlint \
		--verbose \
		--from "origin/main"

# --
# -- Code Formatting & Linting
# --

.PHONY: \
	code \
	code.fix

code:
	npx eslint \
		--cache \
		--cache-location .eslintcache \
		--format codeframe \
			./src \
			./examples

code.fix:
	npx eslint \
		--cache \
		--cache-location .eslintcache \
		--fix \
		--format codeframe \
			./src \
			./examples

# --
# -- Testing
# --

.PHONY: \
	test

test:
	npx jest

# --
# -- Project Build
# --

.PHONY: \
	build

build:
	npx tsc

# --
# -- Package Build
# --

.PHONY: \
	package.build \
	package.build.clean \
	package.build.setup \
	package.build.compile \
	package.build.compile.verify \
	package.build.package \
	package.build.package.verify

package.build: \
	package.build.clean \
	package.build.setup \
	package.build.compile \
	package.build.compile.verify \
	package.build.package \
	package.build.package.verify

package.build.clean:
	rm -rf build/workspace

package.build.setup:
	mkdir -p build/workspace

package.build.compile:
	npx tsc -p build/tsconfig.json

	find build/workspace -type f -name "*.spec.js" -delete
	find build/workspace -type f -name "*.spec.js.map" -delete
	find build/workspace -type f -name "*.spec.d.ts" -delete

package.build.compile.verify:
	test ! -f build/workspace/application/handler.spec.js

	test -f build/workspace/application/handler.js
	test -f build/workspace/application/middleware.js
	test -f build/workspace/provider/aws.js

package.build.package:
	cp package.json build/workspace/package.json
	cp package-lock.json build/workspace/package-lock.json

	cp README.md build/workspace/README.md

package.build.package.verify:
	test -f build/workspace/package.json
	test -f build/workspace/package-lock.json

	test -f build/workspace/README.md

# --
# -- Package Publishing
# --

.PHONY: \
	package \
	package.publish.verify

package: \
	package.build \
	package.publish.verify

package.publish.verify:
	npm publish "./build/workspace" \
		--dry-run
