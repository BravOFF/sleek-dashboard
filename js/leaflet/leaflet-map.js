
var mymap = L.map('mapid').setView([65, 100], 2);
mymap.setMinZoom(2);

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


var southWest = L.latLng(-300, -200),
northEast = L.latLng(300, 200);
var bounds = L.latLngBounds(southWest, northEast);

mymap.setMaxBounds(bounds);
mymap.on('drag', function() {
  mymap.panInsideBounds(bounds, { animate: false });
});

let arMarker = {
  "RZD" : L.icon({
    iconUrl: 'assets/plugins/leaflet/images/marker1.png',
    iconSize:     [16, 16],
    iconAnchor:   [8, 8],
    popupAnchor:  [0, -8]
  }),

  "IGS" : L.icon({
    iconUrl: 'assets/plugins/leaflet/images/marker2.png',
    iconSize:     [16, 16],
    iconAnchor:   [8, 8],
    popupAnchor:  [0, -8]
  }),

  "WORT" : L.icon({
    iconUrl: 'assets/plugins/leaflet/images/marker3.png',
    iconSize:     [16, 16],
    iconAnchor:   [8, 8],
    popupAnchor:  [0, -8]
  }),

  "FAGS" : L.icon({
    iconUrl: 'assets/plugins/leaflet/images/marker4.png',
    iconSize:     [16, 16],
    iconAnchor:   [8, 8],
    popupAnchor:  [0, -8]
  }),

  "EPN" : L.icon({
    iconUrl: 'assets/plugins/leaflet/images/marker5.png',
    iconSize:     [16, 16],
    iconAnchor:   [8, 8],
    popupAnchor:  [0, -8]
  }),
};

let onMarker = L.icon({
  iconUrl: 'assets/plugins/leaflet/images/marker5.png',
  shadowUrl: 'assets/plugins/leaflet/images/markerShadow.png',
  shadowSize: [26, 26],
  shadowAnchor:   [13, 13],

  iconSize:     [20, 20],
  iconAnchor:   [10, 10],
  popupAnchor:  [0, -10]
});


(async () => {
  let markersCluster = L.markerClusterGroup.layerSupport().addTo(mymap);

  //let response = await fetch('http://bitrixdesign.iackvno.local/api_test/getStations/');
  let response = await fetch('http://test.lan/getStations.php');
  let dat = await response.json();    //  dat[ID, net, coord]
  console.log(dat);
  let id_buff = {};
  let marker;
  let net = [];
  let lang = "EN"
  // for (let i = 0; i < dat.length; i++) {
  for(let i in dat){

    if (arMarker[dat[i][1]]&&dat[i][1]) {
      marker = L.marker([dat[i][2][0],dat[i][2][1]], {icon: arMarker[dat[i][1]]});
    }
    else {
      marker = L.marker([dat[i][2][0],dat[i][2][1]], {});
    }

    marker.on("click", popupOpen);
    marker.on("mouseover", function(e){e.target.setIcon(onMarker);});
    marker.on("mouseout", function(e){e.target.setIcon(arMarker[dat[i][1]]);});

      //фильтр по сети---------------------------------
      if(!net[dat[i][1]])
        net[dat[i][1]] = L.layerGroup();
      net[dat[i][1]].addLayer(marker);
      //фильтр по сети---------------------------------

    marker._leaflet_id = i;
    markersCluster.addLayer(marker);
    
  }

  markersCluster.eachLayer(function(layer) {
          if(layer instanceof L.Marker)
              layer.bindTooltip(dat[layer._leaflet_id][0], {permanent: true, className: "label", offset: [0, 0] });
      })

console.log(dat);
    markersCluster.checkIn(net); // <= this is where the magic happens!


  function popupOpen(pop) {

    (async () => {
    this.currentPop = pop;
    //console.log(pop.target);
    if(!$('#map-menu').hasClass('on') )
    {
      $('#map-menu').toggleClass('on');
      $('#but').toggleClass('on');
    }

    let p;

    let station = await fetch('http://test.lan/getStation.php', {method: 'POST',
                                                                 body: pop.target._leaflet_id});
    let fullDat = await station.json();
    console.log(fullDat.name);
    pop.target.bindPopup("Название: " + fullDat.name + "<br/>ID: " + fullDat.ID);

    p = document.getElementById("name").innerHTML =fullDat.name;
    p = document.getElementById("ID").innerHTML =fullDat.ID;
    p = document.getElementById("organization").innerHTML =fullDat.organization;
    p = document.getElementById("network").innerHTML =fullDat.network;
    p = document.getElementById("id_network").innerHTML =fullDat.id_network;
    p = document.getElementById("conditional_name_rus").innerHTML =fullDat.conditional_name_rus;
    p = document.getElementById("conditional_name_lat").innerHTML =fullDat.conditional_name_lat;
    p = document.getElementById("date_install").innerHTML =fullDat.date_install;
    p = document.getElementById("destination").innerHTML =fullDat.destination;
    p = document.getElementById("mode").innerHTML =fullDat.mode;
    })();
  }


let cont = L.control.layers(baseMaps,net).addTo(mymap);

})();



L.control.scale({position: 'bottomright'}).addTo(mymap);

mymap.zoomControl.setPosition('topright');
