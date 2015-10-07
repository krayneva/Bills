function refreshBills() {
	try{
	  if (!db){
	       $('#billsHeader').html('Не сохранено ни одного чека');
	      $('#uploadButton').hide();
	      $('#clearBillsButton').hide();
	       return;
	    }
	    
	    db.transaction(
	    function(transaction) {
	        transaction.executeSql('SELECT * FROM Bills;', [], function(transaction, result) {
	        	 $('#billList').html('');
	
	        		 
	            for (var i = 0; i < result.rows.length; i++) {
	             d = new Date();
	                var row = result.rows.item(i);
	                $('#billList').append(
			      	'<li onclick = "showCheck('+row.id+')">'
			       +'<a href="#">'
			        +'<img src="'+row.path+"?"+d.getTime()+'" width = "70">'
			        +'<h4>'+row.name+" "+row.id+'</h4>'
			        +'<p>'+formatDate(row.createdate)+'</p>'
			        +'<p><img id="uploadImage'+row.id+'" width = "20"></img>'
			        +'<h5 id="uploadProgress'+row.id+'">asdfasd</h5>' 
			        +'</p>'
			        +'</a>'
			      +'</li>'); 
	                if (row.sent==1){
	                	 $('#uploadImage'+row.id).attr('src','img/cameraoverlay/send.png');
	                	 $('#uploadProgress'+row.id).hide();
	                }
	                else{
	                	$('#uploadImage'+row.id).attr('src','img/cameraoverlay/upload_blue.png');
	                	$('#uploadProgress'+row.id).hide();
	                }
	                
			       $('#billList').listview('refresh');
	            }
	            if (result.rows.length>0){
	              $('#billsHeader').html('Список чеков');
	              $('#uploadButton').show();
	              $('#clearBillsButton').show();
	            }
	            else{
	             $('#billsHeader').html('Не сохранено ни одного чека');
	             $('#uploadButton').hide();
	             $('#clearBillsButton').hide();
	            }
	        }, onError);
	    });
	}
	catch(e){
		  dumpError("refreshBills",e);
	  }	
  
}

