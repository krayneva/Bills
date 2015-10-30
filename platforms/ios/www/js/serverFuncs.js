var SERVER_ERROR_NO_INTERNET = "noInternet";
var SERVER_ERROR_NO_AUTH = "noAuth";
var SERVER_ERROR_NO_CONNECTION_TO_HOST = "noConnectionToHost";
var SERVER_ERROR_OTHER = "other";
var SERVER_ERROR_TRY_AGAIN = "tryAgain";


function getErrorMessage(err){
	switch(err){

	case SERVER_ERROR_NO_INTERNET:
	return "Проверьте соединение с интернетом";
		break;
	case SERVER_ERROR_NO_AUTH:
	return "Неправильная пара логин-пароль";
    	break;
    case SERVER_ERROR_NO_CONNECTION_TO_HOST:
    return "Нет связи с сервером";
      	break;
    case SERVER_ERROR_OTHER:
    default:
    return "Произошла неизвестная ошибка";
     	break;
	}
}

var currentRowID = 0;

var authCount = 0;

function uploadPhoto() {
	try{
	    var billsToSend = 0;
	    if (!db) return;
	     db.transaction(
	
	    function(transaction) {
	        transaction.executeSql('SELECT * FROM Bills where sent=0;', [], function(transaction, result) {
	        var array = new Array(result.rows.length);
	   	 if (result.rows.length==0){
			 $.mobile.loading("hide");
		 }
	            for (var i = 0; i < result.rows.length;i++) {
	             var row = result.rows.item(i);
	             if (row.sent==0){
	            	 $.mobile.loading("show",{
	             		text: "Отправка чека "+row.id,
	             		textVisible: true,
	             		theme: 'e',
	             	});
	              imageURI = row.path; 
	                currentRowID = row.id;
			        var options = new FileUploadOptions();
			        options.fileKey="test.jpg";
			        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
			      
			        options.mimeType="image/jpeg";
			        var params = new Object();
			        options.params = params;
			        var lat = row.latitude;
			        var lon = row.longitude;
			        var alt = row.altitude;
			        if (lat===-1) {
			        	lat = null;
			        	lon = null;
			        	alt = null;
			        }
			        getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(res){
			        	var userToken = res;
			        
				        var headers={'Authorization':'Bearer '+userToken, 
				        		'Latitude':lat, 
				        		'Longitude':lon,
				        		'Altitude':alt,
				        };
				        
				        //alert(lat);
				        //alert(lon);
				        options.headers = headers;
				        var ft = new FileTransfer();
				        var loadingStatus; 
				        ft.onprogress = function(progressEvent) {
						    if (progressEvent.lengthComputable) {
							  //    loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
						    	  $('#uploadProgress'+row.id).show();
							      $('#uploadProgress'+row.id).html(''+Math.round((progressEvent.loaded / progressEvent.total)*100)+'%');
							 } 
							 else {
								 $('#uploadProgress'+row.id).show();
								 $('#uploadProgress'+row.id).html(''+loadingStatus);
								// $('#uploadPercent').html(''+loadingStatus);
							    }
							};

					    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT)
					    		console.log("ImageURI: ",imageURI);
					    		ft.upload(imageURI, encodeURI(serverAddress.concat(addPhotoURL)), onFileUploadSuccess, onFileUploadError, options,true);

				        
		                
			        });
			        break;
	            }
	    	}
	    }, onError);
	    });
		}
	  catch(e){
		  dumpError("uploadPhoto",e);
	  }
    }

    function onFileUploadSuccess(r) {
    	try{
	    	setBillSent(currentRowID);
	    	var s = r.response.replace(/"/g,"");
	    	setBillUID(currentRowID,s);
	    	$.mobile.loading("hide");
	        uploadPhoto();
    	}
	    catch(e){
	    	dumpError("onFileUploadSuccess",e);
	    }
    }

    function onFileUploadError(error) {
    	try{
	    	 var errorThrown ="";
	    	// alert("file upload error: "+error.http_status);
	    	if (error.http_status===401){
	    		errorThrown = "Unauthorized";
	    	
	    	
	
	   		 onServerRequestError("", "", errorThrown).done(function(res){
	   			 if (res==SERVER_ERROR_TRY_AGAIN){
	   				 uploadPhoto();
	   				 return;
	   			 }
	   		 });
			 
	    	}
	    	else{
	    	$.mobile.loading("hide");
	    	
	    
		    var message = "";;
		    switch(error.code)
	        {
	            case FileError.NOT_FOUND_ERR:
	               // logger.logToConsole("File Not Found");
	            	message = "File not found";
	                break;
	            case FileError.SECURITY_ERR:
	            	message ="Security Error";
	                break;
	            case FileError.ABORT_ERR:
	            	message ="Abort error";
	                break;
	            case FileError.NOT_READABLE_ERR:
	            	message ="Not Readable";
	                break;
	            case FileError.ENCODING_ERR:
	            	message ="Encoding Error";
	                break;
	            case FileError.NO_MODIFICATION_ALLOWED_ERR:
	            	message ="No Modification Allowed";
	                break;
	            case FileError.INVALID_STATE_ERR:
	            	message ="Invalid State";
	                break;
	            case FileError.SYNTAX_ERR:
	            	message ="Syntax Error";
	                break;
	            case FileError.INVALID_MODIFICATION_ERR:
	            	message ="Invalid Modification Error";
	                break;
	            case FileError.QUOTA_EXCEEDED_ERR:
	            	message ="Quota Exceeded";
	                break;
	            case FileError.TYPE_MISMATCH_ERR:
	            	message ="Type Mismatch Error";
	                break;
	            case FileError.PATH_EXISTS_ERR:
	            	message ="Path Already Exists Error";
	                break;
	        }
	    	}
	        console.log(error);

    	}
	    catch(e){
	    	dumpError("onFileUploadError",e);
	    }

    }
    
    
    

    
    function getImageList(){
    	try{
	        var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	  	        $.ajax({
	    	          url: serverAddress+getPhotosURL,
	    	            type: "get",
	              /*     beforeSend: function (request)
	                   {
	                   request.setRequestHeader("Authorization", "Bearer "+userToken);
	                   },*/
	    	            data: [],       
	    	            success: function(response, textStatus, jqXHR) {
	    	               alert(response);
	    	               alert(textStatus);
	    	            },
	    	            error: function(jqXHR, textStatus, errorThrown) {
	    	                alert(textStatus + " " + errorThrown);
	    	                alert("Код ошибки " + errorThrown.code);
	    	            }
	    	        });
    	}
	    catch(e){
	    	dumpError("getImageList",e);
	    }
    }

    function requestUserToken(login, password){
    	try{
	    	var deferred = $.Deferred();
	    	authCount = authCount+1;
	    	//getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    	//var serverAddress = res;
	    	var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    //	alert("GetUserToken serverAddress: "+serverAddress+getTokenURL);
	    	
	        	$.mobile.loading("show",{
	        		text: "Авторизация",
	        		textVisible: true,
	        		theme: 'e',
	        	});
	            $.ajax({
	                   url:serverAddress+getTokenURL,
	                   type: "POST",
	                   contentType: "application/x-www-form-urlencoded",
	                 //  data:'grant_type=password&username=aworux@gmail.com&password=cd73geW8',
	                   data:'grant_type=password&username='+login+'&password='+password,
	                   		
	                   success: function(response, textStatus, jqXHR) {
	                	// lert("GET uSER TOKEN:" +jqXHR.responseText);
	                       var obj = jQuery.parseJSON(jqXHR.responseText);
	                       var userToken = obj.access_token;
	                   		openDB(login);
	                       putSetting(SETTING_USER_LOGIN, login);
	                       putSetting(SETTING_USER_PASSWORD, password);
	                       putSetting(SETTING_USER_TOKEN, userToken);
	
	                       authCount = 0;
	               		  $.mobile.loading("hide");
	                      // showMainPage();
	                     deferred.resolve(userToken);  
	                   },
	                   error: function(jqXHR, textStatus, errorThrown) {
	                	 /*  alert("getUserToken: "+textStatus + " " + errorThrown+" "+jqXHR.responseText+textStatus);
	                	   alert("login: "+login+ " password: "+password);
	               			$.mobile.loading("hide");
	               			*/
	                	/*   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
	                    	   //showMainPage();
	                		   $.mobile.loading("hide");
	                		   showErrorDialog(getErrorMessage(res));
	                    	   deferred.resolve("");
	                		   
	                	   });*/
	                	  /* onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){

                           	                        		   $.mobile.loading("hide");
                           	                        		   if (res==SERVER_ERROR_TRY_AGAIN)*/
                           	                        		 var  res = SERVER_ERROR_NO_AUTH;
                           	                        		     showErrorDialog(getErrorMessage(res));
                           	                        		     authCount = 0;
                           	                        		   deferred.resolve("");

                           	                    	  // });
	                   } 
	                   });  
	    	//});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestUserToken",e);
	    }

    }


    function requestUserEnvironment(){
    	try{
			var start = new Date().getTime();

	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка окружения пользователя",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	   // 	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress =getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    	   $.ajax({
	    	          url: serverAddress+getEnvironmentURL,
	    	            type: "get",
	                beforeSend: function (request)
	                {
	                request.setRequestHeader("Authorization", "Bearer "+userToken);
	                },
	    	            data: [],       
	    	            success: function(response, textStatus, jqXHR) {
	    	            //	alert("user environment success!");
	    	            //   alert(jqXHR.responseText);
	    	            	if (debugMode==true)
								var end = new Date().getTime();
								var time = end - start;
								console.log('user environment server requesttime: ' + time);
							console.log("request user environment: "+jqXHR.responseText);
	    	               //putSetting(SETTING_USER_ENVIRONMENT,jqXHR.responseText);
	    	               addUserEnvironment(jqXHR.responseText);
	    	           		var json = jQuery.parseJSON(jqXHR.responseText);
	    	           		for (var k in json.Widgets) {
	    	  				  var w = json.Widgets[k];
	    	  				  	addWidget(w.VisualObjectId, JSON.stringify(w));

	    	           		}
	    	           		$.mobile.loading("hide");
	    	               deferred.resolve();
	    	            },
	    	            error: function(jqXHR, textStatus, errorThrown) {
	    	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){  	              		
	                        	   if (res==SERVER_ERROR_TRY_AGAIN){
	                        		   requestUserEnvironment();
	                        	   	   deferred.resolve();
	                        	   }
	                        	   else{
	                        		   $.mobile.loading("hide");
	                        		     showErrorDialog(getErrorMessage(res));
	                        		   deferred.resolve();
	                        	   }
	                    	   });
	     
	    	            }
	    	        });
	    		});
	    //	});

	    	return deferred;
    	}
	    catch(e){

	    	dumpError("requestUserEnvironment",e);
	    	deferred.resolve();
	    }

    }


    
    /**
     * api/transactions?dateFrom=1.1.2000&dateTo=1.1.2020
     */
    function requestTransactions(){
    	try{
			var start = new Date().getTime();
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка транзакций",
	    		textVisible: true,
	    		theme: 'e',
	    	});

	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		
	    		console.log("requestTransactionsURL server address: "+serverAddress+getTransactionsURL);
	    		console.log("requestTransactionsURL user token: "+userToken);

	    		getSyncDate(SYNC_TRANSACTIONS).done(function(res){
	    		var startDate = "null";

					if (res!=0){
						var d = new Date();
						d.setTime(Date.parse(res));
						//dateFrom=1.1.2000&dateTfo=1.1.2020
						startDate = d.getDate()+"."+(d.getMonth()+1)+"."+(1900+d.getYear());
					//	alert("startDate is "+startDate);
					}
				   $.ajax({
						//  url: serverAddress+getTransactionsURL+"?dateFrom=null&dateTo=null",
						url: serverAddress+getTransactionsURL+"?dateFrom="+startDate+"&dateTo=null",
							type: "get",
						beforeSend: function (request)
						{
						request.setRequestHeader("Authorization", "Bearer "+userToken);
						},
							data: [],
							success: function(response, textStatus, jqXHR) {
							//   if (debugMode==true)
								//   console.log(jqXHR.responseText);
								var end = new Date().getTime();
								var time = end - start;
								console.log('transactions server requesttime: ' + time);

								var dateString = jqXHR.getResponseHeader("Date");
							//	alert(dateString);
								addSyncDate(SYNC_TRANSACTIONS,dateString);
								var json = jQuery.parseJSON(jqXHR.responseText);

								/*for (var k in json) {
								  var transaction = json[k];
								  var id = transaction.Id;
								  var purseID = transaction.PurseID;
								  var transactionDate = transaction.TransactionDate;
								  var categoryID = transaction.CategoryID;
								  addTransaction(id,JSON.stringify(transaction), purseID, transactionDate, categoryID);
								}
								*/
							//	alert("got transactions count: "+json.length);
								if (json.length>0){
									console.log("time: transaction count: "+json.length);
									  /*addSeveralTransactions(json,0,undefined).done(function(r){
											$.mobile.loading("hide");
											deferred.resolve();
										  var end = new Date().getTime();
										  var time = end - start;
										  console.log('getTransactions add to database time: ' + time);
									  });*/
									db.transaction(
										function(tr) {
											for (var i=0; i< json.length; i++) {

												addTransactionInTransaction(json[i], tr);
											}
											}, onError,function onSuccess(){
											$.mobile.loading("hide");
											deferred.resolve();
										});

								}
								else{
										$.mobile.loading("hide");
									   deferred.resolve();
									var end = new Date().getTime();
									var time = end - start;
									console.log('getTransactions server add 0 tr to database time: ' + time);
								}
							},
							error: function(jqXHR, textStatus, errorThrown) {
								   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
								   if (res==SERVER_ERROR_TRY_AGAIN){
									   requestTransactions();
									   deferred.resolve();
								   }
								   else{
									   $.mobile.loading("hide");
										 showErrorDialog(getErrorMessage(res));
									   deferred.resolve();
								   }


								   });


							}
						});


				});

	    	});
	   // 	});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestTransactions",e);
	    }

    }
    


    /*var getProductListsURL = "api/productlists";*/
    function requestShopLists(){
    	try{
			var start = new Date().getTime();
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка списков покупок",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		console.log("requestShopLists server address: "+serverAddress+getProductListsURL);
	    		console.log("requestShopLists user token: "+userToken);
	    	   $.ajax({
	    	          url: serverAddress+getProductListsURL,
	    	            type: "get",
	                beforeSend: function (request)
	                {
	                request.setRequestHeader("Authorization", "Bearer "+userToken);
	                },
	    	            data: [],       
	    	            success: function(response, textStatus, jqXHR) {
	    	            	deleteShopListsTable();
							var end = new Date().getTime();
							var time = end - start;
							console.log('shop lists server requesttime: ' + time);
	    	               if (debugMode==true)console.log(jqXHR.responseText);
	    	           		var json = jQuery.parseJSON(jqXHR.responseText);
	    	           	//	for (var k in json) {
	
	    	           	/*	  var shopList = json[k];
	    	           		  var id = shopList.Id;
	    	           		  var name = shopList.Name;
	    	           		  var createdAt = shopList.CreatedAt;
	    	           		  var accountID = shopList.AccountID;
	    	           		  var itemsJSON = JSON.stringify(shopList.Items);
	    	           		  var fullJSON = JSON.stringify(shopList);
	    	           		*/  
	
	    	           			
	    	           		if (json.length>0)
	    	           		  addSeveralShopLists(json,0, undefined).done(function(r){
	    	    	           		$.mobile.loading("hide");
	    	    	           		deferred.resolve();
	    	           		  });
	    	           		else{
	    	           			$.mobile.loading("hide");
		    	           		deferred.resolve();
	    	           		}
	    	           			
		         	          //addShopList(id,name, accountID,createdAt, fullJSON, itemsJSON);
	
	    	            },
	    	            error: function(jqXHR, textStatus, errorThrown) {
	    	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
	                      	   if (res==SERVER_ERROR_TRY_AGAIN){
	                      		   requestShopLists();
	                      	   	   deferred.resolve();
	                      	   }
	                      	   else{
	                      		   $.mobile.loading("hide");
	                      		     showErrorDialog(getErrorMessage(res));
	                      		   deferred.resolve();
	                      	   }
	                   	   });
	    	            }
	    	        });
	    		});
	    	//});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestShopLists",e);
	    }

    }
    
    
    function sendShopList(listID){
    	try{
	    	$.mobile.loading("show",{
	    		text: "Отправка списка покупок",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	
	    	var deferred = $.Deferred();
	    	getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
	    		var log = login;
	    		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
	    		var pass = password;
	    			requestUserToken(log, pass).done(function(uToken){
	    	//getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		console.log("sendShopList server address: "+serverAddress+getProductListsURL);
	    		console.log("sendShopList user token: "+userToken);
	    		
	    		
	    		getShopList(listID).done(function(result){
	    		//	alert("Count of such listIDs: "+result.rows.length);
	    			
	    		var list =new Object();
	    		var row = result.rows.item(0);
	    		var listJSON = '';
	    		if (row.fullJSON!=''){
		    		list = jQuery.parseJSON(row.fullJSON);
		    	//	alert("Sending list id: "+list.Id);
		    		list.Items = jQuery.parseJSON(row.itemsJSON);
		    		listJSON = JSON.stringify(list);
	    		}
	    		else{
	    			alert ("row full json is empty");
	    		}
	    	
	    		console.log("sending shop list: "+listJSON);
		    	   $.ajax({
		    	          url: serverAddress+getProductListsURL,
		    	          type: "post",
		    	        //    contentType: "application/json; charset=utf-8",
		                beforeSend: function (request)
		                {
			                request.setRequestHeader("Authorization", "Bearer "+userToken);
			                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		                },
		    	            data: listJSON,       
		    	            success: function(response, textStatus, jqXHR) {
		    	              if (debugMode==true) console.log(jqXHR.responseText);
		    	           var json = jQuery.parseJSON(jqXHR.responseText);
		    	           //		alert("status: "+textStatus);
		    	           		res = jqXHR.responseText.replace(/"/g,"");
		    	         //  		alert("received ID: "+res);
		    	           		//addShopList(id,name, createdAt, fullJSON, itemsJSON)
		    	           		/*if (row.id!=tempShopListID){
		    	           			addShopList(row.id, row.name, row.accountID,row.createdAt,JSON.stringify(list), JSON.stringify(list.Items));
		    	           		}*/
		    	           		//updateShopListsPage(true);
		    	           		addShopListID(res, tempShopListID);
		    	           		
		    	           		$.mobile.loading("hide");
		    	           		deferred.resolve(res);
		    	            },
		    	            error: function(jqXHR, textStatus, errorThrown) {
		    	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
		                        	   if (res==SERVER_ERROR_TRY_AGAIN){
		                        		   sendShopList(listID);
		                        	   	   deferred.resolve();
		                        	   }
		                        	   else{
		                        		   $.mobile.loading("hide");
		                        		     showErrorDialog(getErrorMessage(res));
		                        		   deferred.resolve();
		                        	   }
	
		                    	   });
		    	            }
		    	        });
		    		});
	    		});
	    	//});
	    	});});});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("sendShopList",e);
	    }

    }
    
    
    

    function sendShopLists(){
    	try{
	    	var deferred = $.Deferred();
	    	getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
	    		var log = login;
	    		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
	    		var pass = password;
	    			requestUserToken(log, pass).done(function(uToken){
				    	getShopLists().done(function(res){
							for (var i=0; i<res.rows.length;i++){
								var row = res.rows.item(i);
								var listID =  row.id;
								sendShopList(listID);
							}
							deferred.resolve();
						});
	    			});
	    		});
	    	});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("sendShopLists",e);
	    }

    }
    
    
    function sendRegistration(email, nick , promo){
    	try{
	    	$.mobile.loading("show",{
	    		text: "Регистрация",
	    		textVisible: true,
	    		theme: 'e'
	    	});
	    	var deferred = $.Deferred();
	    	
	    	var jsonData = new Object();
	    	jsonData.Email = email;
	    	jsonData.HowToReferTo = nick;
	    	jsonData.PromoCode = promo;
	    	
	    	var jsonText = JSON.stringify(jsonData);
	    	
			//facebookConnectPlugin.logEvent("Registrarion event", jsonData);
	    	dumpEvent("Registrarion event", jsonData);
	
	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
		    	   $.ajax({
		    	          url: serverAddress+getRegistrationURL,
		    	          type: "post",
	
		                beforeSend: function (request)
		                {
			            //
			                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		                },
		    	            data: jsonText,       
		    	            success: function(response, textStatus, jqXHR) {
		    	            	$.mobile.loading("hide");
		    	            	window.localStorage.setItem(SETTING_USER_LOGIN,email);
		    	         	    showDialog("Регистрация успешно пройдена",
									"Благодарим Вас за регистрацию.На Ваш адрес электронный почты мы отправили пароль, используйте его для входа в систему.");
		    	           		deferred.resolve("success");
		    	            },
		    	            error: function(jqXHR, textStatus, errorThrown) {
		                        		   $.mobile.loading("hide");
		                        		   showErrorDialog(jqXHR.responseText);
		                        		   deferred.resolve("fail");
		    	            }
		    	        });
		   //		});
	
	    	return deferred;	
    	}
	    catch(e){
	    	dumpError("sendRegistration",e);
	    }

    }
    
 

    function requestGoodItems(){
    	try{
			var start = new Date().getTime();

	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка видов продуктов",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	//getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		console.log("requestGoodItems server address: "+serverAddress+getGoodItemsURL);
	    		console.log("requestGoodItems user token: "+userToken);
	    		//alert("requesting good items!");
	    		
	     	   $.ajax({
	 	          url: serverAddress+getGoodItemsURL,
	 	            type: "get",
	             beforeSend: function (request)
	             {
	            	 request.setRequestHeader("Authorization", "Bearer "+userToken);
	             },
	 	            data: [],       
	 	            success: function(response, textStatus, jqXHR) {
	 	            	deleteGoodItemsTable();
						var end = new Date().getTime();
						var time = end - start;
						console.log('good items server requesttime: ' + time);
	 	               if(debugMode==true)console.log(jqXHR.responseText);
	 	               
	 	           		var json = jQuery.parseJSON(jqXHR.responseText);
						db.transaction(
							function(transaction) {
								for (var k in json) {
									var item = json[k];
									//+'(id integer primary key autoincrement,tag, value, measure, color,soundTranscription,json)');
									var tag = item.Tag;
									var value = item.Value;
									var measure = item.Measure;
									var color = item.Color;
									var soundTranscription = item.SoundTranscription;

									addGoodItemInTransaction(tag, value, measure, color, soundTranscription, JSON.stringify(item), transaction);
								};
							}, onError, onSuccess);

	 	           	$.mobile.loading("hide");
	 	           		deferred.resolve();
	 	            },
	 	            error: function(jqXHR, textStatus, errorThrown) {
	 	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
	                  	   if (res==SERVER_ERROR_TRY_AGAIN){
	                  		   requestGoodItems();
	                  	   	   deferred.resolve();
	                  	   }
	                  	   else{
	                  		   $.mobile.loading("hide");
	                  		     showErrorDialog(getErrorMessage(res));
	                  		   deferred.resolve();
	                  	   }
	
	                 	   });
	 	            }
	 	        });
	    		
	    		
	    		
	    		});
	    	//});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestGoodItems",e);
	    }

    }
    


    
    function requestGoodMeasures(){
    	try{
			var start = new Date().getTime();

	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка единиц измерения",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		console.log("requestGoodMeasures server address: "+serverAddress+getGoodMeasuresURL);
	    		console.log("requestGoodMeasures user token: "+userToken);
	    	//	alert("requestiong good Measures!");
	      	   $.ajax({
	  	          url: serverAddress+getGoodMeasuresURL,
	  	            type: "get",
	              beforeSend: function (request)
	              {
	             	 request.setRequestHeader("Authorization", "Bearer "+userToken);
	              },
	  	            data: [],       
	  	            success: function(response, textStatus, jqXHR) {
						var end = new Date().getTime();
						var time = end - start;
						console.log('good measures server requesttime: ' + time);
	  	            	deleteGoodMeasuresTable();
	  	               if (debugMode==true)console.log(jqXHR.responseText);
	  	           		var json = jQuery.parseJSON(jqXHR.responseText);
						db.transaction(
							function(transaction) {
								for (var k in json) {
								  var item = json[k];
								//  alert(JSON.stringify(item));
								  var index = item.Index;
								  var name = item.name;
								  addGoodMeasureInTransaction(index, name,transaction);
								};
							}, onError, onSuccess);

	  	           	$.mobile.loading("hide");
	  	           		deferred.resolve();
	  	            },
	  	            error: function(jqXHR, textStatus, errorThrown) {
	  	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
	
	                  	   if (res==SERVER_ERROR_TRY_AGAIN){
	                  		   requestGoodMeasures();
	                  	   	   deferred.resolve();
	                  	   }
	                  	   else{
	                  		   $.mobile.loading("hide");
	                  		     showErrorDialog(getErrorMessage(res));
	                  		   deferred.resolve();
	                  	   }
	
	                  	   });
	  	            }
	  	        });
	    		});
	    	//});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestGoodMeasures",e);
	    }

    }

    function writeToFile(fileName,data){
    	try{
	    	fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function gotFileEntry(fileEntry){
	    		  fileEntry.createWriter( function gotFileWriter(writer) {
	    		        writer.write(data);
	    		    }, onError);
	    	}, onError);
    	}
	    catch(e){
	    	dumpError("writeToFile",e);
	    }
    }
    
    
    
    
    function onServerRequestError(jqXHR, textStatus, errorThrown){
    	var deferred = $.Deferred();
    	try{

	    	if (authCount>2){
		    	    $.mobile.loading("hide");

		    	    showErrorDialog(jqXHR.responseText);
		    //	    getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
		     //   		var log = login;
		      //  		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
		       // 		var pass = password;
		        		
		        		 deferred.resolve(SERVER_ERROR_NO_AUTH);
		        		return deferred;
		    //    		});
		   // 	    });
	    	}
	    	/*
	    	var SERVER_ERROR_NO_INTERNET = "noInternet";
	    	var SERVER_ERROR_NO_AUTH = "noAuth";
	    	var SERVER_ERROR_NO_CONNECTION_TO_HOST = "noConnectionToHost";
	    	var SERVER_ERROR_OTHER = "other";
	    	var SERVER_ERROR_TRY_AGAIN = "tryAgain";
	    	*/
	    
	    	var networkState = navigator.connection.type;
	   	    var states = {};
	   	    states[Connection.UNKNOWN]  = 'Unknown connection';
	   	    states[Connection.ETHERNET] = 'Ethernet connection';
	   	    states[Connection.WIFI]     = 'WiFi connection';
	   	    states[Connection.CELL_2G]  = 'Cell 2G connection';
	   	    states[Connection.CELL_3G]  = 'Cell 3G connection';
	   	    states[Connection.CELL_4G]  = 'Cell 4G connection';
	   	    states[Connection.CELL]     = 'Cell generic connection';
	   	    states[Connection.NONE]     = 'No network connection';
	   	//	alert(  states[networkState]);
	
	    	if (networkState==Connection.NONE){
	    		$.mobile.loading("hide");
	    		deferred.resolve(SERVER_ERROR_NO_INTERNET);
	    	
	    		showErrorDialog("Проверьте соединение с интернетом");
	    		authCount = 0;
	    		return deferred;
	    	}
	
	
	    /*	var isReachable = false;
	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
		    	$.get(getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT))
		    	    .done( function(){ isReachable = true; } )
		    	    .fail( function(){ isReachable = false; 
		    	    deferred.resolve(SERVER_ERROR_NO_CONNECTION_TO_HOST);
		    	    $.mobile.loading("hide");
		    	 
		    	    authCount = 0;
		    	    return deferred;
		    	    } );
		    	    */
	    //	});
	    	
	    	if ((errorThrown==="Unauthorized")|(errorThrown==="Bad Request")){
	    	//	getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
	        //		var log = login;
	       // 		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
	       // 		var pass = password;
	       			var log = getSettingFromStorage(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT);
	       			var pass = getSettingFromStorage(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT);
	        			requestUserToken(log, pass).done(function(uToken){
	                		var userToken = uToken;
	                		if (userToken!=""){
	                			deferred.resolve(SERVER_ERROR_TRY_AGAIN);
	                			
	                		}
	                		else{
	                			deferred.resolve(SERVER_ERROR_NO_AUTH);
	                			$.mobile.loading("hide");
	                		}
	                		
	                		
	        			});
	        		//});
	        //	});
	    	}
	    	else{
		    	$.mobile.loading("hide");
		    	deferred.resolve(SERVER_ERROR_OTHER);
		    	alert("Сервер ответил "+jqXHR.reponseText);
		        alert(textStatus + " " + errorThrown);
		        alert("Код ошибки " + errorThrown.code);
		       
	    	}
	    	
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("onServerRequestError",e);
	      	deferred.resolve(SERVER_ERROR_OTHER);
	      	return deferred;
	    	
	    }

    }
    
    
  /*  function registerUser(email, nick, promo){
    	var deferred = $.Deferred();
    		setTimeout(deferred.resolve(), 1000);
    	return deferred;
    }
    */
    
    function requestAndGetError(){
    	try{
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Тест",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    	   $.ajax({
	    	          url: serverAddress+getTestErrorURL,
	    	            type: "get",
	                beforeSend: function (request)
	                {
	                request.setRequestHeader("Authorization", "Bearer "+userToken);
	                },
	    	            data: [],       
	    	            success: function(response, textStatus, jqXHR) {
	    	            	alert("success! response is "+response);
	    	            	alert("textStatus is "+textStatus);
	    	            	alert("jqXHR is "+jqXHR.reponseText);
	    	           		$.mobile.loading("hide");
	    	               deferred.resolve();
	    	            },
	    	            error: function(jqXHR, textStatus, errorThrown) {
	
	    	            
	    	            /*	alert("error! error thrown is "+errorThrown);
	    	            	alert("textStatus is "+textStatus);
	    	            	
	    	            	alert("jqXHR is "+jqXHR.responseText);
	    	            	*/
	    	            	   $.mobile.loading("hide");
	    	            	   showErrorDialog(jqXHR.responseText);
	                		   deferred.resolve();
	    	            }
	    	        });
	    		});
	    	//});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestAndGetError",e);
	    }

    }
    
    

    function getImage(uid){
    	var deferred = $.Deferred();
    	try{
	    	
	    	$.mobile.loading("show",{
	    		text: "Загрузка образа",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		
	    	    var fileTransfer = new FileTransfer();
	    	    var uri = encodeURI(serverAddress+getPhotoURL+uid);
	    		var filePath =  receivedPhotoDir +uid;

	    	    fileTransfer.download(
	    	            uri,
	    	            filePath,
	    	            function(entry) {
	    	                $.mobile.loading("hide");
                		    deferred.resolve();
	    	            },
	    	            function(error) {
	    	                console.log("download error source " + error.source);
	    	                console.log("download error target " + error.target);
	    	                console.log("download error code" + error.code);
	    	            	   $.mobile.loading("hide");
	    	            	   showErrorDialog("download error source " + error.source +" "+error.target+" "+error.code);
	                		   deferred.resolve();

	    	            },
	    	            true,
	    	            {
	    	                headers: {
	    	                    "Authorization":"Bearer "+userToken
	    	                }
	    	            }
	    	        );
	    		

	    		});
	    //	});

    	}
	    catch(e){
	    	dumpError("getImage",e);
	    }
	    return deferred;
    }
                                    


   function requestDictionaries(){
      	try{
			var start = new Date().getTime();
  	    	var deferred = $.Deferred();
  	    	$.mobile.loading("show",{
  	    		text: "Загрузка справочников",
  	    		textVisible: true,
  	    		theme: 'e',
  	    	});
  	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
  	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
  	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
  	    		var userToken = uToken;
  	    		console.log("requestDictionaries server address: "+serverAddress+getDictionariesURL);
  	    		console.log("requestDicrtionaries user token: "+userToken);
  	    	//	alert("requestiong good Measures!");
  	      	   $.ajax({
  	  	          url: serverAddress+getDictionariesURL,
  	  	            type: "get",
  	              beforeSend: function (request)
  	              {
  	             	 request.setRequestHeader("Authorization", "Bearer "+userToken);
  	              },
  	  	            data: [],
  	  	            success: function(response, textStatus, jqXHR) {
						var end = new Date().getTime();
						var time = end - start;
						console.log('dictionaries server requesttime: ' + time);
  	  	            	deleteDictionariesTable();
  	  	               if (debugMode==true)console.log(jqXHR.responseText);
  	  	           		var json = jQuery.parseJSON(jqXHR.responseText);


  	  	           	/*	  var categories = json.Categories;
							 $.each(categories, function(key, value) {
									$.each(value, function(key, value) {
										var categoryID = key;
										$.each(value, function(key, value) {
											var categoryName = key;
											$.each(value, function(key, value) {
												addCategory(categoryID, categoryName);
												$.each(value, function(key, value) {
													addSubCategory(key,value,categoryID);
												});
										});
										//addCategory(key,value);
									  });
								});

							  });
*/



						db.transaction(
							function(transaction) {
								var categories = json.Categories;
								$.each(categories, function (key, value) {
									$.each(value, function (key, value) {
										var categoryID = key;
										$.each(value, function (key, value) {
											var categoryName = key;
											$.each(value, function (key, value) {
												addCategoryInTransaction(categoryID, categoryName, transaction);
												$.each(value, function (key, value) {
												//	addSubCategory(key, value, categoryID);
													addSubCategoryInTransaction(key, value, categoryID, transaction);
												});
											});
										});
									});

								});
							},onError, onSuccess);


							var tags = json.Tags;
							db.transaction(
								function(transaction) {
									$.each(tags, function(key, value) {
											$.each(value, function(key, value) {
												//addTag(key,value);
												addTagInTransaction(key, value, transaction);
												fullTagsArray[key] = value;
											});;
									});
								},
								function onError(error){
									console.log("Error trying to add tag item!");
								},onSuccess);



  	  	           	$.mobile.loading("hide");
  	  	           		deferred.resolve();
  	  	            },
  	  	            error: function(jqXHR, textStatus, errorThrown) {
  	  	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){

  	                  	   if (res==SERVER_ERROR_TRY_AGAIN){
  	                  		   requestDictionaries();
  	                  	   	   deferred.resolve();
  	                  	   }
  	                  	   else{
  	                  		   $.mobile.loading("hide");
  	                  		     showErrorDialog(getErrorMessage(res));
  	                  		   deferred.resolve();
  	                  	   }

  	                  	   });
  	  	            }
  	  	        });
  	    		});
  	    //});
  	    	return deferred;
      	}
  	    catch(e){
  	    	dumpError("requestDcitionaries",e);
  	    }

      }


      function sendFeedback(id, mark,remark,reason){
    	  try{
  	    	$.mobile.loading("show",{
  	    		text: "Отправка отзыва",
  	    		textVisible: true,
  	    		theme: 'e',
  	    	});
  	    	
  	    	var deferred = $.Deferred();
  	    //	alert("trying to send feedback id: "+id+" mark: "+mark+" remark:"+remark+" reason:"+reason);
  	    	getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
  	    		var log = login;
  	    		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
  	    		var pass = password;
  	    			requestUserToken(log, pass).done(function(uToken){
  	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
  	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
  	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
  	    		var userToken = uToken;
  	    		console.log("sendFeedback server address: "+serverAddress+sendFeedbackURL);
  	    		console.log("sendFeedback user token: "+userToken);
  	    		

  	    			
  	    			
  	    		var feedback =new Object();
  	    		feedback.Id = id;
  	    		feedback.Mark = mark;
  	    		feedback.Remark = remark;
  	    		feedback.Reason = reason;
  	    		//alert(JSON.stringify(feedback));
  		    	   $.ajax({
  		    	          url: serverAddress+sendFeedbackURL,
  		    	          type: "post",
  		                beforeSend: function (request)
  		                {
  			                request.setRequestHeader("Authorization", "Bearer "+userToken);
  			                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  		                },
  		    	        data:  JSON.stringify(feedback),
  		    	        success: function(response, textStatus, jqXHR) {
  		    	        console.log(jqXHR.responseText);
  		    	    
  		    	          var json = jQuery.parseJSON(jqXHR.responseText);

  		    	           		$.mobile.loading("hide");
  		    	           		deferred.resolve();

  		    	            },
  		    	            error: function(jqXHR, textStatus, errorThrown) {
  		    	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
  		                        	   if (res==SERVER_ERROR_TRY_AGAIN){
  		                        		   sendFeedback(id, mark,remark);
  		                        	   	   deferred.resolve();
  		                        	   }
  		                        	   else{

  		                        		   $.mobile.loading("hide");
  		                        		     showErrorDialog(getErrorMessage(res));
  		                        		   deferred.resolve();
  		                        	   }
  	
  		                    	   });
  		    	            }
  		    	        });
  	    		});
  	    //	});
  	    	});});});
  	    	  $.mobile.loading("hide");
  	    	return deferred;
      	}
       	  catch(e){
       	    	dumpError("sendFeedback",e);
           }
      }


       function requestFeedback(receiptID){
          	try{
      	    	var deferred = $.Deferred();
      	    	$.mobile.loading("show",{
      	    		text: "Загрузка отзыва",
      	    		textVisible: true,
      	    		theme: 'e',
      	    	});
      	    //	getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
      	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
      	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
      	    		var userToken = uToken;
      	    		console.log("requestFeedbackURL server address: "+serverAddress+getFeedbackURL+receiptID);
      	    		console.log("requestFeedbackURL user token: "+userToken);
      	    	   $.ajax({
      	    	          url: serverAddress+getFeedbackURL+receiptID,
      	    	            type: "get",
      	                beforeSend: function (request)
      	                {
      	                request.setRequestHeader("Authorization", "Bearer "+userToken);
      	                },
      	    	            data: [],
      	    	            success: function(response, textStatus, jqXHR) {
      	    	           		deferred.resolve(jqXHR.responseText);
      	    	            },
      	    	            error: function(jqXHR, textStatus, errorThrown) {
      	    	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
      	                      	   if (res==SERVER_ERROR_TRY_AGAIN){
      	                      		 	requestFeedback(receiptID)
      	                      	   	   deferred.resolve("");
      	                      	   }
      	                      	   else{
      	                      		   $.mobile.loading("hide");
      	                      		   showErrorDialog(getErrorMessage(res));
      	                      		   deferred.resolve("");

      	                      	   }
      	                   	   });
      	    	            }
      	    	        });
      	    		});
      	    	//});
      	    	return deferred;
          	}
      	    catch(e){
      	    	dumpError("requestFeedback",e);
      	    }

          }


