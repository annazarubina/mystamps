*** Settings ***
Documentation    Verify access to country related pages
Library          Selenium2Library
Suite Setup      Before Test Suite
Suite Teardown   After Test Suite
Force Tags       country  access

*** Test Cases ***
Anonymous user cannot create country
	[Documentation]         Verify that anonymous user gets 403 error
	Go To                   ${SITE_URL}/country/add
	Element Text Should Be  id=error-code  403
	Element Text Should Be  id=error-msg  Forbidden

*** Keywords ***
Before Test Suite
	[Documentation]                     Open browser and register fail hook
	Open Browser                        ${SITE_URL}  ${BROWSER}
	Register Keyword To Run On Failure  Log Source

After Test Suite
	[Documentation]  Close browser
	Close Browser
