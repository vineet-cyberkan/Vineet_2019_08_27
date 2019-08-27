var canvas = window.canvas || {};
var d_Cont = '#dynamic_content';

(function (window, document, $, canvas) {
	canvas.generate = {
		init: function() {
			// area for constants etc
			canvas.generate.dataRequest();
		},

		dataRequest: function(){
			$.ajax({
	            url: 'https://jsonplaceholder.typicode.com/photos', // data request path
	            type: 'GET',
	            contentType: 'application/json',
	            dataType: 'json',

	            success: function success(photosData) {
					
	            },

	            complete: function() {

	            }
        	});
		}
	}
})(window, document, jQuery, canvas);

window.onload = function(){
	if ($(d_Cont).length) {
		canvas.generate.init();   // data request sent on page load
	}
}

window.onresize = function(){
	
}