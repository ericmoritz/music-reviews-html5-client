all:
	node_modules/.bin/browserify src/music-reviews.js -o build/music-reviews.js

watch:
	node_modules/.bin/watchify src/music-reviews.js -o build/music-reviews.js

demo:
	python -m SimpleHTTPServer
