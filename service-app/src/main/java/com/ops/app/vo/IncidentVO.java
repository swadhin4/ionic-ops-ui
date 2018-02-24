package com.ops.app.vo;
public class IncidentVO {

	private Long ticketId;
	private String ticketNumber;
	private String ticketTitle;
	private String statusId;
	private String status;
	private String priority;
	private String createdOn;
	private String slaDueDate;
	
	public String getTicketNumber() {
		return ticketNumber;
	}
	public IncidentVO() {
		super();
	}
	public void setTicketNumber(String ticketNumber) {
		this.ticketNumber = ticketNumber;
	}
	public String getTicketTitle() {
		return ticketTitle;
	}
	public void setTicketTitle(String ticketTitle) {
		this.ticketTitle = ticketTitle;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getStatusId() {
		return statusId;
	}
	public void setStatusId(String statusId) {
		this.statusId = statusId;
	}
	public String getCreatedOn() {
		return createdOn;
	}
	public void setCreatedOn(String createdOn) {
		this.createdOn = createdOn;
	}
	public String getSlaDueDate() {
		return slaDueDate;
	}
	public void setSlaDueDate(String slaDueDate) {
		this.slaDueDate = slaDueDate;
	}
	public Long getTicketId() {
		return ticketId;
	}
	public void setTicketId(Long ticketId) {
		this.ticketId = ticketId;
	}
	
	
}