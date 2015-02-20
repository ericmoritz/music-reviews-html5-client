all: build/music-reviews.js build/music-reviews.css

build/music-reviews.js:
	node_modules/.bin/browserify js/app.js -o js/bundle.js

build/music-reviews.css:
	./node_modules/.bin/lessc css/style.less css/bundle.css

demo:
	node_modules/.bin/beefy js/app.js:js/bundle.js

