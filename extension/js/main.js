$(document).ready( function(){

    function show_fullcontact() {
        console.log(arguments);
        alert('todo');
    }

    function complete_profile(container, request) {
       chrome.extension.sendRequest(request, function(response) {
         if(response.status == 200) {
           var contactInfo = $(response.responseText).appendTo(container);
           $('.twttr-dialog-container, .twttr-dialog-content').width('700px');
         }
         else if(response.status == 202) {
             console.log('Queued, will try again');
             setTimeout(function() {
               complete_profile(container, request); 
             }, 1000);

         }
       });
    }

    function extend_profile_dialog() {
        if($('.profile-modal').length && !$('.profile-modal .fullcontact-profile-container').length) {
            var container = $('<div>')
                .addClass('fullcontact-profile-container')
                .insertBefore('.profile-modal .social-proof');

            var username = $('.profile-modal .js-screen-name ').text();
            
            var request = {'method':'getFullContactProfile', 'username':username};
            complete_profile(container, request);
        }
    }

    setTimeout(function() {
      $('<button/>').addClass('fullcontact_info')
         .prependTo(".stream-item-header")
         .on('click', show_fullcontact);
    }, 100);


    setInterval(extend_profile_dialog, 1000);

}); 
