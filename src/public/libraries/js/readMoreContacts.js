$(document).ready(function() {
	$('#link-read-more-contacts').click(function() {
		let skipNumber = $('#contacts ul > li').length;

		$('.read-more-contacts-loader').css('display', 'block')
		$(this).css('display', 'none')

		$.get(`/contact/read-more-contacts?skip=${skipNumber}`, function(data){
			if(!data.length){
				$('.modal-see-more-contacts').html('')
				return;
			}

			let moreContact = '';
			data.map(function(contact){
				moreContact += `
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
							<div class="user-talk" data-uid="${contact._id}">
								Trò chuyện
							</div>
							<div class="user-remove-contact action-danger" data-uid="${contact._id}">
								Xóa liên hệ
							</div>
						</div>
					</li>`
			})

			$('#contacts ul').append(moreContact)
			removeContact()

			$('.read-more-contacts-loader').css('display', 'none')
			$(this).css('display', 'block')
		}.bind(this))
	})
})
