//
// IMPORTANT:
// You must update ResourceUrl.RESOURCES_VERSION each time whenever you're modified this file!
//

// @todo #1056 SeriesSaleAddForm: add tests
class SeriesSaleAddForm extends React.Component {
	
	// TODO: data-text to l10n
	// TODO: data-action
	// TODO: data-classappend
	// TODO: data-placeholder
	// TODO: data-remove
	// TODO: data-field
	// TODO: data-value
	// TODO: deal with asterisk
	render() {
		return (
			<div className="row">
				<div className="col-sm-12">
					<h5 data-text="#{t_add_info_who_selling_series}">Add info about selling/buying this series</h5>
					<form id="add-series-sales-form"
						method="post"
						className="form-horizontal"
						action="info.html"
						data-action="@{${ADD_SERIES_ASK_PAGE}(id=${series.id})}">
						
						<div className="form-group form-group-sm" data-classappend="${#fields.hasErrors('date') ? 'has-error' : ''}">
							<label htmlFor="date" className="control-label col-sm-3" data-text="#{t_date}">
								Date
							</label>
							<div className="col-sm-4">
								<input type="text" id="date" className="form-control" data-field="*{date}" data-placeholder="#{t_dd_mm_yyyy}" placeholder="dd.mm.yyyy" />
								{/*
								<span id="date.errors" class="help-block" th:if="${#fields.hasErrors('date')}" th:each="error : ${#fields.errors('date')}" th:text="${error}"></span>
								*/}
							</div>
							<small>
								<a tabIndex="-1"
									className="link-vcenter"
									href="javascript:populateTransactionDateWithTodayDate(); void(0);" data-text="#{t_today}">
									Today
								</a>
							</small>
						</div>
						
						<div className="form-group form-group-sm" data-classappend="${#fields.hasErrors('sellerId') ? 'has-error' : ''}">
							<label htmlFor="seller" className="control-label col-sm-3">
								<span data-remove="tag" data-text="#{t_seller}">
									Seller
								</span>
								<span className="required_field">*</span>
							</label>
							<div className="col-sm-6">
								<select id="seller" className="form-control" required="required" data-field="*{sellerId}">
									<option value="" data-text="#{t_not_chosen_masculine}">Not chosen</option>
									{/*
									<th:block th:each="item : ${sellers}">
										<optgroup th:if="${not #lists.isEmpty(item.children)}" th:label="${item.name}">
											<option th:each="seller : ${item.children}"
												th:value="${seller.value}"
												th:text="${seller.name}"
												th:selected="${addSeriesSalesForm.sellerId != seller.value}">
											</option>
										</optgroup>
										<option th:if="${#lists.isEmpty(item.children)}"
											th:value="${item.value}"
											th:text="${item.name}"
											th:selected="${addSeriesSalesForm.sellerId != item.value}">
										</option>
									</th:block>
									*/}
									<optgroup label="Musicians">
										<option value="3">Eicca Toppinen</option>
										<option value="1">James Alan Hetfield</option>
									</optgroup>
									<option value="2">Tommy Lee Jones</option>
								</select>
								<small data-authorize="hasAuthority('ADD_PARTICIPANT')">
									<span className="hint-block" data-utext="#{t_add_seller_hint(@{${ADD_PARTICIPANT_PAGE}(seller=true)})}">
										You can also <a tabIndex="-1" href="../participant/add.html?seller=true">add a new seller</a>
									</span>
								</small>
								{/*
								<span id="seller.errors" class="help-block" th:if="${#fields.hasErrors('sellerId')}" th:each="error : ${#fields.errors('sellerId')}" th:text="${error}"></span>
								*/}
							</div>
						</div>
						
						<div className="form-group form-group-sm" data-classappend="${#fields.hasErrors('url') ? 'has-error' : ''}">
							<label htmlFor="url" className="control-label col-sm-3" data-text="#{t_url}">
								URL
							</label>
							<div className="col-sm-6">
								<input type="url" id="url" className="form-control" data-field="*{url}" />
								{/*
								<span id="url.errors" class="help-block" th:if="${#fields.hasErrors('url')}" th:each="error : ${#fields.errors('url')}" th:text="${error}"></span>
								*/}
							</div>
						</div>
						
						<div className="form-group form-group-sm" data-classappend="${#fields.hasErrors('price') or #fields.hasErrors('currency') ? 'has-error' : ''}">
							<label htmlFor="price" className="control-label col-sm-3">
								<span data-remove="tag" data-text="#{t_price}">
									Price
								</span>
								<span className="required_field">*</span>
							</label>
							<div className="col-sm-6">
								<div className="row">
									<div className="col-xs-6">
										<input type="text" id="price" className="form-control" size="5" required="required" data-field="*{price}" />
									</div>
									<div className="col-xs-4 no-padding">
										<select id="currency" className="form-control" required="required" data-field="*{currency}">
											<option value=""></option>
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
											<option value="GBP">GBP</option>
											<option value="RUB" selected="selected">RUB</option>
											<option value="CZK">CZK</option>
										</select>
									</div>
								</div>
								{/*
								<span id="price.errors" class="help-block" th:if="${#fields.hasErrors('price')}" th:each="error : ${#fields.errors('price')}" th:text="${error}"></span>
								<span id="currency.errors" class="help-block" th:if="${#fields.hasErrors('currency')}" th:each="error : ${#fields.errors('currency')}" th:text="${error}"></span>
								*/}
							</div>
						</div>
						
						<div className="form-group form-group-sm" data-classappend="${#fields.hasErrors('altPrice') or #fields.hasErrors('altCurrency') ? 'has-error' : ''}">
							<label htmlFor="alt-price" className="control-label col-sm-3" data-text="#{t_alternative_price}">
								Alternative price
							</label>
							<div className="col-sm-6">
								<div className="row">
									<div className="col-xs-6">
										<input type="text" id="alt-price" className="form-control" size="5" data-field="*{altPrice}" />
									</div>
									<div className="col-xs-4 no-padding">
										<select id="alt-currency" className="form-control" data-field="*{altCurrency}">
											<option value=""></option>
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
											<option value="GBP">GBP</option>
											<option value="RUB">RUB</option>
											<option value="CZK">CZK</option>
										</select>
									</div>
								</div>
								{/*
								<span id="alt-price.errors" class="help-block" th:if="${#fields.hasErrors('altPrice')}" th:each="error : ${#fields.errors('altPrice')}" th:text="${error}"></span>
								<span id="alt-currency.errors" class="help-block" th:if="${#fields.hasErrors('altCurrency')}" th:each="error : ${#fields.errors('altCurrency')}" th:text="${error}"></span>
								*/}
							</div>
						</div>
						
						<div className="form-group form-group-sm" data-classappend="${#fields.hasErrors('buyerId') ? 'has-error' : ''}">
							<label htmlFor="buyer" className="control-label col-sm-3" data-text="#{t_buyer}">
								Buyer
							</label>
							<div className="col-sm-6">
								<select id="buyer" className="form-control" data-field="*{buyerId}">
									<option value="" data-text="#{t_not_chosen_masculine}">Not chosen</option>
									{/*
										<th:block th:each="item : ${buyers}">
											<optgroup th:if="${not #lists.isEmpty(item.children)}" th:label="${item.name}">
												<option th:each="buyer : ${item.children}"
													th:value="${buyer.value}"
													th:text="${buyer.name}"
													th:selected="${addSeriesSalesForm.buyerId != buyer.value}">
												</option>
											</optgroup>
											<option th:if="${#lists.isEmpty(item.children)}"
												th:value="${item.value}"
												th:text="${item.name}"
												th:selected="${addSeriesSalesForm.buyerId != item.value}">
											</option>
										</th:block>
									*/}
									<optgroup label="Musicians">
										<option value="1">Kurt Cobain</option>
										<option value="2">Michael Jackson</option>
									</optgroup>
								</select>
								<small data-authorize="hasAuthority('ADD_PARTICIPANT')">
									<span className="hint-block" data-utext="#{t_add_buyer_hint(@{${ADD_PARTICIPANT_PAGE}(buyer=true)})}">
										You can also <a tabIndex="-1" href="../participant/add.html?buyer=true">add a new buyer</a>
									</span>
								</small>
								{/*
								<span id="buyer.errors" class="help-block" th:if="${#fields.hasErrors('buyerId')}" th:each="error : ${#fields.errors('buyerId')}" th:text="${error}"></span>
								*/}
							</div>
						</div>
						
						<div className="form-group form-group-sm">
							<div className="col-sm-offset-3 col-sm-4">
								<input type="submit" className="btn btn-primary" value="Add info" data-value="#{t_add_info}" />
							</div>
						</div>
						
					</form>
				</div>
			</div>
		)
	}
}
