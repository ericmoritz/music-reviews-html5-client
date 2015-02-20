var URI = require("uri-template-lite").URI

function ensureArray(x) {
    if(x.find) {
	return x;
    } else {
	return [x]
    }
}

module.exports = {
    iriTemplateRender(iriTemplate, variables) {
	var template = iriTemplate['template'];
	var bindings = {}
	for(var prop in variables) {
	    var mapping = ensureArray(iriTemplate['mapping']).find(
		mapping => mapping['property'] == prop
	    )
	    if(mapping) {
		bindings[mapping['variable']] = variables[prop]
	    }
	}
	return URI.expand(template, bindings)
    },
    hasType(object, type) {
	return object['@type'] && ensureArray(object['@type']).find(x => x == type)
    }
}
