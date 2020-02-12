function callFindUsers(e) {
    if(e.keyCode === 13 || e.type === 'click'){
        const keyword = $('#input-find-users').val();

        if(!keyword.length){
            alertify.notify('Bạn cần nhập username hoặc email để tìm kiếm', 'warning');
            return;
        }

        $.get(`/contact/find-user?keyword=${keyword}`, function(data) {
            $('#find-user').find('ul').html(data)
            addRequestContact()
            cancelRequestContact()
        })
        .catch(err => alertify.notify(err.responseJSON[0], 'warning'))
    }
}

$(document).ready(function() {
    $('#input-find-users').on('keypress', callFindUsers);
    $('#btn-find-users').on('click', callFindUsers);
})
