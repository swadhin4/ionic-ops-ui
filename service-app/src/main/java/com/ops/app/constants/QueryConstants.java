package com.ops.app.constants;
public class QueryConstants {

	public final static String INCIDENT_LIST_QUERYY="select ct.id, ct.ticket_number as ticketNumber,"
			+ " ct.ticket_title as ticketTitle,	ct.status_id as statusId,"
			+ " st.status as statusName, ct.priority as priority, ct.created_on as createdOn, ct.sla_duedate as slaDueDate"
			+ " from pm_cust_ticket ct inner join pm_user_access uc on ct.site_id = uc.site_id "
			+ " inner join pm_status st on ct.status_id = st.status_id"
			+ " where uc.user_id =:userId ";
	
}