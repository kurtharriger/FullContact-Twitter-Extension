$(document).ready( function(){

    function show_fullcontact() {
        console.log(arguments);
        alert('todo');
    }

    function complete_profile(username, container) {
        var header = $('<h1>FullContact</h1>').appendTo(container);
//        $('<span/>').addClass('fullcontact-loading').appendTo(header);
    }

    function extend_profile_dialog() {
        if($('.profile-modal').length && !$('.profile-modal .fullcontact-profile-container').length) {
            var container = $('<div>')
                .addClass('fullcontact-profile-container')
                .insertBefore('.profile-modal .social-proof');

            var username = $('.profile-modal .js-screen-name ').text();
            complete_profile(username, container);
        }
    }

    setTimeout(function() {
      $('<button/>').addClass('fullcontact_info')
         .prependTo(".stream-item-header")
         .on('click', show_fullcontact);
    }, 100);


    setInterval(extend_profile_dialog, 1000);

}); 
