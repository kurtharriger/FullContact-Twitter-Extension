$(document).ready(function(){
    //console.log('fullcontact');
    
    // determine page type using url path
    var path = location.pathname;
    var page = '';
    var email = '';
    
    // contact view page: /003xxxxxxxx
    if(path.substr(0, 4) == '/003' && path.length > 4 && path.substr(path.length - 2, path.length) != '/e') {
        page = 'contact';
        email = $('#con15_ileinner a:first').text().trim();
        
        // insert FullContact html output
        insert_fullcontact_box(email, page);
    }

    // lead view page: /00Qxxxxxxxx
    if(path.substr(0, 4) == '/00Q' && path.length > 4 && path.substr(path.length - 2, path.length) != '/e') {
        page = 'lead';
        email = $('#lea11_ileinner a:first').text().trim();
        
        // insert FullContact html output
        insert_fullcontact_box(email, page);
    }
        
    // contact-edit page: /003xxxxxxxx/e
    if(path.substr(0, 4) == '/003' && path.substr(path.length - 2, path.length) == '/e') {
        page = 'contact-edit';
        email = $('#con15').val();
        
        // insert FullContact autofill button
        insert_fullcontact_autofill(email, page);
    }
    
    // lead-edit page: /00Qxxxxxxxx/e
    if(path.substr(0, 4) == '/00Q' && path.substr(path.length - 2, path.length) == '/e') {
        page = 'lead-edit';
        email = $('#lea11').val();
        
        // insert FullContact autofill button
        insert_fullcontact_autofill(email, page);
    }

    // a click event listener for the autofill button
    $('#fullcontact_autofill').on('click', function() {
        $(this).append('<img src="'+chrome.extension.getURL("images/loading.gif")+'" id="fullcontact_loading" />');
        
        // get email
        var email = '';
        // if it is on lead page, get the email from #lea11
        if($('#lea11').length) email = $('#lea11').val();
        // if it is on contact page, get the email from #con15
        else if($('#con15').length) email = $('#con15').val();
        
        // call autofill function
        fullcontact_autofill(email); 
        
        return false;    
    });

}); // end $(document).ready()

// insert fullcontact autofill button
function insert_fullcontact_autofill(email, page) {   
    $('h2.pageDescription').append('<a href="#" id="fullcontact_autofill" class="btn">' +
        '<img src="'+chrome.extension.getURL("images/fullcontact_32.png")+'" />' + 
        '<span>Autofill with FullContact details</span></a>' +
        '<div id="fullcontact_error"></div>');
    return;
}

// insert fullcontact box
function insert_fullcontact_box(email, page) {
    var error = null;
    
    if(email == '') {
        error = 'Please add an email address first.';
    } else if(!isRFC822ValidEmail(email)) {
        error = 'Invalid email.';
    }
    
    // find target for inserting fullcontact_box wrapper
    if(page == 'contact') var target = '#head_01BA000000UUby4_ep';
    if(page == 'lead') var target = '#head_01BA000000UUbyT_ep';
    
    if(!$(target).length) var target = '.bPageBlock:eq(1)';
    if(!$(target).length) var target = '.pbSubheader.tertiaryPalette:first';

    // insert fullcontact_box wrapper
    $(target).before('<br />' +
        '<div class="listRelatedObject"><div class="bPageBlock secondaryPalette">' +
            '<div class="pbHeader" style="padding-top: 4px !important;"><table  border="0" cellpadding="0" cellspacing="0">' +
                '<tr><td class="pbTitle">' +
                    '<h3 style="margin-left: 0px !important;">FullContact Details</h3>' +
                '</td></tr>' +
            '</table></div>' +
            '<div class="pbBody"><div id="fullcontact_box">' +
                '<div id="fullcontact_loading"><img src="'+ chrome.extension.getURL("images/loading.gif") +'" />&nbsp;&nbsp;&nbsp;Loading ...</div>' +
            '</div></div>' +
            '<div class="pbFooter secondaryPalette"><div class="bg"></div></div>' +
        '</div></div>' +
        '<div class="listElementBottomNav"></div>');
        
    // error encountered so don't do api call, just display error
    if(error) {
        $('#fullcontact_box').html(error);
        return;
    } 

    chrome.extension.sendRequest({method: 'getLocalStorage', key: 'fullcontact_apikey'}, function(response) {
        fullcontact_apikey = response.data;
        var xhr = new XMLHttpRequest();		
    	xhr.open('GET', 'https://api.fullcontact.com/v2/person.html?apiKey='
    	+ fullcontact_apikey
    	+ '&email='+ email, true);

    	xhr.onreadystatechange = function() {
    		if (xhr.readyState == 4) {				
    			// get the raw html output
    			var r = xhr.responseText;

    			// insert the response into #fullcontact_box
                $('#fullcontact_box').html(r);

                // If invalid API key - ask to enter it in the options page
                if($('#fullcontact_box').find('title').text() == '403 - Invalid API Key') {
                    $('#fullcontact_box').html('<h2>Your API key is invalid</h2>' +
                    '<br /><br />Please enter your FullContact API key in the options page.');
                }

                // tweak to differentiate the first #position-company for css
                $('#contactInfo #position-company:first').attr('id', 'title');			
    		}
    	}
    	xhr.send();
    });
}

