all:
	jsx src/ build/

watch:
	jsx --watch src/ build/

demo:
	python -m SimpleHTTPServer
