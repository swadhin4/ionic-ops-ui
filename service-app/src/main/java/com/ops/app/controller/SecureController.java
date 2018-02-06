package com.ops.app.controller;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ops.app.util.RestResponse;
import com.ops.app.vo.UserVO;
import com.ops.web.service.UserService;

@Controller
@RequestMapping("/secure")
public class SecureController {
	private static final Logger LOGGER = LoggerFactory.getLogger(SecureController.class);
	@Autowired
	private UserService userService;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public String sayHello() {
        return "Secure Hello!";
    }
	
    @RequestMapping(value = "/v1/user", method = RequestMethod.GET, produces="application/json")
    public ResponseEntity<RestResponse>  getUserDetails(@RequestParam("email") String email ) {
    	LOGGER.info("Inside SecureController -- Get User Details By Email :");
    	RestResponse response = new RestResponse();
		ResponseEntity<RestResponse> responseEntity = new ResponseEntity<RestResponse>(HttpStatus.NO_CONTENT);
		if(StringUtils.isNotBlank(email)){
			try {
				UserVO user = userService.findUserByUsername(email);
				if(user.getUserId()!=null){
					response.setStatusCode(200);
					response.setObject(user);
					responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.OK);
				}
			} catch (Exception e) {
				e.printStackTrace();
				response.setStatusCode(500);
				responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.EXPECTATION_FAILED);
			}
		}
		
		LOGGER.info("Exit SecureController -- Get User Details By Email :");
		return responseEntity;
    }
}
