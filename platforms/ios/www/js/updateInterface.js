function updateLoginPage(){
	(getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT)).done(function(res){
			document.getElementById('login').value = res;
		});
	getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT).done(function(res){
		document.getElementById('password').value= res;
	});
	
}



function updateMainPage(){
	//alert("Update Main Page called!");
	requestUserEnvironment().done(function(){
		getUserEnvironment().done(function(res){
			var json = jQuery.parseJSON(res);
			console.log(res);
			
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
			expenses.innerHTML = json.ExpencesAmount;
			// ------------- конец расход-------------------//
			
			
			for (var k in json.Widgets) {
				  var w = json.Widgets[k];
				 // alert("Widget "+w.Name+" left: "+w.Left+" top:"+w.Top+" interest:"+w.Percent);
				  var widget = document.getElementById("widget".concat(w.Left,w.Top));
				
				 widget.style.display = "block";
				 widget.style.visibility = "visible";

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
			            	console.log("Setting src="+src,"iconID: ");//+w.IconIdentifier);
			                arr[i].setAttribute("src",src);
			            }
				  }
				  console.log("Widget "+w.WidgetID+" left: "+w.Left+" top:"+w.Top+" interest:"+w.Percent);

				}
		});
	});
}






function updateTransactionPage(){
	  $('#expensesList').html('');
	
	requestTransactions().done(function(){
		getTransactions().done(function(result){
			//  alert ("Rows count: "+result.rows.length);
			  
			  for (var i = 0; i <result.rows.length; i++) {
				  var row = result.rows.item(i);
				  var listrow = document.getElementById("listRowTemplate").cloneNode(true);
				  listrow.style.display = "block";
				  var arr=listrow.find("td");
				  
				 // var json = row.transactionJSON;
				  for (var j=0;j<arr.length;j++){
					  console.log("ID of element is: "+arr[j].id);
					  if(arr[j].id == "transactionName"){
						  arr[j].innerHTML = "Билеты в кино";
					  }
					  if(arr[j].id == "transactionComment"){
						  arr[j].innerHTML = "Ходили в кино, фильм плохой";
					  }

					  if(arr[j].id == "transactionPrice"){
						  arr[j].innerHTML = "2000";
					  }

					  if(arr[j].id == "transactionTime"){
						  arr[j].innerHTML = "14:20";
					  }

					  if(arr[j].id == "transactionDate"){
						  arr[j].innerHTML = "07.04";
					  }

				  }
				  console.log("Appending listview with id: "+row.id);
				  $('#expensesList').append(listrow);
				 
			  }
	
		});
	});	
		
} 