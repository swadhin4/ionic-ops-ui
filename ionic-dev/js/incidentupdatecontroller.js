ops365App.controller('incidentupdateCtrl',['$rootScope', '$scope','$filter','$ionicPopover','$ionicModal',
                                           '$ionicPopup','$stateParams','$state',
                                           'userService','ticketService','statusService',
                                           'ticketCategoryService','siteService','$ionicHistory','assetService',
                                           function($rootScope,$scope,$filter,$ionicPopover,$ionicModal,$ionicPopup,
                                        $stateParams,$state,userService,ticketService,statusService,
                                        ticketCategoryService,siteService,$ionicHistory,assetService) {
		 $scope.ticketData={};
		$scope.categoryList=[];
		//$scope.ticketData.ticketNumber = null;
		 $scope.asset={
				 selected:{},
				 list:[]
		 }
		$scope.goBack = function() {
			//$window.history.go(-1);
			$ionicHistory.goBack(-1);
		}
	 $scope.init=function(){
		// console.log($stateParams.selectedticket);
		// console.log($state.params.selectedticket);
		// $scope.getTicketPriority();
		 $scope.selectedCategory={};
		 //$scope.ticketData.ticketNumber = "INC003489";
         //console.log("shibasish");
        // var selectedTicketNumber = $state.params.selectedticket.ticketNumber;
		 //var selectedTicketId = $state.params.selectedticket.ticketId;
		// $scope.getStatus();
		 $scope.token = $.jStorage.get("tokendata");
		
		 //$scope.ticketData.ticketNumber = "INC003489";
         //console.log("shibasish");
		var ticketNumber = $.jStorage.get("ticketId");
		 $scope.getSelectedTicket(ticketNumber);
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
					$scope.getTicketPriority();
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
    						var catergorySelected={
    								categoryId:$scope.ticketData.categoryId,
    						}
    						$scope.selectedCategory.selected = $scope.ticketData.categoryName;
    						$scope.setTicketPriorityAndSLA(catergorySelected, token);
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

	$scope.setTicketPriorityAndSLA=function(ticketCategory, token){
			 console.log($scope.ticketData);
			 console.log(token);
			 var spId = $scope.ticketData.sp;
			 //if(viewMode.toUpperCase()=='EDIT'){
				 spId=parseInt($scope.ticketData.assignedTo);
		     // }
			 if(spId==undefined){
				 //alert("No Site Selected");
				 return false;
			 }else{
				// $('#loadingDiv').show();
			 ticketService.getTicketPriorityAndSLA(spId,ticketCategory.categoryId, token)
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
					 var viewMode="EDIT";
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

		 $scope.getTicketPriority=function(token){
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
			//$scope.setTicketPriorityAndSLA(category, token);
			
		}

		//getselected ticketCategory
		$scope.getDropdownInfo=function(component, event, dropDownId){
				console.log(component);
				var token =$scope.token;
			if(dropDownId.toUpperCase() == "TICKETCATEGORYSELECT"){
				 var category={
						 categoryId:parseInt($("#ticketCategorySelect").val()),
				 		 categoryName:$("#ticketCategorySelect option:selected").text()
				 }
				 $scope.categoryList.selected =category;
				 $scope.setTicketPriorityAndSLA($scope.categoryList.selected, token);
			 }
			else if(dropDownId.toUpperCase() == "PRIORITYSELECT"){
				 var priority={
						 categoryId:parseInt($("#prioritySelect").val()),
				 		 categoryName:$("#prioritySelect option:selected").text()
				 }
				 $scope.priorityList.selected =priority;
			 }
		}
		 
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
       $state.go('incidentescalation', { selectedticket: $scope.ticketData.ticketId });
	}

   $scope.openIncidentHistory=function(){
       $state.go('incidenthistory', { selectedticket: $scope.ticketData.ticketId });
   }
   $scope.openIncidentLink=function(){
       $state.go('incidentlinkticket', { selectedticket: $scope.ticketData.ticketId });
   }
	   
   $scope.openIncidentWorkNote=function(){
       $state.go('worknote', { selectedticket: $scope.ticketData.ticketId });
   }
   $scope.showAssetInfo=function(){
	   var token=$scope.token;
	   $scope.getAssetDetails($scope.ticketData.assetId, token);
   }
	   
   $scope.showSiteInfo=function(){
	   var token=$scope.token;
	   var siteId = $scope.ticketData.siteId;
	   $scope.getSelectedSiteData(siteId, token);
   }
	   
   $scope.getSelectedSiteData=function(siteId, token){
		 siteService.retrieveSiteDetails(siteId, token)
    		.then(function(data) {
    			console.log(data)
    			var site=angular.copy(data.object);
    			$scope.selectedSite={};
				$scope.selectedSite=angular.copy(site);
				$scope.selectedSite.siteName = site.siteName;
				$scope.selectedSite.siteNumber1 = site.siteNumber1;
				$scope.selectedSite.siteNumber2 = site.siteNumber2;
				$scope.selectedSite.salesAreaSize = site.salesAreaSize;
				$scope.selectedSite.siteAddress = site.fullAddress;
				
				$scope.selectedSite.siteAddress1 = site.siteAddress1;
				$scope.selectedSite.siteAddress2 = site.siteAddress2;
				$scope.selectedSite.siteAddress3 = site.siteAddress3;
				$scope.selectedSite.siteAddress4 = site.siteAddress4;
				
				$scope.selectedSite.district = site.district;
				$scope.selectedSite.area=site.area;
				$scope.selectedSite.cluster=site.cluster;
				
				/*$scope.district.selected=$scope.selectedSite.district;
				$scope.area.selected = $scope.selectedSite.area;
				$scope.cluster.selected = $scope.selectedSite.cluster;*/
				 
				$scope.selectedSite.retailerName=site.owner;
				$scope.selectedSite.primaryContact=site.primaryContact;
				$scope.selectedSite.secondaryContact=site.secondaryContact;
				
				$scope.selectedSite.LicenseDetail = site.siteLicense;
				$scope.selectedSite.SalesOperation = site.siteOperation;
				$scope.selectedSite.DeliveryOperation = site.siteDelivery;
				$scope.selectedSite.submeterDetails = site.siteSubmeter;
				 
				$scope.siteLicense = $scope.selectedSite.LicenseDetail;
				$scope.siteSalesOperation = $scope.selectedSite.SalesOperation;
				$scope.siteDeliveryOperation = $scope.selectedSite.DeliveryOperation;
				
				$scope.siteSubmeterDetails = $scope.selectedSite.submeterDetails;
				//$scope.siteData.siteId = $scope.selectedSite.siteId;
    			//$scope.siteData = angular.copy( $scope.selectedSite);
				console.log($scope.selectedSite.siteAttachments);
				var customTemplate='<div class="item ">' 
					+'<p><i class = "icon icon ion-person"></i>'
					+'<a href="#" class="subdued"> Address :</a> <a>'+ $scope.selectedSite.siteAddress+'</a>'
					+'</p><p><i class = "icon ion-android-phone-portrait"></i><a href="#" class="subdued"> Site Number 1:</a> <a>'+ $scope.selectedSite.siteNumber1+'</a>'
					+'</p><p><i class = "icon ion-android-phone-portrait"></i><a href="#" class="subdued"> Primary Contact:</a> <a>'+ $scope.selectedSite.primaryContact+'</a>'
					+'</p><p><i class = "icon ion-calendar"></i><a href="#" class="subdued"> Operator :</a> <a>'+ $scope.selectedSite.operator.companyName+'</a>'
					+'</p><p><i class = "icon icon ion-person"></i><a href="#" class="subdued"> Retailer :</a> <a>'+ $scope.selectedSite.retailerName+'</a>'
					+'</p><p><i class = "icon icon ion-android-mail"></i><a href="#" class="subdued"> Owner :</a> <a>'+ $scope.selectedSite.email+'</a>'
					+'</p></div>';
				var alertPopup = $ionicPopup.alert({
				      title: $scope.selectedSite.siteName,
				      template: customTemplate
				 });
				    alertPopup.then(function(res) {
				    //console.log('Thank you for not eating my delicious ice cream cone');
			    });
    		},function(data){
    			console.log(data);
    		});
    		
	 }
   
   $scope.getAssetDetails=function(assetId, token){
		 assetService.getAssetInfo(assetId, token)
		 .then(function(data){
			if(data.statusCode == 200){
				$scope.selectedAsset=angular.copy(data.object);
				console.log($scope.selectedAsset)
				var assetType="EQUIPMENT";
				if($scope.selectedAsset.assetType=="E"){
					assetType="EQUIPMENT"
				}else{
					assetType="SERVICE"
				}
				var customTemplate='<div class="item ">' 
					+'<p><i class = "icon icon ion-person"></i>'
					+'<a href="#" class="subdued"> Asset Code :</a> <a>'+ $scope.selectedAsset.assetCode+'</a>'
					+'</p><p><i class = "icon ion-android-phone-portrait"></i><a href="#" class="subdued"> Asset Type:</a> <a>'+ assetType+'</a>'
					+'</p><p><i class = "icon ion-android-phone-portrait"></i><a href="#" class="subdued"> Asset Category: </a> <a>'+ $scope.selectedAsset.category+'</a>'
					+'</p><p><i class = "icon ion-calendar"></i><a href="#" class="subdued"> Asset Location :</a> <a>'+ $scope.selectedAsset.locationName+'</a>'
					+'</p></div>';
				var alertPopup = $ionicPopup.alert({
				      title: $scope.selectedAsset.assetName,
				      template: customTemplate
				 });
				    alertPopup.then(function(res) {
				    //console.log('Thank you for not eating my delicious ice cream cone');
			    });
			} 
		 },function(data){
			 console.log(data);
		 });
	
	
	}

     }]);