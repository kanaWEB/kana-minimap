 var minimap_pos = $("#minimap-image").position();

//Reposition widgets based on minimap position
$( ".minimap-widgets" ).each(function( index ) {
	var top_repos = $(this).position().top;
  	var left_repos = $(this).position().left;
	$(this).css("left",left_repos + minimap_pos.left);
	$(this).css("top",top_repos + minimap_pos.top);
	console.log("REPOSITION WIDGETS");
});

//Make sensors draggable
 var items = document.querySelectorAll('.draggy');
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    var draggie = new Draggabilly( item, {

    });
    draggie.on( 'dragEnd', onDragEnd );
  }

//If a widget is dragged we saved all the position
  function onDragEnd( instance, event, pointer ) {

  	var widgets = new Object();
  	$( ".minimap-widgets" ).each(function( index ) {
  		var top_pos = $(this).position().top;
  		var left_pos = $(this).position().left;
  		var id = $(this).attr("id");
  		top_pos = top_pos - minimap_pos.top;
  		left_pos = left_pos - minimap_pos.left;
  		widgets[id] = {top: top_pos,left: left_pos}
	});
  	json_data = JSON.stringify(widgets);
  	$.ajax({
			url: "actions.php",
			dataType: "json",
			data: {type: "jsonview", data: json_data  , op: "add", view: "minimap"}
		}).done(function ( data ) {
			console.log("saved");
	});
}

//Reload widgets info every 3 seconds
minimap_refresh_speed = 3000;
console.log("AJAX TIMER: Minimap view - plugins/views/minimap/js/minimap.js");
minimap_timer = setInterval(function(){
	refresh_minimap();
},minimap_refresh_speed);

function refresh_minimap(){
	//console.log("Refresh minimap");
		$.ajax({
			url: "actions.php",
			dataType: "json",
			data: {type: "data", data: "sensors/widgets"}
		}).done(function ( data ) {
			//console.log(data);
			$( data ).each(function( index ) {
				sensor_lastvalue = $(this)[0].sensor_lastvalue;
				sensor_timesince = $(this)[0].timesince;
				sensor_uid = $(this)[0].uid;
				$($("#sensor_lastvalue_" + sensor_uid)).html(sensor_lastvalue);
				$($("#sensor_timestamp_" + sensor_uid)).html(sensor_timesince);
				//console.log($($("sensor_lastvalue_" + sensor_uid)));
			})
	});
}