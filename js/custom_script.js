var canvas = window.canvas || {};
var d_Cont = '#dynamic_content', photos_Data = [], canvas_data=[], node_obj=[], canvas_obj=[];

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
	            url: 'https://jsonplaceholder.typicode.com/photos', // data request path live
	            //url: 'http://localhost/photos/photos.json', // data request path localhost
	            type: 'GET',
	            contentType: 'application/json',
	            dataType: 'json',

	            success: function(photosData) {
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
				    //canvas_space = 20,
				    canvas_space = 0,
				    canvas_stroke = 1,
				    canvas_attr;

				$(d_Cont).empty().append(dynamic_select, btn_Insert, '<hr />', canvas_area);
				uniq_int = canvas.generate.generate_uniq_int(2, 4);

				canvas_attr = parseInt( ( $(d_Cont).width()/2 ) - ( (canvas_stroke+canvas_space)*2 ) ); // calculate for canvas styling
			
				for (var number = 0; number < uniq_int; number++) {
					var uniqID = number+1;
					dynamic_select.append('<option id="customSelectOption'+uniqID+'" value="'+uniqID+'">Canvas '+uniqID+'</option>');
					canvas_area.append(
						'<div class="canvasbox" id="canvasboxParent'+uniqID
						+'" style="margin:'+canvas_space+'px;'
							+'height:'+canvas_attr+'px; width:'+canvas_attr+'px;'
						+'"><canvas height="'+(canvas_attr - 1)
						+'" width="'+(canvas_attr - 1)
						+'" id="canvasbox'+uniqID
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
				$('#'+selected_canvas).css('border-color','#f00' );
				canvas.generate.genrateCanvasData(photos_Data, selected_canvas);
			} else {
				alert('Please select a canvas!')
			}
		},

		genrateCanvasData: function(data, id){
			var newCanvas = new fabric.Canvas(id), random_obj, data_nodes =[1, 2];

			var all_canvas = $('.canvasbox canvas');	
			canvas_obj=[];
			all_canvas.each(function(index, el) {
				//debugger;
				if ( $(this).attr('id') !=  undefined && $(this).attr('id') !=  id ) {
					var otherCanvas = $(this).attr('id');
					canvas_obj.push(otherCanvas);
				}
			});


			random_obj = canvas.generate.generate_uniq_int(3, 4997); //for object randomly from the JSON endpoint
			data_nodes.push(random_obj, data.length - 2, data.length - 1);  // 1. Select the first 2 objects, last 2 objects, and 1 object randomly from the JSON endpoint. 
			
			canvas.generate.contentDragableCanvas(newCanvas);

			for( var i = 0; i < data.length; i++ ){
				for( var x = 0; x < data_nodes.length; x++ ){

					var html_node_val = ''; // 2. Of the selected objects:
					
					if (i == data_nodes[x] ) {
						var tag, child_node=[];
						node_obj = data[data_nodes[x]];

						if ( canvas.generate.evenOrOdd(node_obj['id']) == 'odd'){ // 1. if ‘id’ is odd, insert ‘thumbnailUrl’ as an image in the selected canvas. 
							html_node_val = node_obj['thumbnailUrl'];
							tag = 'image';
						};

						if ( canvas.generate.evenOrOdd(node_obj['id']) == 'even' ) {  // if ‘id’ is even, display ‘title’ in the selected canvas. Thus, the prior rule becomes invalid.
							html_node_val = node_obj['title'];							
							tag = 'title';
						};

						if ( node_obj['albumId'] >= 100){
							html_node_val = node_obj['url'];							
							tag = 'text';
						};
					}

					if (html_node_val != '') {
						child_node.push(html_node_val, tag);
						canvas_data.push(child_node);
					}
				}
			}

			if (canvas_data.length>0) {
				var tag;
				for (var i = 0; i < canvas_data.length; i++) {
					var node = canvas_data[i];
					if ( node.length == 2 ) {
						canvas.generate.genrateTagTypeContent(newCanvas, node[1], node[0], node[1]+i);
					}
				}
			}
		},

		genrateTagTypeContent: function(newCanvas, tag, node, node_id) {

			if (tag == "image") {

				fabric.Image.fromURL(node, function(img) {
			        //i create an extra var for to change some image properties
			        var thumbnailUrl = img.set({
			            left: 10,
			            top: 10,
			            //width: 150,
			            //height: 150
			        });
			        newCanvas.add(thumbnailUrl);
			    });
			};

			if (tag == "title") {

				url = new fabric.Text(node, {
			        fontSize: 30,
			        left: 10,
			        top: 250
			        // originX: "center",
			        // originY: "center",
			    });
			    newCanvas.add(url);
			};

			if (tag == "text") {

				url = new fabric.Text(node, {
			        fontSize: 18,
			        left: 10,
			        top: 200
			        // originX: "center",
			        // originY: "center",
			    });
			    newCanvas.add(url);
			};

		},

		evenOrOdd: function(num) {
			if ( (num % 2) == 0 ) {
				return 'even';
			} else {
				return 'odd';
			}
		},

		contentDragableCanvas: function(newCanvas){
			// get ready to handle touch events
			var isTouchDevice = false;
			window.addEventListener("touchstart", function() {
			    isTouchDevice = true;
			});

			var move_item = function(fromCanvas, toCanvas, pendingLayer) {
			    fromCanvas.remove(pendingLayer);

			    var pendingTransform = fromCanvas._currentTransform;
			    fromCanvas._currentTransform = null;

			    var removeListener = fabric.util.removeListener;
			    var addListener = fabric.util.addListener; 
			    {
			        removeListener(fabric.document, 'mouseup', fromCanvas._onMouseUp);
			        removeListener(fabric.document, 'touchend', fromCanvas._onMouseUp);

			        removeListener(fabric.document, 'mousemove', fromCanvas._onMouseMove);
			        removeListener(fabric.document, 'touchmove', fromCanvas._onMouseMove);

			        addListener(fromCanvas.upperCanvasEl, 'mousemove', fromCanvas._onMouseMove);
			        addListener(fromCanvas.upperCanvasEl, 'touchmove', fromCanvas._onMouseMove, {
			            passive: false
			        });

			        if (isTouchDevice) {
			            // Wait 500ms before rebinding mousedown to prevent double triggers
			            // from touch devices
			            var _this = fromCanvas;
			            setTimeout(function() {
			                addListener(_this.upperCanvasEl, 'mousedown', _this._onMouseDown);
			            }, 500);
			        }
			    } 
			    {
			        addListener(fabric.document, 'touchend', toCanvas._onMouseUp, {
			            passive: false
			        });
			        addListener(fabric.document, 'touchmove', toCanvas._onMouseMove, {
			            passive: false
			        });

			        removeListener(toCanvas.upperCanvasEl, 'mousemove', toCanvas._onMouseMove);
			        removeListener(toCanvas.upperCanvasEl, 'touchmove', toCanvas._onMouseMove);

			        if (isTouchDevice) {
			            // Unbind mousedown to prevent double triggers from touch devices
			            removeListener(toCanvas.upperCanvasEl, 'mousedown', toCanvas._onMouseDown);
			        } else {
			            addListener(fabric.document, 'mouseup', toCanvas._onMouseUp);
			            addListener(fabric.document, 'mousemove', toCanvas._onMouseMove);
			        }
			    }

			    setTimeout(function() {
			        pendingLayer.scaleX *= -1;
			        pendingLayer.canvas = toCanvas;
			        pendingLayer.migrated = true;
			        toCanvas.add(pendingLayer);

			        toCanvas._currentTransform = pendingTransform;
			        toCanvas._currentTransform.scaleX *= -1;
			        toCanvas._currentTransform.original.scaleX *= -1;
			        toCanvas.setActiveObject(pendingLayer);
			    }, 10);
			};

			var moving_obj = function(event) {
			    var viewport = event.target.canvas.calcViewportBoundaries();
			    //console.log(viewport)
			    //console.log(event)
			    //console.log(event.target)
			    //console.log(event.target.canvas)
			    if (event.target.canvas === newCanvas) {
			        if (event.target.left > viewport.br.x) {
			            console.log("Migrate: left -> right");
			            //console.log(canvas_obj);
			            console.log(viewport);
			            if (canvas_obj.length > 0) {
			            	for (var canvas = 0; canvas < canvas_obj.length; canvas++) {
			            		//console.log(canvas_obj[canvas]);

								var otherCanvas = new fabric.Canvas(canvas_obj[canvas]);
								//otherCanvas = otherCanvas.renderAll();

			            		move_item(newCanvas, otherCanvas, event.target);
			            	}
			            }
			            //move_item(newCanvas, canvas1, event.target);
			            return;
			        }
			    }
			    if (event.target.canvas === newCanvas) {
			        if (event.target.left < viewport.tl.x) {
			        //if (event.target.left < viewport.br.x) {
			            console.log("Migrate: right -> left");
			            //console.log(canvas_obj);
			            console.log(viewport);
			            if (canvas_obj.length > 0) {
			            	for (var canvas = 0; canvas < canvas_obj.length; canvas++) {
			            		//console.log(canvas_obj[canvas]);

								var otherCanvas = new fabric.Canvas(canvas_obj[canvas]);
								//otherCanvas = otherCanvas.renderAll();
								
			            		move_item(newCanvas, otherCanvas, event.target);
			            	}
			            }
			            //move_item(newCanvas, canvas0, event.target);
			            return;
			        }
			    }
			};

			newCanvas.on("object:moving", moving_obj);
		}
	}
})(window, document, jQuery, canvas);

window.onload = function(){
	if ($(d_Cont).length) {
		canvas.generate.init();   // data request sent on page load
	}

	$(document).on('click', '#genrate_canvas', function() {
		canvas.generate.createDynamicButtons();
		canvas_data=[];
	});

	$(document).on('click', '#insert_canvas', function() {
		canvas.generate.selectCanvas();
		canvas_data=[];
	});
}

window.onresize = function(){
	
}