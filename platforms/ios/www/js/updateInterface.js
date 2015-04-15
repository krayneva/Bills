function updateLoginPage(){
	(getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT)).done(function(res){
			document.getElementById('login').value = res;
		});
	getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT).done(function(res){
		document.getElementById('password').value= res;
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






function updateTransactionPage(){
	  $('#expensesList').html('');
	 var categoryID =  window.localStorage.getItem(CATEGORY_ID_KEY);
	 getWidget(categoryID).done(function(result){
		  var json = jQuery.parseJSON(result);
			$('#categoryTitle').html(json.Name);	
		});
	requestTransactions().done(function(){
		//getTransactions().done(function(result){
		getTransactionsByCategoryID(categoryID).done(function(result){
		
			  for (var i = 0; i <result.rows.length; i++) {
				  var row = result.rows.item(i);
				  var listrow = document.getElementById("transactionRow").cloneNode(true);
				  listrow.style.display = "block";
				  var arr=listrow.childNodes;
				  var jsonText = row.transactionJSON;
				  var json =  jQuery.parseJSON(jsonText);
				  var date = new Date(json.CreatedAt);
				  var currency = json.Currency;
				  
				  for (var j=0;j<arr.length;j++){
					 
					  if(arr[j].id == "transactionInfoDiv"){
						  var childArray=arr[j].childNodes;
						  for (var k=0; k<childArray.length; k++){
							  if(childArray[k].id == "transactionPrice"){
								  childArray[k].innerHTML = json.Amount;
							  }
	
							  if(childArray[k].id == "transactionTime"){
							//	  childArray[k].innerHTML = date.format("hh-MM");// date.getHours()+":"+date.getMinutes();
								  childArray[k].innerHTML =  date.getHours()+":"+date.getMinutes();
							  }
	
							  if(childArray[k].id == "transactionDate"){
								 // childArray[k].innerHTML = date.format("dd-mm");//date.getDay()+"."+date.getMonth();
								  childArray[k].innerHTML = date.getDay()+"."+date.getMonth();
							  }
						  }
					  }
					 
					  if(arr[j].id == "transactionDescriptionDiv"){
						  var childArray=arr[j].childNodes;
						  for (var k=0; k<childArray.length; k++){
							  if(childArray[k].id == "transactionName"){
								  childArray[k].innerHTML =json.Name;
								  childArray[k].innerHTML ="Наименование транзакции "+i;
							  }
							 
						  }
					  }
					  
					  
					  if(arr[j].id == "transactionButtonsDiv"){
						  var childArray=arr[j].childNodes;
						  for (var k=0; k<childArray.length; k++){
							  if(childArray[k].id == "expensesButtonInfo"){
								  childArray[k].setAttribute("onclick","showTransactionInfo('"+json.Id+"')");
							  }
							 
						  }
					  }
/*					  var s = "showExpensesPage('"+ w.VisualObjectId+"')";
						 console.log("Setting onclick categoryID "+s);
						 widget.setAttribute("onclick",s);
  */
				  }
				  $('#expensesList').append(listrow);
				 
			  }
	
		});
	});	
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
	                   arr[i].innerHTML = w.Percent;//+" "+w.Name;
	            }
	            if (arr[i].id == "icon"){
	            	var src = "img/largeImages/";
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
		            		src ="img/ico_category_1.png";
		            		break;
		            	case "ico_house":
		            		src ="img/ico_category_smoll_5.png";
		            		break;
		            	case "ico_auto":
		            		src ="img/auto396.png";
		            		break;
		            	default:
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
		var json = jQuery.parseJSON(res.rows.item(0).transactionJSON);
		alert(res.rows.item(0).transactionJSON);
		$('#ReceiptsDataListView').html('');
		
		$('#name').append(json.Name);
		$('#category').append(json.Category);
		$('#subCategory').append(json.SubCategory);
		$('#id').append(json.id);
		$('#createdAt').append(json.CreatedAt);
		
		
		for (var i=0; i<json.Tags.length; i++){
			alert(json.Tags[i]);
			$('#tagsListView').append("<li>"+json.Tags[i]+"</li>");
		}
		
		
		for (var i=0; i<json.Receiptdata[0].Items.length; i++){
			  var receiptRow = document.getElementById("receiptDataTemplate").cloneNode(true);
			  for (var k=0; k<receiptRow.childNodes.length; k++){
				  	if (receiptRow.childNodes[k].id=="receiptItems"){
				  		var receiptItems = receiptRow.childNodes[k].childNodes;
				  		for (var f=0; f<receiptItems.length; f++){
				  			if (receiptItems[f].id=="itemName")receiptItems[f].innerHTML+=(" "+i);
				  		}
				  	}
			  }
			  
			  
			  $('#ReceiptsDataListView').append(receiptRow);
		}
		

	
	});

	
}