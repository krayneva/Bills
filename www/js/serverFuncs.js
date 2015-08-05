var SERVER_ERROR_NO_INTERNET = "noInternet";
var SERVER_ERROR_NO_AUTH = "noAuth";
var SERVER_ERROR_NO_CONNECTION_TO_HOST = "noConnectionToHost";
var SERVER_ERROR_OTHER = "other";
var SERVER_ERROR_TRY_AGAIN = "tryAgain";



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
							getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
					    		var serverAddress = res;
					    		console.log("ImageURI: ",imageURI);
					    		ft.upload(imageURI, encodeURI(serverAddress.concat(addPhotoURL)), onFileUploadSuccess, onFileUploadError, options,true);
							});
				        
		                
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
	    	//1--пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
	    
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
	      /*  alert("Ошибка при отправке файла " + message);
	        alert("HTTP RESPONSE CODE: " + error.http_status);
		    console.log("upload error source " + error.source);*/
    	}
	    catch(e){
	    	dumpError("onFileUploadError",e);
	    }

    }
    
    
    

    
    function getImageList(){
    	try{
	        var serverAddress = getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
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
	    	//getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
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
	                	   onServerRequestError(jqXHR, textStatus, errorThrown).done(function(res){
	                    	   //showMainPage();
	                		   $.mobile.loading("hide");
	                    	   deferred.resolve("");
	                		   
	                	   });
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
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка окружения пользователя",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = res;
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
	    	             //  alert(jqXHR.responseText);
	    	            	if (debugMode==true)
	    	            		console.log("request user environment: "+jqXHR.responseText);
	    	               //putSetting(SETTING_USER_ENVIRONMENT,jqXHR.responseText);
	    	               addUserEnvironment(jqXHR.responseText);
	    	           		var json = jQuery.parseJSON(jqXHR.responseText);
	    	           		for (var k in json.Widgets) {
	    	  				  var w = json.Widgets[k];
	    	  				  	addWidget(w.VisualObjectId, JSON.stringify(w));
	    	  				  	// alert (JSON.stringify(w));
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
	                        		   deferred.resolve();
	                        	   }
	                    	   });
	     
	    	            }
	    	        });
	    		});
	    	});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestUserEnvironment",e);
	    }

    }


    
    /**
     * api/transactions?dateFrom=1.1.2000&dateTo=1.1.2020
     */
    function requestTransactions(){
    	try{
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка транзакций",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = res;
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		
	    		console.log("requestTransactionsURL server address: "+serverAddress+getTransactionsURL);
	    		console.log("requestTransactionsURL user token: "+userToken);
	    		
	    	   $.ajax({
	    	          url: serverAddress+getTransactionsURL+"?dateFrom=null&dateTo=null",
	    	            type: "get",
	                beforeSend: function (request)
	                {
	                request.setRequestHeader("Authorization", "Bearer "+userToken);
	                },
	    	            data: [],       
	    	            success: function(response, textStatus, jqXHR) {
	    	               if (debugMode==true)console.log(jqXHR.responseText);
	    	         //      alert(jqXHR.responseText);
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
		    	           	if (json.length>0)
			    	           	  addSeveralTransactions(json,0,undefined).done(function(r){
				    	           		$.mobile.loading("hide");
				    	           		deferred.resolve();
			    	           	  });
		    	           	else{
			    	           		$.mobile.loading("hide");
			    	               deferred.resolve();
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
	                      		   deferred.resolve();
	                      	   }
	
	                    		   
	                    	   });
	     
	
	    	            }
	    	        });
	    		});
	    	});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestTransactions",e);
	    }

    }
    


    /*var getProductListsURL = "api/productlists";*/
    function requestShopLists(){
    	try{
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Обновление списков покупок",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = res;
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		console.log("requestTransactionsURL server address: "+serverAddress+getTransactionsURL);
	    		console.log("requestTransactionsURL user token: "+userToken);
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
	                      		   deferred.resolve();
	                      	   }
	                   	   });
	    	            }
	    	        });
	    		});
	    	});
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
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = res;
	    		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(uToken){
	    		var userToken = uToken;
	    		console.log("sendShopList server address: "+serverAddress+getProductListsURL);
	    		console.log("sendShopList user token: "+userToken);
	    		
	    		// форимруем json списка продуктов для отправки на серевр
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
	    		//listJSON ='{"AccountID":"54ef3e2073915440bcd7d216","Number":2,"Name":"Мои покупки 2","Items":[{"Tag":"TAG_VODKA","Value":"Водочка","Quantity":"1","Measure":"бутылочка","Color":-983041,"bought":"0"},{"Tag":"TAG_APPLES","Value":"Яблочки","Quantity":"1","Measure":"кг","Color":-7722014},{"Tag":"TAG_PISTACHES","Value":"Фисташки","Quantity":"1","Measure":"п.","Color":-2180985},{"Tag":"TAG_CHIPS","Value":"Чипсы","Quantity":"1","Measure":"п.","Color":-32944}],"Id":"55411209e657afb61404689f","CreatedAt":"2015-04-29T20:16:57.217+03:00"}';
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
		                        		   deferred.resolve();
		                        	   }
	
		                    	   });
		    	            }
		    	        });
		    		});
	    		});
	    	});});});});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("sendShopList",e);
	    }

    }
    
    
    
    /**
     * отправка всех списков на сервер
     */
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
	
	    //	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);
		    	   $.ajax({
		    	          url: serverAddress+getRegistrationURL,
		    	          type: "post",
	
		                beforeSend: function (request)
		                {
			            //    request.setRequestHeader("Authorization", "Bearer "+userToken);
			                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		                },
		    	            data: jsonText,       
		    	            success: function(response, textStatus, jqXHR) {
		    	           //   if (debugMode==true) console.log(jqXHR.responseText);
		    	         //  var json = jQuery.parseJSON(jqXHR.responseText);
	                		//	alert("response text: "+jqXHR.responseText);
	                		//	alert("http status is "+jqXHR.status);
		    	           		//res = jqXHR.responseText.replace(/"/g,"");
		    	            	$.mobile.loading("hide");
		    	            	window.localStorage.setItem(SETTING_USER_LOGIN,email);
		    	         	    showDialog("Регистрация успешно завершена","Благодарим Вас за регистрацию. На Ваш адрес электронный почты мы отправили пароль, используйте его для входа в систему.");
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
    
 
    
    /**
     *  запрос классификатора продуктов
     */
    function requestGoodItems(){
    	try{
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка списков продуктов",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = res;
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
	 	               if(debugMode==true)console.log(jqXHR.responseText);
	 	               
	 	           		var json = jQuery.parseJSON(jqXHR.responseText);
	 	           		for (var k in json) {
	 	           		  var item = json[k];
	 	           		  //+'(id integer primary key autoincrement,tag, value, measure, color,soundTranscription,json)');
	 	           		  var tag = item.Tag;
	 	           		  var value = item.Value;
	 	           		  var measure = item.Measure;
	 	           		  var color = item.Color;
	 	           		  var soundTranscription = item.SoundTranscription;
	 	           		  
	 	           		  addGoodItem(tag,value,measure,color,soundTranscription,JSON.stringify(item));
	 	           		}
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
	                  		   deferred.resolve();
	                  	   }
	
	                 	   });
	 	            }
	 	        });
	    		
	    		
	    		
	    		});
	    	});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestGoodItems",e);
	    }

    }
    


    
    function requestGoodMeasures(){
    	try{
	    	var deferred = $.Deferred();
	    	$.mobile.loading("show",{
	    		text: "Загрузка единиц измерения",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = res;
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
	  	            	deleteGoodMeasuresTable();
	  	               if (debugMode==true)console.log(jqXHR.responseText);
	  	           		var json = jQuery.parseJSON(jqXHR.responseText);
	  	           		for (var k in json) {
	  	           		  var item = json[k];
	  	           		//  alert(JSON.stringify(item));
	  	           		  var index = item.Index;
	  	           		  var name = item.name;
	  	           		  addGoodMeasure(index, name);
	  	           		}
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
	                  		   deferred.resolve();
	                  	   }
	
	                  	   });
	  	            }
	  	        });
	    		});
	    	});
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
    	try{
	    	var deferred = $.Deferred();
	    	if (authCount==2){
		    	    $.mobile.loading("hide");
		    	  // alert("Ошибка авторизации");
		    	    showErrorDialog(jqXHR.responseText);
		    	    getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
		        		var log = login;
		        		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
		        		var pass = password;
		        		/*alert("Логин: "+log);
		        		alert("Пароль: "+pass);
		        		*/
		        		 deferred.resolve(SERVER_ERROR_NO_AUTH);
		        		return deferred;
		        		});
		    	    });
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
	   	    // Проверяем доступность интернета
	    	if (networkState==Connection.NONE){
	    		$.mobile.loading("hide");
	    		deferred.resolve(SERVER_ERROR_NO_INTERNET);
	    		//alert("Проверьте подключение к интернету");
	    		showErroDialog("Проверьте подключение к интернету");
	    		authCount = 0;
	    		return deferred;
	    	}
	
	    	// Проверяем доступность сервера
	    	var isReachable = false;
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
		    	$.get(res)
		    	    .done( function(){ isReachable = true; } )
		    	    .fail( function(){ isReachable = false; 
		    	    deferred.resolve(SERVER_ERROR_NO_CONNECTION_TO_HOST);
		    	    $.mobile.loading("hide");
		    	   // alert("Нет связи с сервером");
		    	    showErrorDialog("Нет связи с сервером");
		    	    authCount = 0;
		    	    return deferred;
		    	    } );
	    	});
	    	// проверяем, не протух ли ключ авторизации и если что пытаемся обновить
	    	if (errorThrown==="Unauthorized"){
	    		getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(login){
	        		var log = login;
	        		getSetting(SETTING_USER_PASSWORD,USER_PASSWORD_DEFAULT).done(function(password){
	        		var pass = password;
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
	        		});
	        	});
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
	    		text: "Загрузка  тест",
	    		textVisible: true,
	    		theme: 'e',
	    	});
	    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
	    		var serverAddress = res;
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
	    	            	/// вот здесь  текст огшибки от Сергея
	    	            	alert("jqXHR is "+jqXHR.responseText);
	    	            	*/
	    	            	   $.mobile.loading("hide");
	    	            	   showErrorDialog(jqXHR.responseText);
	                		   deferred.resolve();
	    	            }
	    	        });
	    		});
	    	});
	    	return deferred;
    	}
	    catch(e){
	    	dumpError("requestAndGetError",e);
	    }

    }
