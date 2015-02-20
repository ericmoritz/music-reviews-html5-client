require("6to5/polyfill");
var React = require("react");
var bs = require('react-bootstrap');
var PageStore = require("../stores/PageStore");
var LoginForm = require("./LoginForm");
var UserMenu = require("./UserMenu");
var ReviewList = require("./ReviewList");

var Metadata = React.createClass({
    render() {
	return (
		<div>
  		<a href={this.props.url} target="_blank">{this.props.url}</a>
		</div>
	)
    }
})

var MusicReviewApp = React.createClass({
    componentDidMount() {
	PageStore.addChangeListener(this._onChange);
    },
    componentWillUnmount() {
	PageStore.removeChangeListener(this._onChange);
    },
    _onChange() {
	this.setState(PageStore.get());
    },
    getInitialState() {
	return PageStore.get();
    }, 
    render() {
	var loginForm = !!this.state.loginForm ? <LoginForm data={this.state.loginForm} /> : null;
	var userMenu = !!this.state.user ? <UserMenu data={this.state.user} /> : null;
	var reviewList = !!this.state.reviewList ? <ReviewList data={this.state.reviewList} /> : null;
	var metadata = !!this.state.url ? <Metadata url={this.state.url} /> : null;

	return (
	  <bs.Panel bsStyle="primary">
            {loginForm}
	    {userMenu}
	    {reviewList}
	    {metadata}
	  </bs.Panel>
	)
    }
});

module.exports = MusicReviewApp;

