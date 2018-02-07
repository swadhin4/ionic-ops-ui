//angular.module('starter.controllers', [])

ops365App.factory("appService", ['$http','$q',function ($http, $q) {
	 var AppService = {
	 			getBasicAuth:getBasicAuth    
	     };
	 return AppService;
	  function getBasicAuth(user) {
          var def = $q.defer();
          $http.get("http://localhost:9191/ops/api/basic/token?username="+user.username+"&password="+user.password )
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
	            validateUser:validateUser	            
	        };
	 	
	 	return UserService;

    // implementation
        function validateUser(user, tokendata) {
            var def = $q.defer();
			var config = {
                headers : {
                "Authorization": "Bearer "+tokendata.object.access_token,
				"Accept" : "application/json"
				
                }
            }
           
            $http.get("http://localhost:9191/ops/api/secure/v1/user?email="+user.username, config)
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
        changeLinkedTicketStatus:changeLinkedTicketStatus
        
    };
    return TicketService;


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
        url="http://localhost:9191/ops/api/incident/v1/ticket/linkedtickets/"+ticketId
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
        var url="http://localhost:9191/ops/api/incident/v1/list?email="+user.emailId;
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
        $http.get("http://localhost:9191/ops/api/incident/v1/ticket/"+ticketId, config)
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
 	    function getTicketPriorityAndSLA(spId, categoryId) {
 	        var def = $q.defer();
 	        $http.get(hostLocation+"/incident/priority/sla/"+spId+"/"+categoryId)
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
    function escalateTicket(escalations) {
        var def = $q.defer();
        $http.post(hostLocation+"/incident/escalate/", escalations)
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
        $http.get("http://localhost:9191/ops/api/incident/v1/ticket/history/"+ticketId, config)
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
        $http.get("http://localhost:9191/ops/api/incident/v1/ticket/categories", config)
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
        $http.get("http://localhost:9191/ops/api/incident/status/CT",config)
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
    function retrieveEscLevel(ticketNumber) {
        var def = $q.defer();
        $http.get(hostLocation+"/test/api/escalation/CT",ticketNumber)
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