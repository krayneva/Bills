	 var def;
function updateLoginPage(){
	try{
/*	(getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT)).done(function(res){
			document.getElementById('login').value = res;
		});
	getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT).done(function(res){
		document.getElementById('password').value= res;
	});
*/
	//var login =  window.localStorage.getItem(SETTING_USER_LOGIN);




	var login =  getSettingFromStorage(SETTING_USER_LOGIN,"");
	$('#login').val(login);
	var password = getSettingFromStorage(SETTING_USER_PASSWORD,"");
	$('#password').val(password);
    
	 if ( $("#login").length==0)$('#login').focus();
	 else
		 $('#login_button').focus();
	     
	  $('#login').bind("keydown", function(e) {
	    
	     if (e.which == 13) 
	 	    { //Enter key
	 	      e.preventDefault(); //Skip default behavior of the enter key
	 	        $('#password').focus();
	 	        var n = $("#password").length;
	 	      // setCaretToPos($("#password"),$("#password").length);

	 	    }
	 	  });
	 	 
 	   

	  $('#password').bind("keydown", function(e) {
		     if (e.which == 13) { 
		 	      e.preventDefault();
		 	        $('#login_button').click();
		 	    }
		 	  });

	$('.ui-input-reg').parent().addClass('ui-register-input');
	$('.ui-input-reg-promo').parent().addClass('ui-register-input-promo');
	   $(document).on("blur", "#registerPage input[type='email']", function()
		    	{
		    		var val = $(this).val();
		    		if(val.length <= 0)
					{
						$(this).parent().removeClass('valid');
		    			$(this).parent().removeClass('error');
		    			return 0;
					}

		    		if(val.search('@') > 0)
		    		{
		    			$(this).parent().addClass('valid');
		    			$(this).parent().removeClass('error');
		    		}
		    		else
		    		{
		    			$(this).parent().addClass('error');
		    			$(this).parent().removeClass('valid');
		    		}

		    	});
			$(document).on("focus", "#registerPage input[type='email']", function()
					{
						$(this).parent().removeClass('valid');
						$(this).parent().removeClass('error');
					});


		    $(document).on("blur", "#registerPage input[type='password']",function()
		    {
		    	var len = $(this).val().length;


				if(len <= 0)
				{
					$(this).parent().removeClass('valid');
					$(this).parent().removeClass('error');
					return 0;
				}
				else if(len > 0 && len < 5)
				{
					$(this).parent().removeClass('valid');
					$(this).parent().addClass('error');
				}
				else
				{
					$(this).parent().removeClass('error');
					$(this).parent().addClass('valid');
				}
		    });
			$(document).on("focus", "#registerPage input[type='password']", function()
				{
					$(this).parent().removeClass('valid');
					$(this).parent().removeClass('error');
				});
	}
	
	
    catch(e){
    	dumpError("updateLoginPage",e);
    }

}


function requestAndUpdateMainPage(){
	try{
		requestUserEnvironment().done(function(){
			updateMainPage();
		});
	}
    catch(e){
    	dumpError("requestAndUpdateMainPage",e);
    }

}



function updateMainPage(){
	try{
		getUserEnvironment().done(function(res){
			if (debugMode==true)
			console.log("Update main page json :"+res);
			if (res=="") {
				console.log("updateMainPage: requesting environment From server");
				requestAndUpdateMainPage();

			}
			else{
				var json = jQuery.parseJSON(res);


				var incomeRublesTD = document.getElementById("incomeRublesTD");
				var incomeDollarsTD = document.getElementById("incomeDollarsTD");
				//var incomeEurosTD = document.getElementById("incomeRublesTD");


				var showRublesIncome = json.IsAmount1Visible;
				var showDollarsIncome = json.IsAmount2Visible;
				//var showEurosIncome = json.IsAmount3Visible;

				if (showRublesIncome===true){
					incomeRublesTD.style.display = "block";
					var incomeRubles = document.getElementById("incomeRubles");
					incomeRubles.innerHTML = json.Amount1;

				}
				else{
					incomeRublesTD.style.display = "none";
				}


				if (showDollarsIncome===true){
					incomeDollarsTD.style.display = "block";
					var incomeDollars = document.getElementById("incomeDollars");
					incomeDollars.innerHTML = json.Amount2;

				}
				else{
					incomeDollarsTD.style.display = "none";
				}



				var expenses = document.getElementById("expenses");
				expenses.innerHTML = json.ExpencesAmountStr;


				updateWidgets();
				}
			});
	}
    catch(e){
    	dumpError("UpdateMainPage",e);
    }

}



function requestAndUpdateTransactionPage(){
	try{
		var deferred = $.Deferred();
		requestTransactions().done(function(){
			 requestTransactionPageCount = requestTransactionPageCount+1;
			 updateTransactionPage().done(function(){
				deferred.resolve();
			});
		});
		return deferred;
	}
    catch(e){
    	dumpError("requestAndUpdateTransactionPage",e);
    }
}

	 function updateTransactionPageUsingFav(){
		 var isFav =  window.localStorage.getItem(TRANSACTIONS_FAVOURITES);
		// alert("isFav is "+isFav);
		 if ((isFav==true)|(isFav=="true")){
			 window.localStorage.setItem(TRANSACTIONS_FAVOURITES,false);
			 $('#favButton').removeClass("transactionIsFavorites-true")
			 $('#favButton').addClass("transactionIsFavorites-false")
		 }
		 else{
			 window.localStorage.setItem(TRANSACTIONS_FAVOURITES,true);
			 $('#favButton').removeClass("transactionIsFavorites-false")
			 $('#favButton').addClass("transactionIsFavorites-true")
		 }
		 updateTransactionPage();
	 }


