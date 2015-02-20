var MusicAppDispatcher = require('../dispatcher/MusicAppDispatcher');
var MusicAppConstants = require('../constants/MusicAppConstants');

module.exports = {
    navigateComplete(url, data) {
	MusicAppDispatcher.handleServerAction({
	    type: MusicAppConstants.NAVIGATE_COMPLETE,
	    data: data,
	    url: url
	})
    },
    reviewSeen(review_id) {
	MusicAppDispatcher.handleViewAction({
	    type: MusicAppConstants.REVIEW_SEEN,
	    review_id
	})
    },
    reviewUnsee(review_id) {
	MusicAppDispatcher.handleViewAction({
	    type: MusicAppConstants.REVIEW_UNSEEN,
	    review_id
	})
    }
}
    
