
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

      "RZD": L.divIcon({
        className: 'mdi mdi-radiobox-marked rzd',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      }),

      "IGS": L.divIcon({
        className: 'mdi mdi-radiobox-marked igs',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      }),

      "WORT": L.divIcon({
        className: 'mdi mdi-radiobox-marked wort',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      }),

      "FAGS": L.divIcon({
        className: 'mdi mdi-radiobox-marked fags',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      }),

      "EPN": L.divIcon({
        className: 'mdi mdi-radiobox-marked epn',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      }),
    };

    let onMarker = L.divIcon({
      className: 'mdi mdi-circle-slice-8 ACTIVE',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });


    (async () => {
      let markersClusterGroup = L.markerClusterGroup.layerSupport();


      let response = await fetch(apiURL + '/getStations/');
      let dat = await response.json();    //  dat[ID, net, coord]



      let marker;
      let net = [];

      for (let i in dat) {

        if (arMarker[dat[i][1]] && dat[i][1]) {
          marker = L.marker([dat[i][2][0], dat[i][2][1]], {icon: arMarker[dat[i][1]]});
        } else {
          marker = L.marker([dat[i][2][0], dat[i][2][1]], {});
        }

        marker.bindPopup();
        marker.on("click", popupOpen);
        marker.on("mouseover", function (e) {
          e.target.setIcon(onMarker);
        });
        marker.on("mouseout", function (e) {
          e.target.setIcon(arMarker[dat[i][1]]);
        });
        marker._leaflet_id = i;

        //фильтр по сети---------------------------------
        if (!net[dat[i][1]])
          net[dat[i][1]] = L.layerGroup();
        net[dat[i][1]].addLayer(marker);
        //фильтр по сети---------------------------------
        markersClusterGroup.addLayer(net[dat[i][1]]);
      }

      markersClusterGroup.eachLayer(function (layer) {
        if (layer instanceof L.Marker)
          layer.bindTooltip(dat[layer._leaflet_id][0], {permanent: true, className: "label", offset: [0, 0], opacity: 1, sticky:true});
      });

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
          p = document.getElementById("organization").innerHTML = "Организация: " + fullDat.organization + "<hr>";
          p = document.getElementById("network").innerHTML = "Сеть: " + fullDat.network + "<hr>";
          p = document.getElementById("id_network").innerHTML = "ID в сети: " + fullDat.id_network + "<hr>";
          p = document.getElementById("conditional_name_rus").innerHTML = "Условное название (RUS): " + fullDat.conditional_name_rus + "<hr>";
          p = document.getElementById("conditional_name_lat").innerHTML = "Условное название (LAT): " + fullDat.conditional_name_lat + "<hr>";
          p = document.getElementById("date_install").innerHTML = "Дата установки: " + fullDat.date_install + "<hr>";
          p = document.getElementById("destination").innerHTML = "Назначение: " + fullDat.destination + "<hr>";
          p = document.getElementById("department").innerHTML = "Принадлежность: " + fullDat.department + "<hr>";
          p = document.getElementById("address").innerHTML = "Адрес: " + fullDat.address.city + ", " + fullDat.address.street + "<hr>";


          let statPic = await fetch('http://test.lan/AllPic.php?pk_id=' + pop.target._leaflet_id + '&target=map')
          let jsonPic = await statPic.json();
          console.log(jsonPic);
          if (jsonPic.length!=0) {
            document.SatImg.src = 'http://test.lan/getIMG.php?pk_id=' + jsonPic[0];
          }
          else {
            document.SatImg.src = 'assets/img/favicon.png';
          }




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
