require("6to5/polyfill");
var URI = require("uri-template-lite").URI;
var React = require("react");

function iriTemplateRender(iriTemplate, variables) {
    var template = iriTemplate['hydra:template'];
    var bindings = {}
    for(var prop in variables) {
	var mapping = iriTemplate['hydra:mapping'].find(
	    mapping => mapping['hydra:property'] == prop
	)
	if(mapping) {
	    bindings[mapping['hydra:variable']] = variables[prop]
	}
    }
    return URI.expand(template, bindings)
}

var UserMenu = React.createClass({
    render() {
	var queueUrl = "#" + this.props.data.queue;
	var seenUrl = "#" + this.props.data.seen;
	return (
	    <ul>
		<li><a href={queueUrl}>Queue</a></li>
		<li><a href={seenUrl}>Seen</a></li>
	    </ul>
	)
    }
})

var Review = React.createClass({
    render() {
	return (
	    <span>
		<span className="rating">{this.props.data.reviewRating.ratingValue}</span>
		:
		<a href={this.props.data.url}>{this.props.data.about.name}</a>
		<span> by {this.props.data.about.byArtist.name}</span>
            </span>
	)
    }
})

var ReviewList = React.createClass({
    render() {
	var members = this.props.data.member;

	if(members.length) {
	    var items = members.map(
		x => <li><Review data={x} /></li>
	    )
	    return <ul>{items}</ul>
	} else {
	    return <div>No items</div>
	}
    }
})

var LoginForm = React.createClass({
    handleSubmit(e) {
	e.preventDefault();
	var userUri = this.refs.userUri.getDOMNode().value.trim();
	var url = iriTemplateRender(this.props.data, {'@id': userUri});
	window.location.hash = "#" + url;
    },
    render() {
	return (
	    <form className="LoginForm" onSubmit={this.handleSubmit}>
		Login: <input type="text" placeholder="user uri here" ref="userUri" />
		<input type="submit" value="Login" />
	    </form>
	)
    }
});

var MusicReviewApp = React.createClass({
    getInitialState() {
	return {data: {}}
    },
    navigate(url) {
	$.ajax({
	    url: url,
	    dataType: 'json',
	    success: data => this.setState({data:data}),
	    error: (xhr, status, err) => console.error(url, status, err.toString()) 
	})
    },
    serverUrl() {
	if(window.location.hash) {
	    return window.location.hash.substring(1, window.location.hash.length)
	}
    },
    navigateToHash() {
	var serverUrl = this.serverUrl()
	if(serverUrl) {
	    this.navigate(serverUrl);
	}
    },
    componentDidMount() {
	this.navigateToHash();
	$(window).on("hashchange", this.navigateToHash.bind(this))
    },
    render() {
	function hasType(object, type) {
	    return object['@type'] && object['@type'].find(x => x == type)
	}
	var nodes = [];
	var loginForm, userMenu, userObj, reviewList;

	if(hasType(this.state.data, 'User')) {
	    userObj = this.state.data;
	} else if(this.state.data.user) {
	    userObj = this.state.data.user;
	}

	if(this.state.data.loginForm) {
	    loginForm = <LoginForm data={this.state.data.loginForm} />
	}

	if(hasType(this.state.data, 'ReviewList')) {
	    reviewList = <ReviewList data={this.state.data} />
	}

        if(userObj) {
	    userMenu = <UserMenu data={userObj} />
	}

	return (<div className="MusicReviewApp">
		{loginForm}

		{userMenu}

		{reviewList}

		<div>
  		<a href={this.serverUrl()} target="_blank">{this.serverUrl()}</a>
		</div>
		</div>)
    }
});

// Export these as globals
window.React = React;
window.MusicReviewApp = MusicReviewApp;
