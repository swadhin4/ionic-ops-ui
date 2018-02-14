
ops365App.controller('worknoteCtrl',['$rootScope','$scope','$filter','$stateParams','$state','ticketService',
 function($rootScope,$scope,$filter,$stateParams,$state, ticketService) {

  $scope.hideTime = true;
  $scope.data = {};
  //$scope.myId = '12345';
  $scope.messages = [];
  $scope.ticketComments=[];
  $scope.ticketComment={
				'comment':''
		};

    $scope.init=function(){		 	
     $scope.token = $.jStorage.get("tokendata");
     //console.log($state.params.selectedticket);
    // console.log($stateParams.selectedticket);
     var ticketNumber = $.jStorage.get("ticketId");

     $scope.getTicketComments(ticketNumber,  $scope.token);
      
    }

  $scope.getTicketComments=function(ticketId, token){
	  ticketService.getComments(ticketId,token)
		 .then(function(data){
			 console.log(data);
			 if(data.object.length>0){
				 $scope.ticketComments=[];
				 $.each(data.object,function(key,val){
					 selectedTicketNumber=val.ticketNumber;
					  $scope.ticketComments.push(val);
				 })
				 console.log($scope.ticketComments)
			}
		 },function(data){
			 console.log(data);
		 });
  }

$scope.addNewComment = function(){
		console.log("comment added");
		var user = $.jStorage.get('loggedInUser');
		$scope.CurrentDate = new Date();
		$scope.CurrentDate = $filter('date')(new Date(), 'dd-MM-yyyy');
		if($scope.ticketComment.comment != ""){			
			var ticketComment={
					  ticketId:$state.params.selectedticket,
					  ticketNumber : selectedTicketNumber,
					  comment:$scope.ticketComment.comment,
					  createdBy:user.object.userName
			}
     // $scope.ticketComments.push(ticketComment);
			 console.log(ticketComment);
			var token = $scope.token; 
			 ticketService.saveComment(ticketComment, token)
			 .then(function(data){
				 console.log(data);
				 if(data.statusCode == 200){					 
					 $scope.ticketComments.push(data.object);
				 }
			 },function(data){
				 console.log(data);
			 });
		}
		 
	};

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };
}]);