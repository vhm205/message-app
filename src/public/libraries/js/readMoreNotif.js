$(document).ready(function() {
	$('#link-read-more-notif').click(function() {
		let skipNumber = $('.list-notification > li').length;

		$('.read-more-loader').css('display', 'block')
		$(this).css('display', 'none')

		$.get(`/notification/read-more?skip=${skipNumber}`, function(data){
			if(!data.length){
				$('.modal-see-more-notify').html('Không còn thông báo nào')
				return;
			}

			let moreNotif = '';
			data.map(function(notification){
				moreNotif += `<li>${notification}</li>`
			})

			$('.list-notification').append(moreNotif)

			$('.read-more-loader').css('display', 'none')
			$(this).css('display', 'block')
		}.bind(this))
	})
})
