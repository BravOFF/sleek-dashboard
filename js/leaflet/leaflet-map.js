


//------------------------------------------------------------------------------

      function prim(text) {
        return "<span class=\"badge badge-primary\">"+text+"</span> ";
      }

      function pil(text) {
        return "<span class=\"badge badge-pill badge-secondary\">"+text+"</span> ";
      }

// 1


// 2
      // function dtest() {
// 3
      // }
// 4
      function testtest() {
        return '123';
      }
// 5
// 6
      function output(ob, ha) {
        let outInfo = "<div class=\"card text-dark border-dark mb-1 mt-1 InfoCard\"> <div class=\"card-header p-2\"> <h1>" + ha["cname"] + "</h1> </div> <div class=\"row no-gutters\"><div class=\"card-body p-2\">";
        let sc = "";
        for (let v in ha) {
          if (!ob[v] || v == 'number' || v == 'ID') {
            continue;
          }

          if (v=="station_center"||v=="station_ceneter") {
            sc+=output(ob[v], ha[v]);
            continue;
          }

          if (v == 'chocke_ring') {
            if (ob[v] == true) {
              outInfo += prim(ha[v] + ":") + "есть<br><hr>";
            }
            else{
              outInfo += prim(ha[v] + ":") + "нет<br><hr>";
            }
            continue;
          }

          if (v == 'gnss') {
            let gnss = "";
            for (let i = 0; i < ob[v].length; i++) {
              gnss += ob[v][i];
              if (i!=ob[v].length-1) {
                gnss+=", ";
              }
            }
            outInfo += prim(ha["gnss"] + ":") + gnss + "<br>";
            continue;
          }

          if (v == 'coord' || v == 'frequency') {
            let coord = "<div class=\"card text-white border-dark mb-1 mt-1 InfoCard\"> <div class=\"card-header p-2\"> <h1>" + ha[v]["cname"] +
                        "</h1> </div> <div class=\"row no-gutters\"><div class=\"card-body p-0\">" +
                        "<table class=\"table table-dark table-hover mb-0\"> <tbody>";
            for (let i in ob[v]){
              coord += "<tr><th scope=\"row\">" + i + "<\/th><td class=\"w-50\">" + ob[v][i] + "</td></tr>";
            };
            coord += "</tbody></table></div></div></div>";
            outInfo += coord;
            continue;
          }

          if (v == 'address' || v == 'contact') {
            let address = prim(ha[v]["cname"] + ":");
            for (let w in ha[v]) {
              if (!ob[v][w]) {
                continue;
              }
              address += pil(ha[v][w] + ":") + ob[v][w] + " ";
            }
            outInfo += address + "<br><hr>";
            continue;
          }

          if (typeof ob[v] === 'object') {
            outInfo += output(ob[v], ha[v]);
          }
          else {
            outInfo += prim(ha[v] + ":") + ob[v] + "<br><hr>";
          }
        }
        outInfo += "</div></div></div>";
        return(outInfo + sc);
      }
