require("babel/register");
var MusicAppApi = require("./utils/MusicAppApi");
var MusicReviewApp = require("./components/MusicReviewApp");
var React = require("react");

window.React = React;

MusicAppApi.init();

React.render(
    React.createElement(MusicReviewApp, null),
    document.body
);
