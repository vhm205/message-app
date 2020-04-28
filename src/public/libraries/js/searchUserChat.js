function searchUserChat(e) {
	if(e.keyCode === 13){
		const keyword = $('#input-search-user-chat').val();

		if(!keyword.length){
			alertify.notify('Bạn cần nhập username hoặc email để tìm kiếm', 'error');
			return;
		}

		$.get(`/contact/search-user?keyword=${keyword}`, function(data) {
			if(data.length){
				let results = '';
				data.map(user => {
					results += `
						<li class="user-talk" data-uid="${user._id}">
							<img src="./libraries/images/users/${user.avatar}" />
							<span id="username-search">
							${user.username}
							</span>
						</li>
					`;
				})
				$('#search-results ul').html(results);
				talkWithContact();
			} else{
				$('#search-results ul').html(`
				<div class="user-not-found">Không tìm thấy kết quả nào</div>
				`);
			}
			// Show result
			$('#search-results').css('display', 'block');
		}).catch(err => {
			alertify.notify(err.responseJSON[0], 'error');
		})
	}
}

$(document).ready(function() {
	$('#input-search-user-chat').on({
		keypress: searchUserChat,
		focus: () => {
			if($('#search-results ul').html() !== ''){
				$('#search-results').css('display', 'block');
			}
		},
		focusout: () => {
			// Something...
		}
	})
	$('.main-content').on('click', function() {
		$('#search-results').css('display', 'none');
	})
})
