
/*
async function fas(lin) {
  let response = await fetch(lin);
  return await response.json();
}
(async () => {
  let response = await fetch('/SetStation.json');
  let dat = await response.json();
})();
*/

var mymap = L.map('mapid').setView([65, 100], 3);
mymap.setMinZoom(3);

var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map dat: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var baseMaps = {
  ToolMap: OpenTopoMap,
  OSM: osmLayer,
};

let arMarker = {
  0 : L.icon({}),
  1 : L.icon({
    iconUrl: 'img/marker1.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  }),

  2 : L.icon({
    iconUrl: 'img/marker2.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  }),

  3 : L.icon({
    iconUrl: 'img/marker3.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  }),

  4 : L.icon({
    iconUrl: 'img/marker4.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  }),

  5 : L.icon({
    iconUrl: 'img/marker5.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  }),
};

(async () => {
  let response = await fetch('/SetStation.json');
  let dat = await response.json();

for (var i = 0; i < dat.length; i++) {
  if (dat[i].orgID && arMarker[dat[i].orgID]) {
    var  marker = L.marker([dat[i].coord.B,dat[i].coord.L],{/*icon: arMarker[dat[i].orgID]*/}).addTo(mymap);
    marker.bindPopup("Название: " + dat[i].name + "<br/>ID: " + dat[i].ID + "<br/><u>Подробнее...<u/>");
  }
  else {
    var  marker = L.marker([dat[i].coord.B,dat[i].coord.L],{}).addTo(mymap);
    marker.bindPopup("Название: " + dat[i].name + "<br/>ID: " + dat[i].ID + "<br/><u>Подробнее...<u/>");
  }
}

})();

L.control.scale({position: 'bottomright'}).addTo(mymap);
L.control.layers(baseMaps, {}).addTo(mymap);
mymap.zoomControl.setPosition('topright');
