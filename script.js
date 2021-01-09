//Token needed for access to MapBox
mapboxgl.accessToken = "pk.eyJ1IjoiemVwaGFuaWFoIiwiYSI6ImNrajVncWhzdzFhYWgyd3BkcXpkOTl0ejQifQ.DcVR3f9JVGvLP8dJOYkMOg";

// Getting current location
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

/*
navigator.geolocation.getCurrentPosition(success,error,{
    enableHighAccuracy: true
});

//When given your location, startMap
function success(position){
    startMap([position.coords.longitude, position.coords.latitude])
};

// When not given your location, defaulted to Singapore
function error(){
    startMap([103.851959, 1.290270])
}*/

let map = new mapboxgl.Map({ //since map is in a function, it isnt a global variable
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 17,
    center: [103.76788,1.33581]
});

//Places navigation tools (+ - buttons and compass)
//https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol
let nav = new mapboxgl.NavigationControl();
map.addControl(nav);

//Places directions function to give direction from point A to point B
// https://github.com/mapbox/mapbox-gl-directions
let directions = new MapboxDirections({
accessToken: "pk.eyJ1IjoiemVwaGFuaWFoIiwiYSI6ImNrajVncWhzdzFhYWgyd3BkcXpkOTl0ejQifQ.DcVR3f9JVGvLP8dJOYkMOg",
});

map.addControl(directions, "top-left");

new mapboxgl.Marker().setLngLat([103.76788,1.33581]).addTo(map)

/*
function startMap(position){
    //Creates Map with the center point of the map being your current position
    let map = new mapboxgl.Map({ //since map is in a function, it isnt a global variable
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 17,
        center: position
    });

    //Places navigation tools (+ - buttons and compass)
    // https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol
    let nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    //Places directions function to give direction from point A to point B
    // https://github.com/mapbox/mapbox-gl-directions
    let directions = new MapboxDirections({
    accessToken: "pk.eyJ1IjoiemVwaGFuaWFoIiwiYSI6ImNrajVncWhzdzFhYWgyd3BkcXpkOTl0ejQifQ.DcVR3f9JVGvLP8dJOYkMOg",
    });

    map.addControl(directions, "top-left");

    //Places a marker at your current position
    //https://docs.mapbox.com/mapbox-gl-js/api/markers/
    new mapboxgl.Marker().setLngLat(position).addTo(map);

};
*/



//When Display parking areas button is clicked, it will change its text to "Hide parking areas"
//When Hide parking areas button is clicked, it will change its text to "Display parking areas"

function toggleParkingAreas() {
    let x = document.getElementById("ParkingAreas");
    if (x.innerHTML === "Display Parking Areas") {
      x.innerHTML = "Hide Parking Areas";
      FetchCarparkData(carparkList)
    } else {
      x.innerHTML = "Display Parking Areas";
    }
  }

//Fetch the data from https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c to get carpark locations

let carparkList = []

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
    
        PlaceCarparkMarkers(carparkList);
        
};

function PlaceCarparkMarkers(carparkList){
    //https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
    // add markers to map
    carparkList.forEach(function(marker) {

        // create a HTML element for each feature
        var el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundImage = "url(parking.png)";
        el.style.width = "35px";
        el.style.height = "37px";
        // make a marker for each feature and add to the map
        
        new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML("<h3>" + marker.address + "</h3><p>" 
            + "Parking Type: " + marker.type + "<br></br>"
            + "Parking Time: " + marker.parking_time + "<br></br>" //just added this (remove)
            + "Free parking: " + marker.free_parking + "<br></br>"
            + "Payment System: " + marker.payment_system + "<br></br>" 
            + "Available spots: " + marker.available_spots + "</p>"))
            .addTo(map);
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

