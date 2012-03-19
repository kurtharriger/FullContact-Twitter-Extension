$(document).ready(function () {
    var fullcontact = {};

    function getFullContactProfile(username, callback) {
        if (fullcontact[username]) {
            callback(fullcontact[username]);
        } else {
            fullcontact[username] = {};
            chrome.extension.sendRequest({
                'method': 'getFullContactProfile',
                'username': username
            }, function (data) {
                fullcontact[username] = data;
                callback(data);
            });
        }
    }

    function rate_limit_exceeded() {
        if (!$('.js-stream-title a.fullcontact-upgrade').length) {
            $('<a/>')
                .attr('href', 'https://developer.fullcontact.com/sign-up/?plan_id=566&commercial=true')
                .attr('target', '_new')
                .addClass('fullcontact-upgrade')
                .text('Upgrade Your FullContact Account')
                .appendTo('.js-stream-title');
        }
    }


    function add_indicator_to_stream() {
        $(".stream-item-header").each(function () {
            if (!$(this).find('.fullcontact_info').length) {
                var username = $(this).find('.username').text();
                var data = fullcontact[username];
                if (!data) {
                    getFullContactProfile(username, update_ui);
                } else {
                    if (data.status == 200) {
                        $('<img/>')
                            .addClass('fullcontact_info')
                            .prependTo(this);
                    } else {
                        if (data.status == 403) {
                            rate_limit_exceeded();
                        }
                    }
                }
            }
        });
    }


    function extend_profile_dialog() {
        if ($('.profile-modal').length 
            && !$('.profile-modal .fullcontact-profile-container').length) {

            var username = $('.profile-modal .js-screen-name ').text();
            getFullContactProfile(username, function (data) {
                if (data.status == 200) {
                    var container = $('<div>')
                        .addClass('fullcontact-profile-container')
                        .insertBefore('.profile-modal .social-proof');

                    var contactInfo = $(data.responseText);
                    contactInfo.appendTo(container);
                    $('.twttr-dialog-container, .twttr-dialog-content').width('700px');
                }
            });
        }
    }

    function update_ui() {
        add_indicator_to_stream();
        extend_profile_dialog();
    }

    setInterval(update_ui, 1000);
});