
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

  let response = await fetch('http://test.lan/mapGetStations.php');
  let dat = await response.json();
  let id_buff = {};
  let markers;
  let net = [];

  for (let i = 0; i < dat.length; i++) {
    if (arMarker[dat[i].lang.RU.network_en]&&dat[i].lang.RU.network_en) {
      markers = L.marker([dat[i].lang.RU.coord.B, dat[i].lang.RU.coord.L], {icon: arMarker[dat[i].lang.RU.network_en]});
    }
    else {
      markers = L.marker([dat[i].lang.RU.coord.B, dat[i].lang.RU.coord.L], {});
    }


      markers.bindPopup("Название: " + dat[i].lang.RU.name + "<br/>ID: " + dat[i].lang.RU.ID).on("click", popupOpen);
      markers.bindTooltip(dat[i].lang.RU.ID, {permanent: true, className: "label", offset: [0, 0] });
      markers.on("mouseover", function(e){e.target.setIcon(onMarker);});
      markers.on("mouseout", function(e){e.target.setIcon(arMarker[dat[i].lang.RU.network_en]);});

      //фильтр по сети---------------------------------
      if(!net[dat[i].lang.RU.network_en])
        net[dat[i].lang.RU.network_en] = L.layerGroup();
      net[dat[i].lang.RU.network_en].addLayer(markers);
      //фильтр по сети---------------------------------

    markers._leaflet_id = dat[i].pk_id;
    id_buff[dat[i].pk_id] = i;
    markersCluster.addLayer(markers);

  }

    markersCluster.checkIn(net); // <= this is where the magic happens!


  function popupOpen(pop) {
    this.currentPop = pop;
    console.log(pop.target._leaflet_id);
    if(!$('#map-menu').hasClass('on') )
    {
      $('#map-menu').toggleClass('on');
      $('#but').toggleClass('on');
    }

    let p;

    p = document.getElementById("name").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.name;
    p = document.getElementById("ID").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.ID;
    p = document.getElementById("organization").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.organization;
    p = document.getElementById("network").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.network;
    p = document.getElementById("id_network").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.id_network;
    p = document.getElementById("conditional_name_rus").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.conditional_name_rus;
    p = document.getElementById("conditional_name_lat").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.conditional_name_lat;
    p = document.getElementById("date_install").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.date_install;
    p = document.getElementById("destination").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.destination;
    p = document.getElementById("mode").innerHTML =dat[id_buff[pop.target._leaflet_id]].lang.RU.mode;

    //p = document.getElementById("IMG").innerHTML = dat[pop.target._leaflet_id].name;
  }


cont = L.control.layers(baseMaps,net).addTo(mymap);
//cont.net.addTo(mymap);

})();



L.control.scale({position: 'bottomright'}).addTo(mymap);

mymap.zoomControl.setPosition('topright');
