SHELL := /usr/bin/env bash

.PHONY: asdf-install
asdf-install:
	cat .tool-versions | cut -f 1 -d ' ' | xargs -n 1 asdf plugin-add || true
	asdf plugin update --all
	asdf install || true
	asdf reshim

.PHONY: install
install: asdf-install
install:
	pnpm install
	pnpm --dir package install
	pnpm --dir devapp install

.PHONY: detect-secret
detect-secret:
	detect-secrets scan --exclude-files "(pnpm-lock\.yaml|.*/pnpm-lock\.yaml)" > .secrets.baseline

.PHONY: devapp
devapp:
	pnpm --dir devapp dev