function updateTransactionPage(){
	try{
		var deferred = $.Deferred();
		var start = new Date().getTime();
		$('#title').html('');
		$('#checkCount').html('');
		$("#total").html('');
		getTransactions().done(function(result){
			if ((result.rows.length==0)&(requestTransactionPageCount==0)){
				requestAndUpdateTransactionPage();
				return;
			}
			else{
				deferred.resolve();
				return;
			}
		});
		var end1 = new Date().getTime();
		var time = end1 - start;
		console.log('updateTransactionpage 1 time: ' + time);

		 var categoryID =  window.localStorage.getItem(CATEGORY_ID_KEY);
		 getWidget(categoryID).done(function(result){
			  var json = jQuery.parseJSON(result);
			  var titleHTML ='<span class="ui-btn ui-icon-coctail"></span>'	+ json.Name
			  $('#title').html(titleHTML);
			});
			var period =$("#periodSelect").val();
			$("#periodSelect").change(function () {
				$('#expensesList').html("");
				updateTransactionPage();
			});
			if (period==undefined) period ="month";
		//	alert("period is  "+period);

			getTransactionsByCategoryIDAndPeriod(categoryID, period).done(function(result){
				var tagArray = new Array();
                var tagCounter = 0;
				var start = +new Date();  // log start timestamp
	            var totalAmount = 0;
	            var lastAmount = 0;
				var checkCount = result.rows.length;
				$('#checkCount').html(checkCount);

	            if (result.rows.length>0)
	            	lastAmount = jQuery.parseJSON(result.rows.item(0).transactionJSON).Amount;
	            var listHTML = "";
				  for (var i = 0; i <result.rows.length; i++) {

					  var row = result.rows.item(i);
					  var html = $('#transactionRowTemplate').html();
					  
					  var jsonText = row.transactionJSON;
					  console.log(jsonText);
					  var json =  jQuery.parseJSON(jsonText);
					  var date = new Date(json.TransactionDate);
					  var currency = json.Currency;
					  var hours = date.getHours();
					  var minutes = date.getMinutes();
					  var month = date.getMonth()+1;
					  var day =  date.getDate();
					  var year = date.getYear()+1900;




					  html = html.replace(/\{transactionDate\}/g,(day<10?'0':'')+day+"."+(month<10?'0':'')+month+"."+year);
					  html = html.replace(/\{transactionTime\}/g,(hours<10?'0':'')+hours+":"+(minutes<10?'0':'')+minutes);
					  html = html.replace(/\{transactionPrice\}/g,formatPrice(json.Amount)+getCurrencyString(json.Currency));
					  html = html.replace(/\{transactionName\}/g,json.Name==null?"":json.Name);
					//  html = html.replace(/\{transactionName\}/g,row.searchText);
					  console.log("search text is "+row.searchText);
					  html = html.replace(/\{transactionID\}/g,json.Id);
					  html = html.replace(/\{searchText\}/g,row.searchText);
					  var style = 'false';
					  if ((row.isFav==1)||(row.isFav=='1')){
						  style = 'true';
					  }


					  html = html.replace(/\{isFavorites}/g,style);





					 	var tagKeys = "";

					 	for (var j=0; j<json.receiptData.Items.length; j++){

							tagArray[tagCounter] = json.receiptData.Items[j].Tag;
							tagCounter=tagCounter+1;
							var tagValue = fullTagsArray[hashCode(json.receiptData.Items[j].Tag)];
							if (tagKeys.indexOf(tagValue) <0){
								tagKeys+= tagValue;
								if (j!=json.receiptData.Items.length-1)
									tagKeys = tagKeys+", ";
								}

					 	}

						html = html.replace(/\{transactionTags\}/g,tagKeys);
						listHTML = listHTML+html;

						totalAmount=totalAmount+json.Amount;

					};
				$("#total").html(formatPrice(totalAmount));
			/*	for (var j=0; j<tagArray.length; j++){
                	getTagName(tagArray[j],j,tagArray.length).done(function(res, src,position,len){
	                   	listHTML = listHTML.replace(src,res);

                    		if (position==len-1)$('#expensesList').html(listHTML);
                    	});
                   }
*/
				$('#expensesList').html(listHTML);
				var end =  +new Date();  // log end timestamp
				var diff = (end - start)/(20*result.rows.length);
				console.log("Time per row: "+diff);

  			});
			var end2 = new Date().getTime();
			var time = end2 - start;
			console.log('updateTransactionpage 2 time: ' + time);
			return deferred;
	}
    catch(e){
    	dumpError("updateTransactionPage",e);
    }

}





