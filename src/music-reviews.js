require("6to5/polyfill");
var URI = require("uri-template-lite").URI;
var React = require("react");
var $ = require("jquery");
var bs = require('react-bootstrap');
var jsonld = require('jsonld');

function ensureArray(x) {
    if(x.find) {
	return x;
    } else {
	return [x]
    }
}

function iriTemplateRender(iriTemplate, variables) {
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
}

var UserMenu = React.createClass({
    render() {
	var queueUrl = "#" + this.props.data.queue;
	var seenUrl = "#" + this.props.data.seen;
	return (
	    <bs.Navbar>
              <bs.Nav>
  	        <bs.NavItem entryKey={1} href={queueUrl}>Queue</bs.NavItem>
		<bs.NavItem entryKey={2} href={seenUrl}>Seen</bs.NavItem>
              </bs.Nav>
            </bs.Navbar>
	)
    }
})

var Review = React.createClass({
    render() {
	return (
	    <span>
		<bs.Badge>{this.props.data.reviewRating.ratingValue}</bs.Badge><span> </span>
		<a href={this.props.data.url}>{this.props.data.about.name}</a>
		<span> by {this.props.data.about.byArtist.name}</span>
            </span>
	)
    }
})

var QueueForm = React.createClass({
    handleSubmit(e) {
	e.preventDefault();
	var properties = {}
	
	var ratingValue = this.refs.ratingValue.getDOMNode().value.trim();
	if(ratingValue) {
	    properties['ratingValue'] = ratingValue;
	}

	var datePublished = this.refs.datePublished.getDOMNode().value.trim();
	if(datePublished) {
	    properties['datePublished'] = datePublished
	}

	window.location.hash = "#" + iriTemplateRender(
	    this.props.data,
	    properties
	);
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

var ReviewList = React.createClass({
    render() {
	var formColContent;
	var members = this.props.data.member;
	var listColContent = (() => {
	    if(members.length) {
		var items = members.map(
		    x => <bs.ListGroupItem><Review data={x} /></bs.ListGroupItem>
		)
		return <bs.ListGroup>{items}</bs.ListGroup>
	    } else {
		return <div>No items</div>
	    }
	})();

	if(this.props.data.queueForm) {
	    formColContent = <QueueForm data={this.props.data.queueForm} />
	}

	return (
	    <bs.Grid>
		<bs.Row>
		  <bs.Col md={8}>{listColContent}</bs.Col>
		  <bs.Col md={4}>{formColContent}</bs.Col>
		</bs.Row>
	    </bs.Grid>
	)
    }
});

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

var Loading = React.createClass({
    render() {
	return <div><span className="icon-spin">Loading...</span></div>
    }
})

var MusicReviewApp = React.createClass({
    CONTEXT: {
	"@context": {
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

	    "reviewRating": "schema:reviewRating",
	    "ratingValue": "schema:ratingValue",
	    "url": "schema:url",
	    "about": "schema:about",
	    "byArtist": "schema:byArtist",
	    "name": "schema:name",
	    "datePublished": "schema:datePublished"
	}
    },
    getInitialState() {
	return {data: {}}
    },
    navigate(url) {
	this.setState({loading:true, data:this.state.data})
	$.ajax({
	    url: url,
	    dataType: 'json',
	    success: data => {
		console.log(data);
		jsonld.compact(
		data,
		this.CONTEXT,
		(err, compacted) => {
		    if(err) {
			console.error(url, err)
		    } else {
			console.log(compacted);
			this.setState({loading:false, data:compacted})
		    }
		}
		)
	    },
	    error: (xhr, status, err) => {
		this.setState({loading:false, data:{}}),
		console.error(url, status, err.toString()) 
	    }
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
	    return object['@type'] && ensureArray(object['@type']).find(x => x == type)
	}
	var nodes = [];
	var content, loginForm, userMenu, userObj, reviewList, loading;

	if(this.state.loading) {
	    loading = <Loading />
	}

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

	return (<bs.Panel bsStyle="primary">
		{loginForm}
		{userMenu}
		{loading}
		{reviewList}
		<div>
  		<a href={this.serverUrl()} target="_blank">{this.serverUrl()}</a>
		</div>
	
		</bs.Panel>)
    }
});

// Export these as globals
window.React = React;
window.MusicReviewApp = MusicReviewApp;
