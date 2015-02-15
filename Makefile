all: build/music-reviews.js build/music-reviews.css

build/music-reviews.js:
	mkdir -p build
	node_modules/.bin/browserify src/music-reviews.js -o build/music-reviews.js

build/music-reviews.css:
	mkdir -p build
	./node_modules/.bin/lessc src/style.less build/music-reviews.css

watch:
	node_modules/.bin/watchify src/music-reviews.js -o build/music-reviews.js

demo:
	node_modules/.bin/beefy src/music-reviews.js:build/music-reviews.js

