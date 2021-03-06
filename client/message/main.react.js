// MessageApp
// Header
// ContainerMain
// -- MessageBox
// 	-- MessageNav
// 	-- MessageList
// 		-- MessageItem
// 		-- Pagination
// ContainerSide
// Footer

'use strict';

var React = require('../../dep/react/react');
var ReactDOM = require('../../dep/react/react-dom');

var MessagePanel = require('./modules/MessagePanel.react');
// var MessageList = require('./modules/MessageList.react');

var MessageBox = React.createClass({
	render: function() {
		return (<div className = "message-box">
				<MessagePanel url="/api/messages" />
			</div>
		);
	}
});

ReactDOM.render(<div className = "content-left" >
    <div className="left-wrap"> <MessageBox / >
    </div></div>,
	document.getElementById('example')
);
