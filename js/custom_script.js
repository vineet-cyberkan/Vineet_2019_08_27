var canvas = window.canvas || {};
var d_Cont = '#dynamic_content', photos_Data = [];

(function (window, document, $, canvas) {
	canvas.generate = {
		init: function() {
			// area for constants etc
			canvas.generate.dataRequest();
		},

		pageLoaderShow: function() {
	        $('body').append('<div class="ajax-loader" style="" ></div>')
	    },

	    pageLoaderRemove: function() {
	        $('body>.ajax-loader').remove();
	    },

		dataRequest: function(){

			canvas.generate.pageLoaderShow(); // show loader 

			$.ajax({
	            url: 'https://jsonplaceholder.typicode.com/photos', // data request path
	            type: 'GET',
	            contentType: 'application/json',
	            dataType: 'json',

	            success: function success(photosData) {
					//console.log( "photosData =>"+photosData);
					//console.log( "photosData count =>"+photosData.length);
					if (photosData.length > 0 ) {
						photos_Data = photosData;    // stored data into an object when genrating canvas again and again
						canvas.generate.createDynamicButtons(); // to run in sequence 
					}
	            },

	            complete: function() {
	            	canvas.generate.pageLoaderRemove();
	            }
        	});
		},

		createDynamicButtons: function(){
			if( photos_Data.length > 0 ){

			} else {
				$('#dynamic_content').html('<p>No data avialable </p>')
			}
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