function changeSubCategory(transactionID, subcategory){
    	try{
	    	$.mobile.loading("show",{
	    		text: "Смена подкатегории транзакции",
	    		textVisible: true,
	    		theme: 'e',
	    	});

	    	var deferred = $.Deferred();
	    	getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
	    		var log = login;
	    		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
	    		var pass = password;
	    			requestUserToken(log, pass).done(function(uToken){

	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		console.log("changeSubCategory server address: "+serverAddress+getTransactionsURL);
	    		console.log("changeSubCategory user token: "+userToken);

	    	
	    		getTransaction(transactionID).done(function(res){
	    		var js = jQuery.parseJSON(res.rows.item(0).transactionJSON);
				js.SubCategory = subcategory;

		    	   $.ajax({
		    	          url: serverAddress+getTransactionsURL,
		    	          type: "post",

		                beforeSend: function (request)
		                {
			                request.setRequestHeader("Authorization", "Bearer "+userToken);
			                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		                },
		    	            data: JSON.stringify(js),
		    	            success: function(response, textStatus, jqXHR) {

							jqXHR.responseText=jqXHR.responseText.replace(/"/g,"");
							if (jqXHR.responseText==transactionID){


							 addSeveralTransactions(js,0,undefined).done(function(r){
                            				    	           		$.mobile.loading("hide");
                            				    	           		deferred.resolve();
                            			    	           	  });
							}
							else{
								//alert("errors while changing subcategrory");
							}


		    	           		$.mobile.loading("hide");
		    	           		deferred.resolve(res);
		    	            },
		    	            error: function(jqXHR, textStatus, errorThrown) {
		    	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
		                        	   if (res==SERVER_ERROR_TRY_AGAIN){
		                        		   changeSubCategory(transactionID, subcategory);
		                        	   	   deferred.resolve();
		                        	   }
		                        	   else{
		                        		   $.mobile.loading("hide");
		                        		     showErrorDialog(getErrorMessage(res));
		                        		   deferred.resolve();
		                        	   }

		                    	   });
		    	            }
		    	        });
		    		});
	    		});
	    	//});
	    	});});});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("changeSubCAtegory",e);
	    }

    }



