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

	            success: function(photosData) {
					//console.log( "photosData =>"+photosData);
					//console.log( "photosData count =>"+photosData.length);
					if (photosData.length > 0 ) {
						photos_Data = photosData;    // stored data into an object when genrating canvas again and again
						//canvas.generate.createDynamicButtons(); // to run in sequence 
					}
	            },

	            complete: function() {
	            	canvas.generate.pageLoaderRemove();
	            }
        	});
		},

		generate_uniq_int: function(min_num, max_num){
			min_num = Math.ceil(min_num);
		    max_num = Math.floor(max_num);
		    return Math.floor(Math.random() * (max_num - min_num + 1)) + min_num;
		},

		createDynamicButtons: function(){
			if( photos_Data.length > 0 ){
				var dynamic_select = $('<select id="select" class="form-control"><option value="0">Canvas #</option></select>'),
				    btn_Insert = '<a href="javascript:void(0)" class="btn btn-primary" id="insert_canvas">Insert to Canvas</a>',
				    photosDataNode,
				    canvas_area = $('<div id="canvas_area" />'),
				    uniq_int,
				    canvas_space = 20,
				    canvas_stroke = 1,
				    canvas_attr;

				$(d_Cont).empty().append(dynamic_select, btn_Insert, '<hr />', canvas_area);
				uniq_int = canvas.generate.generate_uniq_int(2, 4);

				console.log("uniq_int =>"+uniq_int);
				canvas_attr = parseInt( ( $(d_Cont).width()/2 ) - ( (canvas_stroke+canvas_space)*2 ) ); // calculate for canvas styling
				console.log("main container width =>"+canvas_attr);

				// append dynamic values

				for (var number = 0; number < uniq_int; number++) {
					dynamic_select.append('<option id="customSelectOption'+(number+1)+'" value="'+(number+1)+'">Canvas '+(number+1)+'</option>');
					//canvas_area.append('<div class="canvasbox" style="margin:'+canvas_space+'px;"><canvas height="'+canvas_attr+'" width="'+canvas_attr+'" id="canvasbox'+(number+1)+'"></canvas></div>');
					canvas_area.append(
						'<canvas height="'+canvas_attr
						+'" width="'+canvas_attr
						+'" id="canvasbox'+(number+1)
						+'" style="border:'+canvas_stroke+'px solid #000;'
							+'margin:'+canvas_space+'px;'
						+'"></canvas>'
						);
				}				

			} else {
				$('#dynamic_content').html('<p>No data avialable</p>')
			}
		},

		insertToCanvas: function(){
			var canvas_value = $('#select').val();
			if ( canvas_value != 0 ) {
				//$('#canvasbox'+canvas_value).parent().css('border-color','red' )
				$('#canvasbox'+canvas_value).css('border-color','#f00' )
			} else {
				alert('Please select a canvas!')
			}
		}
	}
})(window, document, jQuery, canvas);

window.onload = function(){
	if ($(d_Cont).length) {
		canvas.generate.init();   // data request sent on page load
	}

	$(document).on('click', '#genrate_canvas', function() {
		canvas.generate.createDynamicButtons();
	});

	$(document).on('click', '#insert_canvas', function() {
		canvas.generate.insertToCanvas();
	});
}

window.onresize = function(){
	
}