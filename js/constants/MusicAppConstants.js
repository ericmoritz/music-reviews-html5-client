module.exports = {
    CONTEXT: {
	"@context": {
	    "xsd": "http://www.w3.org/2001/XMLSchema#",
	    "hydra": "http://www.w3.org/ns/hydra/core#",
	    "mrs": "http://rdf.vocab-ld.org/vocabs/music-reviews.jsonld#",
	    "schema": "http://schema.org/",
	    "template": "hydra:template",
	    "mapping": "hydra:mapping",
	    "property": "hydra:property",
	    "variable": "hydra:variable",
	    "member": "hydra:member",

	    "queue": {"@id": "mrs:queue", "@type": "@id"},
	    "seen": {"@id": "mrs:seen", "@type": "@id"},
	    "queueForm": "mrs:queueForm",
	    "loginForm": "mrs:loginForm",
	    "User": "mrs:User",
	    "user": "mrs:user",
	    "ReviewList": "mrs:ReviewList",
	    "review_id": "mrs:review_id",
	    "isSeen": "mrs:isSeen",
	    "seenItem": "mrs:seenItem",
	    
	    "reviewRating": "schema:reviewRating",
	    "ratingValue": "schema:ratingValue",
	    "url": "schema:url",
	    "about": "schema:about",
	    "byArtist": "schema:byArtist",
	    "name": "schema:name",
	    "datePublished": {"@id": "schema:datePublished", "@type": "xsd:date"},
	    "author": "schema:author",
	}
    },
    NAVIGATE_COMPLETE: Symbol("NAVIGATE_COMPLETE"),
    REVIEW_SEEN: Symbol("REVIEW_SEEN"),
    REVIEW_UNSEE: Symbol("REVIEW_UNSEE"),

    PayloadSources: {
	SERVER_ACTION: Symbol("SERVER_ACTION"),
	VIEW_ACTION: Symbol("VIEW_ACTION")
    }
}