function changeCategory(transactionID, category){
	try{
		$.mobile.loading("show",{
			text: "Смена категории транзакции",
			textVisible: true,
			theme: 'e',
		});

		var deferred = $.Deferred();
		getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
			var log = login;
			getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
				var pass = password;
				requestUserToken(log, pass).done(function(uToken){

					var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
					getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
						var userToken = uToken;
						console.log("changeCategory server address: "+serverAddress+getTransactionsURL);
						console.log("changeCategory user token: "+userToken);


						getTransaction(transactionID).done(function(res){
							var js = jQuery.parseJSON(res.rows.item(0).transactionJSON);
							js.Category = category;

							$.ajax({
								url: serverAddress+getTransactionsURL,
								type: "post",

								beforeSend: function (request)
								{
									request.setRequestHeader("Authorization", "Bearer "+userToken);
									request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
								},
								data: JSON.stringify(js),
								success: function(response, textStatus, jqXHR) {

									jqXHR.responseText=jqXHR.responseText.replace(/"/g,"");
									if (jqXHR.responseText==transactionID){

										addSeveralTransactions(js,0,undefined).done(function(r){
											$.mobile.loading("hide");
											deferred.resolve();
										});
									}
									else{
										//alert("errors while changing subcategrory");
									}


									$.mobile.loading("hide");
									deferred.resolve(res);
								},
								error: function(jqXHR, textStatus, errorThrown) {
									onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
										if (res==SERVER_ERROR_TRY_AGAIN){
											changeCategory(transactionID, category);
											deferred.resolve();
										}
										else{
											$.mobile.loading("hide");
											showErrorDialog(getErrorMessage(res));
											deferred.resolve();
										}

									});
								}
							});
						});
					});
					//});
				});});});
		return deferred;
	}
	catch(e){
		dumpError("changeCAtegory",e);
	}

}




 function requestBadHabits(){
    	try{
			var start = new Date().getTime();
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка статистики вредных привычек",
	    		textVisible: true,
	    		theme: 'e',
	    	});

	    		var serverAddress =getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    	   $.ajax({
	    	          url: serverAddress+getHabitsURL,
	    	            type: "get",
	                beforeSend: function (request)
	                {
	               	 request.setRequestHeader("Authorization", "Bearer "+userToken);
	                },
	    	            data: [],
	    	            success: function(response, textStatus, jqXHR) {
	    	            //	alert("user environment success!");
	    	            //   alert(jqXHR.responseText);
	    	            //	if (debugMode==true)
							var end = new Date().getTime();
							var time = end - start;
							console.log('habits server requesttime: ' + time);
	    	            		console.log("request user habts: "+jqXHR.responseText);
							//alert("request user habts: "+jqXHR.responseText);
	    	               //putSetting(SETTING_USER_ENVIRONMENT,jqXHR.responseText);
	    	               addBadHabits(jqXHR.responseText);

	    	           		$.mobile.loading("hide");
	    	               deferred.resolve();
	    	            },
	    	            error: function(jqXHR, textStatus, errorThrown) {
	    	              	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
	                        	   if (res==SERVER_ERROR_TRY_AGAIN){
                                  	   requestBadHabits();
                                  	    deferred.resolve();
                                  	    }
                                  	  else{
                                  	       $.mobile.loading("hide");
                                  	       showErrorDialog(getErrorMessage(res));
                                  	        deferred.resolve();
                                  	   }
	                    	   });

	    	            }
	    	        });
	    		});
	    //	});

	    	return deferred;
    	}
	    catch(e){

	    	dumpError("requestBadHabits",e);
	    	deferred.resolve();
	    }

    }
