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

    var selector = 'all';

    function getRandomColor(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    function uniq(a) {
      return a.sort().filter(function(item, pos, ary) {
          return !pos || item != ary[pos - 1];
      });
    }

    // Promise-based API
    return {
      setSelector : function(slktr){
        if(slktr.label == 'All')
          selector = 'all';
        else if(slktr.type == 'bulb')
          selector = 'label:'+slktr.label;
        else
          selector = 'group:'+slktr.label;
      },
      listLights : function() {
        return $http.get('https://api.lifx.com/v1beta1/lights/'+selector, opt).then(function(data){
          var bulbs = data.data,
              allGroups = [],
              filteredGroups = [];

          bulbs.forEach(function(data){
            data.type = 'bulb';
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
      on : function() {
        return $http.put('https://api.lifx.com/v1beta1/lights/'+selector+'/power', {state : 'on'}, opt).then(function(data){
          return data.data;
        });
      },
      off : function() {
        return $http.put('https://api.lifx.com/v1beta1/lights/'+selector+'/power', {state : 'off'}, opt).then(function(data){
          return data.data;
        });
      },
      setRandomLights : function() {
        return $http.put('https://api.lifx.com/v1beta1/lights/'+selector+'/color', {color : getRandomColor()}, opt).then(function(data){
          return data.data;
        });
      },
      setHex : function(hex) {
        return $http.put('https://api.lifx.com/v1beta1/lights/'+selector+'/color', {color : hex}, opt).then(function(data){
          return data.data;
        });
      },
      setRGB : function(rgb) {
        var color = 'rgb:'+rgb.red+','+rgb.green+','+rgb.blue;
        return $http.put('https://api.lifx.com/v1beta1/lights/'+selector+'/color', {color : color}, opt).then(function(data){
          return data.data;
        });
      },
      setHSBK : function(hsbk) {
        return $http.put('https://api.lifx.com/v1beta1/lights/'+selector+'/color', {color :'hue:'+hsbk.hue+' saturation:'+hsbk.saturation+' brightness:'+hsbk.brightness}, opt).then(function(data){
          return data.data;
        });
      },
      setColorForScene : function(color) {
        return $http.put('https://api.lifx.com/v1beta1/lights/'+selector+'/color', {color : color, duration : 9}, opt).then(function(data){
          return data.data;
        });
      },
      verify : function(token) {
        return $http.get('https://api.lifx.com/v1beta1/lights/'+selector+'', {
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
