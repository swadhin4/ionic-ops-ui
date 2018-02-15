//angular.module('starter.controllers', [])

ops365App.factory("appService", ['$http','$q',function ($http, $q) {
	 var AppService = {
	 			getBasicAuth:getBasicAuth    
	     };
	 return AppService;
	  function getBasicAuth(user) {
          var def = $q.defer();
          $http.get(hostLocation+"/ops/api/basic/token?username="+user.username+"&password="+user.password )
              .success(function(data) {
                  def.resolve(data);
              })
              .error(function(data) {
                  def.reject(data);
              });
          return def.promise;
      }
}]);
ops365App.factory("userService", ['$http','$q',function ($http, $q) {

    var UserService = {
	 			user:{},
	            userList: [],	           
	            validateUser:validateUser,
	            getUserSiteAccess:getUserSiteAccess
	        };
	 	
	 	return UserService; 
	 	
	 	function getUserSiteAccess(user, tokendata){
       	  var def = $q.defer();
	   	  var config = {
	            headers : {
	            "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json"
				
	            }
	      }
         $http.get(hostLocation+"/ops/api/secure/user/site/access?email="+user.userName, config)
             .success(function(data) {
             	console.log(data)
                 def.resolve(data);
             })
             .error(function() {
                 def.reject("Failed to get user site access list");
         });
	   	return def.promise;
      }

    // implementation
        function validateUser(user, tokendata) {
            var def = $q.defer();
			var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json"
				
                }
            }
           
            $http.get(hostLocation+"/ops/api/secure/v1/user?email="+user.username, config)
                .success(function(data) {
                	
                    def.resolve(data);
                })
                .error(function(data) {
                	console.log("error" + data)
                    def.reject(data);
                });
            return def.promise;
        }
}]);
ops365App.factory("ticketService", ['$http', '$q',function ($http, $q) {
    var TicketService = {
		ticket:{},
        ticketList: [],
        openTicketList:[],
        approachingTicketList:[],
        priorityTicketList:[],
        escalatedTicketList:[],
        saveTicket:saveTicket,
        displayAllOpenTickets:displayAllOpenTickets,
        getSelectedTicket:getSelectedTicket,
        getTicketPriorityAndSLA:getTicketPriorityAndSLA,
        escalateTicket:escalateTicket,
        getTicketHistory:getTicketHistory,
        getLinkedTickets:getLinkedTickets,
        linkTicket:linkTicket,
        deleteLinkedTicket:deleteLinkedTicket,
        changeLinkedTicketStatus:changeLinkedTicketStatus,
        saveComment:saveComment,
        getComments:getComments
        
    };
    return TicketService;

    function getComments(ticketId,tokendata) {
        var def = $q.defer();    
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json"
				
                },
             
		 };
        
        url=hostLocation+"/ops/api/incident/v1/ticket/comment/list/"+ticketId;        
        $http.get(url,config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

    function saveComment(ticketComments, tokendata) {
        var def = $q.defer();    
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json"
				
                },
             
		 };
        var data=ticketComments;
        
        url=hostLocation+"/ops/api/incident/v1/ticket/comment/save";        
        $http.post(url, data, config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
// implementation
    function changeLinkedTicketStatus(linkTicket) {
        var def = $q.defer();
        
        	url=hostLocation+"/incident/linkedticket/status/"+linkTicket.ticketNumber+"/"+linkTicket.status
        
        $http.get(url)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

 // implementation
    function deleteLinkedTicket(linkTicket) {
        var def = $q.defer();
        
        	url=hostLocation+"/incident/linkedticket/delete/"+linkTicket.ticketNumber
        
               $http.get(url)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

// implementation
    function linkTicket(linkedTicket) {
        var def = $q.defer();
        
        	url=hostLocation+"/incident/linkedticket/"+linkedTicket.parentTicketId+"/"+linkedTicket.parentTicketNo+"/"+linkedTicket.linkedTicketNo
        
        $http.get(url)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

// implementation
    function getLinkedTickets(ticketId,tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json"
				
                },
             
		 };
        url=hostLocation+"/ops/api/incident/v1/ticket/linkedtickets/"+ticketId
         $http.get(url,config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

    // implementation
    function saveTicket(customerTicket, mode) {
        var def = $q.defer();
        var url=""
	        if(mode!=undefined && mode.toUpperCase()=="update"){
	        	url=hostLocation+"/sp/incident/update";
	        }else{
	        	url=hostLocation+"/incident/create";
	        }
        $http.post(url,customerTicket)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
    
    // implementation
    function displayAllOpenTickets(user, tokendata) {
        var def = $q.defer();
		var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json"
				
                },
             
		 };
		var data=user;
        var url=hostLocation+"/ops/api/incident/v1/list?email="+user.emailId;
	     $http.get(url, config)
            .success(function(data) {
            	console.log(data)
            	TicketService.ticketList=data;
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

    // implementation
    function getSelectedTicket(ticketId, tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json",
                }
             
		 };
        $http.get(hostLocation+"/ops/api/incident/v1/ticket/"+ticketId, config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

        // implementation
 	    function getTicketPriorityAndSLA(spId, categoryId,tokendata) {
 	        var def = $q.defer();
 	       var config = {
 	                headers : {
 	                "Authorization": "Bearer "+tokendata.object.access_token,
 					"Accept" : "application/json",
 	                }
 	             
 			 };
 	        $http.get(hostLocation+"/ops/api/incident/priority/sla/"+spId+"/"+categoryId, config)
 	            .success(function(data) {
 	            	console.log(data)
 	                def.resolve(data);
 	            })
 	            .error(function(data) {
 	            	console.log(data)
 	                def.reject(data);
 	            });
 	        return def.promise;
 	    }

         // implementation
    function escalateTicket(escalations, user, tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json",
                }
             
		 };
        $http.post(hostLocation+"/ops/api/incident/v1/ticket/escalate?email="+user.emailId, escalations, config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

    // implementation
    function getTicketHistory(ticketId, tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json",
                }
             
		 };
        $http.get(hostLocation+"/ops/api/incident/v1/ticket/history/"+ticketId, config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
}]);

ops365App.factory("ticketCategoryService", ['$http', '$q',function ($http, $q) {
	var TicketCategoryService = {
		category:{},
        categories: [],
        retrieveAllCategories:retrieveAllCategories
    };
	
	
 	return TicketCategoryService;
 	
    // implementation
    function retrieveAllCategories(tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json",
                }
             
		 };
        $http.get(hostLocation+"/ops/api/incident/v1/ticket/categories", config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
    
}]);

ops365App.factory("statusService", ['$http', '$q',function ($http, $q) {
	var StatusService = {
		status:{},
        statusList: [],
        retrieveAllStatus:retrieveAllStatus,
    };
	
	
 	return StatusService;
 	
    // implementation
    function retrieveAllStatus(tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json",
                }
             
		 };
        $http.get(hostLocation+"/ops/api/incident/status/CT",config)
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
}]);

ops365App.factory("ticketEscalationService", ['$http', '$q',function ($http, $q) {
	var ticketEscalationService = {
        escalation:{},
        escalationLevelList: [],	
        retrieveEscLevel:retrieveEscLevel
    };
	
	
 	return ticketEscalationService;
 	
    // implementation
    function retrieveEscLevel(ticketNumber, tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json",
                }
             
		 };
        $http.get(hostLocation+"/ops/api/incident/v1/ticket/escalations/CT/"+ticketNumber, config)
            .success(function(data) {
            	ticketEscalationService.escalationLevelList = data;
                console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
}]);

ops365App.factory("siteService", ['$http', '$q',function ($http, $q) {
	var SiteService = {
		site:{},
        siteList: [],
        retrieveAllSites:retrieveAllSites,
        retrieveSiteDetails:retrieveSiteDetails,
    };
	
 	return SiteService;
 	
    function retrieveSiteDetails(siteId, tokendata) {
        var def = $q.defer();
        var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json",
                }
             
		 };
        $http.get(hostLocation+"/ops/api/site/v1/selected/"+siteId, config)
            .success(function(data) {
                 console.log(data)
                 SiteService.site=data;
                def.resolve(data);
            })
            .error(function(data) {
                 console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

 	
    // implementation
    function retrieveAllSites() {
        var def = $q.defer();
        $http.get(hostLocation+"/test/api/sites")
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
   
}]);

ops365App.factory('assetService',  ['$http', '$q',function ($http, $q) {
	var AssetService = {
			retrieveAssetCategories:retrieveAssetCategories,
			getAssetLocations:getAssetLocations,
			saveAssetObject:saveAssetObject,
			findAllAssets:findAllAssets,
			getAssetBySite:getAssetBySite,
			deleteFileAttached:deleteFileAttached,
			getAssetInfo:getAssetInfo,
			deleteAsset:deleteAsset
	};
	return AssetService;
	
	// implementation
	    function deleteAsset(asset) {
	        var def = $q.defer();
	        $http.get(hostLocation+"/asset/delete/"+asset.assetId)
	            .success(function(data) {
	            	console.log(data)
	                def.resolve(data);
	            })
	            .error(function(data) {
	            	console.log(data)
	                def.reject(data);
	            });
	        return def.promise;
	    }
	
	// implementation
	    function getAssetInfo(assetId, tokendata) {
	        var def = $q.defer();
	        var config = {
	                headers : {
	                "Authorization": "Bearer "+tokendata.object.access_token,
					"Accept" : "application/json",
	                }
	             
			 };
	        $http.get(hostLocation+"/ops/api/asset/info/"+assetId,config )
	            .success(function(data) {
	            	console.log(data)
	                def.resolve(data);
	            })
	            .error(function(data) {
	            	console.log(data)
	                def.reject(data);
	            });
	        return def.promise;
	    }
	
	// implementation
	    function deleteFileAttached(feature,assetId,type) {
	        var def = $q.defer();
	        $http.get(hostLocation+"/file/attachement/delete/"+feature+"/"+assetId+"/"+type)
	            .success(function(data) {
	            	console.log(data)
	                def.resolve(data);
	            })
	            .error(function(data) {
	            	console.log(data)
	                def.reject(data);
	            });
	        return def.promise;
	    }
	    
	// implementation
	    function findAllAssets() {
	        var def = $q.defer();
	        $http.get(hostLocation+"/asset/list")
	            .success(function(data) {
	            	console.log(data)
	                def.resolve(data);
	            })
	            .error(function(data) {
	            	console.log(data)
	                def.reject(data);
	            });
	        return def.promise;
	    }
	
	    
	// implementation
	    function getAssetBySite(siteId, tokendata) {
	        var def = $q.defer();
	        var config = {
	                headers : {
	                "Authorization": "Bearer "+tokendata.object.access_token,
					"Accept" : "application/json",
	                }
	             
			 };
	        $http.get(hostLocation+"/ops/api/asset/site/list/"+siteId, config)
	            .success(function(data) {
	            	console.log(data)
	                def.resolve(data);
	            })
	            .error(function(data) {
	            	console.log(data)
	                def.reject(data);
	            });
	        return def.promise;
	    }

	// implementation
	    function saveAssetObject(assetObject) {
	        var def = $q.defer();
	        $http.post(hostLocation+"/asset/create",assetObject)
	            .success(function(data) {
	            	console.log(data)
	                def.resolve(data);
	            })
	            .error(function(data) {
	            	console.log(data)
	                def.reject(data);
	            });
	        return def.promise;
	    }
	
// implementation
    function retrieveAssetCategories() {
        var def = $q.defer();
        $http.get(hostLocation+"/asset/categories")
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }
    
 // implementation
    function getAssetLocations() {
        var def = $q.defer();
        $http.get(hostLocation+"/asset/locations")
            .success(function(data) {
            	console.log(data)
                def.resolve(data);
            })
            .error(function(data) {
            	console.log(data)
                def.reject(data);
            });
        return def.promise;
    }

}]);