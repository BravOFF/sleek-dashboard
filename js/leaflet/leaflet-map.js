
document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById('mapid')) {

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
    mymap.on('drag', function () {
      mymap.panInsideBounds(bounds, {animate: false});
    });


    let arMarker = {

      "RZD": L.icon({
        iconUrl: 'assets/plugins/leaflet/images/marker1.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      }),

      "IGS": L.icon({
        iconUrl: 'assets/plugins/leaflet/images/marker2.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      }),

      "WORT": L.icon({
        iconUrl: 'assets/plugins/leaflet/images/marker3.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      }),

      "FAGS": L.icon({
        iconUrl: 'assets/plugins/leaflet/images/marker4.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      }),

      "EPN": L.icon({
        iconUrl: 'assets/plugins/leaflet/images/marker5.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      }),
    };

    let onMarker = L.icon({
      iconUrl: 'assets/plugins/leaflet/images/marker5.png',
      shadowUrl: 'assets/plugins/leaflet/images/markerShadow.png',
      shadowSize: [26, 26],
      shadowAnchor: [13, 13],

      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });


    (async () => {
      let markersClusterGroup = L.markerClusterGroup.layerSupport();//.addTo(mymap);

      let response = await fetch(apiURL + '/getStations/');
      let dat = await response.json();    //  dat[ID, net, coord]
      let id_buff = {};
      let marker;
      let net = [];

      for (let i in dat) {

        if (arMarker[dat[i][1]] && dat[i][1]) {
          marker = L.marker([dat[i][2][0], dat[i][2][1]], {icon: arMarker[dat[i][1]]});
        } else {
          marker = L.marker([dat[i][2][0], dat[i][2][1]], {});
        }

        marker.bindPopup();
        marker.on("mouseover", function (e) {
          e.target.setIcon(onMarker);
        });
        marker.on("mouseout", function (e) {
          e.target.setIcon(arMarker[dat[i][1]]);
        });
        marker.on("click", popupOpen);

        //фильтр по сети---------------------------------
        if (!net[dat[i][1]])
          net[dat[i][1]] = L.layerGroup();

        net[dat[i][1]].addLayer(marker);
        //фильтр по сети---------------------------------

        marker._leaflet_id = i;
        markersClusterGroup.addLayer(net[dat[i][1]]);

      }

      markersClusterGroup.eachLayer(function (layer) {
        if (layer instanceof L.Marker)
          layer.bindTooltip(dat[layer._leaflet_id][0], {permanent: true, className: "label", offset: [0, 0]});
      })

      markersClusterGroup.checkIn(net);


      function popupOpen(pop) {
        this.currentPop = pop;
        if (!$('#map-menu').hasClass('on') && !$('#control').hasClass('closed')) {
          $('#map-menu').toggleClass('on');
          $('#control').toggleClass('on');
          $('#menu-toggle').toggleClass('open');
        }
        let shift = 0;
        if ($('#map-menu').hasClass('on')) {
          let bound = this._map.getBounds();
          shift = (bound.getNorthEast().lng - bound.getNorthWest().lng) / 4;
        }
        this._map.setView([this._latlng.lat, this._latlng.lng - shift]);
        console.log(this);
        (async () => {

          let p;
          let lang = "EN";
          let station = await fetch(apiURL + '/getStation/?id=' + pop.target._leaflet_id + '&lang=' + lang);
          let fullDat = await station.json();

          p = document.getElementById("name").innerHTML = "Название: " + fullDat.name;
          p = document.getElementById("ID").innerHTML = "ID: " + fullDat.ID;
          p = document.getElementById("organization").innerHTML = "Организация: " + fullDat.organization;
          p = document.getElementById("network").innerHTML = "Сеть: " + fullDat.network;
          p = document.getElementById("id_network").innerHTML = "ID в сети: " + fullDat.id_network;
          p = document.getElementById("conditional_name_rus").innerHTML = "Условное название (RUS): " + fullDat.conditional_name_rus;
          p = document.getElementById("conditional_name_lat").innerHTML = "Условное название (LAT): " + fullDat.conditional_name_lat;
          p = document.getElementById("date_install").innerHTML = "Дата установки: " + fullDat.date_install;
          p = document.getElementById("destination").innerHTML = "Назначение: " + fullDat.destination;
          p = document.getElementById("department").innerHTML = "Принадлежность: " + fullDat.department;
          p = document.getElementById("address").innerHTML = "Адрес: " + fullDat.address.city + ", " + fullDat.address.street;

          pop.target.bindPopup("Название: " + fullDat.name + "<br/>ID: " + fullDat.ID);

        })();
      }

      let cont = L.control.layers(baseMaps, net, 'sortLayers').addTo(mymap).expand();

      markersClusterGroup.addTo(mymap);
    })();

    $('#but').on("click", function () {
      if ($('#map-menu').hasClass('') && $('#control').hasClass('')) {
        $('#control').toggleClass('closed');
      }

      if ($('#map-menu').hasClass('on') && $('#control').hasClass('closed on')) {
        let bound = mymap.getBounds();
        let shiftM = ((bound.getNorthEast().lng - bound.getNorthWest().lng) + (bound.getSouthEast().lng - bound.getSouthWest().lng)) / 8;
        mymap.setView([bound.getCenter().lat, bound.getCenter().lng - shiftM]);
      }

      if ($('#map-menu').hasClass('') && $('#control').hasClass('closed')) {
        let bound = mymap.getBounds();
        let shiftM = ((bound.getNorthEast().lng - bound.getNorthWest().lng) + (bound.getSouthEast().lng - bound.getSouthWest().lng)) / 8;
        mymap.setView([bound.getCenter().lat, bound.getCenter().lng + shiftM]);
      }
    })


    mymap.zoomControl.setPosition('topright');
  }
});
