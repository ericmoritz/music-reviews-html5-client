require("6to5/polyfill");
var MusicAppDispatcher = require("../dispatcher/MusicAppDispatcher");
var MusicAppConstants = require("../constants/MusicAppConstants");
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var JSONLDUtils = require("../utils/JSONLDUtils");

var CHANGE_EVENT = Symbol("CHANGE_EVENT");

var _data = {};

var PageStore = assign({}, EventEmitter.prototype, {
    emitChange() {
	this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
	this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
	this.removeListener(CHANGE_EVENT, callback)
    },
    get() {
	return _data;
    }
});

function handleNewData(url, x) {
    var ret = {url};

    if(JSONLDUtils.hasType(x, "ReviewList") && x.member) {
	ret.reviewList = x
    }

    if(JSONLDUtils.hasType(x, "User")) {
	ret.user = x
    } else if(x.user) {
	ret.user = x.user
    }

    if(x.seenItem) {
	ret.seenItem = x.seenItem;
    }

    if(x.loginForm) {
	ret.loginForm = x.loginForm;
    }
    return ret;
}

PageStore.dispatchToken = MusicAppDispatcher.register(function({action}) {
    switch(action.type) {
	case MusicAppConstants.NAVIGATE_COMPLETE:
	  _data = handleNewData(action.url, action.data);
	  PageStore.emitChange();
	  break;

	case MusicAppConstants.REVIEW_SEEN:
	case MusicAppConstants.REVIEW_UNSEEN:
	  _data.reviewList.member = _data.reviewList.member.filter((x) => x.review_id != action.review_id)
	  PageStore.emitChange();	
	  break;
	default:
	    // do nothing
    }
});

module.exports = PageStore;
