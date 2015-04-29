function updateLoginPage(){
	(getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT)).done(function(res){
			document.getElementById('login').value = res;
		});
	getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT).done(function(res){
		document.getElementById('password').value= res;
	});
	
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
		     if (e.which == 13) 
		 	    { //Enter key
		 	      e.preventDefault(); //Skip default behavior of the enter key
		 	      	$('#password').blur();
		 	        $('#login_button').click();
		 	    }
		 	  });

	
}


function requestAndUpdateMainPage(){
	requestUserEnvironment().done(function(){
		updateMainPage();
	});
}



function updateMainPage(){
		getUserEnvironment().done(function(res){
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
	//	alert("Requesting transactions!");
		updateTransactionPage().done(function(){
			deferred.resolve();
			 $('#expensesList').listview('refresh');
		});
	});
	return deferred;
}



function updateTransactionPage(){
	var deferred = $.Deferred();
	getTransactions().done(function(result){
		if (result.rows.length==0){
			requestAndUpdateTransactionPage();
			return;
		}
	});
	
	  
	 var categoryID =  window.localStorage.getItem(CATEGORY_ID_KEY);
	 getWidget(categoryID).done(function(result){
		  var json = jQuery.parseJSON(result);
			$('#categoryTitle').html(json.Name);	
		});
//	requestTransactions().done(function(){
		//getTransactions().done(function(result){
		getTransactionsByCategoryID(categoryID).done(function(result){
			
			$('#expensesList').html('');
		//	$('#expensesList').listview();
			var start = +new Date();  // log start timestamp
			
			
		//	for (var t=0; t<5; t++){
			  for (var i = 0; i <result.rows.length; i++) {
		//		  for (var i = 0; i <2; i++) {
				  var row = result.rows.item(i);
				  var listrow = document.getElementById("transactionRow").cloneNode(true);
				  listrow.style.display = "list-item";
				  var arr=listrow.childNodes;
				  var jsonText = row.transactionJSON;
				  var json =  jQuery.parseJSON(jsonText);
				  var date = new Date(json.TransactionDate);
				  var currency = json.Currency;
				  listrow.setAttribute("onclick","showTransactionInfo('"+json.Id+"')");
				  for (var j=0;j<arr.length;j++){
					 
					  if(arr[j].id == "transactionInfoDiv"){
						  
						  var childArray=arr[j].childNodes;
						  for (var k=0; k<childArray.length; k++){
							  if(childArray[k].id == "transactionPrice"){
								  childArray[k].innerHTML = json.Amount+getCurrencyString(json.Currency);
							  }
	
							var hours = date.getHours();
							var minutes = date.getMinutes();
							  if(childArray[k].id == "transactionTime"){
							//	  childArray[k].innerHTML = date.format("hh-MM");// date.getHours()+":"+date.getMinutes();
								  childArray[k].innerHTML = (hours<10?'0':'')+hours+":"+(minutes<10?'0':'')+minutes;
							  }
							  var month = date.getMonth()+1;
							  var day =  date.getDate();
							  var year = date.getYear()+1900;
							  if(childArray[k].id == "transactionDate"){
								 // childArray[k].innerHTML = date.format("dd-mm");//date.getDay()+"."+date.getMonth();
								  childArray[k].innerHTML =(day<10?'0':'')+day+"."+(month<10?'0':'')+month+"."+year;
							  }
						  }
					  }
					 
					  else if(arr[j].id == "transactionDescriptionDiv"){
						  var childArray=arr[j].childNodes;
						  for (var k=0; k<childArray.length; k++){
							  if(childArray[k].id == "transactionName"){
								  childArray[k].innerHTML =json.Name;
								  childArray[k].innerHTML ="Наименование транзакции "+i;
							  }
							 
						  }
					  }
					  
					  
					  else if(arr[j].id == "transactionButtonsDiv"){
						  var childArray=arr[j].childNodes;
						  for (var k=0; k<childArray.length; k++){
							  if(childArray[k].id == "expensesButtonInfo"){
							//	  childArray[k].setAttribute("onclick","showTransactionInfo('"+json.Id+"')");
							  }
							 
						  }
					  }

				  }
				  $('#expensesList').append(listrow);
				  
				/*  $('#expensesList').append(listrow).promise().done(function () {
					  $('#expensesList').listview("refresh");    
				      });*/
				 // $('#expensesList').listview('refresh');

				 if (i==result.rows.length-1){
					//    $('#expensesList').listview('refresh');
					 deferred.resolve();
				 }
				 
			  }
		//	}
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
		 console.log("Setting categoryID for widget: "+w.VisualObjectId);
		 widget.setAttribute("categoryID", w.VisualObjectId);
		 var s = "showExpensesPage('"+ w.VisualObjectId+"')";
		 console.log("Setting onclick categoryID "+s);
		 widget.setAttribute("onclick",s);
		  var arr=widget.childNodes;
		  for (var i=0;i<arr.length;i++){
	            if (arr[i].id == "interest"){
	                   arr[i].innerHTML = w.Percent.replace(/\s/g, '');//+" "+w.Name;
	            }
	            if (arr[i].id == "icon"){
	            	var src = "img/largeImages/";
	            	console.log("GOT ICON IDENTIFIER "+w.IconIdentifier+" for kind "+w.Kind );
	            	switch(w.IconIdentifier){
	            	
		            	case "ico_purse":
		            		src ="img/purse396.png";
		            		break;
		            	case "ico_food":
		            		src = src.concat("food396/0.png");
		            		break;
		            	case "ico_medicine":
		            		src = src.concat("health396/0.png");
		            		break;
		            	case "ico_education":
		            		src = src.concat("education396/0.png");
		            		break;
		            	case "ico_entertainment":
		            		src ="img/ico_category_1_396.png";
		            		break;
		            	case "ico_house":
		            		src ="img/ico_category_5_396.png";
		            		break;
		            	case "ico_auto":
		            		src ="img/auto396.png";
		            		break;
		            	case "ico_other":
		            		src ="img/other_396.png";
		            		break;
		            	case "ico_wear":
		            		src ="img/wear_396.png";
		            		break;
		            	default:
		            		src = src.concat("food396/0.png");
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
						receiptRow.childNodes[k].id.innerHTML = "Позиция "+i;
					} 
			  }
			  
			  receiptRow.style.display = "block";
			  receiptRow.style.visibility = "visible";
			  $('#receiptsDataListView').append(receiptRow);
		}
		

	
	});
	
	
	
}

