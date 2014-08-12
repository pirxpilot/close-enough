all: lint test build

lint:
	jshint index.js lib test


test:
	mocha

build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean lint test all
