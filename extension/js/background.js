
function getFullContactProfile(request, sendResponse) {
    var apiKey = localStorage['fullcontact_apikey'];
    if(apiKey) {
        var url = 'https://api.fullcontact.com/v2/person.html';
        $.get(url, {'twitter': request.username, 'apiKey': apiKey})
         .complete(function(jqXHR) {
           var data = {'status':jqXHR.status, 'responseText': jqXHR.responseText};
 console.log(data);
           sendResponse(data);
         });
    } 
    else {
        chrome.tabs.create({'url': 'popup.html'});
        sendResponse({'status': 'apikey not set'});
    }
}


function requestHandler(request, sender, sendResponse) {
    console.log(request);
    if(request.method == 'getFullContactProfile') {
        getFullContactProfile(request, sendResponse);
    }
    else {
        sendResponse({});
    }
}

chrome.extension.onRequest.addListener(requestHandler);
chrome.extension.onRequestExternal.addListener(requestHandler);

// getFullContactProfile({username:'al3x'}, function(data) { console.log(data); });
// getFullContactProfile({username:'kurtharriger'}, function(data) { console.log(data); });
