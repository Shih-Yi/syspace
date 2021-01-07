
var map=null;
var watchId=null;
var options={enableHighAccuracy:true, timeout:100, maximumAge:10000};
var flightPlanCoordinates = [];
var coordsArray=[];
var distanceArray=[];


window.onload=getLocation;

function getLocation(){
	if(navigator.geolocation){
		//navigator.geolocation.getCurrentPosition(watchLocation);
		//var watchButton=document.getElementById("watch");
		//watchButton.onclick=watchLocation;
		watchLocation();
		//var clearWatchButton=document.getElementById("cleanWatch");
		//clearWatchButton.onclick=clearWatch;
	}else{
		alert("no geolocation support");
	}
}

function watchLocation(){
	watchId=navigator.geolocation.watchPosition(showPosition,displayError,options);
}


function displayError(error) {
	var errorTypes = {
		0: "Unknown error",
		1: "Permission denied",
		2: "Position is not available",
		3: "Request timeout"
	};
	var errorMessage = errorTypes[error.code];
	if (error.code === 0 || error.code === 2) {
		errorMessage = errorMessage + " " + error.message;
	}
	//var div = document.getElementById("location");
	//div.innerHTML = errorMessage;
}

/*function clearWatch(){
	if (watchId){
		navigator.geolocation.clearWatch(watchId);
		watchId=null;
	}
}*/

function showPosition(position){
	var latitude=position.coords.latitude;
	var longitude=position.coords.longitude;

	//var message=document.getElementById("location");
	//message.innerHTML = "You are at !!!!(Latitude, Longitude): </br> "+"("+latitude+", "+longitude+")";
	//message.innerHTML+= "</br> (with"+position.coords.accuracy+ " meters accuracy)";
	//message.innerHTML+= "found in" +options.timeout+"milliseconds";
	
	if (map===null){
		showMap(position.coords);
	}else{
		scrollMapToPosition(position.coords);
	}
}

// distance
function computeDistance(startCoords, destCoords) {
  var startLatRads = degreesToRadians(startCoords.latitude);
  var startLongRads = degreesToRadians(startCoords.longitude);
  var destLatRads = degreesToRadians(destCoords.latitude);
  var destLongRads = degreesToRadians(destCoords.longitude);

  var Radius = 6371; // radius of the Earth in km
  var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
          Math.cos(startLatRads) * Math.cos(destLatRads) *
          Math.cos(startLongRads - destLongRads)) * Radius;

  return distance*1000;
}

function degreesToRadians(degrees) {
  radians = (degrees * Math.PI)/180;
  return radians;
}


function showMap(coords){
	 var googleLatLong=new google.maps.LatLng(coords.latitude, coords.longitude);
	 var mapOptins={
	    		zoom: 16,
	    		center: googleLatLong,
	     		mapTypeId: google.maps.MapTypeId.ROADMAP

	   };

	 map=new google.maps.Map(document.getElementById("map"), mapOptins, options);

	 var title="Your Location";
	 var content="You are at Latitude: "+coords.latitude+"; Longitude:"+coords.longitude;
	 //addMarker(map, googleLatLong, title, content);
   //console.log(coords.latitude,coords.longitude);
	
	//畫路徑要用的陣列,要用lat,lng
   flightPlanCoordinates.push({lat:coords.latitude, lng:coords.longitude});
   //計算距離要用的座標陣列,要用latitude, longitude
   coordsArray.push({latitude:coords.latitude, longitude:coords.longitude});
   console.log(flightPlanCoordinates);

  
   addMarker(map, googleLatLong, title, content);


}


function addMarker(map, latlong, title, content){
	var markerOptions={
		map: map,
		position: latlong,
		title: title,
		clickable: true
	};
	var marker= new google.maps.Marker(markerOptions);

	var infoWindowOptions={
		content: content,
		position: latlong
	};
	var infoWindow= new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, "click", function(){
		infoWindow.open(map);
	});
}



function scrollMapToPosition(coords){
	var latitude=coords.latitude;
	var longitude=coords.longitude;
	var latlong=new google.maps.LatLng(latitude, longitude);

	map.panTo(latlong);
	var content="You move to: "+latitude+"; "+longitude;
	addMarker(map, latlong, "Yore new location", content);

	//畫路徑要用的陣列,要用lat,lng(因為flightPath這樣用). 第二筆開始,因為function scrollMapToPosition 第二筆開始更新.
  flightPlanCoordinates.push({lat:coords.latitude, lng:coords.longitude});
  	//計算距離要用的座標陣列,要用latitude, longitude(因為function computeDistance這樣用).第二筆開始
  coordsArray.push({latitude:coords.latitude, longitude:coords.longitude});

  console.log(flightPlanCoordinates);
  
  //畫線
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: 'yellow',
    strokeOpacity: 1.0,
    strokeWeight: 12
  });
        flightPath.setMap(map);

function single(x) {
    return x;
  }

   var arr=coordsArray.map(single); //複製coordsArray
   var element=arr.pop();
   var distance=document.getElementById("distance");
   var m=computeDistance(coordsArray[0],element);
   var	number=parseFloat(m.toFixed(1));//取小數第一位,取完為字串,轉回浮點數

   distanceArray.push(number); //將計算距離放入新陣列中

   function array_max(array){
  		var max=array[0];
       for(var i=1; i<array.length;i++)
	    if(max<array[i]){
	      max=array[i];
	    }
	    console.log(max);
	    return max;
	   }
   
   var maxNumber=array_max(distanceArray);

   distance.innerHTML=maxNumber+"m";

   console.log(distanceArray);  
   console.log(maxNumber);  

   //計算coordsArray 兩點間的距離,但累積誤差太大
  /*for(var i=0; i<10000000000000; i++){		//上限取很大 避免超過
    var distance=document.getElementById("distance");
    var m=computeDistance(coordsArray[i],coordsArray[i+1]);//兩點間的距離
    var	number=parseFloat(m.toFixed(1)); //取小數第一位,取完為字串,轉回浮點數

    distanceArray.push(number); //將計算距離放入新陣列中
    var sum=distanceArray.reduce(function(previousValue, currentValue){
          return previousValue+currentValue; //用reduce 搭配function 加總陣列總和
    });
     distance.innerHTML=sum+"m";  
     console.log(distanceArray);
     console.log(sum);   
    }*/
}

// google.maps.event.addDomListener(window, 'load', initialize);

//計時器：
var sec;
var intervalId;
var intervalId1;
var x=0;
var y=0;
var z;
function runningStart(){
		sec=document.getElementById("sec");
		intervalId= window.setInterval(conuntSec, 1000); 
		intervalId1= window.setInterval(conuntMin, 60000); 
		//設定排程之後,不會卡住程式，會去做別的事，時間到再回來執行
		//電腦會自己紀錄排程順序0.1.2.3...，用intervalId紀錄數值，之後需要可以用
	}
function clearTimer(){
	window.clearInterval(intervalId); 
	window.clearInterval(intervalId1); 
}

function conuntMin(){
	 y=y+1;
	min.innerHTML=y; //像數字的字串
		
}

function conuntSec(){
	 x=x+1;
	 z=x%60;
	sec.innerHTML=z; //像數字的字串
		
}

//消耗卡洛里

var weight;



