// magical autofill function
function fullcontact_autofill(email) {
    var error = null;
    
    if(email == '') {
        error = 'Please add an email address first';
    } else if(!isRFC822ValidEmail(email)) {
        error = 'Invalid email address';
    }
    
    // error encountered so don't do api call, just display error
    if(error) {
        $('#fullcontact_loading').remove();
        $('#fullcontact_error')
            .html(error)
            .fadeIn().delay('2000').fadeOut()
            .html();
        return;
    }
    
    chrome.extension.sendRequest({method: 'getLocalStorage', key: 'fullcontact_apikey'}, function(response) {
        fullcontact_apikey = response.data;
        var xhr = new XMLHttpRequest();		
    	xhr.open('GET', 'https://api.fullcontact.com/v2/person.json?apiKey='
        + fullcontact_apikey
    	+ '&email='+ email, true);

    	xhr.onreadystatechange = function() {
    		if (xhr.readyState == 4) {				
    			// parse out JSON then pass the JSON object
    			var r = JSON.parse(xhr.responseText);

    			// ajax has loaded - so remove the loading gif
                $('#fullcontact_loading').remove();

                if(r.status != '200') {
                    if(r.status == '403') r.message += '. Please enter your FullContact API key in the options page.';

                    //alert('Error encountered: '+ r.message);
                    $('#fullcontact_error')
                        .html('Error encountered: '+ r.message)
                        .fadeIn().delay('2000').fadeOut()
                        .html();
                    return true;   
                }   

                // givenname -> firstname
                if(r.contactInfo.givenName) {
                    var firstname = '#name_firstlea2';
                    if($('#name_firstcon2').length) firstname = '#name_firstcon2';

                    if($(firstname).val() == '') {
                        $(firstname).addClass('autofilled');
                        $(firstname).val(r.contactInfo.givenName);               
                    }                    
                }

                // familyname -> lastname
                if(r.contactInfo.familyName) {
                    var lastname = '#name_lastlea2';
                    if($('#name_lastcon2').length) lastname = '#name_lastcon2';

                    if($(lastname).val() == '') {
                        $(lastname).addClass('autofilled');
                        $(lastname).val(r.contactInfo.familyName);
                    }                                
                }


                if(typeof r.organizations != 'undefined') {
                    // title
                    var org_title = '#lea4';
                    if($('#con5').length) org_title = '#con5';

                    if($(org_title).val() == '') {
                        $(org_title).addClass('autofilled');
                        $(org_title).val(r.organizations[0]['title']);
                    }             

                    // company
                    var org_name = '#lea3';
                    // no company field in the contact page

                    if($(org_name).val() == '') {
                        $(org_name).addClass('autofilled');
                        $(org_name).val(r.organizations[0]['name']);
                    }                 
                }

                // website - fillup with linkedin
                var website = '#lea12';

                if($(website).val() == '') { 
                    if(typeof r.socialProfiles != 'undefined') {
                      for (i=0;i<r.socialProfiles.length;i++) {
                          if(typeof r.socialProfiles[i]['type'] == 'undefined') continue;

                          if(r.socialProfiles[i]['type'] == 'linkedin') {
                              $(website).addClass('autofilled');
                              $(website).val(r.socialProfiles[i]['url']);
                          }
                      }
                    }
                }   

                // address - dump it all in the street
                var location = '#lea16street';
                if($('#con19street').length) location = '#con19street';

                if(r.demographics.locationGeneral) {

                    if($(location).val() == '') {
                        $(location).addClass('autofilled'); 
                        $(location).val(r.demographics.locationGeneral);
                    }            
                }

                // gender: male or female for title
                var gender = '#name_salutationlea2';
                if($('#name_salutationcon2').length) gender = '#name_salutationcon2';

                if(r.demographics.locationGeneral) {

                    if($(gender).val() == '') {
                        $(gender).addClass('autofilled'); 

                        if(r.demographics.gender == 'Male') $(gender).val('Mr.');
                        else if(r.demographics.gender == 'Female') $(gender).val('Ms.');
                    }            
                } // end if r.demographics.locationGeneral			
    		}
    	}
    	xhr.send();
    });
    
} // end function autofill

// check for valid email
function isRFC822ValidEmail(sEmail) {
    console.log(sEmail);
    
    var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
    var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
    var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
    var sQuotedPair = '\\x5c[\\x00-\\x7f]';
    var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
    var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
    var sDomain_ref = sAtom;
    var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
    var sWord = '(' + sAtom + '|' + sQuotedString + ')';
    var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
    var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
    var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
    var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

    var reValidEmail = new RegExp(sValidEmail);
  
    if(reValidEmail.test( $.trim(sEmail) )) {
        return true;
    }
  
    return false;
}