angular.module('starter.controllers', [])
/**
 * @ngdoc controller
 * @name starter.controllers.controller:LoginCtrl
 * @description
 * Controller de lógica de login.
 */
.controller('LoginCtrl', function($scope,LoginService,$state,$ionicPopup,$rootScope) {
  $scope.user = {user:"user",pass:"123"};

  /**
  * @ngdoc method
  * @name login
  * @methodOf starter.controllers.controller:LoginCtrl
  * @description
  * Envia lós datos de usuario y passoword al servicio.
  *
  */
  $scope.login = function(){
    console.debug("login")
    LoginService.login($scope.user).success(function(user){
      $state.go("tab.dash")
      $rootScope.__USER = user;
      $scope.user = {};

    }).catch(function(err){
      console.error(err);
      $ionicPopup.alert({
        title: 'Error',
        content: 'Usuario y/o contraseña incorrectos.'
      })
    })
  }
})

/**
 * @ngdoc controller
 * @name starter.controllers.controller:DashCtrl
 * @description
 * Controller que maneja toda la lógica referente a rutas, render, busqueda y creación de las mismas.
 */
.controller('DashCtrl', function($scope,$cordovaGeolocation,$ionicModal,RouteService,$rootScope,$ionicPopup) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();

   /**
  * @ngdoc method
  * @name init
  * @methodOf starter.controllers.controller:DashCtrl
  * @description
  * Inicializa la pantalla, hace render del mapa y busca las rutas favoritas.
  *
  */ 
  $scope.init = function(){

    RouteService.find().success(function(rutas){
      $scope.misRutas = rutas;
      console.debug($scope.misRutas)
    }).catch(function(err){
      console.error(err);
    })

    $scope.nuevaRuta = {};
    $ionicModal.fromTemplateUrl('modal-nuevaruta.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalNuevaRuta = modal;
    });

    $ionicModal.fromTemplateUrl('modal-misrutas.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalMisRutas = modal;
    });

    $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false}).then(function(position){
      var lat  = position.coords.latitude;
      var lon = position.coords.longitude;
      console.log(lat,lon);
      $scope.map = { center: { latitude: lat, longitude: lon }, zoom: 12,control:{} };
      $scope.currentPos = {
        coords:{
          latitude: lat,
          longitude: lon
        },
        options:{
          draggable: false,
          icon: 'img/myloc.png'
        }
      }
      $scope.iniPos = {
        coords:{
          
        }
      }
      $scope.endPos = {
        coords:{
          latitude: lat,
          longitude: lon+.01,
        }
      }
      console.log("termina posición ")
       // instantiate google map objects for directions
      
      
      

    }).catch(function(err){
      console.error("error al obtener la posición")
    })
  }


  /**
  * @ngdoc method
  * @name submitModalRuta
  * @methodOf starter.controllers.controller:DashCtrl
  * @description
  * Recibe las rutas seleccionadas en el componente de autocompletar y envía a hacer render al metodo renderRuta..
  *
  * 
  */ 
  $scope.submitModalRuta = function(){
    console.debug($scope.nuevaRuta.start,$scope.nuevaRuta.end)
    $scope.renderRuta(
      {
        lat:$scope.nuevaRuta.start.geometry.location.lat(),
        lon:$scope.nuevaRuta.start.geometry.location.lng(),
        desc:$scope.nuevaRuta.start.formatted_address
      },
      {
        lat:$scope.nuevaRuta.end.geometry.location.lat(),
        lon:$scope.nuevaRuta.end.geometry.location.lng(),
        desc:$scope.nuevaRuta.end.formatted_address
      }
    );

    $scope.mode = "C";
    $scope.modalNuevaRuta.hide();   

    
  }

  /**
  * @ngdoc method
  * @name showModalNuevaRuta
  * @methodOf starter.controllers.controller:DashCtrl
  * @description
  * Inicializa modal de nueva ruta..
  *
  * 
  */ 
  $scope.showModalNuevaRuta = function(){
    $scope.nuevaRuta = {};
    $scope.modalNuevaRuta.show()
  }

  /**
  * @ngdoc method
  * @name submitModalMisRutas
  * @methodOf starter.controllers.controller:DashCtrl
  * @description
  * Inicializa modal de mis rutas..
  *
  * 
  */ 
  $scope.submitModalMisRutas = function(rt){
    $scope.modalMisRutas.hide();
    $scope.currentRuta = rt;
    $scope.mode = 'R';
    $scope.renderRuta(rt.start,rt.end);
  }

  /**
  * @ngdoc method
  * @name save
  * @methodOf starter.controllers.controller:DashCtrl
  * @description
  * Persiste la ruta seleccionada en el servidor y añade la nueva ruta a "mis rutas"
  *
  * 
  */ 
  $scope.save = function(){
    var route = {
      user:$rootScope.__USER,
      start:{
        lat: $scope.iniPos.coords.latitude,
        lon: $scope.iniPos.coords.longitude,
        desc : $scope.iniPos.desc
      },
      end:{
        lat: $scope.endPos.coords.latitude,
        lon: $scope.endPos.coords.longitude,
        desc : $scope.endPos.desc

      }
    }
    RouteService.create(route).success(function(routeres){
      console.debug("ruta creada",routeres)
      $scope.misRutas.push(routeres);
      $scope.currentRuta = routeres;
      $scope.mode='R';
      $ionicPopup.alert({
        title: 'Éxito',
        content: 'Ruta creada.'
      })
    }).catch(function(err){
      console.error(err)
    })

  }

  /**
  * @ngdoc method
  * @name delete
  * @methodOf starter.controllers.controller:DashCtrl
  * @description
  * Destruye una ruta
  *
  * 
  */ 
  $scope.delete = function(){
    console.debug($scope.currentRuta);
    
    RouteService.delete($scope.currentRuta).success(function(routeres){
      console.debug("ruta eliminada",routeres)

      $scope.mode='C';
      $ionicPopup.alert({
        title: 'Éxito',
        content: 'Ruta eliminada.'
      })
      $scope.misRutas.splice($scope.currentRuta,1)

    }).catch(function(err){
      console.error(err)
    })

  }

  /**
  * @ngdoc method
  * @name save
  * @methodOf starter.controllers.controller:DashCtrl
  * @description
  * Renderea una ruta en el mapa
  *
  * 
  */ 
  $scope.renderRuta = function(iniPos,endPos){

    $scope.iniPos.coords.latitude = iniPos.lat;
    $scope.iniPos.coords.longitude = iniPos.lon;
    $scope.iniPos.desc = iniPos.desc;

    $scope.endPos.coords.latitude = endPos.lat;
    $scope.endPos.coords.longitude = endPos.lon;
    $scope.endPos.desc = endPos.desc;


  

    var request = {
      origin: new google.maps.LatLng($scope.iniPos.coords.latitude, $scope.iniPos.coords.longitude),
      destination:  new google.maps.LatLng($scope.endPos.coords.latitude, $scope.endPos.coords.longitude),
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap($scope.map.control.getGMap());

        //directionsDisplay.setPanel(document.getElementById('directionsList'));
        //$scope.directions.showList = true;
        
      } else {
        alert('Google route unsuccesfull!');
      }
    });
  }


  
  $scope.init();

})
