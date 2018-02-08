//angular.module('starter.controllers', [])

ops365App.controller('LoginCtrl',
		['$rootScope', '$scope','$filter','$state','userService','appService','$ionicLoading',
	 function($rootScope,$scope,$filter,$state,userService,appService, $ionicLoading) {
    $scope.user={};
	var loggedInuser =null;

		angular.element(document).ready(function(){
			//$('#validationmsgDiv').hide();
		})
		$scope.validateUser=function(){
			var user =  $scope.user;
			$scope.getBasicToken(user);
		};
		
		$scope.getBasicToken=function(user){
			appService.getBasicAuth(user)
			.then(function(data){
				console.log(data)
				if(data.statusCode==200){
					$scope.getUserDetails(user, data);
				}
			},function(data){
				console.log(data)
			});
		};
		
		$scope.getUserDetails=function(user,tokendata){
			 $scope.showLoading();
			userService.validateUser(user,tokendata)
			.then(function(data){
				console.log(data)
				  $scope.hideLoading ();
				if(data.statusCode==200){
					$state.go('sidemenu.incidentlist');
					$scope.savedUser = angular.copy(data);
					$.jStorage.set('loggedInUser', $scope.savedUser);
					$.jStorage.set('tokendata', tokendata);
				}
				
			},function(data){
				console.log(data)
			});
		};
   
		  $scope.showLoading = function() {
				 $ionicLoading.show({
					      templateUrl: 'templates/loading.html',
					      scope:$scope,
				  });
		   };

		   $scope.hideLoading = function(){
		      $ionicLoading.hide();
		   };
}])
