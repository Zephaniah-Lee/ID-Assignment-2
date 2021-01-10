//Token needed for access to MapBox
mapboxgl.accessToken = "pk.eyJ1IjoiemVwaGFuaWFoIiwiYSI6ImNrajVncWhzdzFhYWgyd3BkcXpkOTl0ejQifQ.DcVR3f9JVGvLP8dJOYkMOg";

// Getting current location
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

navigator.geolocation.getCurrentPosition(success,error,{
    enableHighAccuracy: true
});

let dragCoords = [];

function CurrentLocationMarker(currentCoords){
    //Add a draggable marker on your current location
    let CurrentLocation = new mapboxgl.Marker({draggable: true}).setLngLat(currentCoords).addTo(map);

    dragCoords = currentCoords;

    //Record the current location of the marker
    //https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/
    function onDragEnd(){
        let lnglat = CurrentLocation.getLngLat();
        dragCoords = [lnglat.lng, lnglat.lat];
    }

    CurrentLocation.on('dragend', onDragEnd);

    //Center the map on your current location
    //https://docs.mapbox.com/mapbox-gl-js/example/flyto/
    map.flyTo({
        center: currentCoords
    });
}

//When given your location, place marker on Current Location
function success(position){
    currentCoords = [position.coords.longitude, position.coords.latitude]
    CurrentLocationMarker(currentCoords);
};

// When not given your location, place marker at Singapore [103.851959, 1.290270]
function error(){
    currentCoords = [103.851959, 1.290270]
    CurrentLocationMarker(currentCoords);
}

let map = new mapboxgl.Map({ //since map is in a function, it isnt a global variable
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 17,
    center: [103.76788,1.33581]
});

//Places navigation tools (+ - buttons and compass)
//https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol
let nav = new mapboxgl.NavigationControl({showCompass: false});
map.addControl(nav);

//When Display parking areas button is clicked, it will change its text to "Hide parking areas" and add markers
//When Hide parking areas button is clicked, it will change its text to "Display parking areas" and remove all markers

function ToggleParkingAreas(markerList){
    let x = document.getElementById("ParkingAreas");
    if (x.innerHTML === "Display Parking Areas") {
        x.innerHTML = "Hide Parking Areas";
        FetchCarparkData(carparkList);
    } 
    else {
        let length = markerList.length;
        for (let i = 0; i < length; i++){
            markerList[0].remove();
            markerList.shift();
            carparkList = [];
        };
        x.innerHTML = "Display Parking Areas";
    }
  }

//Fetch the data from https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c to get carpark locations

let carparkList = [];
let markerList = [];

function FetchCarparkData(carparkList){
    fetch("https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c")
        .then(response => response.json())
        .then(function(data){
            for (let i = 0; i < data.result.records.length; i++){
                let carpark = data.result.records[i];
                let address = carpark.address;
                let carpark_number = carpark.car_park_no;
                let parking_time = carpark.short_term_parking;
                let type = carpark.car_park_type;
                let free_parking = carpark.free_parking;
                let payment_system = carpark.type_of_parking_system;
                let xcoord = carpark.x_coord;
                let ycoord = carpark.y_coord;
                
                //Fetching from a coordinate converter api using the parameters of the x and y coords of the current carpark
                let url = new URL("https://developers.onemap.sg/commonapi/convert/3414to4326");
                //Entering Query parameters
                url.search = new URLSearchParams({
                    X: xcoord,
                    Y: ycoord
                });
                
                fetch(url)
                    .then(response => response.json())
                    .then(function(data){
                        let longitude = data.longitude;
                        let latitude = data.latitude;
                        let coordinates = [longitude,latitude];
                        

                        //Fetching from a parking api to check parking avialability
                        fetch("https://api.data.gov.sg/v1/transport/carpark-availability")
                            .then(response => response.json())
                            .then(function(data){
                                //Search the data for matching carpark number to find the number of available spots for a specific carpark number
                                let available_spots = null;

                                for (let i = 0; i < data.items[0].carpark_data.length; i++){
                                    let carpark_number_check = data.items[0].carpark_data[i].carpark_number;
                                    
                                    if (carpark_number == carpark_number_check){
                                        available_spots = data.items[0].carpark_data[i].carpark_info[0].total_lots;
                                        break;
                                    };
                                };
                                let carparkobject = new Carpark(coordinates, address, type, parking_time, free_parking, payment_system, available_spots);
                                carparkList.push(carparkobject);
                            });
                    });
            };
        });
        //Setting a delay so that carparkList will be filled before placing the markers
        setTimeout(function(){
            PlaceCarparkMarkers(carparkList,markerList);
            alert("Carparks Displayed");
        }, 10000);

};

function PlaceCarparkMarkers(carparkList,markerList){
    //https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
    // add markers to map
    carparkList.forEach(function(marker){

        // create a HTML element for each feature
        let el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundImage = "url(parking.png)";
        el.style.width = "35px";
        el.style.height = "37px";
        // make a marker for each feature and add to the map
        
        let Marker = new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML("<h3>" + marker.address + "</h3><p>" 
            + "Parking Type: " + marker.type + "<br></br>"
            + "Parking Time: " + marker.parking_time + "<br></br>"
            + "Free parking: " + marker.free_parking + "<br></br>"
            + "Payment System: " + marker.payment_system + "<br></br>" 
            + "Available spots: " + marker.available_spots + "</p>"))
            .addTo(map);
        
        markerList.push(Marker);
        });        
}

//Creating Carpark object
function Carpark(coordinates, address, type, parking_time, free_parking, payment_system, available_spots){
    this.coordinates = coordinates;
    this.address = address;
    this.type = type;
    this.parking_time = parking_time
    this.free_parking = free_parking;
    this.payment_system = payment_system;
    this.available_spots = available_spots;
};




//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
//https://simplemaps.com/resources/location-distance
function DistanceBetween2LatLng(lat1, lon1, lat2, lon2){
    let R = 6371;
    let dLat = deg2rad(lat2-lat1);
    let dLon = deg2rad(lon2-lon1); 
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c;
    return d;
}
  
function deg2rad(deg){
    return deg * (Math.PI/180);
}

//
function ScanArea(){
    let radius = document.getElementById("Radius").value;
    $("#carparkList").empty();
    if (!isNaN(radius) && radius !== ""){
        if (carparkList.length !== 0){
            for(let i = 0; i < carparkList.length; i++){
                let carparkCoords = carparkList[i].coordinates;
                let distance = DistanceBetween2LatLng(dragCoords[1],dragCoords[0],carparkCoords[1],carparkCoords[0]);
                if (distance <= radius){
                    addOption(`${carparkList[i].address}: ${carparkList[i].available_spots}`);
                };
            };
        }
        else{
            alert("Please display parking areas before scanning");
        }
    }
    else{
        alert("Please enter a number");
    };
};

function addOption(txt, val){
    document.getElementById("carparkList").options[document.getElementById("carparkList").options.length]= new Option(txt,val);
    return true;
}

//Hide first by default
$("#carparkList").hide()

//Showing and hiding the carpark scan list

function CollapseList(){
    let x = document.getElementById("CollapseList");
    if (x.innerHTML === "Show Parking Areas"){
        $("#carparkList").show();
        x.innerHTML = "Hide Parking Areas";
    } 
    else {
        $("#carparkList").hide();
        x.innerHTML = "Show Parking Areas";
    }
}