function updateWidgets(){
	try{
		getWidgets().done(function(res){
			for (var j=0;j<res.rows.length;j++){
			var w = jQuery.parseJSON(res.rows.item(j).json);

			if (w.Type==0) continue;
			  //var w = json.Widgets[k];
			 // alert("Widget "+w.Name+" left: "+w.Left+" top:"+w.Top+" interest:"+w.Percent);
			  var widget = document.getElementById("widget".concat(w.Left,w.Top));
			
			 widget.style.display = "block";
			 widget.style.visibility = "visible";
			 //console.log("Setting categoryID for widget: "+w.VisualObjectId);
			 widget.setAttribute("categoryID", w.VisualObjectId);
			 var s = "showExpensesPage('"+ w.VisualObjectId+"')";
			 //console.log("Setting onclick categoryID "+s);
			 widget.setAttribute("onclick",s);
			  var arr=widget.childNodes;
			  for (var i=0;i<arr.length;i++){
		            if (arr[i].id == "interest"){
		                   arr[i].innerHTML = w.Percent.replace(/\s/g, '');//+" "+w.Name;
		            }
		            if (arr[i].id == "icon"){
		            	var src = "img/";
		            	if (debugMode==true){
		            		console.log("GOT ICON IDENTIFIER "+w.IconIdentifier+" for kind "+w.Kind );
		            	}
		            	switch(w.IconIdentifier){
		            	
			            	case "ico_purse":
			            		src = src.concat("cash396.png");
			            		break;
			            	case "ico_food":
			            		src = src.concat("food396.png");
			            		break;
			            	case "ico_medicine":
			            		src = src.concat("medicine396.png");
			            		break;
			            	case "ico_education":
			            		src = src.concat("education396.png");
			            		break;
			            	case "ico_entertainment":
			            		src = src.concat("entertainment396.png");
			            		break;
			            	case "ico_house":
			            		src = src.concat("house396.png");
			            		break;
			            	case "ico_auto":
			            		src = src.concat("auto396.png");
			            		break;
			            	case "ico_other":
			            		src = src.concat("other396.png");
			            		break;
			            	case "ico_clothing":
			            		src = src.concat("clothing396.png");
			            		break;
			            	default:
			            		src = src.concat("food396.png");
			            		console.log("GOT ICON IDENTIFIER "+w.IconIdentifier);
			            		break;
		            	}
		            //	console.log("Setting src="+src,"iconID: ");//+w.IconIdentifier);
		                arr[i].setAttribute("src",src);
		            }
			  }
			//  console.log("Widget "+w.WidgetID+" left: "+w.Left+" top:"+w.Top+" interest:"+w.Percent);
			}
	
		});
	}
    catch(e){
    	dumpError("updateWidgets",e);
    }
	
}




function updateTransactionInfoPage(){
	try{
		var transactionID = window.localStorage.getItem(TRANSACTION_ID_KEY);
		
		getTransaction(transactionID).done(function(res){
			var json = jQuery.parseJSON(res.rows.item(0).transactionJSON);
			$('#category').html("Категория: "+json.Category);
			if (json.Name!=null)
				$('#name').html("Наименование: "+json.Name);
			$('#subcategory').html("Подкатегория: "+json.SubCategory);
			$('#id').html("Идентификатор: "+json.Id);
			$('#createdAt').html("Дата создания: "+json.CreatedAt);
			$('#currency').html("Валюта "+ getCurrencyString(json.Currency));
			$('#transactionDate').html("Дата транзакции: "+json.TransactionDate);
			$('#amount').html("Сумма "+json.Amount);
			
			var listHTML = "";
			  $('#tableTransactionInfo > tbody').html("");
			 for (var i=0; i<json.receiptData.Items.length; i++){
				var html="<tr><td>{goodName}</td><td>{goodCount}</td><td>{goodPrice}</td><td>{goodTotalPrice}</td><td>{goodTag}</td></tr>" ;
				 html = html.replace(/\{goodName\}/g,json.receiptData.Items[i].ItemName);
				 html = html.replace(/\{goodCount\}/g,json.receiptData.Items[i].Quantity);
				 html = html.replace(/\{goodPrice\}/g,json.receiptData.Items[i].PricePerUnit);
				 html = html.replace(/\{goodTotalPrice\}/g,json.receiptData.Items[i].Value);
				 html = html.replace(/\{goodTag\}/g,json.receiptData.Items[i].Tag);

				 listHTML+=html;
			 }
	
			  $('#tableTransactionInfo > tbody').append(listHTML);
			  $("#tableTransactionInfo").table("refresh");
		
		});
	}
    catch(e){
    	dumpError("updateTransactionInfoPage",e);
    }
}
	
	
	
