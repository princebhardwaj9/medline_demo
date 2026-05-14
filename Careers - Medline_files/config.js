/* BEGIN Configuration */

if(typeof _cls_config === "undefined") _cls_config = {};

if (window.location.href.indexOf("add-clinician") > -1 ||
window.location.href.indexOf("add-patient") > -1 ||
window.location.href.indexOf("clinician-details") > -1 ||
window.location.href.indexOf("edit-clinician-details") > -1 ||
window.location.href.indexOf("edit-patient-details") > -1 ||
window.location.href.indexOf("manage-clinician") > -1 ||
window.location.href.indexOf("manage-patient") > -1 ||
window.location.href.indexOf("patient-details") > -1 ) {
	 _cls_config.domMaskingMode="whitelist"
} else {_cls_config.domMaskingMode="blacklist"};

/* Per Ria's request */
_cls_config.enabledByChance = 1;
_cls_config.domIncludeCSSSelector=true;

/* BEGIN ajax */
_cls_config.ajaxRecordMetadata="never";
_cls_config.ajaxRecordRequestBody="never";
_cls_config.ajaxRecordRequestHeaders="and(tld,statusgte(400))";
_cls_config.ajaxRecordResponseBody="never";
_cls_config.ajaxRecordResponseHeaders="and(tld,statusgte(400))";
_cls_config.interceptAjax=true;
_cls_config.ajaxRecordStats="always";
/* END ajax */


/*BEGIN MASKING*/

//Value Masking (INPUT)
_cls_config.valueMaskingMode = "whitelist";
_cls_config.maskWhitelistValueById = []; //Everything is masked EXCEPT FOR listed inputs that match an Id , This is only applied when valueMaskingMode is set to 'whitelist'
_cls_config.maskBlacklistValueById = ["#medShipTo>DIV>TABLE>TBODY>TR:eq(4)>TD:eq(1)", "A#selectedPatientLink", "#glcodeResultGrid>DIV:eq(5)>TABLE>TBODY>TR*>TD:eq(1)"]; //Only listed inputs with a matching Id are masked , This is only applied when valueMaskingMode is set to 'blacklist'.
_cls_config.maskWhitelistValueByClass = ["medUpperCase","sku_quantity","skunumberdatalayer","skuInput","skuQty","search-input"]; //Everything is masked EXCEPT FORlisted inputs that match a class , This is only applied when valueMaskingMode is set to 'whitelist'.
_cls_config.maskBlacklistValueByClass = ["sessioncamexclude"]; //Only listed inputs with a matching Class are masked , This is only applied when valueMaskingMode is set to 'blacklist'.
_cls_config.valueWhitelistMaskSimpleSelector = [
"searchQuestion",
"q",
"#Username-input",
"#search-text",
"#newTemplateNameInputBox_selectTemplatePopupDivproduct_sku_container_Z05-PF41085_1",
"#materialId_1",
"#materialId_2",
"#materialId_3",
"#orderTemplateForm_qty_1",
"#orderTemplateForm_qty_3",
"#orderTemplateForm_qty_2",
"#viewListSearchTextBox",
"#poNumber",
"#delayUntilShipping",
"td.quantity > div > div > div > input"
]; //EVERYTHING is masked EXCEPT FOR this list of selectors , This is only applied when valueMaskingMode is set to 'whitelist'.
_cls_config.valueBlacklistMaskSimpleSelector = []; //Only listed inputs with a matching selector are masked. , This is only applied when valueMaskingMode is set to 'blacklist'.

//DOM Masking
_cls_config.domWhitelistMaskContentById = []; //ALL text is masked EXCEPT FOR this list of Ids. This supports a single wildcard, such as *. This is only applied when domMaskingMode is set to 'whitelist'.
_cls_config.domBlacklistMaskContentById = ["address-validation-modal"]; //ONLY text matched to this list of Ids is masked. This supports a single wildcard, such as *. This is only applied when domMaskingMode is set to 'blacklist'.
_cls_config.domWhitelistMaskContentByClass = ["medline-gb-unmask"]; //ALL text is masked EXCEPT FOR this list of classes. This supports a single wildcard, such as *. This is only applied when domMaskingMode is set to 'whitelist'.
_cls_config.domBlacklistMaskContentByClass = ["sessioncamhidetext", "sessioncamexclude",
"shipping-address-item", 
"billing-address-details", 
"shipping-information-content", 
"order-date",
"medline-gb-mask",
"address-suggestion-wrapper"
]; //ONLY text matched to this list of classes is masked. This supports a single wildcard, such as *. This is only applied when domMaskingMode is set to 'blacklist'.
_cls_config.domWhitelistMaskSimpleSelector = []; //ALL text is masked, EXCEPT FORthe listed selectors. This is only applied when domMaskingMode is set to 'whitelist'.
_cls_config.domBlacklistMaskSimpleSelector = [
"div.box-information div.box-content", 
"address", 
".shipping-address-item", 
".billing-address-details", 
".shipping-information-content", 
".order-date", 
".payment-method table.data.table tbody tr:nth-of-type(2) td", 
".customer-name span:nth-of-type(2)",
"#my-orders-table > tbody > tr > td.col.shipping",
"#additional-addresses-table > tbody > tr > td.col.firstname",
"#additional-addresses-table > tbody > tr > td.col.lastname",
"#additional-addresses-table > tbody > tr > td.col.streetaddress",
"#additional-addresses-table > tbody > tr > td.col.city",
"#additional-addresses-table > tbody > tr > td.col.country",
"#additional-addresses-table > tbody > tr > td.col.state",
"#additional-addresses-table > tbody > tr > td.col.zip",
"#additional-addresses-table > tbody > tr > td.col.phone",
"#maincontent > div.columns > div > div:nth-child(3) > div > div > div.grow > p"
]; //ONLY text matched to this list of selectors is masked.This is only applied when domMaskingMode is set to 'blacklist'.

/*END MASKING*/

/* OOTB */
_cls_config.iframesAutoInject=true;
_cls_config.recordMouseMoves=true; 
_cls_config.recordScrolls=true;
_cls_config.recordHovers=true;
_cls_config.clientAttributesEnabled=true;
_cls_config.clientAttributeMaxLength=500;
_cls_config.collectStruggles=true;
/* END OF OOTB*/

/* BEGIN page performance */
_cls_config.resourceTimingRecordEnabled=true;
_cls_config.resourceTimingRecordEnabledByChance=0.05;
_cls_config.webVitalsRecordEnabled=true;
/* END page performance */
 
 //PJB 187692
_cls_config.resourcesRecordEnabled=true;

//191127
_cls_config.resourcesRecordCount=5;
_cls_config.resourcesRecordChance=0.5;
_cls_config.resourceRecordCssOnly=false;

/* BEGIN exposure */
_cls_config.recordScrollReach=true;
/* END exposure */
 
/* BEGIN form tracking IM */
_cls_config.domFormAnalysisReporting=true;
_cls_config.domFormValidationTracking=true;
/* END form tracking IM */
 
/* BEGIN window property */
_cls_config.pageAttributesEnabled=true;
/* END window property */

/* BEGIN Global Objects Capture */
_cls_config.captureGlobalObjects=[
	'dataLayer.br_search_term',
	'dataLayer.page.page_category'
];
/* END Global Objects Capture */

/* END Configuration */

/* BEGIN V7 detector requirements */
_cls_config.initDetectorOnInteractive = true;
_cls_config.detectorPath = 'https://cdn.gbqofs.com/sv/a/';
/* End V7 detector requrements */