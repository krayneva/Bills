function updateLoginPage(){
	
/*	(getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT)).done(function(res){
			document.getElementById('login').value = res;
		});
	getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT).done(function(res){
		document.getElementById('password').value= res;
	});
*/
	//var login =  window.localStorage.getItem(SETTING_USER_LOGIN);
	var login =  getSettingFromStorage(SETTING_USER_LOGIN,"");
	document.getElementById('login').value = login;
	var password = getSettingFromStorage(SETTING_USER_PASSWORD,"");
	document.getElementById('password').value= password;
    
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
  	  	$('#buildVersion').html("Версия сборки: "+buildVersion);
	
}


function requestAndUpdateMainPage(){
	requestUserEnvironment().done(function(){
		updateMainPage();
	});
}



function updateMainPage(){
		getUserEnvironment().done(function(res){
			if (debugMode==true)
			console.log("Update main page json :"+res);
			if (res==="") {
				console.log("updateMainPage: requesting environment From server");
				requestAndUpdateMainPage();
				return;
			}
			var json = jQuery.parseJSON(res);
			
			//--------------- доход----------//
			var incomeRublesTD = document.getElementById("incomeRublesTD");
			var incomeDollarsTD = document.getElementById("incomeDollarsTD");
			//var incomeEurosTD = document.getElementById("incomeRublesTD");
			
			
			var showRublesIncome = json.IsAmount1Visible;
			var showDollarsIncome = json.IsAmount2Visible;
			//var showEurosIncome = json.IsAmount3Visible;
			
			// рубли
			if (showRublesIncome===true){
				incomeRublesTD.style.display = "block";
				var incomeRubles = document.getElementById("incomeRubles");
				incomeRubles.innerHTML = json.Amount1;
				
			}
			else{
				incomeRublesTD.style.display = "none";
			}
			
			// доллары
			if (showDollarsIncome===true){
				incomeDollarsTD.style.display = "block";
				var incomeDollars = document.getElementById("incomeDollars");
				incomeDollars.innerHTML = json.Amount2;
				
			}
			else{
				incomeDollarsTD.style.display = "none";
			}

			// еврики пока отбой
			
			//---------------конец  доход----------//
			
			
			// ------------- расход-------------------//
			var expenses = document.getElementById("expenses");
			expenses.innerHTML = json.ExpencesAmountStr;
			// ------------- конец расход-------------------//
			
			updateWidgets();
		});
}



function requestAndUpdateTransactionPage(){
	var deferred = $.Deferred();
	requestTransactions().done(function(){
		 requestTransactionPageCount = requestTransactionPageCount+1;
		 updateTransactionPage().done(function(){
			deferred.resolve();
		});
	});
	return deferred;
}



function updateTransactionPage(){
	var deferred = $.Deferred();
	getTransactions().done(function(result){
		if ((result.rows.length==0)&(requestTransactionPageCount==0)){
			alert("rerequesting from update, count:"+requestTransactionPageCount);
			requestAndUpdateTransactionPage();
			return;
		}
		else{
			deferred.resolve();
			return;
		}
	});
	
	//$('#expensesList').html('');
	 var categoryID =  window.localStorage.getItem(CATEGORY_ID_KEY);
	 getWidget(categoryID).done(function(result){
		  var json = jQuery.parseJSON(result);
			$('#categoryTitle').html(json.Name);	
		});
		getTransactionsByCategoryID(categoryID).done(function(result){
			$('#expensesList').html('');
			var start = +new Date();  // log start timestamp
            var totalAmount = 0;
            var lastAmount = 0;
            if (result.rowslength>0)
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
				  html = html.replace(/\{transactionPrice\}/g,json.Amount+getCurrencyString(json.Currency));
				  html = html.replace(/\{transactionName\}/g,json.Name==null?"":json.Name);
				  html = html.replace(/\{transactionID\}/g,json.Id);
				  
				  listHTML+=html;
				 if (i==result.rows.length-1){
					 deferred.resolve();
				 }
				 
			  }
		  $('#expensesList').html(listHTML);
           $('#totalAmount').html(Math.round(totalAmount*100)/100);
           $('#lastAmount').html(Math.round(lastAmount*100)/100);
			var end =  +new Date();  // log end timestamp
			var diff = (end - start)/(20*result.rows.length);
			console.log("Time per row: "+diff);
	
		});
	//});	
		 
		return deferred; 
		
}


