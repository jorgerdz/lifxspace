(function(){
   'use strict';

   angular.module('lifx')
   .service('lifxService', ['$q', '$http', 'localStorageService', LIFXService]);

   function LIFXService($q, $http, localStorageService){

      var opt = {
         headers : {
            Authorization: "Basic " + btoa(localStorageService.get('token') + ":" + "")
         }
      }

      function uniq(a) {
         return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
         });
      }

      // Promise-based API
      return {
         listLights : function() {
            return $http.get('https://api.lifx.com/v1/lights/all', opt).then(function(data){
               var bulbs = data.data,
               allGroups = [],
               filteredGroups = [];

               bulbs.forEach(function(data){
                  data.type = 'label';
                  allGroups.push(data.group.name);
               });

               allGroups = uniq(allGroups);

               allGroups.forEach(function(data){
                  filteredGroups.push({label : data, type : 'group'});
               });

               bulbs.unshift({label : 'All', selected : true});

               var body = { groups : filteredGroups, lights : bulbs };
               return body;
            });
         },
         setState : function(statesArray) {
            return $http.put('https://api.lifx.com/v1/lights/states', {states : statesArray}, opt).then(function(data){
               return data.data;
            });
         },
         verify : function(token) {
            return $http.get('https://api.lifx.com/v1/lights/states', {
               headers : {
                  Authorization: "Basic " + btoa(token + ":" + token)
               }
            }).success(function(data){
               localStorageService.set('token', token);
               opt = {
                  headers : {
                     Authorization: "Basic " + btoa(localStorageService.get('token') + ":" + "")
                  }
               }
               return 200;
            }).error(function(data){
               return 500;
            });
         }
      };
   }

})();
