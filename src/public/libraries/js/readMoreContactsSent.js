$(document).ready(function() {
	$('#link-read-more-contacts-sent').click(function() {
		let skipNumber = $('#request-contact-sent ul > li').length;

		$('.read-more-contacts-sent-loader').css('display', 'block')
		$(this).css('display', 'none')

		$.get(`/contact/read-more-contacts-sent?skip=${skipNumber}`, function(data){
			if(!data.length){
				$('.modal-see-more-contacts-sent').html('')
				return;
			}

			let moreContactSent = '';
			data.map(function(contact){
				moreContactSent += `<li class="_contactList" data-uid="${contact._id}">
									<div class="contactPanel">
										<div class="user-avatar">
											<img src="./libraries/images/users/${contact.avatar}" alt="">
										</div>
										<div class="user-name">
											<p>
												${contact.username}
											</p>
										</div>
										<br>
										<div class="user-address">
											<span>&nbsp ${contact.address}</span>
										</div>
										<div class="user-remove-request-sent action-danger" data-uid="${contact._id}">
											Hủy yêu cầu
										</div>
									</div>
								</li>`
			})

			$('#request-contact-sent ul').append(moreContactSent)

			$('.read-more-contacts-sent-loader').css('display', 'none')
			$(this).css('display', 'block')
		}.bind(this))
	})
})
