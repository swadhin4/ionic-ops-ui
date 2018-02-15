// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var hostLocation= window.location.protocol + "//" + window.location.hostname+":9191";
var ops365App=angular.module('ops365App', ['ionic','ionic-toast','ion-floating-menu', ,'mobiscroll-datetime', 'mobiscroll-form','ion-datetime-picker']);
//angular.module('starter', ['ionic','starter.controllers'])

ops365App.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	$ionicConfigProvider.backButton.previousTitleText(false);
	$ionicConfigProvider.backButton.icon('ion-chevron-left');
	$ionicConfigProvider.backButton.text('')

  $stateProvider
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
    
  })
    .state('sidemenu',{
      url:'/sidemenu',
      //abstract: true,
      templateUrl:'templates/sidemenu.html',
     // controller:'incidentlistCtrl'
    })
     .state('sidemenu.incidentlist', {
      url: '/incidentlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/incidentlist.html',
          controller: 'incidentlistCtrl'
        }
      }
    })
     .state('incidentcreate',{
      url:'/incidentcreate',
      params: {
        selectedticket: null
      },
      //abstract: true,
      templateUrl:'templates/incidentcreate.html',
      controller: 'incidentcreateCtrl'      
    })
    .state('incidentupdate',{
      url:'/incidentupdate/:selectedticket',
      params: {
        selectedticket: null
      },
      templateUrl:'templates/incidentupdate.html',
      controller: 'incidentupdateCtrl'     
    })
    .state('incidentescalation',{
      url:'/incidentescalation/:selectedticket',
      params: {
        selectedticket: null
      },
      //abstract: true,
      templateUrl:'templates/incidentescalation.html',
      controller: 'incidentescupdateCtrl'      
    })
    .state('incidentview',{
      url:'/incidentview/:selectedticket',
      params: {
        selectedticket: null
      },
      //abstract: true,
      templateUrl:'templates/incidentview.html',
      controller: 'incidentviewCtrl'      
    })
    .state('incidenthistory',{
      url:'/incidenthistory/:selectedticket',
      params: {
        selectedticket: null
      },
      //abstract: true,
      templateUrl:'templates/incidenthistory.html',
      controller: 'incidenthistoryCtrl'      
    })
    .state('worknote',{
      url:'/worknote/:selectedticket',
      params: {
        selectedticket: null
      },
      //abstract: true,
      templateUrl:'templates/worknote.html',
      controller: 'worknoteCtrl'      
    })
    .state('incidentlinkticket',{
      url:'/incidentlinkticket/:selectedticket',
      params: {
        selectedticket: null
      },
      //abstract: true,
      templateUrl:'templates/incidentlinkticket.html',
      controller: 'incidentlinkticketCtrl'      
    });
  
  $urlRouterProvider.otherwise('/login');
});
