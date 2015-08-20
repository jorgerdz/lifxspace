(function(){

  angular
       .module('lifx', ['LocalStorageModule'])
       .controller('LifxController', [
          '$scope', 'lifxService', '$mdSidenav', '$mdDialog', '$log', '$q', '$interval', 'localStorageService', '$timeout',
          LifxController
       ]);

  function LifxController($scope, lifxService, $mdSidenav, $mdDialog, $log, $q, $interval, localStorageService, $timeout) {


    var sceneInterval,
        intervalHelper = 0,
        initializing = true;

    $scope.scenes = [
              {color: ['3F7CAC', '95AFBA', 'BDC4A7', 'D5E1A3', 'E2F89C']},
              {color: ['FA8334', 'FFFD77', 'FFE882', '388697', '271033']},
              {color: ['65ADF5', 'A08FF3', 'D8CFF4', 'CBABBD', 'AC8985']},
              {color: ['FFC09F', 'FFEE93', 'FCF5C7', 'A0CED9', 'ADF7B6']},
              {color: ['82C187', '92D74F', 'B4EF5D', '46584F', '211916']},
              {color: ['33CBE5', '3AA2FF', '4BFFEF', '36EAAA', '3CFE82']}
            ];

    $scope.showOptions = function($event) {
       var parentEl = angular.element(document.body);

       var html = '<md-dialog aria-label="List dialog">' +
               '  <md-content>'+
               '    <md-list>'+
               '      <md-item>'+
               '       <p>Please enter your token generated at <a href="http://cloud.lifx.com">cloud.lifx.com</a></p>' +
               '      </md-item>'+
               '      <md-item>'+
               '      <md-input-container flex><label>Token</label><input type="text" ng-model="token"></md-input-container>'+
               '      </md-item>'+
               '      <md-item ng-show="error && !verified">'+
               '       <p>We couldn\'t verify your information, please provide a correct token.</p>' +
               '      </md-item>'+
               '      <md-item ng-show="verified">'+
               '       <p>Success!</p>' +
               '      </md-item>'+
               '    </md-list>'+
               '  </md-content>' +
               '  <div class="md-actions">' +
               '    <md-button ng-hide="verified" aria-label="Verify" class="md-raised md-primary" ng-click="verify()">' +
               '      Verify' +
               '    </md-button>' +
               '    <md-button ng-show="verified" aria-label="Cloase dialog" class="md-raised md-warn" ng-click="closeDialog()">' +
               '      Close' +
               '    </md-button>' +
               '  </div>' +
               '</md-dialog>';
       var token = '';
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template: html,
         locals: {
           token : token
         },
         controller: DialogController
      });
     }

    $scope.showHelp = function($event) {
       var parentEl = angular.element(document.body);

       var html = '<md-dialog aria-label="Help">' +
               '  <md-content>'+
               '    <md-list>'+
               '      <md-item>'+
               '       <h2>lifx.space is built by <a href="http://twitter.com/jorgerdz">Jorge Rodríguez</a>.</h2> <p>You can contact me <a href="mailto:mail@jorgerdz.com">here</a> and you can buy me a beer <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=XXLESFVMHJJ3N&lc=MX&item_name=lifx%2espace&currency_code=MXN&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted">here</a> :)</p>' +
               '      </md-item>'+
               '    </md-list>'+
               '  </md-content>' +
               '  <div class="md-actions">' +
               '    <md-button aria-label="Cloase dialog" class="md-raised md-warn" ng-click="closeDialog()">' +
               '      Close' +
               '    </md-button>' +
               '  </div>' +
               '</md-dialog>';
       var token = '';
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template: html,
         locals: {
           token : token
         },
         controller: DialogController
      });
    }

    function DialogController(scope, $mdDialog, token, lifxService, localStorageService) {
      scope.token = token;
      scope.closeDialog = function() {
        $mdDialog.hide();
        listLights();
      };
      scope.verify = function(){
        lifxService.verify(scope.token).success(function(data){
          scope.verified = true;
        }).error(function(err){
          scope.error = true;
        });
      };
      scope.setToken = function(token){
        localStorageService.set('token', token);
      };
    }

    $scope.turnOn = function(){
      $scope.stopScene();
      lifxService.on();
    };

    $scope.turnOff = function(){
      $scope.stopScene();
      lifxService.off();
    };

    $scope.setRandomColor = function() {
      $scope.stopScene();
      lifxService.setRandomLights();
    };

    $scope.setScene = function(scene){
      if(scene.selected){
        scene.selected = false;
        $scope.stopScene();
      }
      else{
        $scope.scenes.forEach(function(data){
          data.selected = false;
        });
        scene.selected = true;

        $scope.selectedScene = scene.color;
        interval();
        sceneInterval = $interval(interval, 10*1000);
      }
    };

    function interval(){
      lifxService.setColorForScene($scope.selectedScene[intervalHelper]);
      intervalHelper++;
      if(intervalHelper==$scope.selectedScene.length-2)
        intervalHelper=0;
    }

    $scope.stopScene = function() {
      if (angular.isDefined(sceneInterval)) {
        $interval.cancel(sceneInterval);
        stop = undefined;
      }
    };

    function listLights(){
      lifxService
            .listLights()
            .then( function( data ) {
              $scope.color = {};
              $scope.color.brightness = data[1].brightness;
              $scope.color.hue = data[1].color.hue;
              $scope.color.saturation = data[1].color.saturation;
              $scope.color.kelvin = data[1].color.kelvin;
              $scope.lights = data;
              $scope.selected = $scope.lights[1];
              lifxService.setSelector($scope.selected);
            });
    }


    if(localStorageService.get('token')){
      listLights();
    } else {
      $scope.showOptions();
    }

    $scope.HSBK = function(){
        if($scope.color) {
          $scope.stopScene();
          lifxService.setHSBK($scope.color);
        }
    };

    $scope.$watch('color.rgb', function(){
      if (initializing) {
        $timeout(function() { initializing = false; });
      }else{
        if($scope.color && $scope.color.rgb) {
          console.log($scope.color.rgb)
          $scope.stopScene();
          lifxService.setHex($scope.color.rgb);
        }
      }
    });

    $scope.selectLight  = function( light ) {
      $scope.selected = light;
      lifxService.setSelector($scope.selected);
    }
  }

})();
