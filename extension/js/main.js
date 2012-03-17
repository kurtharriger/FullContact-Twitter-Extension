$(document).ready( function(){
    var fullcontact = {};

    function getFullContactProfile(username, callback) {
        if(fullcontact[username]) {
            callback(fullcontact[username]);
        }
        else {
            fullcontact[username] = {};
            chrome.extension.sendRequest(
                {'method':'getFullContactProfile', 'username':username}, 
                function(data) {
                    fullcontact[username] = data;
                    callback(data);
                });
        }
    }

    function extend_profile_dialog() {
       if($('.profile-modal').length && 
          !$('.profile-modal .fullcontact-profile-container').length) {

           var username = $('.profile-modal .js-screen-name ').text();
           getFullContactProfile(
               username, 
               function(data) {
                   if(data.status == 200) {
                       var container = $('<div>')
                           .addClass('fullcontact-profile-container')
                           .insertBefore('.profile-modal .social-proof');

                       var contactInfo = $(data.responseText);
                       console.log(contactInfo.find("#contactInfo"));
                       contactInfo.appendTo(container);
                       $('.twttr-dialog-container, .twttr-dialog-content').width('700px');
                   }
               });
        }
    }

    function update_ui() {
       $(".stream-item-header").each(function() {
          var username = $(this).find('.username').text();
          var data = fullcontact[username];
          if(!data) {
              getFullContactProfile(username, update_ui);
          }
          else if(data.status == 200) {
              if(!$(this).find('.fullcontact_info').length) {
                  $('<button/>').addClass('fullcontact_info').prependTo(this);
              }
          }
       });
       extend_profile_dialog();
        
    }

    setInterval(update_ui, 1000);

}); 
