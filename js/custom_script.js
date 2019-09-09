var canvas = window.canvas || {};
var d_Cont = '#dynamic_content',
    photos_Data = [],
    canvas_Data = [],
    canvas_Obj = [],
    obj_id_canvas = [];
var isTouchDevice = false;
window.addEventListener("touchstart", function() {
    isTouchDevice = true;
});

(function(window, document, $, canvas) {
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

        dataRequest: function() {

            canvas.generate.pageLoaderShow(); // show loader 

            $.ajax({
                url: 'https://jsonplaceholder.typicode.com/photos', // data request path live
                //url: 'http://localhost/photos/photos.json', // data request path localhost
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',

                success: function(photosData) {
                    if (photosData.length > 0) {
                        photos_Data = photosData; // stored data into an object when genrating canvas again and again
                        //canvas.generate.dynamicHtmlNode(); // to run in sequence 
                    }
                },

                complete: function() {
                    canvas.generate.pageLoaderRemove();
                }
            });
        },

        generate_uniq_int: function(min_num, max_num) {
            min_num = Math.ceil(min_num);
            max_num = Math.floor(max_num);
            return Math.floor(Math.random() * (max_num - min_num + 1)) + min_num;
        },

        evenOrOdd: function(num) {
            if ((num % 2) == 0) {
                return 'even';
            } else {
                return 'odd';
            }
        },

        selectCanvas: function(e) {
            var canvas_value = $('#select').val(),
                selected_canvas = canvas_value;


            if (canvas_value != 0 && photos_Data.length > 0) {
                $('#' + selected_canvas).closest('.canvasbox').css('border-color', '#f00');
                canvas.generate.genrateCanvasData(photos_Data, canvas_Obj[selected_canvas]);
                $('#' + e.target.id).attr('disabled', 'disabled');
            } else {
                alert('Please select a canvas!');
                return false;
            }
        },

        genrateCanvasData: function(data, selected_canvas) {
            var random_obj, data_nodes = [1, 2];

            random_obj = canvas.generate.generate_uniq_int(3, 4997); //for object randomly from the JSON endpoint
            data_nodes.push(random_obj, data.length - 2, data.length - 1); // 1. Select the first 2 objects, last 2 objects, and 1 object randomly from the JSON endpoint. 

            for (var i = 0; i < data.length; i++) {
                for (var x = 0; x < data_nodes.length; x++) {

                    var html_node_val = ''; // 2. Of the selected objects:
                    var tag, child_node = [];

                    if (i == data_nodes[x]) {
                        node_obj = data[data_nodes[x]];

                        if (canvas.generate.evenOrOdd(node_obj['id']) == 'odd') { // 1. if ‘id’ is odd, insert ‘thumbnailUrl’ as an image in the selected canvas. 
                            html_node_val = node_obj['thumbnailUrl'];
                            tag = 'image';
                        };

                        if (canvas.generate.evenOrOdd(node_obj['id']) == 'even') { // if ‘id’ is even, display ‘title’ in the selected canvas. Thus, the prior rule becomes invalid.
                            html_node_val = node_obj['title'];
                            tag = 'title';
                        };

                        if (node_obj['albumId'] >= 100) {
                            html_node_val = node_obj['url'];
                            tag = 'text';
                        };
                    }

                    if (html_node_val != '') {
                        child_node.push(html_node_val, tag);
                        canvas_Data.push(child_node);
                    }
                }
            }

            if (canvas_Data.length > 0) {
                for (var m = 0; m < canvas_Data.length; m++) {
                    var node = canvas_Data[m];
                    if (node.length == 2) {
                        var tag_name = node[1],
                            node = node[0],
                            top_pos = parseInt( canvas.generate.generate_uniq_int(10, parseInt($('#id_canvasParent_1').width() - 50) ) );

                        //console.log(top_pos + " random top position of element");
                        //console.log(selected_canvas);

                        if (tag_name == "image") {

                            fabric.Image.fromURL(node, function(img) {
                                var thumbnailUrl = img.set({
                                    left: 10,
                                    top: top_pos
                                });
                                selected_canvas.add(thumbnailUrl);
                            });
                        };

                        if (tag_name == "title") {

                            largeText = new fabric.Text(node, {
                                fontSize: 30,
                                left: 10,
                                top: top_pos,
                                fill: '#f90'
                            });
                            selected_canvas.add(largeText);
                        };

                        if (tag_name == "text") {

                            url = new fabric.Text(node, {
                                fontSize: 18,
                                left: 10,
                                top: top_pos,
                                fill: '#f90'
                            });
                            selected_canvas.add(url);
                        };
                    }
                }

            };

        },

        dynamicHtmlNode: function() {
            canvas_Obj = [];
            obj_id_canvas = [];
            if (photos_Data.length > 0) {
                var dynamic_select = $('<select id="select" class="form-control"><option value="0">Canvas #</option></select>'),
                    btn_Insert = '<a href="javascript:void(0)" class="btn btn-primary" id="insert_canvas">Insert to Canvas</a>',
                    canvas_area = $('<div id="canvas_area" />'),
                    //canvas_space = 20,
                    canvas_space = 0,
                    canvas_stroke = 1;

                $(d_Cont).empty().append(dynamic_select, btn_Insert, '<hr />', canvas_area);

                /*canvas code start here*/

                var $uniq_num, $canvas_prop;
                $uniq_num = canvas.generate.generate_uniq_int(2, 4);
                $canvas_prop = parseInt(($(d_Cont).width() / 2) - ((canvas_stroke + canvas_space) * 2)); // calculate for canvas styling

                //console.log($uniq_num);
                for (var number = 0; number < $uniq_num; number++) {
                    var uniqID = number + 1,
                        id_selectOption = 'id_selectOption_' + uniqID,
                        id_canvasParent = 'id_canvasParent_' + uniqID;
                    id_canvas = 'id_canvas_' + uniqID;

                    dynamic_select.append('<option id="' + id_selectOption + '" value="' + id_canvas + '">Canvas ' + uniqID + '</option>');
                    canvas_area.append(
                        '<div class="canvasbox" id="' + id_canvasParent +
                        '" style="margin:' + canvas_space + 'px;' +
                        'height:' + $canvas_prop + 'px; width:' + $canvas_prop + 'px;' +
                        '"><canvas height="' + ($canvas_prop) +
                        '" width="' + ($canvas_prop) +
                        '" id="' + id_canvas
                        +'" style="border:'+canvas_stroke+'px solid #000;'
                        +
                        '"></canvas></div>'
                    );

                    var canvas_obj_prop = new fabric.Canvas(id_canvas);
                    canvas_Obj[id_canvas] = canvas_obj_prop;
                    canvas_obj_prop.on("object:moving", canvas.generate.onObjectDrag);
                    obj_id_canvas.push(id_canvas);
                }
                /*canvas code end here*/

            } else {
                $('#dynamic_content').html('<p>No data avialable</p>')
            }
        },

        onObjectDrag: function(evnt) {
            var _this = this,
                draging_from;
            draging_from = _this.lowerCanvasEl.id;
            /* move object to any canvas start*/
            setTimeout(function() {
                for (var c_id = 0; c_id < obj_id_canvas.length; c_id++) {
                    var draging_to = obj_id_canvas[c_id];
                    if (draging_to != undefined) {
                        canvas_Obj[draging_to].on("mouse:moved", canvas.generate.objectMoved(evnt, draging_from, draging_to, _this))
                    }
                }
            }, 100 );
            /* move object to any canvas end*/
        },

        objectMoved: function(evnt, dragin_from, draging_to, _this){
                var activeCanvas;
                activeCanvas = evnt.e.target.previousSibling.id;
            
            if (dragin_from != activeCanvas) {
                //console.log("evnt => "+ evnt + ";\n dragin_from => "+ dragin_from+ ";\n draging_to => "+ activeCanvas+ ";\n _this => "+ _this);
                //return;
                draging_to = activeCanvas;
                var activeObjects = _this.getActiveObjects(),
                    object, objsToRender, activeGroupObjects,
                    dragin_from = canvas_Obj[dragin_from],
                    draging_to = canvas_Obj[draging_to];
                if (activeObjects.length > 0 ) {
                    var objsToRender = [],
                    activeGroupObjects = [],
                    setActive = [];

                    if (draging_to && ( draging_to != dragin_from ) ) {
                        var pendingTransform = dragin_from._currentTransform;
                        dragin_from._currentTransform = null;
                        
                        setActive = evnt.target;
                        if (activeObjects.length > 1) {
                            var obj = evnt.target._objects;
                            for (x in obj) {
                                var nodeToMove = obj[x];
                                renderObj(dragin_from, draging_to, nodeToMove);
                            }

                            draging_to._currentTransform = pendingTransform;
                            dragin_from.discardActiveObject();
                            setActiveObject_custom(setActive, evnt, dragin_from, draging_to);
                            draging_to._updateActiveSelection();

                        } else {
                            renderObj(dragin_from, draging_to, evnt.target);
                            draging_to._currentTransform = pendingTransform;
                            draging_to.setActiveObject(setActive);
                        }
                        return false;
                    }
                }

                function renderObj(from, to, target){

                    from.remove(target);
                    
                    canvas.generate.addRemoveEvents(from, to);

                    //setTimeout(function() {
                        target.canvas = to;
                        target.migrated = true;

                        to.add(target);
                    //}, 10);
                }


                function setActiveObject_custom(setActive, evnt, dragin_from, draging_to) {
                    var currentActives = dragin_from.getActiveObjects();
                    draging_to._setActiveObject(setActive, evnt);
                    draging_to._fireSelectionEvents(currentActives, evnt);
                    return draging_to;
                }
            }
        }, 
        
        addRemoveEvents: function(fromCanvas, toCanvas) {
            var removeListener = fabric.util.removeListener;
            var addListener = fabric.util.addListener; {
                removeListener(fabric.document, 'mouseup', fromCanvas._onMouseUp);
                removeListener(fabric.document, 'touchend', fromCanvas._onMouseUp);

                removeListener(fabric.document, 'mousemove', fromCanvas._onMouseMove);
                removeListener(fabric.document, 'touchmove', fromCanvas._onMouseMove);

                addListener(fromCanvas.upperCanvasEl, 'mousemove', fromCanvas._onMouseMove);
                addListener(fromCanvas.upperCanvasEl, 'touchmove', fromCanvas._onMouseMove, {
                    passive: false
                });

                if (isTouchDevice) {
                    // Wait 300ms before rebinding mousedown to prevent double triggers
                    // from touch devices
                    var _this = fromCanvas;
                    setTimeout(function() {
                        addListener(_this.upperCanvasEl, 'mousedown', _this._onMouseDown);
                    }, 300);
                }
            } {
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
        }
    }
})(window, document, jQuery, canvas);

window.onload = function() {
    if ($(d_Cont).length) {
        canvas.generate.init(); // data request sent on page load
    }
    /* create dynamic select dropdown start*/
    $(document).on('click', '#genrate_canvas', function() {
        canvas.generate.dynamicHtmlNode();
        canvas_Data = [];
    });
    /* create dynamic select dropdown end*/

    $(document).on('click', '#insert_canvas', function(event) {
        if (!$(this).attr('disabled')) {
            canvas.generate.selectCanvas(event);
            canvas_Data = [];
        }

        /*canvas.generate.selectCanvas();
        canvas_Data=[]; */
    });


}

window.onresize = function() {

}