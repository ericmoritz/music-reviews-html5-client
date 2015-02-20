var React = require("react");
var bs = require('react-bootstrap');

var UserMenu = React.createClass({
    render() {
	var {queue: serviceQueueUrl, seen: serviceSeenUrl} = this.props.data;

	// TODO: abstract this away
	var queueUrl = "#" + serviceQueueUrl;
	var seenUrl = "#" + serviceSeenUrl;

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
module.exports = UserMenu;
