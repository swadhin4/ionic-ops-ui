
    ops365App.controller('incidentviewCtrl',
		['$rootScope', '$scope','$ionicPopover','$ionicModal','$ionicPopup','$stateParams','$ionicHistory',
		 '$state','$window','ticketService','statusService','ticketCategoryService','siteService','assetService',
	 function($rootScope,$scope,$ionicPopover,$ionicModal,$ionicPopup,$stateParams,$ionicHistory,$state,
			 $window,ticketService, statusService,ticketCategoryService,siteService,assetService) {
        
      //  var selectedTicketNumber = $state.params.selectedticket.ticketNumber;
		// var selectedTicketId = $state.params.selectedticket.ticketId;
         console.log($state.params.selectedticket);
         $scope.ticketData={};

         $scope.goBack = function() {
 			//$window.history.go(-1);
 			$ionicHistory.goBack(-1);
 		}

     $scope.OpenHistory=function(){
         
        $state.go('incidenthistory', { selectedticket: $state.params.selectedticket });
   }

   $scope.OpenWorkNote=function(){
         
        $state.go('worknote',
        { selectedticket: $state.params.selectedticket });
   }

   $scope.init=function(){
		 console.log("shibasih");			
       //  console.log($stateParams.selectedticket);
		 //console.log($state.params.selectedticket);
		 //$scope.getTicketPriority();
		 //$scope.getStatus();
	
	//$scope.getTicketCategory();
    //$scope.getCloseCode(); 
	 $scope.token = $.jStorage.get("tokendata");
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
				//$scope.getStatus();
				//$scope.getTicketPriority();
				$scope.ticketData=angular.copy(data.object);
				//$scope.getTicketCategory(token);
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

     

    