function refershBillSendStatus(rowID){
	try{
	    if (!db) return;
	    db.transaction(
	        function(transaction) {
	        transaction.executeSql('SELECT * FROM Bills;', [], function(transaction, result) {
	                for (var i = 0; i < result.rows.length; i++) {
	                    var row = result.rows.item(i);
	                    if (row.id==rowID){
	                               if (row.sent==1){
	                                    $('#uploadImage'+row.id).attr('src','img/cameraoverlay/send.png');
	                                    $('#uploadProgress'+row.id).hide();
	                               }
	                               else{
	                                    $('#uploadImage'+row.id).attr('src','img/cameraoverlay/upload_blue.png');
	                                    $('#uploadProgress'+row.id).hide();
	                                }
	                               break;
	                               }
	                               else{
	                               continue;
	                               }
	                                          
	                        $('#billList').listview('refresh');
	                        }
	                               
	                        }, onError);
	 
	                   });
	}
	catch(e){
		  dumpError("refreshBillSendStatus",e);
	  }	
    }




	

	function formatDate(jsD){
		try{
			jsDate = new Date(jsD);
			var  hm =  (jsDate.getHours()<10?("0"+jsDate.getHours()):jsDate.getHours()) + ":" + (jsDate.getMinutes()<10?("0"+jsDate.getMinutes()):jsDate.getMinutes());
		  	var dmy =  (jsDate.getDate()<10?("0"+jsDate.getDate()):jsDate.getDate()) + "." + 
		      ((jsDate.getMonth()+1)<10?("0"+(jsDate.getMonth()+1)):(jsDate.getMonth()+1)) + "." + 
		      jsDate.getFullYear();
		    return hm+" "+dmy;
		}
		catch(e){
			  dumpError("formatDate",e);
		  }	
	}

	function hideTesterDiv(){
		try{
			$('#testDiv').hide();
		}
		catch(e){
			  dumpError("hodeTesterDiv",e);
		  }	
	}
	
	function showCheckPage(transactionID){
		try{
		    currentPage = "pageCheck";
		    getReceiptID(transactionID).done(function(res){
		    	var receiptID = res;
			    window.localStorage.setItem(RECEIPT_ID_KEY, receiptID);
			    window.localStorage.setItem(TRANSACTION_ID_KEY, transactionID);
			//	$.mobile.pageContainer.pagecontainer( "change", "check.html",{transition:"none"});
				$.mobile.pageContainer.pagecontainer( "change", "checkNew.html",{transition:"none"});
			//	$.mobile.pageContainer.pagecontainer( "change", "check_0709.html",{transition:"none"});
		//	$.mobile.pageContainer.pagecontainer( "change", "check_0809.html",{transition:"none"});
		$.mobile.pageContainer.pagecontainer( "change", "check0809v2.html",{transition:"none"});

		    	 
		    });
		}
		catch(e){
			  dumpError("showCheck",e);
		  }	
	}
	
	function showCheckImagePage(transactionID){
		try{
		    currentPage = "pageCheckImage";
		    getReceiptID(transactionID).done(function(res){
		    	var receiptID = res;
			    window.localStorage.setItem(RECEIPT_ID_KEY, receiptID);
			    window.localStorage.setItem(TRANSACTION_ID_KEY, transactionID);
				$.mobile.pageContainer.pagecontainer( "change", "check.html",{transition:"none"});
		    	 
		    });
		}
		catch(e){
			  dumpError("showCheckImagePage",e);
		  }	
	}
	
	function showBillsList(){
		try{
			currentPage = "pageBills";
			$.mobile.pageContainer.pagecontainer( "change", "bills.html",{transition:"none"});
		}
		catch(e){
			  dumpError("showBillsList",e);
		  }	

	}
	
	

	
	function showAuthPage(){
		try{
			currentPage = "pageAuth";
			//$.mobile.pageContainer.pagecontainer( "change", "login.html", {transition:"none"});
			$.mobile.pageContainer.pagecontainer( "change", "loginNew.html", {transition:"none"});
		}
		catch(e){
			  dumpError("showAuthPage",e);
		  }	
	}
	
	
	function showSettingsPage(){
		try{
			currentPage = "pageSettings";
			$.mobile.pageContainer.pagecontainer( "change", "settings.html",{transition:"none"});
		}
		catch(e){
			  dumpError("showSettingsPage",e);
		  }	
	}
	
	
	function showMainPage(){
		try{
		currentPage = "pageMain";
			$.mobile.pageContainer.pagecontainer( "change", 'main.html' ,{transition:"none"});
		//	$.mobile.pageContainer.pagecontainer( "change", "pull.html" ,{transition:"none"});
		}
		catch(e){
			  dumpError("showMainPage",e);
		  }			
	}
	
	function showConnectionSettingsPage(){
		try{
			currentPage = "pageConnectionSettings";
			$.mobile.pageContainer.pagecontainer( "change", "connectionSettings.html" ,{transition:"none"});
		}
		catch(e){
			  dumpError("showConnectionSettingsPage",e);
		  }			
	}
	
	function showExpensesPage(categoryID){
		try{
			window.localStorage.setItem(CATEGORY_ID_KEY, categoryID);
			currentPage = "pageExpenses";
			$.mobile.pageContainer.pagecontainer( "change", "expenses.html" ,{transition:"none"});
	    //    $.mobile.pageContainer.pagecontainer( "change", "pull.html" ,{transition:"none"});
		//	window.localStorage.setItem(TRANSACTION_ID_KEY, transactionID);
		}
		catch(e){
			  dumpError("showExpensesPage",e);
		  }			
	}
	
	function showTransactionPage(){
		try{
			currentPage = "pageTransaction";
			$.mobile.pageContainer.pagecontainer( "change", "transaction.html" ,{transition:"none"});
		}
		catch(e){
			  dumpError("showTransactionPage",e);
		  }			
	}
	
	function showShopListPage(){
		try{
			currentPage = "pageShopList";
			$.mobile.pageContainer.pagecontainer( "change", "shopList.html" ,{transition:"none"});
		}
		catch(e){
			  dumpError("showShopListPage",e);
		  }			
	}
	
	function showCreateShopListPage(){
		try{
			currentPage = "pageCreateShopList";
			$.mobile.pageContainer.pagecontainer( "change", "createShopList.html" ,{transition:"none"});
		}
		catch(e){
			  dumpError("showCreateShopListPage",e);
		  }			
	}

	function showRegistrationPage(){
		try{
			currentPage = "pageRegistration";
			//$.mobile.pageContainer.pagecontainer( "change", "registration.html" ,{transition:"none"});
			$.mobile.pageContainer.pagecontainer( "change", "registration_new.html" ,{transition:"none"});
		}
		catch(e){
			  dumpError("showRegistrationPage",e);
		  }			
	}
	function showRulesPage(){
		try{
			currentPage = "pageRules";
			//$.mobile.pageContainer.pagecontainer( "change", 'rules.html' ,{transition:"none"});
			$.mobile.pageContainer.pagecontainer( "change", 'rules_new.html' ,{transition:"none"});
		}
		catch(e){
			  dumpError("showRegistrationPage",e);
		  }			
	}
	function showHabitsPage(){
		try{
			currentPage = "pageHabits";
			$.mobile.pageContainer.pagecontainer( "change", 'habits.html' ,{transition:"none"});
		}
		catch(e){
			  dumpError("showHabitsPage",e);
		  }			
	}
	
	
	function showErrorDialog(message){
		try{
			showDialog("Ошибка",message);
		}
		catch(e){
			  dumpError("showErrorDialog",e);
		  }			
	}
	
	
	function showDialog(header,message){
		try{
			currentPage = "pageError";
			window.localStorage.setItem(DIALOG_HEADER, header);
			window.localStorage.setItem(DIALOG_MESSAGE, message);
			message = message.replace ('"','');
			$.mobile.pageContainer.pagecontainer( "change", "dialog.html" ,{transition:"none",role: "dialog"});
		}
		catch(e){
			  dumpError("showDialog",e);
		  }			

	}

	function showFeedbackDialog(){
		try{
			currentPage = "pageFeedbackDialog";
        	$.mobile.pageContainer.pagecontainer( "change", "feedbackdialog.html" ,{transition:"none",role: "dialog"});
		}
		catch(e){
        	  dumpError("showFeedbackDialog",e);
         }
	}
	
	
	function showUserEnvironment(){
		try{
			var environment = getUserEnvironment();
			alert(environment);
		}
		catch(e){
			  dumpError("showUserEnvironment",e);
		  }			
	}
	
	function getUserTokenAndShowMainPage(login, password){
		try{
			var json = new Object();

			//facebookConnectPlugin.logEvent("Login event", json);
			dumpEvent("Login event", json);
        //    alert("getusertoken");
			requestUserToken(login,password).done(function(res){
           //     alert("request user token returned "+res);
				if (res!=""){
					getGoodItemsCount().done(function(res){
						if (res==0){
							requestShopLists().done(function(){
								requestGoodItems().done(function(){
									requestGoodMeasures().done(function(){
                                        requestDictionaries().done(function(){
											showMainPage();

									});
								});
							});
                                                       // });
						});
						}
						else{
							showMainPage();						
						}
					});
				}
			});
		}
		catch(e){
			  dumpError("getUserTokenAndShowMainPage",e);
		  }			
	}
	
	
	function showTransactionInfo(transactionID){
		try{
			window.localStorage.setItem(TRANSACTION_ID_KEY, transactionID);
			currentPage = "pageTransactionInfo";
			$.mobile.pageContainer.pagecontainer( "change", "transactionInfo.html",{transition:"none"});
		}
		catch(e){
			  dumpError("showTransactionInfo",e);
		  }			
	}
	
	
	function acceptRulesAndGoToRegistrationPage(){
		try{
			window.localStorage.setItem(ACCEPT_RULES_KEY,"true");
			//navigator.app.backHistory();
	        // window.history.go(-1);
	        $("#backButton").click();
		}		
		catch(e){
			  dumpError("acceptRulesAndGoToRegistrationPage",e);
		  }			
	}
	
	function declineRulesAndGoToRegistrationPage(){
		try{
	       // alert("trying to decline");
			window.localStorage.setItem(ACCEPT_RULES_KEY,"false");
	       // alert("trying to go back");
			//navigator.app.backHistory();
	        //window.history.go(-1);
	         $("#backButton").click();
		}
		catch(e){
			  dumpError("declineRulesAndGoToRegistrationPage",e);
		  }			
	}
	
	function tryToRegisterUser(){
		try{
			var email= $('#email').val();
			 var nick = $('#nick').val();
			 var promo = $('#promo').val();
			 var rulesCheck = $("#checkboxRules").is(':checked')?true:false;
			 
			if (
				/*	(nick==undefined)||(nick=="")
					(email==undefined)||(email=="")
					(promo==undefined)||(promo=="")
					*/
					(nick=="")
					||(email=="")
				//	||(promo=="")
			)
			{
				//alert("Пожалуйста, заполните все необходимые поля");
				 showErrorDialog("Пожалуйста, заполните все необходимые поля");
				return;
			}
			
			
			
			if (rulesCheck==false){
			//	alert("Необходимо принять условия пользовательского приложения");
				  showErrorDialog("Необходимо принять условия пользовательского соглашения");
				  return;
			}
			sendRegistration(email, nick, promo).done(function(res){
				if (res=="success"){
					navigator.app.backHistory();
				}
			});
		}
		catch(e){
			  dumpError("tryToRegister",e);
		  }			
		
	}