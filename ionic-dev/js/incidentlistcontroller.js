ops365App.controller('incidentlistCtrl',
	['$rootScope', '$scope','$filter','$ionicPopover','$state','userService','ticketService',
	 function($rootScope,$scope,$filter,$ionicPopover,$state,userService,ticketService) {
         $scope.ticket={
			 selected:{},
			 list:[]
		}
  $ionicPopover.fromTemplateUrl('ticketViewEditPop', {
      scope: $scope
   }).then(function(popover) {
      $scope.popover = popover;
   });

         $scope.openPopover = function($event,selectedTicketNo,selectedTicketId) {
             $scope.popover.show($event);
             $scope.ticket.selected.ticketNumber = selectedTicketNo;
             $scope.ticket.selected.ticketId = selectedTicketId;
             //= selectedTicketNo;
             console.log($scope.ticket.selected);
          };


   $scope.closePopover = function() {
      $scope.popover.hide();
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
      $scope.popover.hide();
   });

   // Execute action on hide popover
  /* $scope.$on('popover.hidden', function() {
      // Execute action
      $scope.popover.hide();
   });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });*/
 $scope.openIncidentUpdate=function(){
	 console.log($scope.ticket);
	 $state.go('incidentupdate',{ selectedticket: $scope.ticket.selected.ticketId });
   }

   $scope.init=function(){
			$scope.findAllTickets();
		}
    
   	$scope.findAllTickets=function(){
			console.log("Fetch all ticketlist");   
			var loggedInuser = $.jStorage.get('loggedInUser');
			var tokendata=$.jStorage.get('tokendata');
			console.log( loggedInuser.object);   
			console.log( tokendata.object); 
			ticketService.displayAllOpenTickets(loggedInuser.object, tokendata)
			.then(function(data){
				//console.log(data);
				if(data.statusCode == 200){
				$scope.ticket.list=[];
				$.each(data.object,function(key,val){	    			
	    				$scope.ticket.list.push(val);	    				
	    			})
                 console.log($scope.ticket.list);   
	    		//$('#loadingDiv').hide();	
				 //$('#updateTicket').hide();
				// $scope.getTicketDetails($scope.ticket.list[0]);
				//populateDataTable($scope.ticket.list,'ticketList');
				}
			},function(data){
				//console.log(data);
			});			
			
		}
}])