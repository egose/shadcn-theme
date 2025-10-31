SHELL := /usr/bin/env bash

.PHONY: asdf-install
asdf-install:
	cat .tool-versions | cut -f 1 -d ' ' | xargs -n 1 asdf plugin add || true
	asdf plugin update --all
	@while IFS= read -r line; do \
		if [ -n "$$line" ] && [ "$${line#\#}" != "$$line" ]; then continue; fi; \
		tool=$$(echo $$line | awk '{print $$1}'); \
		version=$$(echo $$line | awk '{print $$2}'); \
		echo "Installing $$tool $$version..."; \
		asdf install $$tool $$version; \
	done < .tool-versions
	asdf reshim

.PHONY: install
install: asdf-install
	pnpm install
	pnpm --dir packages/react install
	pnpm --dir packages/angular install
	pnpm --dir packages/react/@examples/nextjs install
	pnpm --dir packages/angular/@examples/standard install

.PHONY: detect-secret
detect-secret:
	detect-secrets scan --exclude-files "(pnpm-lock\.yaml|.*/pnpm-lock\.yaml)" > .secrets.baseline

.PHONY: nextjs
nextjs:
	pnpm --dir packages/react/@examples/nextjs dev