//------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {



  if (document.getElementById('mapid')) {

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

    var southWest = L.latLng(-300, -300),
      northEast = L.latLng(300, 300);
    var bounds = L.latLngBounds(southWest, northEast);

    mymap.setMaxBounds(bounds);
    mymap.on('drag', function () {
      mymap.panInsideBounds(bounds, {animate: false});
    });

    let tr = {
      cname: "Описание станции",
      name: "Название станции",
      organization: "Организация",
      network: "Сеть (RUS)",
      network_en: "Сеть (LAT)",
      id_network: "Номер в сети",
      conditional_name_rus: "Условное название (RUS)",
      conditional_name_lat: "Условное название (LAT)",
      date_install: "Дата установки",
      destination: "Назначение",
      department: "Принадлежность",
      mode: "Режим функционирования",
      altitude: "Высотная привязка",
      address:{
        cname: "Адресс",
      	region: "Регион",
      	city: "Город",
      	street: "Улица",
      	description: "Расположение"
      },
      contact: {
        cname: "Контакты",
      	operating_organization: "Организация",
      	person_name: "Контактное лицо",
      	person_position: "Должность",
      	tel: "Телефон",
      	email: "Email"
      },
      metrology: "Сведения о метрологии",
      meteo_equipment: "Метеорологическая аппаратура",
      placement_equipment: "Размещение спутниковой аппаратуры",
      log: "Лог-файл",
      coord: {
        cname: "Координаты",
      	B: "B",
      	L: "L",
      	H: "H",
      	Hg: "Hg",
      	X: "X",
      	Y: "Y",
      	Z: "Z"
      },
      station_center: {
        cname: "Центр станции",
      	antenna: {
          cname: "Антенна",
      		name: "Название",
      		manufacturer: "Производитель",
      		serial_number: "Серийный номер"
      	},
      	receiver: {
          cname: "Приёмник",
      		name: "Название",
      		altname: "Сокращённое название",
      		manufacturer: "Производитель",
      		serial_number: "Серийный номер"
      	},
        number_of_channels: "Количество каналов",
        frequency_standard: "Внешний стандарт частоты",
      	chocke_ring: "ГНСС антенна Chocke Ring",
      	nearby_geodetic_points: "Близлежащие геодезические пункты",
      	placement: "Условия размещения станции",
      	type: "Тип центра",
      	heigh_m: "Высота конструкционного центра (м)",
        cable_length_m: "Длинна кабеля (м)",
        gnss: "Принимаемые спутниковые системы",
      	frequency: {
          cname: "Частоты",
      		Beidou: "Beidou",
      		COMPASS: "COMPASS",
      		GLONASS: "GLONASS",
      		GPS: "GPS",
      		Galileo: "Galileo",
      		IRNSS: "IRNSS",
      		QZSS: "QZSS",
      		SBAS: "SBAS"
      	}
      }
    };

    tr.station_ceneter = tr.station_center;

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

          p = document.getElementById("name").innerHTML = fullDat.name;
          p = document.getElementById("ID").innerHTML = "ID: " + fullDat.ID;

          let outInfo = output(fullDat, tr);
          p = document.getElementById("AllInfo").innerHTML = outInfo;

          let statPic = await fetch('http://test.lan/AllPic.php?pk_id=' + pop.target._leaflet_id + '&target=map')
          let jsonPic = await statPic.json();
          console.log(jsonPic);
          if (jsonPic.length!=0) {
            document.getElementById("SatImg").src = 'http://test.lan/getIMG.php?pk_id=' + jsonPic[0];
            document.getElementById("SatImg1").src = 'http://test.lan/getIMG.php?pk_id=' + jsonPic[0];
          }
          else {
            document.getElementById("SatImg").src = 'assets/img/favicon.png';
            document.getElementById("SatImg1").src = 'assets/img/favicon.png';
          }


          pop.target.bindPopup("Название: " + fullDat.name + "<br>ID: " + fullDat.ID + "<br><button type=\"button\" id=\"more\" class=\"btn btn-pill btn-light btn-sm w-100 p-0 mt-1\" OnClick =\"testtest();\">Подробнее...</button>");


          function testtest() {
            return '123';
          }

//4
          testtest();

          // $('#more').on("click", function () {
          //   console.log("123456");
          //     $('#menu-toggle').toggleClass('open');
          //     $('#control').toggleClass('on');
          //     $('#map-menu').toggleClass('on');
          //     let bound = mymap.getBounds();
          //     let shiftM = ((bound.getNorthEast().lng - bound.getNorthWest().lng) + (bound.getSouthEast().lng - bound.getSouthWest().lng)) / 8;
          //     mymap.setView([bound.getCenter().lat, bound.getCenter().lng - shiftM]);
          // })

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


let chislo = 234;
