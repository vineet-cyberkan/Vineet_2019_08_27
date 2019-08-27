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
						canvas.generate.createDynamicButtons(); // to run in sequence 
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

				//console.log("uniq_int =>"+uniq_int);
				canvas_attr = parseInt( ( $(d_Cont).width()/2 ) - ( (canvas_stroke+canvas_space)*2 ) ); // calculate for canvas styling
				//console.log("main container width =>"+canvas_attr);

				// append dynamic values

				for (var number = 0; number < uniq_int; number++) {
					dynamic_select.append('<option id="customSelectOption'+(number+1)+'" value="'+(number+1)+'">Canvas '+(number+1)+'</option>');
					canvas_area.append(
						'<div class="canvasbox" style="margin:'+canvas_space+'px;'
							+'height:'+canvas_attr+'px; width:'+canvas_attr+'px;'
						+'"><canvas height="'+(canvas_attr - 1)
						+'" width="'+(canvas_attr - 1)
						+'" id="canvasbox'+(number+1)
						//+'" style="border:'+canvas_stroke+'px solid #000;'
						+'"></canvas></div>'
						);
				}				

			} else {
				$('#dynamic_content').html('<p>No data avialable</p>')
			}
		},

		selectCanvas: function(){
			var canvas_value = $('#select').val(), selected_canvas = 'canvasbox'+canvas_value;

			if ( canvas_value != 0 && photos_Data.length > 0 ) {
				//$('#canvasbox'+canvas_value).parent().css('border-color','red' )
				$(selected_canvas).css('border-color','#f00' );
				canvas.generate.insertToCanvas(photos_Data, selected_canvas);
			} else {
				alert('Please select a canvas!')
			}
		},

		insertToCanvas: function(data, id){
			var canvas_fabric = new fabric.Canvas(id), random_obj, data_nodes =[1, 2], node_obj;
			random_obj = canvas.generate.generate_uniq_int(3, 4997); //for object randomly from the JSON endpoint
			//debugger;
			//console.log(canvas_fabric);
			//console.log(random_obj);
			data_nodes.push(random_obj, data.length - 2, data.length - 1);
			//console.log(data_nodes);
			
			for( var i = 0; i < data.length; i++ ){
				for( var x = 0; x < data_nodes.length; x++ ){
					if (i == x ) {
						//console.log(data_nodes[x]);
						//console.log(data[i]);
						node_obj = data[i];

						for( var node_name in node_obj ){
							console.log('node_name =>'+ node_name);
							console.log('node_value =>'+ node_obj[node_name]);
						}
					}
				}
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
		canvas.generate.selectCanvas();
	});
}

window.onresize = function(){
	
}