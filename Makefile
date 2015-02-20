all: node_modules js/bundle.js css/bundle.css

clean:
	rm -rf {node_modules,*/bundle.*}

node_modules:
	npm install

js/bundle.js:
	node_modules/.bin/browserify js/app.js -o js/bundle.js

css/bundle.css:
	./node_modules/.bin/lessc css/style.less css/bundle.css

demo:
	node_modules/.bin/beefy js/app.js:js/bundle.js

