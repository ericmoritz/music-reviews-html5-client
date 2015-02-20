var MusicAppConstants = require("../constants/MusicAppConstants");
var MusicAppActions = require("../actions/MusicAppActions");
var jsonld = require("jsonld");
var $ = require("jquery");
var JSONLDUtils = require("../utils/JSONLDUtils");

function hashUrl(hash) {
    if(hash) {
	return hash.substring(1, hash.length);
    }
}

module.exports = {
    serverUrl() { 
	return hashUrl(window.location.hash);
    },
    loadHashUrl() {
	var url = this.serverUrl();
	if(!url) { return }
	$.ajax({
	    url: url,
	    dataType: 'json',
	    success: data => {
		console.log(data);
		jsonld.compact(
		data,
		MusicAppConstants.CONTEXT,
		(err, compacted) => {
		    if(err) {
			console.error(url, err)
		    } else {
			console.log(compacted);
			MusicAppActions.navigateComplete(url, compacted);
		    }
		}
		)
	    },
	    error: (xhr, status, err) => {
		console.error(url, status, err.toString()) 
	    }
	})
    },
    init() {
	$(window).on("hashchange", this.loadHashUrl.bind(this));
	this.loadHashUrl(); // load initial data
    },
    login(loginForm, user_uri) {
	if(loginForm) {
	    var url = JSONLDUtils.iriTemplateRender(loginForm, {"@id": user_uri})
	    window.location.hash = "#" + url;
	}
    },
    search(queueForm, ratingValue, datePublished) {
	if(queueForm) {
	    var url = JSONLDUtils.iriTemplateRender(queueForm, {ratingValue, datePublished});
	    window.location.hash = "#" + url;
	}
    },
    reviewUnsee(seenItem, review_id) {
	// fire off DELETE of the seenItem URL
	// fire off PUT of the seenItem URL
	var url = JSONLDUtils.iriTemplateRender(seenItem, {review_id});
	$.ajax({
	    url,
	    method:"DELETE",
	    success: () => {
		MusicAppActions.reviewUnsee(review_id);
	    },
	    error: (xhr, status, err) => {
		console.log(url, status, err.toString());
	    }
	})

    },
    reviewSee(seenItem, review_id) {
	// fire off PUT of the seenItem URL
	var url = JSONLDUtils.iriTemplateRender(seenItem, {review_id});
	$.ajax({
	    url,
	    method:"PUT",
	    success: () => {
		MusicAppActions.reviewSeen(review_id);
	    },
	    error: (xhr, status, err) => {
		console.log(url, status, err.toString());
	    }
	})
    }
}
