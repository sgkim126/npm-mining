LIB_SRC := $(shell ls src/lib/*.ts)
TESTS_SRC := $(shell ls src/test/*.ts)
TESTS := $(patsubst src/%.ts, build/%.js, $(TESTS_SRC))
.PRECIOUS: $(TESTS_SRC) $(TESTS)

split: | typings/main.d.ts
	./node_modules/.bin/webpack --entry ./src/split.ts --output-filename ./$@.js

test: $(TESTS)
	./node_modules/.bin/mocha $^

build/test/%.js: src/test/%.ts $(LIB_SRC)
	./node_modules/.bin/webpack --entry ./$< --output-path $(@D) --output-filename $(@F)

node_modules:
	npm install

typings/main.d.ts: ./typings.json | node_modules
	./node_modules/.bin/typings install

lint: | node_modules
	./node_modules/.bin/tslint -c tslint.json src/*.ts src/*/*.ts

clean:
	rm -rf ./build/

distclean: | clean
	rm -rf ./node_modules/
	rm -rf ./typings/

./data/all.json:
	wget https://registry.npmjs.org/-/all -O $@

./data/out/: ./data/all.json | split
	node ./build/split.js $< $@
