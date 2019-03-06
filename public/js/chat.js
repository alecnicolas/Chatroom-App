$(function() {

	//your IP address or localhost here
    var socket = io.connect("localhost:4444");


	//Buttons and inputs ----------------------------------------
	var message = $("#message");
	var username = $("#username");
	var send_message = $("#send_message");
	var send_username = $("#send_username");
	var chatroom = $("#feedback");
	var typing = $("#typing");
	var feedback = document.getElementById("feedback");

	$("#clearButton").click(function() {
		while (feedback.firstChild) {
			feedback.removeChild(feedback.firstChild);
		}
	});


	//Handle messages ----------------------------------------------
	send_message.click(function() {
		sendMessage();
	});

	document.getElementById("message").addEventListener("keyup", function(event) {
			socket.emit("typing");
			if (event.keyCode === 13) {
				event.preventDefault();
				sendMessage();
			}
		});

	function sendMessage() {
		if (message.val() != "") {
			socket.emit("new_message", {
				message: message
					.val()
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
			});
			document.getElementById("message").value = "";
		}
	}

	socket.on("new_message", data => {
		if (feedback.childNodes.length == 50) {
			feedback.removeChild(feedback.firstChild);
		}

		chatroom.append(
			"<div class='message-row'><img class='avatar' src=" +
				data.avatar +
				"><p class='message'><strong>" +
				data.username +
				"</strong>" +
				"<br>" +
				data.message +
				"</p><br></div>"
		);

		document.getElementById("chatroom").scrollTop = document.getElementById(
			"chatroom"
		).scrollHeight;
    });
    

	//User Connection ----------------------------------------
	socket.on("new_user", () => {
		chatroom.append(
			"<p class='message connect'><em>A new user has connected!</em></p>"
		);
	});

	socket.on("user_disconnect", data => {
		chatroom.append(
			"<p class='message disconnect'><em>" +
				data.username +
				" has disconnected</em></p>"
		);
	});


	//Handle username ----------------------------------------------
	send_username.click(function() {
		changeUsername();
	});

	function changeUsername() {
        let userElem = document.getElementById("username");
		socket.emit("change_username", {
			username: username
				.val()
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
        });
        userElem.placeholder = username.val()
		userElem.value = "";
    }
    
    document
        .getElementById("username")
        .addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                changeUsername();
            }
        });


	//Miscellanious ------------------------------------------------------
	socket.on("someone_typing", data => {
		console.log("hey someone is typing");
	});
});
