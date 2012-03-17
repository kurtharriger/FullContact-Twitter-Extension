$(document).ready( function(){

    function show_fullcontact() {
        console.log(arguments);
        alert('todo');
    }

    setTimeout(function() {
      $('<button/>').addClass('fullcontact_info')
         .prependTo(".stream-item-header")
         .on('click', show_fullcontact);

    }, 100);
}); 
