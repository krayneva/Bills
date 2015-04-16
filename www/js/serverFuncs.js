var currentRowID = 0;
function uploadPhoto() {

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
            	 console.log("UPLOADING PHOTO "+row.id);
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

    function onFileUploadSuccess(r) {
    	setBillSent(currentRowID);
    	$.mobile.loading("hide");
        uploadPhoto();
        
    }

    function onFileUploadError(error) {
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
    
        console.log(error);
        alert("Ошибка при отправке файла " + message);
        alert("HTTP RESPONSE CODE: " + error.http_status);
	    console.log("upload error source " + error.source);
    }
    
    
    

    
    function getImageList(){
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

    function requestUserToken(login, password){
    	var deferred = $.Deferred();
    	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){
    		var serverAddress = res;
    	//	alert("GetUserToken serverAddress: "+serverAddress+getTokenURL);
        	$.mobile.loading("show",{
        		text: "Загрузка",
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
                	   //  alert(jqXHR.responseText);
                        var obj = jQuery.parseJSON(jqXHR.responseText);
                       var userToken = obj.access_token;
                       putSetting(SETTING_USER_LOGIN, login);
                       putSetting(SETTING_USER_PASSWORD, password);
                       putSetting(SETTING_USER_TOKEN, userToken);
                       
               		  $.mobile.loading("hide");
                      // showMainPage();
                     deferred.resolve(userToken);  
                   },
                   error: function(jqXHR, textStatus, errorThrown) {
                	   //alert("getUserToken: "+textStatus + " " + errorThrown+" "+jqXHR.responseText+textStatus);
               			$.mobile.loading("hide");
                	   //showMainPage();
                	   deferred.resolve("");
                   } 
                   });  
    	});
    	return deferred;
    }


    function requestUserEnvironment(){
    	var deferred = $.Deferred();
    	 
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
    	             //  alert(jqXHR.responseText);
    	             //  console.log(jqXHR.responseText);
    	               //putSetting(SETTING_USER_ENVIRONMENT,jqXHR.responseText);
    	               addUserEnvironment(jqXHR.responseText);
    	               deferred.resolve();
    	            },
    	            error: function(jqXHR, textStatus, errorThrown) {
    	                if (errorThrown=="Unauthorized"){
    	                	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(login){
    	                		var log = login;
    	                		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(password){
    	                		var pass = password;
    	                		alert("Requesting userToken!");
    	                			requestUserToken(log, pass).done(function(uToken){
    	    	                		var userToken = uToken;
    	    	                		if (userToken!=""){
    	    	                			 requestTransactions();
    	    	                		}
    	    	                		else{
    	    	                			alert("Ошибка авторизации");
    	    	                			deferred.resolve();
    	    	                		}
    	                			});
    	                		});
    	                	});
    	                }
    	                else{
	    	            	alert("user token: " +userToken);
	    	            	alert("server address:"+serverAddress+getEnvironmentURL);
	    	                alert(textStatus + " " + errorThrown);
	    	                alert("Код ошибки " + errorThrown.code);
	    	                deferred.resolve();
    	                }
    	            }
    	        });
    		});
    	});
    	return deferred;
    }


    
    /**
     * api/transactions?dateFrom=1.1.2000&dateTo=1.1.2020
     */
    function requestTransactions(){
    	var deferred = $.Deferred();
   	 	
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
    	              // alert(jqXHR.responseText);
    	               console.log(jqXHR.responseText);
    	               //putSetting(SETTING_USER_ENVIRONMENT,jqXHR.responseText);
    	               //addUserEnvironment(jqXHR.responseText);
    	               
    	           		var json = jQuery.parseJSON(jqXHR.responseText);
    	           		for (var k in json) {
    	           		  var transaction = json[k];
    	           		  var id = transaction.Id;
     	           		  var purseID = transaction.PurseID;
     	           		  var transactionDate = transaction.transactionDate;
     	           		  var categoryID = transaction.categoryID;
	    	           	  addTransaction(id,JSON.stringify(transaction), purseID, transactionDate, categoryID);
    	           		}
    	               
    	               deferred.resolve();
    	            },
    	            error: function(jqXHR, textStatus, errorThrown) {
    	            	alert("user token: " +userToken);
    	                alert(textStatus + " " + errorThrown);
    	                if (errorThrown=="Unauthorized"){
    	                	getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(login){
    	                		var log = login;
    	                		getSetting(SETTING_USER_TOKEN,USER_TOKEN_DEFAULT).done(function(password){
    	                		var pass = password;
    	                			requestUserToken(log, pass).done(function(uToken){
    	    	                		var userToken = uToken;
    	    	                		if (userToken!=""){
    	    	                			 requestTransactions();
    	    	                		}
    	    	                		else{
    	    	                			alert("Ошибка авторизации");
    	    	                			deferred.resolve();
    	    	                		}
    	                			});
    	                		});
    	                	});
    	                }
    	                else{
	    	            	alert("user token: " +userToken);
	    	            	alert("server address:"+serverAddress+getEnvironmentURL);
	    	                alert(textStatus + " " + errorThrown);
	    	                alert("Код ошибки " + errorThrown.code);
	    	                deferred.resolve();
    	                }

    	            }
    	        });
    		});
    	});
    	return deferred;
    	
    }
    






    function writeToFile(fileName,data){
    	fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function gotFileEntry(fileEntry){
    		  fileEntry.createWriter( function gotFileWriter(writer) {
    		        writer.write(data);
    		    }, onError);
    	}, onError);
    }
    
    
    
    
    
