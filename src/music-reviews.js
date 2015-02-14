function iriTemplateRender(iriTemplate, variables) {
    var template = iriTemplate['hydra:template'];
    var bindings = {}
    function findMapping(property) {
	for(i in iriTemplate['hydra:mapping']) {
	    var mapping = iriTemplate['hydra:mapping'][i];
	    if(mapping['hydra:property'] == property) {
		return mapping;
	    }
	}
    }
    for(var prop in variables) {
	var mapping = findMapping(prop);
	if(mapping) {
	    bindings[mapping['hydra:variable']] = variables[prop]
	}
    }
    return (new URITemplate(template).expand(bindings))
}
var UserMenu = React.createClass({
    render: function() {
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
    render: function() {
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
    render: function() {
	var members = this.props.data.member;

	if(members.length) {
	    var items = members.map(
		function(x) {
		    return <li><Review data={x} /></li>;
		}
	    )
	    return <ul>{items}</ul>
	} else {
	    return <div>No items</div>
	}
    }
})

var LoginForm = React.createClass({
    handleSubmit: function(e) {
	e.preventDefault();
	var userUri = this.refs.userUri.getDOMNode().value.trim();
	url = iriTemplateRender(this.props.data, {'@id': userUri});
	window.location.hash = "#" + url;
    },
    render: function() {
	return (
	    <form className="LoginForm" onSubmit={this.handleSubmit}>
		Login: <input type="text" placeholder="user uri here" ref="userUri" />
		<input type="submit" value="Login" />
	    </form>
	)
    }
});

var MusicReviewApp = React.createClass({
    getInitialState: function() {
	return {data: {}}
    },
    navigate: function(url) {
	$.ajax({
	    url: url,
	    dataType: 'json',
	    success: function(data) {
		this.setState({data:data})
	    }.bind(this),
	    error: function(xhr, status, err) {
		console.error(url, status, err.toString());
	    }.bind(this)
	})
    },
    serverUrl: function() {
	if(window.location.hash) {
	        return window.location.hash.substring(1, window.location.hash.length)
	    }
    },
    navigateToHash: function() {
	var serverUrl = this.serverUrl()
	if(serverUrl) {
	        this.navigate(serverUrl);
	    }
    },
    componentDidMount: function() {
	this.navigateToHash();
	$(window).on("hashchange", this.navigateToHash.bind(this))
    },
    render: function() {
	function hasType(object, type) {
	    return _.find(object['@type'], function(x) { return x == type })
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
