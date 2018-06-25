// JavaScript Document

//var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster
//var marks = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster per filtri
(function($){
		var amianto = 0;
		var morto = 0;
		var tumore = 0;
		var dataInizio = 0;
		var dataFine = 0;
		var markers = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster	dell'handle
		var marks = L.markerClusterGroup({ chunkedLoading: true }); //creo il cluster	del filter
		serverURL = "server/handler.php" 
		loadData();
		//AGGIUNGERE I GESTORI DI EVENTI SUI PULSANTI !!
		$("#filtra").on('click', function(){
			amianto = $(".amianto").is(":checked") ? 1 : 0;
			morto = $(".morto").is(":checked") ? 1 : 0;
			tumore = $(".tumore").is(":checked") ? 1 : 0;
			dataInizio = parseDate(new Date($(".dataI").val()));
			dataFine = parseDate(new Date($(".dataF").val()));
			if(dataInizio != 0)
				if(dataFine == 0)
					alert("Non hai selezionato la data finale!");
				/*else{
					if (dataInizio.substring(0,4) < dataFine.substring(0,4){
						//mettere controllo data
					}
				}*/
			marks.clearLayers();
			filterData();
		})
		
		function parseDate(date){
			if(isNaN(date))
				return data = 0;
			data = [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
			return data;
		}
			
			
		function loadData() {
			console.log("loadData");
			request_type = "load";
			
			$.ajax({
				url: serverURL,
				type: "POST",
				//contentType: 'application/json; charset=utf-8',
				data: {"action" : request_type}, //invio la richiesta al server
				dataType: "json",
				success:function(data){ //data contiene la risposta dal server
					handleLoad(data);
				},
				error: function(XHR, err) {
					alert( "Request failed: " + err );
				}
				//dataType: "json",
			});
 
			
		}
		
		
		function handleLoad(data) {
			console.log("handleLoad");
			console.log(data); //è un array	
			filterData(); //chiamo filter con tutti i filtri disattivati
			//console.log(data[0]); //oggetto con lat lng e count	
			/*markers = L.markerClusterGroup({iconCreateFunction: function(cluster) {
					// iterate all markers and count
					var markers = cluster.getAllChildMarkers();
					var weight = 0;
					for (var i = 0; i < markers.length; i++) {
						if(markers[i].options.hasOwnProperty("customWeight")){
						weight += parseInt(markers[i].options.customWeight);      
						var a =1;
					  }
					}
					var c = ' marker-cluster-';
					if (weight < 2000) {
						c += 'small';
					} else if (weight < 4000) {
						c += 'medium';
					} else {
						c += 'large';
					}
					// create the icon with the "weight" count, instead of marker count
					return L.divIcon({ 
						html: '<div><span>' + weight + '</span></div>',
						className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
					});
				}
			});//creo il cluster
			for (var i = 0; i < data.length; i++) {
				var a = data[i]; 
				var lat = a.latitudine;
				var lng = a.longitudine;
				var count = a.count;
				var marker=new weightMarker([lat, lng], { customWeight: count });
				marker.bindPopup(count);
				markers.addLayer(marker);
	
			}
			map.addLayer(markers);
			 // aggiungo I marcatori*/
		}
		
		
		function filterData(){ //questa funzione verrò chiamata ogni volta che si varia un valore nel filtro 
			console.log("filterData");
			request_type = "filter";	
			console.log("amianto: " + amianto); //qui bisogna prendere il valore del filtro da jquery (metto 1 solo per i test)
			console.log("tumore: " + tumore); 
			console.log("morto: " + morto); 
			console.log("dataI: " + dataInizio);
			console.log("dataF: " + dataFine);
			
			$.ajax({
				url: serverURL,
				type: "POST",
				data: {"action" : request_type, "tumore" : tumore, "amianto" : amianto, "morto" : morto, "dataInizio" : dataInizio, "dataFine" : dataFine},
				dataType: "json",
				success:function(data){
					handleFilter(data);
				},
				error: function(XHR, err) {
					alert( "Request failed: " + err );
				}
			});
		}
		
		function handleFilter(data){
			console.log("handleLoadF");
			console.log(data); //è un oggetto con l'array in data
			markers.clearLayers();//tolgo i marcatori caricati da handle
			//data a questo punto è un array che contiene elementi ognuno con latitudine, longitudine e count. 
			data = data.data;
			console.log(data);
			console.log(data.settore);
			marks = L.markerClusterGroup({iconCreateFunction: function(cluster) {
					// iterate all markers and count
					var markers = cluster.getAllChildMarkers();
					var weight = 0;
					for (var i = 0; i < markers.length; i++) {
						if(markers[i].options.hasOwnProperty("customWeight")){
						weight += parseInt(markers[i].options.customWeight);      
						var a =1;
					  }
					}
					var c = ' marker-cluster-';
					if (weight < 2000) {
						c += 'small';
					} else if (weight < 4000) {
						c += 'medium';
					} else {
						c += 'large';
					}
					// create the icon with the "weight" count, instead of marker count
					return L.divIcon({ 
						html: '<div><span>' + weight + '</span></div>',
						className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
					});
				}//dim marker:50x82
			});//creo il cluster
			for (var i = 0; i < data.length; i++) {
				var a = data[i]; 
				var lat = a.latitudine;
				var lng = a.longitudine
				var count = a.count;
				var settore = a.settore;
				var agricolturaIcon = L.icon({
					iconUrl: 'img/agricoltura.png',
					//shadowUrl: 'leaf-shadow.png',

					iconSize:     [70, 70], // size of the icon
					//shadowSize:   [50, 64], // size of the shadow
					iconAnchor:   [45, 68], // point of the icon which will correspond to marker's location
					//shadowAnchor: [4, 62],  // the same for the shadow
					popupAnchor:  [-3, -45] // point from which the popup should open relative to the iconAnchor
				});
				var industriaIcon = L.icon({
					iconUrl: 'img/industria.png',
					iconSize:     [70, 70], // size of the icon
				});
				var statoIcon = L.icon({
					iconUrl: 'img/stato.png',
					iconSize:     [70, 70], // size of the icon
					iconAnchor:   [10, 30],
					popupAnchor:  [25, 0]
				});
				
				console.log(settore);
				switch(settore){
					case 'Agricoltura':
						
						var marker=new weightMarker([lat, lng], { customWeight: count,  icon: agricolturaIcon });
						break;
					case 'Industria':
						var marker=new weightMarker([lat, lng], { customWeight: count,  icon: industriaIcon });
						break;
					case 'Statale':
						var marker=new weightMarker([lat, lng], { customWeight: count,  icon: statoIcon });
						break;
				}
				//var marker=new weightMarker([lat, lng], { customWeight: count});
				marker.bindPopup(count);
				marks.addLayer(marker);
			}
			//trovare un modo per aggiungere un minimo di ritardo per enfatizzare il cambiamento dei marcatori sulla mappa
			markers.clearLayers();
			map.addLayer(marks); // aggiungo I marcatori*/
		}
})(jQuery);


latlng = L.latLng(42.56, 12.50);
var map = L.map('map', {center: latlng, zoom: 8});
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiOWV0dG9yZTYiLCJhIjoiY2ppb3FpOXlxMGM5ODN2dDl6Mjh2cTUwOCJ9.QoSRENS3F5CVJSIjLywTxg'
}).addTo(map);

var weightMarker = L.Marker.extend({
   options: { 
      customWeight: 0
   }
});