function updateWidgets(){
	getWidgets().done(function(res){
		for (var j=0;j<res.rows.length;j++){
		var w = jQuery.parseJSON(res.rows.item(j).json);
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




function updateTransactionInfoPage(){
	
	var transactionID = window.localStorage.getItem(TRANSACTION_ID_KEY);
	
	getTransaction(transactionID).done(function(res){
	//	alert("TransactionsCount: "+res.rows.length);
		var json = jQuery.parseJSON(res.rows.item(0).transactionJSON);
	//	alert(res.rows.item(0).transactionJSON);
	//	$('#receiptsDataListView').html('');
	//	alert("Amount: "+json.Amount);

		document.getElementById('ReceiptsListView').style.fontSize = "medium";
		document.getElementById('tagsListView').style.fontSize = "medium";
		$('#category').append(json.Category);
		
		$('#subcategory').append(json.SubCategory);
		$('#id').append(json.Id);
		$('#createdAt').append(json.CreatedAt);
		$('#currency').append(getCurrencyString(json.Currency));
		$('#transactionDate').append(json.TransactionDate);
		$('#amount').append(json.Amount);
		
		
		for (var i=0; i<json.Tags.length; i++){
		//	alert(json.Tags[i]);
			$('#tagsListView').append("<li>"+json.Tags[i]+"</li>");
		}
		

		for (var i=0; i<json.receiptData.Items.length; i++){
			  var receiptRow = document.getElementById("receiptDataTemplate").cloneNode(true);
			  receiptRow.style.fontSize = "medium";
			  for (var k=0; k<receiptRow.childNodes.length; k++){
				  	if (receiptRow.childNodes[k].id=="receiptItems"){
				  		var item = receiptRow.childNodes[k];
				  	//	alert("appending item: "+item.id +" with "+json.receiptData.Items[i].ItemName);
				  		item.innerHTML="<li>Наименование: "+json.receiptData.Items[i].ItemName+"</li>";
				  		item.innerHTML+="<li>Количество: "+json.receiptData.Items[i].Quantity+"</li>";
				  		item.innerHTML+="<li>Цена за единицу: "+json.receiptData.Items[i].PricePerUnit+"</li>";
				  		item.innerHTML+="<li>Стоимость: "+json.receiptData.Items[i].Value+"</li>";
				  		item.innerHTML+="<li>Тэг: "+json.receiptData.Items[i].Tag+"</li>";
				  	}
					if (receiptRow.childNodes[k].id=="receiptHeader"){
						receiptRow.childNodes[k].innerHTML = "Позиция "+i;
					} 
			  }
			  
			  receiptRow.style.display = "block";
			  receiptRow.style.visibility = "visible";
			  $('#receiptsDataListView').append(receiptRow);
		}
		

	
	});
	
}
	
	
	function updateShopListsPage(reloadFromBase){
		// для обнуления криво забитого параметра
		//window.localStorage.setItem("CurrentShopListNum",0);
		

		 var currentShopList = window.localStorage.getItem("CurrentShopListNum");
		 if (currentShopList==undefined) {
			 currentShopList = 0;
			 window.localStorage.setItem("CurrentShopListNum",0);
		 }
		 currentShopList = parseInt(currentShopList);
	//	 alert(currentShopList);
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
			  //var itemsJSON =  jQuery.parseJSON(res.rows.item(currentShopList).itemsJSON);
			  // запоминаем айдишник списка покупок
			  window.localStorage.setItem("ShopListID",res.rows.item(currentShopList).id);
			  // смотрим нет ли инфы по купленным

			 var itemsString = window.localStorage.getItem("ShopListAlreadyBought"+res.rows.item(currentShopList).id);

			  if ((itemsString==undefined)|(reloadFromBase)){
			//	  alert("Bought items are not defined!, len"+itemsJSON.length);
			//	 bought = new Array(itemsJSON.length);


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
	       		  // товар еще в спсике некупленных
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
	       		  // товар в списке купленных
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
							if (listrow.childNodes[i].id=="itemUnit"){
					  			listrow.childNodes[i].innerHTML = measure;
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
		 // наполняем автокомплит
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
	
	
	function onAutoCompleteRowClick(){
		alert(this.innerHTML);
	}
	
	
	
	function swiperightHandler(event){

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
	
	function nextShopList(event){
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
	
	function previousShopList(event){
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
	
	
	function showShopListByNumber(number){
	//	alert("ShowShopListByNumber! "+number);
		
		var currentShopList = window.localStorage.getItem("CurrentShopListNum");
		getShopLists().done(function(res){
			 var listID = res.rows.item(parseInt(currentShopList)).id;
			 sendShopList(listID).done(function(res){
					window.localStorage.setItem("CurrentShopListNum",number);
					//	console.log("CurrentShopList: "+number+" count: "+count);
						clearBoughtItems(window.localStorage.getItem('ShopListID'));
						$( "#mypanel" ).panel( "close" );
						updateShopListsPage(true);
				 
			 });
		});
	}
	
	function closeShopListsPage(){
		getShopLists().done(function(res){
			for (var i=0; i<res.rows.length;i++){
				var row = res.rows.item(i);
				window.localStorage.removeItem("ShopListAlreadyBought"+row.id);
			}
		//	  navigator.app.backHistory();
		});
	}
	
	
	function clearBoughtItems(listID){
		window.localStorage.removeItem("ShopListAlreadyBought"+listID);
	}
