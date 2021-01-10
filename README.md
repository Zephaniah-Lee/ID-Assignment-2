# ID-Assignment-2

## Explanation
This "app" is meant to be a parking locator. With the use of the MapBox API a map will be shown. With the use of a carpark availabilty and carpark information app for Singapore, carparks can be displayed on the map with their relevant information such as their Address, Type, Payment System, Parking Time, Free Parking Time and Available Spots. The intended audience is for those who intend to find a parking lot with available spots at a specific location or at their current location.

This App will only work in Singapore  and for only some parking lots due to the APIs used.

There are 3 main features of the App.
 1. Displaying Parking Icons on the Map
 2. Displaying Carpark Information by Clicking on Parking Icons
 3. Scanning for Parking Areas in a radius near a draggable pin

 ### 1. Displaying Parking Icons
 By clicking on the Show Parking Areas button, icons will appear on the map after a short amount of time (10 seconds).
 After all the icons are loaded in, an alert will inform you that they have loaded in.
 The Parking Areas can also be hidden afterward by clicking the Hide Parking Areas button that replaced the Show Parking Areas button

 ### 2. Displaying Carpark Information
 By clicking on the parking icons that appeared after clicking the Show Parking Areas button, a textbox will appear giving information about the carpark (Address, Type, Payment System, Parking Time, Free Parking Time and Available Spots)
 These textboxes can be closed by clicking the "x" button on the box.

 ### 3. Scanning for Parking Areas
 When you started the app you were asked for your location. Regardless of if you gave your information or not, a pin will be added to the map.
 This pin is draggable and will be used for this function of the App.
 By inputting a radius (in kilometers) and clicking and the Scan Parking Areas button, a radius around the draggable pin will be scanned for parking lots.
 By clicking the Show Parking Areas button after scanning, you will be given the addresses within the radius and their empty parking lots.
 You can close this list by clicking the Hide Parking Areas button that replaced the Show Parking Areas button
 
 

## References
* https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition 
* https://docs.mapbox.com/mapbox-gl-js/example/flyto/
* https://www.mapbox.com/install/js/cdn-install/
* https://github.com/mapbox/mapbox-gl-directions
* https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol
* https://docs.mapbox.com/mapbox-gl-js/api/markers/
* https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
* https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
* https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/
* https://simplemaps.com/resources/location-distance
* https://www.javatpoint.com/html-list-box
* https://www.c-sharpcorner.com/UploadFile/mahakgupta/add-and-remove-listbox-items-in-javascript/
* https://www.w3schools.com/howto/howto_js_collapsible.asp

## APIs
* https://api.data.gov.sg/v1/transport/carpark-availability
* https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c
* https://developers.onemap.sg/commonapi/convert/3414to4326?X={X Coordinates}&Y={Y Coordinates}
* https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js
* https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css