ops365App.controller('incidentescupdateCtrl',
		['$rootScope', '$scope','$filter','$ionicPopover','$ionicModal','$ionicPopup','$stateParams','$state','userService',
        'ticketEscalationService','ticketService','ionicToast','$window',
	 function($rootScope,$scope,$filter,$ionicPopover,$ionicModal,$ionicPopup,$stateParams,
			 $state,userService,ticketEscalationService,ticketService,ionicToast, $window) {
 console.log($state.params.selectedticket);
//var ticketNumber = $state.params.selectedticket.ticketNumber;
$scope.escalationLevelDetails=[];
$scope.modal = {};
$scope.selectedEscalation={};

$scope.goBack = function() {
	$window.history.go(-1);
	//$ionicHistory.goBack(-1);
}
		$scope.init=function(){			
        // console.log($state.params.selectedticket);
       //  console.log($stateParams.selectedticket);
		
		// $scope.initializeEscalateTicket();
		 $scope.loggedInUser = $.jStorage.get('loggedInUser');
		 $scope.token=$.jStorage.get('tokendata');
		 var ticketNumber = $.jStorage.get("ticketId");
		 $scope.getEscalationLevel(ticketNumber);
		}

    $scope.getEscalationLevel=function(ticketNumber){
    	var token = $scope.token;
        ticketEscalationService.retrieveEscLevel(ticketNumber,  token)
        .then(function(data){
        	console.log(data);
            if(data.statusCode == 200){
            	if(data.object.escalationLevelList.length>0){
		               $.each(data.object.escalationLevelList,function(key,val){
							var escLevelData={
								escId : val.escId,
								spId : val.serviceProviderId,
								escLevelId : val.levelId,
								escLevelDesc : val.escalationLevel,
								escTo : val.escalationPerson,
								escEmail : val.escalationEmail,
								ticketNumber : ticketNumber,
								ticketId : val.ticketId,
								escStatus : val.status,
						};
							$scope.escalationLevelDetails.push(escLevelData);
		             });
				}
           }

        },function(data){
          console.log(data);
      });			
   }

	$scope.getSelectedEscalation=function(selectedEscalation,id){

		angular.forEach($scope.escalationLevelDetails, function(escalation, index) {
	    if (id != index) 
	      escalation.checked = false;
	  	});
			$scope.selectedEscalation = angular.copy(selectedEscalation)
			console.log($scope.selectedEscalation);
			if(selectedEscalation.escStatus!=null && selectedEscalation.escStatus.toUpperCase() == 'ESCALATED'){
				//$scope.showAlert(selectedEscalation);
				$scope.showToast(selectedEscalation);
			}
			else{
				$scope.showConfirm(selectedEscalation);
			}
	}
// When button is clicked, the popup will be shown...
   $scope.showConfirm = function(selectedEscalation) {
	
      var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmation',
         template: 'Are you sure want to escalate ?',
		 okText:'Escalate',
		 okType: 'button button-assertive'
      });

      confirmPopup.then(function(res) {
         if(res) {
            console.log('Sure!');
			$scope.escalateTicket(selectedEscalation, $scope.loggedInUser, $scope.token);
         } else {
            console.log('Not sure!');
			selectedEscalation.checked = false;
         }
      });
		
   };

   $scope.showAlert = function(selectedEscalation) {
	
      var alertPopup = $ionicPopup.alert({
         title: 'Confirmation',
         template: 'This ticket has already been escalated'
      });

      alertPopup.then(function(res) {
         selectedEscalation.checked = false;
      });
   };

   $scope.showToast = function(selectedEscalation){
//ionicToast.show(message, position, stick, time);
  ionicToast.show('This ticket has already been escalated', 'middle', false, 2000);
  selectedEscalation.checked = false;
};

   $scope.escalateTicket=function(selectedEscalation, user, token){
		//console.log($scope.selectedEscalation);
		
		if(selectedEscalation != "undefined"){			
			ticketService.escalateTicket(selectedEscalation, user.object, token)
			.then(function(data){
				console.log(data);
				if(data.statusCode ==200){
					$scope.selectedEscalation.escStatus = data.object.escalationStatus;
					angular.forEach($scope.escalationLevelDetails, function(escalation){
						if(escalation.escId == data.object.escId){
							escalation.escStatus = $scope.selectedEscalation.escStatus;
							//$('#confirmEscalate').modal('hide');
							return false;
						}
						
					});
					
				}
				//initializeEscalateTicket();
				//$scope.getLinkedTicketDetails($scope.ticketData.ticketId);
				$scope.selectedEscalation ={};
			},function(data){
				console.log(data);
			});
		}
		console.log("initialized");
		//$scope.initializeEscalateTicket();
		
	}

// 	$scope.closeModal = function() {
//     $scope.modal.hide();
//   };
//   $scope.$on('$destroy', function() {
//     $scope.modal.remove();
//   });

	$scope.initializeEscalateTicket=function(){
	//var scope = angular.element("#incidentCreateWindow").scope();
	var escalated=false;		
	var escalationLevelCount = $scope.escalationLevelDetails.length;
	if(escalationLevelCount > 0){			
		
		for(var i = 0; i <= escalationLevelCount-1; i++){				
			//if(scope.escalationLevelDetails[i].escStatus!=null){
			if($scope.escalationLevelDetails[i].escStatus!=null && $scope.escalationLevelDetails[i].escStatus.toUpperCase() == 'ESCALATED'){					
				$("#chkEscalation"+i).prop("disabled", true);	
				$("#chkEscalation"+(i+1)).prop("disabled", false);
				escalated=true;					
				$("#chkEscalation"+i).prop("checked", false);					
			}
			else if(escalated){					
				if((i) < escalationLevelCount-1){
					$("#chkEscalation"+(i+1)).prop("disabled", true);
				}					
				if($scope.escalationLevelDetails[i].escStatus!=null && $scope.escalationLevelDetails[i].escStatus.toUpperCase() == 'ESCALATED'){
				if((i) == escalationLevelCount-1){
					$("#chkEscalation"+(i+1)).prop("disabled", false);						
				}					
				}
				else if(i == escalationLevelCount-1){
					if($scope.escalationLevelDetails[i].escStatus!=null && $scope.escalationLevelDetails[i-1].escStatus.toUpperCase() != 'ESCALATED'){
						$("#chkEscalation"+i).prop("disabled", true);
					}
					if($scope.escalationLevelDetails[i].escStatus!=null && $scope.escalationLevelDetails[i-1].escStatus.toUpperCase() == 'ESCALATED'){
						$("#chkEscalation"+i).prop("disabled", false);
					}
				}					
				else if($scope.escalationLevelDetails[i].escStatus!=null && $scope.escalationLevelDetails[i].escStatus.toUpperCase() != 'ESCALATED'){
					if($scope.escalationLevelDetails[i].escStatus!=null && $scope.escalationLevelDetails[i-1].escStatus.toUpperCase() == 'ESCALATED'){							
						$("#chkEscalation"+i).prop("disabled", false);
					}
				}
				else if($scope.escalationLevelDetails[i].escStatus!=null && $scope.escalationLevelDetails[i].escStatus.toUpperCase() != 'ESCALATED'){
					if((i) == escalationLevelCount-1){
						$("#chkEscalation"+i).prop("disabled", false);							
					}						
				}					
			}
			//}
			}
		// enable only 1st level
		
		if(!escalated){
			$("#chkEscalation0").prop("disabled",false);
			for(var i = 1; i <= escalationLevelCount-1; i++){
				$("#chkEscalation"+i).prop("disabled", true);
			}
		}
		
	}
};
     }])