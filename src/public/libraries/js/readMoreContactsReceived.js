$(document).ready(function() {
	$('#link-read-more-contacts-received').click(function() {
		let skipNumber = $('#request-contact-received ul > li').length;

		$('.read-more-contacts-received-loader').css('display', 'block')
		$(this).css('display', 'none')

		$.get(`/contact/read-more-contacts-received?skip=${skipNumber}`, function(data){
			if(!data.length){
				$('.modal-see-more-contacts-received').html('')
				return;
			}

			let moreContactReceived = '';
			data.map(function(contact){
				moreContactReceived += `
				<li class="_contactList" data-uid="${contact._id}">
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
						<div class="user-accept-request-contact-received" data-uid="${contact._id}">
							Chấp nhận
						</div>
						<div class="user-remove-request-contact-received action-danger" data-uid="${contact._id}">
							Xóa yêu cầu
						</div>
					</div>
				</li>`
			})

			$('#request-contact-received ul').append(moreContactReceived)
			removeRequestContactReceived()
			acceptRequestContactReceived()

			$('.read-more-contacts-received-loader').css('display', 'none')
			$(this).css('display', 'block')
		}.bind(this))
	})
})
