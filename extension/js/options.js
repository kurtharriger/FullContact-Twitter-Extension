$(document).ready(function () {

    function loadOptions() {
        // populate the options form fields
        $('#fullcontact_apikey').val(localStorage['fullcontact_apikey']);
    }

    function saveOptions() {
        localStorage['fullcontact_apikey'] = $('#fullcontact_apikey').val().trim();

        $('.status').html('Saved successfully ...');
        $('.status').fadeIn().delay('2000').fadeOut();
    }

    function resetOptions() {
        localStorage.removeItem('fullcontact_apikey');
        $('#fullcontact_apikey').val('');

        $('.status').html('Reset successfully ...');
        $('.status').fadeIn().delay('2000').fadeOut();
    }


    // set the logo image through JS - chorme doesn't allow local css reference
    $('.fullcontact_logo').attr('src', chrome.extension.getURL("images/fullcontact_logo.png"));
    $('.save').on('click', saveOptions);
    $('.reset').on('click', resetOptions);
    loadOptions();

});