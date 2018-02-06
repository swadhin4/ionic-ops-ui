package com.ops.web.service;

import java.util.List;

import com.ops.app.vo.CreateSiteVO;
import com.ops.app.vo.LoginUser;


public interface SiteService {

	public List<CreateSiteVO> getSiteList(LoginUser user) throws Exception;

	public CreateSiteVO saveOrUpdate(CreateSiteVO siteVO, LoginUser loginUser) throws Exception;

	public CreateSiteVO getSiteDetails(Long siteId) throws Exception;


}
