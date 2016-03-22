split: | typings/main.d.ts
	./node_modules/.bin/webpack --entry ./src/split.ts --output-filename ./$@.js

node_modules:
	npm install

typings/main.d.ts: ./typings.json | node_modules
	./node_modules/.bin/typings install

clean:
	rm -rf ./build/

distclean: | clean
	rm -rf ./node_modules/
	rm -rf ./typings/

./data/all.json:
	wget https://registry.npmjs.org/-/all -O $@

./data/out/: ./data/all.json | split
	node ./build/split.js $< $@
