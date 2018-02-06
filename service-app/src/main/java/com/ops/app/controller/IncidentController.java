/*
 * Copyright (C) 2013 , Inc. All rights reserved
 */
package com.ops.app.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.ops.app.util.RestResponse;
import com.ops.app.vo.LoginUser;
import com.ops.app.vo.TicketMVO;
import com.ops.app.vo.TicketVO;
import com.ops.app.vo.UserVO;
import com.ops.jpa.entities.Status;
import com.ops.jpa.entities.TicketCategory;
import com.ops.web.service.StatusService;
import com.ops.web.service.TicketCategoryService;
import com.ops.web.service.TicketService;
import com.ops.web.service.UserService;

/**
 * The Class UserController.
 *
 */
@Controller
@RequestMapping("/incident")
public class IncidentController  {

	private static final Logger logger = LoggerFactory.getLogger(IncidentController.class);

	/** The user service. */
	@Autowired
	private UserService userService;
	
	@Autowired
	private TicketService ticketService;
	
	@Autowired
	private TicketCategoryService ticketCategoryService;
	
	@Autowired
	private StatusService statusService;

	@RequestMapping(value = "/v1/list", method = RequestMethod.GET,produces="application/json")
	public ResponseEntity<RestResponse> listAllTickets(@RequestParam("email") String email) {
		List<TicketMVO> tickets = null;
		RestResponse response = new RestResponse();
		ResponseEntity<RestResponse> responseEntity = new ResponseEntity<RestResponse>(HttpStatus.NO_CONTENT);
		try {
			UserVO user = userService.findUserByUsername(email);
			if(user.getUserId()!=null){
				LoginUser authorizedUser = new LoginUser();
				authorizedUser.setEmail(user.getEmailId());
				authorizedUser.setFirstName(user.getFirstName());
				authorizedUser.setLastName(user.getLastName());
				authorizedUser.setUserId(user.getUserId());
				tickets = ticketService.getAllCustomerTickets(authorizedUser);
				if (tickets.isEmpty()) {
					responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.NO_CONTENT);
					return responseEntity;
				}else{
					response.setStatusCode(200);
					response.setObject(tickets);
					responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.OK);
				}
			}
		} catch (Exception e) {
			response.setStatusCode(500);
			logger.info("Exception in getting ticket list response", e);
			responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.EXPECTATION_FAILED);
		}

		return responseEntity;
	}

	

	@RequestMapping(value = "/v1/ticket/{ticketId}", method = RequestMethod.GET,produces="application/json")
	public ResponseEntity<RestResponse> getSelectedTicket(@PathVariable(value="ticketId") Long ticketId) {
		RestResponse response = new RestResponse();
		ResponseEntity<RestResponse> responseEntity = new ResponseEntity<RestResponse>(HttpStatus.NO_CONTENT);
		try {
			TicketVO  ticketVO = ticketService.getSelectedTicket(ticketId);
				if (StringUtils.isNotBlank(ticketVO.getTicketNumber())) {
					response.setStatusCode(200);
					response.setObject(ticketVO);
					responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.OK);
				}
		} catch (Exception e) {
			response.setStatusCode(500);
			logger.info("Exception in getting ticket response", e);
			responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.EXPECTATION_FAILED);
		}

		return responseEntity;
	}

	@RequestMapping(value = "/v1/ticket/categories", method = RequestMethod.GET,produces="application/json")
	public ResponseEntity<RestResponse> getTicketPriorities() {
		RestResponse response = new RestResponse();
		
		ResponseEntity<RestResponse> responseEntity = new ResponseEntity<RestResponse>(HttpStatus.NO_CONTENT);
		try {
			List<TicketCategory> ticketCategories = ticketCategoryService.getAllTicketCategories();
				if (!ticketCategories.isEmpty()) {
					response.setStatusCode(200);
					response.setObject(ticketCategories);
					responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.OK);
				}
		} catch (Exception e) {
			response.setStatusCode(500);
			logger.info("Exception in getting ticket categoriesresponse", e);
			responseEntity = new ResponseEntity<RestResponse>(response,HttpStatus.EXPECTATION_FAILED);
		}

		return responseEntity;
	}
	

	
	@RequestMapping(value = "/status/{category}", method = RequestMethod.GET,produces="application/json")
	public ResponseEntity<List<Status>> listAllOpenTickets(@PathVariable (value="category") final String category) {
		List<Status> statusList = null;
		try {
			statusList = statusService.getStatusByCategory(category);
			if (statusList.isEmpty()) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
				// You many decide to return HttpStatus.NOT_FOUND
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<List<Status>>(statusList, HttpStatus.OK);
	}

	
}