function updateShopListsPage(reloadFromBase){
	try{
		 var currentShopList = window.localStorage.getItem("CurrentShopListNum");
		 if (currentShopList==undefined) {
			 currentShopList = 0;
			 window.localStorage.setItem("CurrentShopListNum",0);
		 }
		 currentShopList = parseInt(currentShopList);
		 console.log("CurrentShopList: "+currentShopList);
		 
		 getShopLists().done(function(res){
			for (var i=0; i<res.rows.length; i++){
				if (debugMode==true){
					console.log("shop list num: "+i);
					console.log("shop list id: "+res.rows.item(i).id);
					console.log("shop list name: "+res.rows.item(i).name);
					console.log("shop list fullJSOn: "+res.rows.item(i).fullJSON);
					console.log("shop list itemJSON: "+res.rows.item(i).itemJSON);
				}
			} 
		 });
		
		getShopLists().done(function(res){
		//	alert("count of shoplists: "+res.rows.length);
			  var listName = res.rows.item(currentShopList).name;
			//  alert("id of list: "+ res.rows.item(currentShopList).id);
			  $('#shopListName').html(listName);	
			  $('#ShopListList').html('');
			  $('#ShopListList').listview('refresh');
			  $('#alreadyBoughtList').html('');
			  $('#alreadyBoughtList').listview('refresh');
			  window.localStorage.setItem("ShopListID",res.rows.item(currentShopList).id);


			 var itemsString = window.localStorage.getItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id);

			  if ((itemsString==undefined)|(reloadFromBase)){
				 var itemsJSON =  jQuery.parseJSON(res.rows.item(currentShopList).itemsJSON);

				 var oldJSON = jQuery.parseJSON(itemsString);
				 if (itemsJSON!=null)
				  for (var i = 0; i < itemsJSON.length; i++){
					  if ((itemsString!=undefined)&(oldJSON!=undefined)){
						  for (var j=0; j< oldJSON.length; j++){
							  if (itemsJSON[i].Value==oldJSON[j].Value){
								 //alert(itemsJSON[i].value+" "+oldJSON[j].value);
								  itemsJSON[i].bought = oldJSON[j].bought;
							  }
						  }
					  }
					  
					  else if ( itemsJSON[i].bought ==undefined)
						  itemsJSON[i].bought ="0";
				  }
				
				window.localStorage.setItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id,JSON.stringify(itemsJSON));
			  }
			itemsJSON = jQuery.parseJSON(window.localStorage.getItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id)); 
			//alert(JSON.stringify(bought))	  ;

			 // alert ("ID of shopList: "+res.rows.item(0).id);
			if (itemsJSON!=null){
			console.log("Start running through itemsJSON,count:  "+itemsJSON.length);
			for (var k=0; k<itemsJSON.length; k++) {
				console.log("Running through itemsJSON "+k);
		  		  var item  = itemsJSON[k];
	      		  var tag = item.Tag;
	      		  var value = item.Value;
	       		  var quantity = item.Quantity;
	       		  var measure = item.Measure;
	       		  var color = item.Color;
	       		  var bought = item.bought;
	       		  if (debugMode==true){
		       		  console.log('Item: '+k);
		       		  console.log('Tag: '+tag);
		       		  console.log('Value: '+value);
		       		  console.log('Quantity: '+quantity);
		       		  console.log('Measure: '+measure);
		       		  console.log('Color: '+color);
	       		  }

	       		  console.log('Bought: '+bought);
	       		if (bought=="0")	{
		       		  var listrow = document.getElementById("shopListRow").cloneNode(true);
		       		  var style = "shopList_group_darkRed";
		       		  switch(color){
		       		  case 1:
		       			  style = "shopList_group_yellowGreen";
		       			  break;
		       		  case 2:
		       			  style = "shopList_group_darkRed";
		       			  break;
		       		  case 3:
		       			 style = "shopList_group_yellow";
		       			  break;
		       		  case 4:
		       			 style = "shopList_group_saddleBrown";
		       			  break;
		       		  case 5:
		       			 style = "shopList_group_lightSeaGreen";
		       			  break;
		       		  default:
		       				 break;
		       		  }
		       		  listrow.setAttribute("id", "listrow"+k);
		       		  listrow.setAttribute("pos", k);
					  listrow.setAttribute("class",style);
					  listrow.style.display = "block";
					  listrow.style.visibility = "visible";
					
					
					  for (var i=0; i<listrow.childNodes.length; i++){
					  		if (listrow.childNodes[i].id=="itemTag"){
					  			listrow.childNodes[i].innerHTML = value;
					  			listrow.setAttribute("key",value);
					  			listrow.setAttribute("pos",k);	
							}
							if (listrow.childNodes[i].id=="itemQuantity"){
					  			listrow.childNodes[i].innerHTML = quantity;
							}
							if (listrow.childNodes[i].id=="itemUnit"){
					  			listrow.childNodes[i].innerHTML = measure;
							}

				  			//alert("ID of child : "+listrow.childNodes[i].id+" type: "+listrow.childNodes[i].type);
					  }
					 
					  $('#ShopListList').append(listrow);
	       		  }

	       		  else{
		       		  var listrowBought = document.getElementById("alreadyBoughtRow").cloneNode(true);
		       		  listrowBought.setAttribute("id", "listrowBought"+k);
		       		  listrowBought.setAttribute("pos",k);
					  listrowBought.style.display = "block";
					  listrowBought.style.visibility = "visible";
					  for (var i=0; i<listrowBought.childNodes.length; i++){
					  		if (listrowBought.childNodes[i].id=="itemTag"){
					  			listrowBought.childNodes[i].innerHTML = value;
							}
							if (listrowBought.childNodes[i].id=="itemQuantity"){
					  			listrowBought.childNodes[i].innerHTML = quantity;
							}
							if (listrowBought.childNodes[i].id=="itemUnit"){
					  			listrowBought.childNodes[i].innerHTML = measure;
							}
				  			//alert("ID of child : "+listrow.childNodes[i].id+" type: "+listrow.childNodes[i].type);
					  }
					  $('#alreadyBoughtList').append(listrowBought);
					  $( "#listrowBought"+k).on( "tap",function(e){
				          e.preventDefault();
				          e.stopPropagation();
						 var items =  jQuery.parseJSON(window.localStorage.getItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id));
						 items[this.getAttribute("pos")].bought = "0";
						 updateShopList(window.localStorage.getItem('ShopListID'), items);
						 window.localStorage.setItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id,JSON.stringify(items));
						  updateShopListsPage(true);
					 });
	       		  }
			}
			}
			
			 $('#ShopListList').listview('refresh');
			 $('#alreadyBoughtList').listview('refresh');

			 

			 for (var i=0; i<itemsJSON.length; i++){
					 $( "#listrow"+i).on( "swiperight",swiperightHandler);
					 $( "#listrow"+i).on( "tap",function(e){
				          e.preventDefault();
				          e.stopPropagation();
						 var items =  jQuery.parseJSON(window.localStorage.getItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id));
						 items[this.getAttribute("pos")].bought = "1";
						 updateShopList(window.localStorage.getItem('ShopListID'), items);
						 window.localStorage.setItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id,JSON.stringify(items));
						 updateShopListsPage(true);
						 return false;
					 });
			
			 }
			 
		});

		 
		  $("#autocomplete").html('');

		 getGoodItems().done(function(res){
			 	//alert("goods items count: "+res.rows.length);
			  for (var i=0; i<res.rows.length; i++){
				  var row = res.rows.item(i);
			//	  $('#autocomplete').append("<li class = 'autoLi' measure='"+row.measure+"' onclick ='onAutoCompleteRowClick()'>"+row.value+"</li>");
				  $('#autocomplete').append("<li id='autoRow"+i+"'class = 'autoLi' measure='"+row.measure+"'>"+row.value+"</li>");
			  }
		
		
			 $( "#autocomplete").hide();
			 
			 $( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
			        var $ul = $( this ),
			            $input = $( data.input ),
			            value = $input.val();
			           
			        	//$ul.html( "" );
			        if ( value && value.length > 1 ) {
			        	 $( "#autocomplete").show();
			        	
			        }
			    });
	
			 $('#autocomplete').listview('refresh');
			 $(".autoLi").click(function(){
			//	 alert("autoLiclick");
				 var measureId = this.getAttribute("measure");
				 var measure = MeasureEnum[measureId].valueRus;
				 var amount = MeasureEnum[measureId].defaultAmount;
				 var value = this.innerHTML;
				 if (measure!=undefined){
					 value = value+" "+amount+" "+measure;
				 }
				 $( "#inset-autocomplete-input").val(value);
				 $( "#autocomplete").hide();
				 $("#pageShopList").css({'top': 0});
				 return false;
			 });
		 
	
	/*   $("#inset-autocomplete-input").bind('focus', function(e){
		//   alert("focus event caught! "+keyboardHeight+" "+$("#inset-autocomplete-input").offset.top());
		   alert("keyboardHeight: "+keyboardHeight);
		 // if ((keyboardHeight!=0)&(($("#inset-autocomplete-input").offset.top()+$("#inset-autocomplete-input").height())>($("#pageShopList").height()-keyboardHeight-100)))
				$("#pageShopList").css({'top': -keyboardHeight});
		   });
		   
	   $("#inset-autocomplete-input").bind('blur', function(e){
		   alert("blur");
		   $("#pageShopList").css({'top': 0});
		   return true;
		 //  $( "#autocomplete").hide();
		  });
*/
		 });
	}
    catch(e){
    	dumpError("updateShopListPage",e);
    }
}
	
	
	function onAutoCompleteRowClick(){
		alert(this.innerHTML);
	}
	
	
	
	function swiperightHandler(event){
		try{	
			var row = $("#"+this.id);
			 row.animate({left: $(window).width()},{duration:1000, 
				 complete: function() {
					    removeFromShopList(window.localStorage.getItem('ShopListID'),this.getAttribute("key")).done(
								function (res){
									updateShopListsPage(true);
								});
			    }
	
			 });
		}
	    catch(e){
	    	dumpError("swipeRightHandler",e);
	    }
	  }
	
	function nextShopList(event){
		try{
			event.preventDefault();
	        event.stopPropagation();
			var currentShopList = window.localStorage.getItem("CurrentShopListNum");
			getShopLists().done(function(res){
				 var listID = res.rows.item(parseInt(currentShopList)).id;
				 sendShopList(listID);
			
				getShopListCount().done(function(count){
		//			alert("count of shop lists: "+count);
					currentShopList = (parseInt(currentShopList))+1;
					
					
					
					if (currentShopList==count)
						currentShopList = 0;
					window.localStorage.setItem("CurrentShopListNum", currentShopList);
					console.log("CurrentShopList: "+currentShopList+" count: "+count);
					clearBoughtItems(window.localStorage.getItem('ShopListID'));
					updateShopListsPage(true);
					return false;
				});
				
			});
		}
	    catch(e){
	    	dumpError("nextShopList",e);
	    }
	}
	
	function previousShopList(event){
		try{
			event.preventDefault();
	        event.stopPropagation();
			var currentShopList = window.localStorage.getItem("CurrentShopListNum");
			getShopLists().done(function(res){
				 var listID = res.rows.item(parseInt(currentShopList)).id;
				 sendShopList(listID);
		
			
				getShopListCount().done(function(count){
					currentShopList = (parseInt(currentShopList))-1;
					if (currentShopList==-1)
						currentShopList = count-1;
					window.localStorage.setItem("CurrentShopListNum", currentShopList);
					console.log("CurrentShopList: "+currentShopList+" count: "+count);
					clearBoughtItems(window.localStorage.getItem('ShopListID'));
					updateShopListsPage(true);
					return false;
				});
			});
		}
	    catch(e){
	    	dumpError("previousShopList",e);
	    }
	}
	
	
	function showShopListByNumber(number){
		try{
			var currentShopList = window.localStorage.getItem("CurrentShopListNum");
			getShopLists().done(function(res){
				 var listID = res.rows.item(parseInt(currentShopList)).id;
				 sendShopList(listID).done(function(res){
						window.localStorage.setItem("CurrentShopListNum",number);
						//	console.log("CurrentShopList: "+number+" count: "+count);
							clearBoughtItems(window.localStorage.getItem('ShopListID'));
							$( "#mypanelShopList" ).panel( "close" );
							updateShopListsPage(true);
					 
				 });
			});
		}
	    catch(e){
	    	dumpError("showShopListByNumber",e);
	    }
	}
	
	function closeShopListsPage(){
		try{
			getShopLists().done(function(res){
				for (var i=0; i<res.rows.length;i++){
					var row = res.rows.item(i);
					window.localStorage.removeItem("ShopListAlreadyBought"+row.id);
				}
			});
		}
	    catch(e){
	    	dumpError("closeShopListsPage",e);
	    }
	}
	
	
	function clearBoughtItems(listID){
		try{
			window.localStorage.removeItem("ShopListAlreadyBought"+listID);
		}
	    catch(e){
	    	dumpError("clearBoughtItems",e);
	    }
	}


       function updateCheckPage(){

           try{

            	var receiptID = window.localStorage.getItem(RECEIPT_ID_KEY);
        		var transactionID = window.localStorage.getItem(TRANSACTION_ID_KEY);
        		$('#sendFeedbackButton').click(function()
                           {
                           var mark=5;

                           		    $("input[name*=level]:checked").each(function() {
                                        mark = $(this).val();
                                    });

                            		sendFeedback(receiptID,3,$('#commentForProggers').val(),$('#select-native-3').val())
                            		.done(function(){
                            				$('#modal').hide();
                                            $('.my-modal').hide();
                            		});
                                });
				$('#okButton').click(function(){
				      		$('#modal').hide();
                        				$('.my-modal').hide();
				});

               	getTransaction(transactionID).done(function(res){
                			var js = jQuery.parseJSON(res.rows.item(0).transactionJSON);
                			var row = res.rows.item(0);
                			 var jsonText = row.transactionJSON;
                			 if ((js.Coords!=undefined)&(js.Coords!=null)&(js.Coords!="null")) {
								 var lat = js.Coords.Latitude;
								 var lon = js.Coords.Longitude;
								 window.localStorage.setItem(LATITUDE_KEY, lat);
								 window.localStorage.setItem(LONGITUDE_KEY, lon);
								 preInitMap();
							 }

					 	  var now = new Date();
                        $('#checkName').html(js.Name==null?"":js.Name);
            			$('#shopName').html(js.Shop==null?"":js.Shop);
            			$('#shopName2').html(js.Shop==null?"":js.Shop);

            

               
               //subcategorys and purses

              refreshSubCategoryCombo(js.SubCategory);

					var html13 = $('#categoryRowTemplate').html();
				//------------combobox for category-----------////////
					$('#select-native-0').html('');
					getCategoryName(js.Category).done(function(categoryName){
						html13 = html13.replace(/\{catName\}/g,categoryName);
						html13 = html13.replace(/\{catValue\}/g,js.Category);
						$('#select-native-0').append(html13);

						getCategories().done(function(res){
								for (var j=0;j<res.rows.length;j++){
									if (js.Category==res.rows.item(j).id) continue;
									var html111 = $('#categoryRowTemplate').html();
									html111 = html111.replace(/\{catName\}/g,res.rows.item(j).name);
									html111 = html111.replace(/\{catValue\}/g,res.rows.item(j).idtext);
									$('#select-native-0').append(html111);
									if (j==res.rows.length-1){
										$("#select-native-0 option:first").attr('selected','selected');
										$('#select-native-0').selectmenu("refresh", "true");
									}
								}
							});
					});
					$('#select-native-0').change(function() {
						changeCategory(transactionID, $('#select-native-0').val()).done(function(){
							getFirstSubCategory($('#select-native-0').val()).done(function (res){
								refreshSubCategoryCombo(res);
							});

						});

					});

					///----------------------------------------//



                 var html2 = $('#purseRowTemplate').html();
                 html2 = html2.replace(/\{purseName\}/g,"Кошелёк");
                 $('#select-native-2').html(html2);
  				 $('#select-native-2').selectmenu( "refresh" );

				// tags
				 
                
                $('#tagsList').html('');
                 for (var k=0; k<js.Tags.length; k++){
						 var html3 = $('#tagRowTemplate').html();
						 html3 = html3.replace(/\{tagName\}/g,fullTagsArray[hashCode(js.Tags[k])]);
						$('#tagsList').append(html3);
                 }



				//checkDetails
				var tableHTML="";
				$("#checkDetailstable > tbody").html('');
				for (var p=0; p< js.receiptData.Items.length; p++){
					var html5='<tr class="one-detail"><td>{positionName}</td><td><span>{positionCost}</span></td><td>{positionTag}</td></tr>' ;

					html5 = html5.replace(/\{positionName\}/g,js.receiptData.Items[p].ItemName);
					html5 = html5.replace(/\{positionCost\}/g,formatPrice(js.receiptData.Items[p].Value));
					html5 = html5.replace(/\{positionTag\}/g,fullTagsArray[hashCode(js.receiptData.Items[p].Tag)]);
						$('#checkDetailstable > tbody').append(html5);



				}

			$('#spent').html(formatPrice(js.receiptData.Total));
            $('#spent2').html(formatPrice(js.receiptData.Total));
            // tax
            $('#discount').html("Скидка "+formatPrice(js.receiptData.TotalTax) +" "+getCurrencyString(js.Currency));
            $('#discount2').html(formatPrice(js.receiptData.TotalTax));
 			 $("#checkDetailstable").table("refresh");

		       });


	//$( "#table" ).table( "rebuild" );
		var flag = false;
        		$('.buttons-container button').click(function()
        		{
        			var id = $(this).data('href');
        			$('.check-tab').hide();
        			$(id).show();

        			$('.active-icon-tab').removeClass('active-icon-tab');
        			$(this).addClass('active-icon-tab');

        			takeHeight();

        			if(id == '#check-map')
        			{
        				if(flag) return 0;

        				flag = true;
        				initMap();

        			}
        			if (id== '#check-photo'){
        			var receiptID = window.localStorage.getItem(RECEIPT_ID_KEY);
        			var now2 = new Date();
        			     window.resolveLocalFileSystemURL(receivedPhotoDir +receiptID,
                         	function success(fileEntry){
                         	//	alert("success");
                            	$('#checkImage').attr('src',receivedPhotoDir +receiptID+ '?' + now2.getTime());
                               },
                       function fail(error){
                       		getImage(receiptID).done(function(res){
                       			//alert("getImage done!");

                          		$('#checkImage').attr('src',receivedPhotoDir +receiptID+ '?' + now2.getTime());
                         	});
                         });
                    }
        		});


        		$(document).ready(function()
        		{
					$('#select-native-0-button').prepend('<img src="images/img.jpg" alt="">');
        			$('#select-native-1-button').prepend('<img src="images/img.jpg" alt="">');
        			$('#select-native-2-button').prepend('<img src="images/cash.png" alt="">');

        			$( "#modal" ).dialog({
        				autoOpen: false,
        				modal: true,
        				show: {
        			        effect: "blind",
        			        duration: 1000
        			    },
        			    hide: {
        			        effect: "explode",
        			        duration: 1000
        			    }
        			});

        			takeHeight();
        		});

        		$('.message').click(function()
        			{

        				requestFeedback(receiptID).done(function(res){
        				 	$.mobile.loading("hide");
        					// no existing feedback
 							if (res=='null'){
								$('#modal').show();
								$('#createFeedbackDialog').show();
 							}
        					// show existing feedback
        					else{
							//	alert(res);
								var json = jQuery.parseJSON(res);
								$('#modal').show();
								$('#showFeedbackDialog').show();
								$("#comment").html(json.Remark);
								var nowdate = new Date();
								if (json.Mark==1) $('#markImage').addClass('myimage1');
								if (json.Mark==2) $('#markImage').addClass('myimage2');
								if (json.Mark==3) $('#markImage').addClass('myimage3');
								if (json.Mark==4) $('#markImage').addClass('myimage4');
								if (json.Mark==5) $('#markImage').addClass('myimage5');

								if (json.Reason==1)$("#reason").html('Все хорошо, спасибо вам, разработчики!');
								if (json.Reason==2)$("#reason").html('Не распознались итоги или скидки');
								if (json.Reason==3)$("#reason").html('Не распознались покупки');
								if (json.Reason==4)$("#reason").html('Не определился магазин');
								if (json.Reason==5)$("#reason").html(' Низкое качество фотографии');
								if (json.Reason==200)$("#reason").html('Другое');
								//$('#markImage').attr('src',receivedPhotoDir +receiptID+ '?' + now.getTime());

								if (json.State=1)$("#state").html('Новый отзыв');
								if (json.State=2)$("#state").html('Рассмотрен, предприняты некоторые действия и закрыт');
								if (json.State=3)$("#state").html('В работе. Необходимо доработать систему');

								if (json.Reaction==null)$("#reaction").html('Нет ответа');
								else $("#reaction").html(json.Reaction);
        					};
        				});
        			});

        		$(document).on('click','#modal',function(event)
        			{
        				$('#modal').hide();
        				$('.my-modal').hide();
        			});


           }
            catch(e){
                dumpError("updateCheckPage",e);
            }
    
            }



	function updateHabitsPage(tab){
		requestBadHabits().done(function(){
			getBadHabits().done(function(res){
				console.log("Bad habits json is: "+res);
				updateHabitsTab(tab,jQuery.parseJSON(res));
			});
		});
	}


	 function updateHabitsTab(tab, json){
		 var spentString="";
		 var measure = "";
		 var tabHeader="";
	//	 alert("habit json.BulkList.length "+JSON.stringify(json.BulkList)+"   "+json.BulkList.length);
		 if (tab==1) {
			 spentString = "Потрачено на выпивку:";
			 tabHeader = "ВЫПИТО";
			 measure = "л.";
		 }
		 if (tab==2) {
			 spentString = "Потрачено на курение:";
			 tabHeader = "ВЫКУРЕНО";
			 measure = "";
		 }
		 if (tab==3) {
			 spentString = "Потрачено на сладости:";
			 tabHeader = "СЪЕДЕНО";
			 measure = "гр.";
		 }

		 $("#spentHeader1").html(spentString);
		 $("#spentHeader2").html(spentString);
		 $("#spentHeader3").html(spentString);

		 $("#header").html(tabHeader);

		 $("#citate").html(getRandomCitate());
	//	 console.log('habit created onjects');
			var monthJson = new Object();
		 	var yearJson = new Object();
		 	var futureJson= new Object();

	//	 console.log('habit created onjects');
		 for (var i=0; i<json.BulkList.length; i++){

			 var j = json.BulkList[i];

			 if (j.BulkType==tab) {
				 if (j.Period == 1) {
				 	monthJson = j;
					continue;
			 	}
				 if (j.Period == 2) {
					 yearJson = j;
					 continue;
				 }
				 if (j.Period == 3) {
					 futureJson = j;
					 continue;
				 }
			 }
		 }
		// console.log('habit filling amounts');
		 $("#monthVolume").html(formatVolume(monthJson.Volume)+'<small> '+measure+'</small>');
		 $("#yearVolume").html(formatVolume(yearJson.Volume) +'<small> '+measure+'</small>');
		 $("#futureVolume").html(formatVolume(futureJson.Volume) +'<small> '+measure+'</small>');
		 if (tab==1) {
			 $("#absoluteMonthVolume").html('~ ' + formatVolume(monthJson.AbsoluteVolume) + ' '+measure+' чистого спирта');
			 $("#absoluteYearVolume").html('~ ' + formatVolume(yearJson.AbsoluteVolume) + ' '+measure+' чистого спирта');
			// $("#absoluteFutureVolume").html('~ ' + formatVolume(futureJson.AbsoluteVolume)+ ' '+measure+' чистого спирта');
		 }
		 else{
			 $("#absoluteMonthVolume").html('');
			 $("#absoluteYearVolume").html('');
			// $("#absoluteFutureVolume").html('');
		 }
		 console.log('habit filling amounts');
		 $("#monthAmount").html(formatPrice(monthJson.Amount)+' р.');
		 $("#yearAmount").html(formatPrice(yearJson.Amount)+' р.');
		 //$("#futureAmount").html(formatPrice(futureJson.Amount)+' р.');

		 $('#monthList').html('');

		 var monthTags = new Array();
		 for (var k=0; k<monthJson.Items.length; k++){
			 monthTags[k]=monthJson.Items[k].Tag;
			 var html = '<li><span>'+fullTagsArray[hashCode(monthJson.Items[k].Tag)]+' '+formatVolume(monthJson.Items[k].Volume)+' '+measure
				 +'</span>'+formatPrice(monthJson.Items[k].Amount) +'р.</li>';
			 $('#monthList').append(html);
		//	 $('#monthList').listview('refresh');
		 }


		 $('#yearList').html('');

		 var yearTags = new Array();
		 for (var k=0; k<yearJson.Items.length; k++){
			 yearTags[k]=yearJson.Items[k].Tag;
			 var html = '<li><span>'+fullTagsArray[hashCode(yearJson.Items[k].Tag)]+' '+formatVolume(yearJson.Items[k].Volume)+' '+measure
				 +'</span>'+formatPrice(yearJson.Items[k].Amount) +'р.</li>';
			 $('#yearList').append(html);
			// $('#yearList').listview('refresh');
		 }


		/* $('#futureList').html('');
		 var futureTags = new Array();
		 for (var k=0; k<futureJson.Items.length; k++){
			 futureTags[k]=futureJson.Items[k].Tag;
			 var html = '<li><span>'+fullTagsArray[hashCode(futureJson.Items[k].Tag)]+' '+formatPrice(futureJson.Items[k].Volume)+' '+measure
				 +'</span>'+formatPrice(futureJson.Items[k].Amount) +'р.</li>';
			 $('#futureList').append(html);
			 $('#futureList').listview('refresh');
		 }
		*/
	 }

	 function refreshSubCategoryCombo(subcategory){
		 var html1 = $('#categoryRowTemplate').html();
		 $('#select-native-1').html('');
		 if (subcategory==0){
			 $('#select-native-1').selectmenu("refresh", "true");
		 }
		 getSubCategoryName(subcategory).done(function(subcategoryName){
			 html1 = html1.replace(/\{catName\}/g,subcategoryName);
			 html1 = html1.replace(/\{catValue\}/g,subcategory);
			 $('#select-native-1').append(html1);

			 getSubCategoryParent(subcategory).done(function(catID){
				 getSubCategories(catID).done(function(res){

					 for (var j=0;j<res.rows.length;j++){
						 if (subcategory==res.rows.item(j).id) continue;
						 var html11 = $('#categoryRowTemplate').html();
						 html11 = html11.replace(/\{catName\}/g,res.rows.item(j).name);
						 html11 = html11.replace(/\{catValue\}/g,res.rows.item(j).idtext);
						 $('#select-native-1').append(html11);
						 if (j==res.rows.length-1){
							 $("#select-native-1 option:first").attr('selected','selected');
							 $('#select-native-1').selectmenu("refresh", "true");
						 }
					 }
				 });
			 });
		 });
		 $('#select-native-1').change(function() {
			 var transactionID = window.localStorage.getItem(TRANSACTION_ID_KEY);
			 changeSubCategory(transactionID, $('#select-native-1').val());
		 });
	 }

function takeHeight()
		{
		try{
			var parent = $(window).outerHeight(),
				childs = $('.check-head').outerHeight(),
				height = 0,
				height2 = 0;

				childs += $('.ui-field-contain').outerHeight()*2;

				childs += $('.spent').outerHeight();

				height = parent-childs-280;

				height2 = parent - $('.check-details h3').height()-250;

			$('.shopping-list').height(height);

			$('.check-details-scroll').height(height2);
			}
            catch(e){
                dumpError("takeHeight",e);
            }
		}