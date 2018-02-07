ops365App.controller('incidenthistoryCtrl',
		['$rootScope', '$scope','$filter','$ionicPopover','$stateParams','$state','userService',
        'ticketEscalationService','ticketService','appService',
	 function($rootScope,$scope,$filter,$ionicPopover,$stateParams,$state,userService,ticketEscalationService,ticketService,appService) {
     
	 $scope.ticketHistoryDetail={};
        
         $scope.init=function(){
        	 $scope.token = $.jStorage.get("tokendata");
        	 console.log( $scope.token)
        	  console.log($stateParams.selectedticket);
        	  var ticketId =  $state.params.selectedticket;
			 $scope.getTicketHistory(ticketId);
			 $scope.CurrentDate = new Date();
			 $scope.CurrentDate = $filter('date')(new Date(), 'dd-MM-yyyy');		 
		}

	$scope.getTicketHistory=function(ticketId){
		ticketService.getTicketHistory(ticketId, $scope.token)
		.then(function(data){
			console.log(data);
			if(data.statusCode == 200){
				var ticketHistory={};
				ticketHistory.ticketId=ticketId;
				ticketHistory.ticketStartDate=data.object.raisedOn;
				ticketHistory.ticketCloseDate=data.object.closedOn;
				if(data.object.length>0){
					
					var	history=[];
					
					$.each(data.object,function(key,val){
						var ticketHistory={
								name:val.who,
								date:val.timeStamp,
								description:val.message	
						};
						history.push(ticketHistory)
					});
					ticketHistory.history=history;
					
				}else{
					
				}
				$scope.ticketHistoryDetail=angular.copy(ticketHistory);
				
				
			}
		},function(data){
			console.log(data)
		});
	}
}]);