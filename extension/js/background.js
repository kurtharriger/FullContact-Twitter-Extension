
function getFullContactProfile(request, sendResponse) {
    var apiKey = localStorage['fullcontact_apikey'];
    if(apiKey) {
        var url = 'https://api.fullcontact.com/v2/person.html';
        $.get(url, {'twitter': request.username, 'apiKey': apiKey})
         .complete(function(jqXHR) {
           if(jqXHR.status == 202) {
               setTimeout(function() { getFullContactProfile(request, sendResponse); }, 1000);
           }
           else {
               var data = {'status':jqXHR.status, 'responseText': jqXHR.responseText};
               sendResponse(data);
           }
         });
    } 
    else {
        sendResponse({'status': 'apikey not set'});
    }
}


function requestHandler(request, sender, sendResponse) {
    if(request.method == 'getFullContactProfile') {
        getFullContactProfile(request, sendResponse);
    }
    else {
        sendResponse({});
    }
}

chrome.extension.onRequest.addListener(requestHandler);
chrome.extension.onRequestExternal.addListener(requestHandler);

