ops365App.controller('incidentcreateCtrl',
		['$rootScope', '$scope','$filter','$ionicPopover','$ionicModal','$ionicPopup','$stateParams',
        '$state','ticketService','ionicToast','$ionicHistory','$ionicSlideBoxDelegate','userService','assetService',
	 function($rootScope,$scope,$filter,$ionicPopover,$ionicModal,$ionicPopup,$stateParams,$state,
     ticketService,ionicToast,$ionicHistory,$ionicSlideBoxDelegate,userService,assetService) {


    $scope.dateValue = new Date();
    $scope.timeValue = new Date();
    $scope.datetimeValue = new Date();

    $scope.ticketData={};
         $scope.data = {
            numViewableSlides : 0,
            slideIndex : 0,
         };
        $scope.slideCount = 2;

        $scope.goBack = function() {
        //$window.history.go(-1);
            $ionicHistory.goBack(-1);
        }

         $scope.nextSlide = function() {
            $ionicSlideBoxDelegate.next();
            }

        $scope.previousSlide = function() {
            $ionicSlideBoxDelegate.previous();
        }
        
         // Called each time the slide changes
        $scope.slideChanged = function(index) {
    
            $scope.data.slideIndex = index;
        };
        
        $scope.TicketCategories = [{
               id: 1,
                Name: 'Operation is completly down'
            }, {
                id: 2,
                Name: 'Operation is partially interputed'
            }, {
                id: 3,
                Name: 'Performance degraded'
            },{
                id: 4,
                Name: 'General service request'
            }
		];

        // $scope.compSettings = {
        //     theme: 'ios',
        //     display: 'bottom',
        //     dateFormat: 'yy-mm-dd',
        //     timeFormat: 'HH:ii'
            
        // };

        $scope.init=function(){
        	$scope.accessSite={
        		list:[]	
        	};
        	var loggedInuser = $.jStorage.get('loggedInUser');
			var tokendata=$.jStorage.get('tokendata');
			 $scope.getUserSiteAccess(loggedInuser,tokendata);
			 $scope.assetTypechecked="E";
			 $scope.ticketData={};
        }
        $scope.getUserSiteAccess=function(user, tokendata){			 
			 userService.getUserSiteAccess(user.object, tokendata)
				.then(function(data) {
	    			console.log(data);
	    			if(data.statusCode == 200){
	    				if(data.object.length>0){
	    					$scope.accessSite.list=[];
	    					$("#siteSelect").empty();
	    					
		    				$.each(data.object,function(key,val){
		    					var accessedSite={
			    						accessId:val.accessId,
			    						site:val.site,
			    						siteId:val.site.siteId,
			    						siteName:val.site.siteName
			    				}
		    					$scope.accessSite.list.push(accessedSite);
		    					
		    				});
		    				
		    				var options = $("#siteSelect");
	    					options.append($("<option />").val("").text("Select Site"));
	    					$.each($scope.accessSite.list,function() {
								options.append($("<option />").val(	this.siteId).text(this.siteName));
							});
	    					
	    				}
	    				
	    			}
	            },
	            function(data) {
	                console.log('Unable to get access list')
	            });
		 }
        $scope.dropDownValues=function(i, e, dropDownId){
        	if(dropDownId.toUpperCase() == "SITESELECT"){
        		 var site={
        				 siteId:parseInt($("#siteSelect").val()),
        		 		 siteName:$("#siteSelect option:selected").text()
        		 }
        		 $scope.accessSite.selected =site;
        		 $scope.getAsset(site);		
        	 }
        	else if(dropDownId.toUpperCase() == "ASSETSELECT"){
       		 var asset={
       				 assetId:parseInt($("#assetSelect").val()),
       		 		 assetName:$("#assetSelect option:selected").text()
       		 }
       		// $scope.assetList.selected = asset;
       		 $.each($scope.assetList,function(key,val){
       			if(val.assetId == asset.assetId){
       				console.log(val);
       				$('#assignedTo').val(val.serviceProviderName);
       				$scope.setTicketServiceProvider(val);
       				return false;
       			} 
       		 });
       		// $scope.getTicketCategory();
       	 }
        }
        
        $scope.setTicketServiceProvider=function(asset){
			 $scope.ticketData.sp=asset.serviceProviderId;
		 }
		$scope.getTicketCategory=function(){
			$('#loadingDiv').show();
			ticketCategoryService.retrieveAllCategories()
			.then(function(data) {
    			console.log(data)
    				$scope.categoryList=[];
    				if(data.length>0){
    					$.each(data,function(key,val){
    						var category={
    	            				categoryId:val.id,
    	            				categoryName:val.ticketCategory
    	            		}
    						$scope.categoryList.push(category);
    					});
    					$('#loadingDiv').hide();
    					$("#ticketCategorySelect").empty();
    					var options = $("#ticketCategorySelect");
    					options.append($("<option />").val("").text("Select category"));
    					$.each($scope.categoryList,function() {
    						options.append($("<option />").val(	this.categoryId).text(	this.categoryName));
    					});
    					if(viewMode.toUpperCase() == 'EDIT'){
    						$("#ticketCategorySelect option").each(function() {
    							console.log($(this).val());
								if ($(this).val() == $scope.ticketData.categoryId) {
									$(this).attr('selected', 'selected');
									return false;
								}
						 	});
    						$scope.selectedCategory.selected = $scope.ticketData.categoryName;
    						$scope.getTicketPriority();
    					}
    				}else{
    					console.log("No categories found")
    				}
    				$('#loadingDiv').hide();
            },
            function(data) {
                console.log(data)
                console.log("No categories found")
				$('#loadingDiv').hide();
            });
			
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
		
		 $scope.setTicketPriorityAndSLA=function(ticketCategory){
			 console.log($scope.ticketData);
			 var spId = $scope.ticketData.sp;
			 if(viewMode.toUpperCase()=='EDIT'){
				 spId=parseInt($scope.ticketData.assignedTo);
		      }
			 if(spId==undefined){
				 //alert("No Site Selected");
				 return false;
			 }else{
				 $('#loadingDiv').show();
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
				 $('#loadingDiv').hide();
			 },function(data){
				 console.log(data);
				 $('#loadingDiv').hide();
			 });
			 }
			
		 }
    	$scope.getAsset=function(selectedSite){
			console.log(selectedSite);
			// $('#loadingDiv').show();
			var tokendata=$.jStorage.get('tokendata');
			 assetService.getAssetBySite(selectedSite.siteId, tokendata)
				.then(function(data) {
					console.log(data);
 					$scope.assetList=[];
 				if(data.length>0){
					
					$.each(data,function(key,val){
	    				$scope.assetList.push(val);
	    			});
					if($scope.assetTypechecked == null){
						//alert($scope.assetType);
					}else{
						//alert($scope.assetType);
						
						if($scope.assetTypechecked == 'E'){
						$scope.populateAssetType('EQUIPMENT');
						}else{
							$scope.populateAssetType('SERVICE');
						}
					}
					//$scope.getTicketCategory();
 				  }
				},  function(data) {
	                console.log('Unable to get asset list')
					$scope.ticketData.assignedTo=null;
					$scope.ticketData.slaTime=null;
					$scope.ticketData.priorityDescription=null;
 					$("#ticketCategorySelect").empty();
 					$("#assetSelect").empty();
				});
			
		}
    	
   	 $scope.populateAssetType=function(type){
		 
		 var selectedSite = $('#siteSelect').val();
		 if(selectedSite == ""){
			 //alert ("No Site Selected");
			 
		 }else{
			 if($scope.assetList==null){
				 
					$scope.errorMessage="No assets available for site "+ $('#siteSelect option:selected').text()
					$scope.ticketData.assignedTo=null;
					$scope.ticketData.slaTime=null;
					$scope.ticketData.priorityDescription=null;
 					$("#ticketCategorySelect").empty();
 					 $("#assetSelect").empty();
 					if(type.toUpperCase()=='EQUIPMENT'){
 						$scope.assetTypechecked = 'E';
 					}else if(type.toUpperCase()=='SERVICE'){
 						$scope.assetTypechecked = 'S';
 					}
			 }else{	 
		 if(type.toUpperCase()=='EQUIPMENT'){
			 $scope.assetTypechecked = 'E';
				console.log($scope.assetTypechecked);
				var equipmentList = [];
				$.each($scope.assetList,function(key,val){
					if(val.assetType == 'E' && val.siteId == $scope.accessSite.selected.siteId){
						equipmentList.push(val);
					}
				});
			 $("#assetSelect").empty();
			 var options = $("#assetSelect");
    			options.append($("<option />").val("").text(
    			"Select asset"));
    			$.each(equipmentList,function() {
    					options.append($("<option />").val(	this.assetId).text(	this.assetName));
    			});
		 }else if(type.toUpperCase()=='SERVICE'){
			 $scope.assetTypechecked = 'S';
				console.log($scope.assetTypechecked);
				var serviceList = [];
				$.each($scope.assetList,function(key,val){
					if(val.assetType == 'S' && val.siteId == $scope.accessSite.selected.siteId){
						serviceList.push(val);
					}
				});
				 $("#assetSelect").empty();
				 var options = $("#assetSelect");
	    			options.append($("<option />").val("").text(
	    			"Select asset"));
	    			$.each(serviceList,function() {
	    					options.append($("<option />").val(	this.assetId).text(	this.assetName));
	    			});
		   }
		  }
		 }
	 }
     }]);