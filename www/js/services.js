angular.module('starter.services', [])
/**
 * @ngdoc service
 * @name starter.services.service:LoginService
 * @description
 * Cliente del servicio rest /auth para autenticación
 */
.service('LoginService', function(__API,$http){
  /**
  * @ngdoc method
  * @name login
  * @methodOf starter.services.service:LoginService
  * @description
  * Envia lós datos al servicdor para la auteticación del usuario
  * 
  * @param {object} User Usuario a autenticar
  * @returns {object} Usuario autenticado
  */
  this.login = function(user){
    return $http.post(__API+"/auth/login",user)
  }
})
/**
 * @ngdoc service
 * @name starter.services.service:RouteService
 * @description
 * Cliente del servicio rest /route para rutas
 */
.service('RouteService', function(__API,$http){
  /**
  * @ngdoc method
  * @name create
  * @methodOf starter.services.service:RouteService
  * @description
  * Crea una ruta.
  * @param {object} Ruta Ruta ruta a persistir
  * @returns {object} Ruta creada
  */
  this.create = function(route){
    return $http.post(__API+"/route/create",route)
  },
  /**
  * @ngdoc method
  * @name find
  * @methodOf starter.services.service:RouteService
  * @description
  * Busca las rutas previamente creadas en el servidor
  *
  * @returns {Array} Lista de rutas
  */
  this.find = function(){
    return $http.get(__API+"/route/find");
  },
  /**
  * @ngdoc method
  * @name delete
  * @methodOf starter.services.service:RouteService
  * @description
  * Borra una ruta en el servidor.
  * 
  * @param {object} Ruta Ruta a eliminar
  * @returns {object}  El objeto elimina
  */
  this.delete = function(route){
    return $http.post(__API+"/route/delete",route);
  }
});
