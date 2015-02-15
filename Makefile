all: build/music-reviews.js build/music-reviews.css

build/music-reviews.js:
	node_modules/.bin/browserify src/music-reviews.js -o build/music-reviews.js

build/music-reviews.css:
	./node_modules/.bin/lessc src/style.less build/music-reviews.css

watch:
	node_modules/.bin/watchify src/music-reviews.js -o build/music-reviews.js

demo:
	node_modules/.bin/beefy --index=index.html src/music-reviews.js

