var React = require("react");
var MusicAppApi = require("../utils/MusicAppApi");

var LoginForm = React.createClass({
    handleSubmit(e) {
	e.preventDefault();
	var userUri = this.refs.userUri.getDOMNode().value.trim();
	MusicAppApi.login(this.props.data, userUri);
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
module.exports = LoginForm;
