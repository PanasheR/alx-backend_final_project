(function () {
	// Grab all HTML elements into variables
	const socket = io.connect();
	const $messageForm = $('#message-form');
	const $message = $('#message');
	const $chat = $('#chat');
	const $messageArea = $('#message-area');
	const $userForm = $('#user-form');
	const $users = $('#users');
	const $onlineUsersHeader = $('#online-users-header');
	const $username = $('#username');
	// Form submit to send messages
	$messageForm.submit(function (e) {
		e.preventDefault();
		socket.emit('send message', $message.val());
		$message.val('');
	});
	// When a new message is sent, print username and time to interface
	socket.on('new message', function (data) {
		let currentHours = new Date().getHours() > 9 ? new Date().getHours() : ('0' + new Date().getHours())
		let currentMinutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : ('0' + new Date().getMinutes())
		data.msg ? (
			$chat.append(`<li>[${currentHours}:${currentMinutes}]<strong> ${data.user}: </strong>${data.msg}</li>`))
			: alert('Blank message not allow!');
	});
	// Form submit to username
	$userForm.submit(function (e) {
		e.preventDefault();
		socket.emit('new user', $username.val(), function (data) {
			data ? (
				$userForm.hide(),
				$messageArea.show()
			) : alert('Ohps. What\'s your name!')
		});
		$username.val('');
	});
	// get all users connected on localhost:3000 and print a list
	socket.on('get userList', function (data) {
		let html = '';
		for (i = 0; i < data.length; i++) {
			html += `<li class="list-item"><strong>${data[i]}</strong></li>`;
		}
		$onlineUsersHeader.html(`<span class="card-title"> Users in the room: </span><span class="label label-success">${data.length}</span>`);
		$users.html(html);
	});

})();
