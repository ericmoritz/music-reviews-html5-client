var URI = require("uri-template-lite").URI

module.exports = {
    ensureArray(x) {
	if(!x) return [];
	if(x.map) return x;
	else return [x];
    },
    iriTemplateRender(iriTemplate, variables) {
	var template = iriTemplate['template'];
	var bindings = {}
	for(var prop in variables) {
	    var mapping = this.ensureArray(iriTemplate['mapping']).find(
		mapping => mapping['property'] == prop
	    )
	    if(mapping) {
		bindings[mapping['variable']] = variables[prop]
	    }
	}
	return URI.expand(template, bindings)
    },
    hasType(object, type) {
	return object['@type'] && this.ensureArray(object['@type']).find(x => x == type)
    }
}
