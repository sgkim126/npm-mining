LIB_SRC := $(shell ls src/lib/*.ts)
TESTS_SRC := $(shell ls src/test/*.ts)
TESTS := $(patsubst src/%.ts, build/%.js, $(TESTS_SRC))
.PRECIOUS: $(TESTS_SRC) $(TESTS)

MOCHA := ./node_modules/.bin/mocha
WEBPACK := ./node_modules/.bin/webpack
TYPINGS := ./node_modules/.bin/typings
TSLINT := ./node_modules/.bin/tslint
NPM := $(shell which npm)
NODE := $(shell which node)
RM := $(shell which rm)
WGET := $(shell which wget)

split: build/split.js

test: $(TESTS)
	$(MOCHA) $^

build/%.js: src/%.ts $(LIB_SRC) | typings/main.d.ts
	$(WEBPACK) --entry ./$< --output-path $(@D) --output-filename $(@F)

node_modules: package.json
	$(NPM) install

typings/main.d.ts: typings.json | node_modules
	$(TYPINGS) install

lint: | node_modules
	$(TSLINT) -c tslint.json src/*.ts src/*/*.ts

clean:
	$(RM) -rf ./build/

distclean: | clean
	$(RM) -rf ./node_modules/
	$(RM) -rf ./typings/

./data:
	mkdir data

./data/all.json: | data
	$(WGET) https://registry.npmjs.org/-/all -O $@

./data/out/: ./build/split.js ./data/all.json
	$(NODE) $^ $@
