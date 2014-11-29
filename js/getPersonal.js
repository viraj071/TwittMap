var map;
var marker;
var allmarkers = [];
var dat={
  q:"",
  lat:"",
  lon:"",
  rad: "2"
};
function initialize() {
  var mapOptions = {
    zoom: 14
  };
  map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);
  
  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(coordinates, function() {
      handleNoGeolocation(true);
    });

  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
  
  function coordinates(position){
      
      var pos = new google.maps.LatLng(position.coords.latitude,
                                      position.coords.longitude);      
      dat.lon=pos.B;
      dat.lat=pos.k;
      var myLatlng = new google.maps.LatLng(dat.lat,dat.lon);
      marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:"You are here!"
      });

      getPersonalTweets();
      map.setCenter(pos);
  }

  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, place name, and location.
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      bounds.extend(place.geometry.location);  
      dat.lat=place.geometry.location.lat();
      dat.lon=place.geometry.location.lng();
    }
    map.fitBounds(bounds);
    map.setZoom(12);
    getPersonalTweets();
  });
  // [END region_getplaces]

// Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };
  map.setCenter(options.position);
}

$("#submit").on("click", function () { 
  dat.q=document.getElementById('searchquery').value;
  getPersonalTweets(); 
});

$("#searchquery").keyup(function(event){
    if(event.keyCode == 13){
      console.log("searchquery");
        $("#submit").click();
    }
});

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

function getPersonalTweets(){
  console.log(dat);
  deleteMarkers();
  $("#jstweets").empty();
  $.ajax({
        type: 'POST',
        url: 'php/getPersonalTweets.php',
        data: dat,
        dataType : 'json',
        success: function( res ) {
          //console.log(res["statuses"].length);
          if(res["statuses"].length==0){
            $("#jstweets").append("<p><h2>Sorry Nothing to display here !</h2></p>");
          }
          else{
            for(var x in res["statuses"]){
                if(res["statuses"][x]["coordinates"]!=null){
                  //var contentString = '<tr class="tweet"><td><a href="http://www.twitter.com/'+res["statuses"][x]["user"]["screen_name"]+'" target="_blank"><img class="avi" src="'+res["statuses"][x]["user"]["profile_image_url"]+'"></a></td><td><a href="http://www.twitter.com/'+res["statuses"][x]["user"]["screen_name"]+'" target="_blank">@'+res["statuses"][x]["user"]["screen_name"]+' </a>:'+res["statuses"][x]["text"]+'</td></tr>';
                  var myLatlng = new google.maps.LatLng(res["statuses"][x]["coordinates"]["coordinates"]["1"],res["statuses"][x]["coordinates"]["coordinates"]["0"]);
                  marker = new google.maps.Marker({
                  position: myLatlng,
                  animation: google.maps.Animation.DROP,
                  ///icon: "img/tweetmarker1.png",
                  icon: res["statuses"][x]["user"]["profile_image_url"],
                  title: "@"+res["statuses"][x]["user"]["screen_name"]+': '+res["statuses"][x]["text"]
                  });
                  allmarkers.push(marker);
                }
                setAllMap(map);
                $("#jstweets").append('<tr class="tweet"><td><a href="http://www.twitter.com/'+res["statuses"][x]["user"]["screen_name"]+'" target="_blank"><img class="avi" src="'+res["statuses"][x]["user"]["profile_image_url"]+'"></a></td><td><a href="http://www.twitter.com/'+res["statuses"][x]["user"]["screen_name"]+'" target="_blank">@'+res["statuses"][x]["user"]["screen_name"]+'</a>: '+res["statuses"][x]["text"]+'</td></tr>');
            }
            var bounds = new google.maps.LatLngBounds();
            for(var i=0;i<allmarkers.length;i++){
              bounds.extend(allmarkers[i].getPosition());
            }
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
            //map.setZoom(map.getZoom()-1);
            if(map.getZoom()>15){
              map.setZoom(15);
            }
          }
        }
    });
}

function setAllMap(map){
  for(var i = 0;i<allmarkers.length;i++){
    allmarkers[i].setMap(map);
  }
}

function clearMarkers() {
  setAllMap(null);
}

function deleteMarkers() {
  clearMarkers();
  allmarkers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);



