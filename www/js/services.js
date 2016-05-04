angular.module('starter.services', [])

.service('LoginService', function(__API,$http){
  this.login = function(user){
    return $http.post(__API+"/auth/login",user)
  }
})

.service('RouteService', function(__API,$http){
  this.create = function(route){
    return $http.post(__API+"/route/create",route)
  },
  this.find = function(){
    return $http.get(__API+"/route/find");
  },
  this.delete = function(route){
    return $http.post(__API+"/route/delete",route);
  }
});
