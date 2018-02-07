ops365App.controller('incidentupdateCtrl',['$rootScope', '$scope','$filter','$ionicPopover','$stateParams','$state',
                                           'userService','ticketService','statusService','ticketCategoryService',
	 function($rootScope,$scope,$filter,$ionicPopover,$stateParams,$state,userService,ticketService,statusService,ticketCategoryService) {
		 $scope.ticketData={};
		$scope.categoryList=[];
		//$scope.ticketData.ticketNumber = null;

	 $scope.init=function(){
		 console.log($stateParams.selectedticket);
		 console.log($state.params.selectedticket);
		 $scope.getTicketPriority();
		 $scope.selectedCategory={};
		 //$scope.ticketData.ticketNumber = "INC003489";
         //console.log("shibasish");
        // var selectedTicketNumber = $state.params.selectedticket.ticketNumber;
		 //var selectedTicketId = $state.params.selectedticket.ticketId;
		// $scope.getStatus();
		 $scope.token = $.jStorage.get("tokendata");
		 
		 //$scope.ticketData.ticketNumber = "INC003489";
         //console.log("shibasish");
		 $scope.getSelectedTicket($stateParams.selectedticket);
		 
		 

	 }

	 $scope.getSelectedTicket=function(selectedTicketNumber){
		 console.log(selectedTicketNumber)
		 
		 var token=$scope.token;
                ticketService.getSelectedTicket(selectedTicketNumber, token)
                .then(function(data){
				console.log("Ticket DetailsXXXX")
				console.log(data)
				if(data.statusCode == 200){
					$scope.getStatus();
					// $scope.getTicketPriority();
					$scope.ticketData=angular.copy(data.object);
					$scope.getTicketCategory(token);
					if($scope.ticketData.statusId == 6){
						$scope.getCloseCode();
						$('#ticketCloseDiv').show();
						$('#closeNote').prop("disabled", true);
						$.each($scope.closeCodeList,function(key,val){
							if(val.id == $scope.ticketData.closeCode){
								$scope.ticketData.codeClosed=val.code;								
								$('#closeCode').prop("disabled", true);
								return false;
							}
						});
						
						$('#closeCode').prop("disabled",true);
					}
					if(data.object.ticketComments.length>0){
						 $scope.ticketData.comments = data.object.ticketComments;
						 $scope.ticketComments=[];
						 $.each(data.object.ticketComments,function(key,val){
							  $scope.ticketComments.push(val);
						 })
						 
					}
					
					/*if($scope.ticketData.attachments.length>0){
						$scope.ticketData.files=[];
						$.each($scope.ticketData.attachments,function(key,val){
							var  fileInfo={
									fileName: val.substring(val.lastIndexOf("/")+1),
									filePath: val
							}
							$scope.ticketData.files.push(fileInfo);
						});
					}*/
				}
			},function(data){
				console.log(data)
			});
         }

$scope.getTicketCategory=function(token){
			//$('#loadingDiv').show();
			ticketCategoryService.retrieveAllCategories(token)
			.then(function(data) {
    			console.log(data)
    				$scope.categoryList=[];
    				if(data.object.length>0){
    					$.each(data.object,function(key,val){
    						var category={
    	            				categoryId:val.id,
    	            				categoryName:val.ticketCategory
    	            		}
    						$scope.categoryList.push(category);
    					});
    					//$('#loadingDiv').hide();
    					$("#ticketCategorySelect").empty();
    					var options = $("#ticketCategorySelect");
    					options.append($("<option />").val("0").text("Select category"));
    					$.each($scope.categoryList,function() {
    						options.append($("<option />").val(	this.categoryId).text(	this.categoryName));
    					});
    					var viewMode="EDIT";
    					if(viewMode.toUpperCase() == 'EDIT'){
    						$("#ticketCategorySelect option").each(function() {
    							console.log($(this).val());
								if ($(this).val() == $scope.ticketData.categoryId) {
									$(this).attr('selected', 'selected');
									return false;
								}
						 	});
    						$scope.selectedCategory.selected = $scope.ticketData.categoryName;
    					}
    				}else{
    					console.log("No categories found")
    				}
    				//$('#loadingDiv').hide();
            },
            function(data) {
                console.log(data)
                console.log("No categories found")
				//$('#loadingDiv').hide();
            });
			
		}

	$scope.getCloseCode=function(){
			$scope.closeCodeList =[{
				'id':1,
				'code':'Root Cause Fixed'
			},
			{
				'id':2,
				'code':'Workaround Provided'
			}];
			
			//$("#closeCodeSelect").empty();
			
			var options = $("#closeCodeSelect");
			options.append($("<option />").val("0").text("Select option"));
			$.each($scope.closeCodeList,function() {
				options.append($("<option />").val(	this.id).text(	this.code));
			});
		}
	$scope.getSelectedCategory=function(){
	if(dropDownId.toUpperCase() == "TICKETCATEGORYSELECT"){
		 var category={
				 categoryId:parseInt($("#ticketCategorySelect").val()),
		 		 categoryName:$("#ticketCategorySelect option:selected").text()
		 }
		 $scope.categoryList.selected =category;
		 //scope.getTicketPriority();
		 scope.setTicketPriorityAndSLA($scope.categoryList.selected);
	 }
	}

	$scope.getSelectedPriority=function(dropDownId){
	//var scope = angular.element("#incidentWindow").scope();
	if(dropDownId.toUpperCase() == "PRIORITYSELECT"){
		 var priority={
				 categoryId:parseInt($("#prioritySelect").val()),
		 		 categoryName:$("#prioritySelect option:selected").text()
		 }
		 $scope.priorityList.selected =priority;
	 }
	}

	$scope.setTicketPriorityAndSLA=function(ticketCategory){
			 console.log($scope.ticketData);
			 var spId = $scope.ticketData.sp;
			 //if(viewMode.toUpperCase()=='EDIT'){
				 spId=parseInt($scope.ticketData.assignedTo);
		     // }
			 if(spId==undefined){
				 //alert("No Site Selected");
				 return false;
			 }else{
				// $('#loadingDiv').show();
			 ticketService.getTicketPriorityAndSLA(spId,ticketCategory.categoryId)
			 .then(function(data){
				 console.log(data);
				 if(data.statusCode == 200){
					 $scope.ticketData.priorityId = data.object.priorityId;
					 $scope.ticketData.priorityDescription = data.object.priorityName;
					 //$scope.ticketData.sla=data.object.ticketSlaDueDate;
					 $scope.ticketData.categoryId=data.object.ticketCategoryId;
					 $scope.ticketData.unit= data.object.units;
					 $scope.ticketData.duration = data.object.duration;
					 $scope.ticketData.slaTime =  $scope.ticketData.duration + " " +  $scope.ticketData.unit;
					 if(viewMode.toUpperCase()=='EDIT'){
						 $.each($scope.priorityList,function(key,val){
							 if(val.priorityId == $scope.ticketData.priorityId){
								 $('#prioritySelect').val(""+val.priorityId+"").prop('selected', true);
								 return false;
							 }
						 });
					 }
				 }
				// $('#loadingDiv').hide();
			 },function(data){
				 console.log(data);
				 //$('#loadingDiv').hide();
			 });
			 }
			
		 }

		 $scope.getTicketPriority=function(){
			$scope.priorityList=[{
				'priorityId':1,
				'priorityCode':'P1',
				'priorityName':'Critical'
			},
			{
				'priorityId':2,
				'priorityCode':'P2',
				'priorityName':'High'
			},
			{
				'priorityId':3,
				'priorityCode':'P3',
				'priorityName':'Medium'
			},
			{
				'priorityId':4,
				'priorityCode':'P4',
				'priorityName':'Low'
			}];
			
			
			$("#prioritySelect").empty();
			
			var options = $("#prioritySelect");
			options.append($("<option />").val("").text(
			"Select Priority"));
			$.each($scope.priorityList,function() {
				options.append($("<option />").val(	this.priorityId).text(	this.priorityName));
			});
			
			var category={
					categoryId:$scope.ticketData.categoryId
			}
			$scope.setTicketPriorityAndSLA(category);
			
		}
	/*
*/
		 $scope.getStatus=function(){
			 var token=$scope.token;
				statusService.retrieveAllStatus(token)
	                .then(function(data){
	                	$("#statusSelect").empty();
	    				var options = $("#statusSelect");
	    				options.append($("<option />").val("").text("Select status"));
	    				$.each(data,function(){
	    					options.append($("<option />").val(	this.statusId).text(	this.status));
	    				});
	    				$("#statusSelect option").each(function() {
							if ($(this).val() == $scope.ticketData.statusId) {
								$(this).attr('selected', 'selected');
								return false;
							}
					 	});
	                },function(data){
	                	console.log(data);
	                });			
			}

	$ionicPopover.fromTemplateUrl('ticketUpdateTabPop', {
      scope: $scope
   }).then(function(popover) {
      $scope.popover = popover;
   });

	$scope.openPopover = function($event, ticketData) {
      $scope.popover.show($event);      
      //console.log($scope.ticket.selected);
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
//    $scope.$on('popover.hidden', function() {
//       // Execute action
//       $scope.popover.hide();
//    });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });

	$scope.openIncidentEscalation=function(){
       $state.go('incidentescalation', { selectedticket: $stateParams.selectedticket });
	}

   $scope.openIncidentHistory=function(){
       $state.go('incidenthistory', { selectedticket: $stateParams.selectedticket }
      );
   }
	   $scope.openIncidentLink=function(){
	       $state.go('incidentlinkticket', { selectedticket: $scope.ticketData.ticketId }
	      );
	   }
     }]);