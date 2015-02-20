require("6to5/polyfill");

var React = require("react");
var bs = require('react-bootstrap');
var MusicAppApi = require("../utils/MusicAppApi");
var PageStore = require("../stores/PageStore");

var QueueForm = React.createClass({
    handleSubmit(e) {
	e.preventDefault();
	var ratingValue = this.refs.ratingValue.getDOMNode().value.trim();
	var datePublished = this.refs.datePublished.getDOMNode().value.trim();
	MusicAppApi.search(this.props.data, ratingValue, datePublished);
    },
    render() {
	return (
		<form onSubmit={this.handleSubmit}>
		<div>
		<label>Pub Date &gt;=</label><input ref="datePublished" placeholder="YYYY-MM-DD" />
		</div>
		<div>
		<label>Score &gt;=</label><input ref="ratingValue" placeholder="number" />
		</div>
		<input type="submit" value="update" />
		</form>
	)
    }
});


var Review = React.createClass({
    _onSeenButton() {
	var {isSeen, review_id} = this.props.data;
	var {seenItem} = PageStore.get();

	if(!!isSeen && !!review_id) {
	    MusicAppApi.reviewUnsee(seenItem, review_id)
	} else {
	    MusicAppApi.reviewSee(seenItem, review_id)
	}
    },
    render() {
	if(this.props.data) {
	    var {
		reviewRating: {ratingValue},
		url,
		isSeen,
		about: {
		    name: title,
		    byArtist: {name: artist}
		}
	    } = this.props.data;

	    var seenButton = (<bs.Button onClick={this._onSeenButton}>
			      {isSeen ? "Unsee" : "Seen"}
			      </bs.Button>);

	    return (
		    <span>
		    <bs.Badge>{ratingValue}</bs.Badge><span> </span>
		    <a href={url}>{title}</a>
		    <span> by {artist}</span>
		    {seenButton}
		    </span>
	    )
	}
    }
})


var ReviewList = React.createClass({
    render() {
	var {member, queueForm} = this.props.data;
	member = !!member && member.map ? member : [];

	var reviews = member.map(
	    x => <bs.ListGroupItem key={x.review_id}><Review data={x} /></bs.ListGroupItem>
	)

	var reviewsComp = (
	    reviews.length
		? <bs.ListGroup>{reviews}</bs.ListGroup>
	        : <div>No items</div>
	)

	var queueFormComp = !!queueForm ? <QueueForm data={queueForm} /> : null

	return (
		<bs.Grid>
		<bs.Row>
		<bs.Col md={8}>{reviewsComp}</bs.Col>
		<bs.Col md={4}>{queueFormComp}</bs.Col>
		</bs.Row>
		</bs.Grid>
	)
    }
});

module.exports = ReviewList;
