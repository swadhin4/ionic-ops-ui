ops365App.controller('incidentlinkticketCtrl',
		['$rootScope', '$scope','$filter','$ionicPopover','$stateParams','$state','userService',
        'ticketEscalationService','ticketService',
	 function($rootScope,$scope,$filter,$ionicPopover,$stateParams,$state,userService,ticketEscalationService,ticketService) {
    
    $scope.linkedTicketDetails=[];
    $scope.linkedTicket={
				'ticketNumber':''
		};
   // var selectedTicketNumber = $state.params.selectedticket.ticketNumber;
	//var selectedTicketId = $state.params.selectedticket.ticketId;
    console.log($state.params.selectedticket);
    $scope.init=function(){			
    	 $scope.token = $.jStorage.get("tokendata");
    	 console.log( $scope.token)
    	  console.log($stateParams.selectedticket);
		 $scope.getLinkedTicketDetails($stateParams.selectedticket);		 

	}

$scope.getLinkedTicketDetails=function(selectedTicketNumber){
		ticketService.getLinkedTickets(selectedTicketNumber, $scope.token)
		.then(function(data){
			console.log(data);
			if(data.statusCode == 200){
			 //$("#linkedTicket").val("");
			 if(data.object.linkedTickets.length>0){
				 $scope.linkedTicketDetails = data.object.linkedTickets;
			 }
			 
			}
		},function(data){
			console.log(data);
		});
	}

    $scope.LinkNewTicket = function(){
		if($scope.linkedTicket.ticketNumber != ""){
			var linkedTicket={
					parentTicketId:selectedTicketId,
					parentTicketNo:selectedTicketNumber,
					linkedTicketNo:$scope.linkedTicket.ticketNumber
			}
			ticketService.linkTicket(linkedTicket)
			.then(function(data){
				console.log(data);
				if(data.statusCode == 200){
				console.log("Linked ticket added");
				 $("#linkedTicket").val("");
				 $scope.getLinkedTicketDetails(linkedTicket.parentTicketId);
				}
			},function(data){
				console.log(data);
			});
			
		}
		 
	};

    $scope.unlinkTicketConfirm=function(linkedTicket,id){
	
		$scope.selectedlinkedTicket = angular.copy(linkedTicket)
		console.log($scope.selectedlinkedTicket);		
		$scope.showConfirm(linkedTicket);
		
	}

    $scope.closeLinkedTicketConfirm=function(linkedTicket,id){
	
		$scope.selectedlinkedTicket = angular.copy(linkedTicket)
		console.log($scope.selectedlinkedTicket);		
		if(linkedTicket.closedFlag == 'CLOSED'){
			//$scope.showAlert(selectedEscalation);
			$scope.showToast(linkedTicket);
		}
		else{
			$scope.showCloseConfirm(linkedTicket);
		}
		
	}

     $scope.showToast = function(linkedTicket){
//ionicToast.show(message, position, stick, time);
  ionicToast.show('This ticket has already been closed', 'middle', false, 2000);
  //selectedEscalation.checked = false;
};

 // When button is clicked, the popup will be shown...
   $scope.showCloseConfirm = function(linkedTicket) {
	
      var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmation',
         template: 'Are you sure want to close the ticket ?',
		 okText:'Close',
		 okType: 'button button-assertive'
      });

      confirmPopup.then(function(res) {
         if(res) {
            console.log('Sure!');
			$scope.closeLinkedTicket(linkedTicket);
         } else {
            console.log('Not sure!');
			
         }
      });
		
   };

    $scope.closeLinkedTicket=function(linkedTicket){
		 //console.log($scope.selectedLinkedTicketDetails.length);
		 
			 var linkedTicket = {};
			 
			 linkedTicket.status="CLOSED";
			 ticketService.changeLinkedTicketStatus(linkedTicket)
			 .then(function(data){
				 if(data.statusCode==200){
					 if(data.object.linkedTickets>0){
						 //$scope.ticketData.linkedTickets = data.object.linkedTickets
					 }
					 $scope.getLinkedTicketDetails($scope.linkedTicket.parentTicketId);
					 //$scope.selectedLinkedTicketDetails = [];
					 
				 }
			 },function(data){
				 console.log(data);
			 });
		 
	 }

    // When button is clicked, the popup will be shown...
   $scope.showConfirm = function(linkedTicket) {
	
      var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmation',
         template: 'Are you sure want to unlink the ticket ?',
		 okText:'Unlink',
		 okType: 'button button-assertive'
      });

      confirmPopup.then(function(res) {
         if(res) {
            console.log('Sure!');
			$scope.unlinkTicket(linkedTicket);
         } else {
            console.log('Not sure!');
			
         }
      });
		
   };

   $scope.unlinkTicket=function(linkedTicket){
		// var linkedTicket = angular.copy($scope.unlinkTktObject);
		 ticketService.deleteLinkedTicket(linkedTicket)
		 .then(function(data){
			 console.log(data);
			 if(data.statusCode == 200){
				 
				 $scope.getLinkedTicketDetails($scope.linkedTicket.parentTicketId);
				 
			 }
		 },function(data){
			 console.log(data);
		 });
	 }
        
     }]);