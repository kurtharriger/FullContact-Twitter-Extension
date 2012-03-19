function loadOptions() {
	// set the logo image through JS - chorme doesn't allow local css reference
	$('#fullcontact_logo').attr('src', chrome.extension.getURL("images/fullcontact_logo.png"));
  	
	// populate the options form fields
	$('#fullcontact_apikey').val(localStorage['fullcontact_apikey']);
}

function saveOptions() {
	localStorage['fullcontact_apikey'] = $('#fullcontact_apikey').val().trim();
	
	$('#fcsf_options_status').html('Saved successfully ...');
	$('#fcsf_options_status').fadeIn().delay('2000').fadeOut();
}

function resetOptions() {
	localStorage.removeItem('fullcontact_apikey');
	$('#fullcontact_apikey').val('');

	$('#fcsf_options_status').html('Reset successfully ...');
	$('#fcsf_options_status').fadeIn().delay('2000').fadeOut();
}