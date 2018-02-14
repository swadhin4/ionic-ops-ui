ops365App.controller('incidentlistCtrl',
	['$rootScope', '$scope','$filter','$ionicPopover','$state','userService','ticketService','ionicToast',
	 function($rootScope,$scope,$filter,$ionicPopover,$state,userService,ticketService,ionicToast) {
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
          $scope.showToast = function(message){
			   ionicToast.show(message, 'middle', false, 2000);
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
	 $scope.ticket.selected.mode = "EDIT";
	 $.jStorage.set("ticketId", $scope.ticket.selected.ticketId);
	 $state.go('incidentupdate',{ selectedticket: $scope.ticket.selected.ticketId });
   }

 $scope.openIncidentView=function(){
   $scope.ticket.selected.mode = "VIEW";
   $.jStorage.set("ticketId", $scope.ticket.selected.ticketId);
     $state.go('incidentview',   { selectedticket: $scope.ticket.selected.ticketId });
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
				console.log(data);
				if(data.error=="invalid_token"){
					$scope.showToast("Your session is expired");
				}
			});			
			
		}
}])