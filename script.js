mapboxgl.accessToken = 'pk.eyJ1IjoiemVwaGFuaWFoIiwiYSI6ImNrajVncWhzdzFhYWgyd3BkcXpkOTl0ejQifQ.DcVR3f9JVGvLP8dJOYkMOg';

// Getting current location
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
navigator.geolocation.getCurrentPosition(success,error,{
    enableHighAccuracy: true
});

function success(position){
    console.log(position)
    startMap([position.coords.longitude, position.coords.latitude])
};

// When not given your location, defaulted to Singapore
function error(){
    startMap([103.851959, 1.290270])
}

function startMap(position){
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 17,
        center: position
    });

    // https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol
    let nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    // https://github.com/mapbox/mapbox-gl-directions



    let directions = new MapboxDirections({
    accessToken: 'pk.eyJ1IjoiemVwaGFuaWFoIiwiYSI6ImNrajVncWhzdzFhYWgyd3BkcXpkOTl0ejQifQ.DcVR3f9JVGvLP8dJOYkMOg',
    });

    map.addControl(directions, 'top-left');
};