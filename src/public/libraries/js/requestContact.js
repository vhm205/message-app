function addRequestContact() {
    $('.user-add-new-contact').click(function() {
        const targetId = $(this).data('uid')

        $.post('/contact/add-request-contact', { uid: targetId }, function(data) {
            if(data.success){
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).css('display', 'inline-block')
                increaseNumberQueueContact('count-request-contact-sent')
                socket.emit('request-add-contact', { contactId: targetId })
            }
        })
    })
}

function cancelRequestContact() {
    $('.user-remove-request-contact').click(function() {
        const targetId = $(this).data('uid')

        $.ajax({
            url: '/contact/cancel-request-contact',
            type: 'delete',
            data: { uid: targetId }
        })
        .done(data => {
            if(data.success){
                $('#find-user').find(`.user-remove-request-contact[data-uid=${targetId}]`).hide()
                $('#find-user').find(`.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block')
                decreaseNumberQueueContact('count-request-contact-sent')
                socket.emit('request-cancel-contact', { contactId: targetId })
            }
        })
        .fail(err => console.error(err))        
    })
}
