var currentRowID = 0;function uploadPhoto() {    var billsToSend = 0;    if (!db) return;     db.transaction(    function(transaction) {        transaction.executeSql('SELECT * FROM Bills where sent=0;', [], function(transaction, result) {        var array = new Array(result.rows.length);   	 if (result.rows.length==0){		 $.mobile.loading("hide");	 }            for (var i = 0; i < result.rows.length;i++) {             var row = result.rows.item(i);             if (row.sent==0){            	 console.log("UPLOADING PHOTO "+row.id);            	 $.mobile.loading("show",{             		text: "�������� ���� "+row.id,             		textVisible: true,             		theme: 'e',             	});              imageURI = row.path;                 currentRowID = row.id;		        var options = new FileUploadOptions();		        options.fileKey="test.jpg";		        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);		        options.mimeType="image/jpeg";		        var params = new Object();		        options.params = params;		        var headers={'Authorization':'Bearer '+userToken};		        options.headers = headers;		        var ft = new FileTransfer();		        var loadingStatus; 		        ft.onprogress = function(progressEvent) {				    if (progressEvent.lengthComputable) {					  //    loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);				    	  $('#uploadProgress'+row.id).show();					      $('#uploadProgress'+row.id).html(''+Math.round((progressEvent.loaded / progressEvent.total)*100)+'%');					    					   //   $('#uploadPercent').html(''+Math.round((progressEvent.loaded / progressEvent.total)*100)+'%');					 } 					 else {					      //loadingStatus.increment();						 $('#uploadProgress'+row.id).show();						 $('#uploadProgress'+row.id).html(''+loadingStatus);						// $('#uploadPercent').html(''+loadingStatus);					    }					};		        var serverAddress = getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);		        ft.upload(imageURI, encodeURI(serverAddress.concat(addPhotoURL)), onFileUploadSuccess, onFileUploadError, options,true);                               		                        break;            }    	}    }, onError);    });        }    function onFileUploadSuccess(r) {        //console.log("RESPONSE FROM SERVER" + r.responseCode);        //alert("HTTP CODE "+r.responseCode);        //console.log("Response = " + r.response);        //console.log("Sent = " + r.bytesSent);      //  alert("Файл успешно отправлен!");    	setBillSent(currentRowID);    	//refreshBillSendStatus(currentRowID);    	$.mobile.loading("hide");        uploadPhoto();            }    function onFileUploadError(error) {    	$.mobile.loading("hide");       alert("������ ��� ����������� ����� " + error.code);	    console.log("upload error source " + error.source);        console.log("upload error target " + error.target);            //   setBillSentError(currentRowID);    }             /*   function getImageList(){    	var ids;    	$.get(    		    serverAddress.concat(getPhotosURL),    		   // {paramOne : 1, paramX : 'abc'},    		    function(data) {    		    	ids = data;    		     	alert(data);    		       //5460de59755df80a001da3d9 - ‚Ó‰Â ‡È‰Ë¯ÌËÍ    		          		    }    		);      	 for (var i=0; i<3; i++){	    	   var id = data[i];	    	   alert(id);	    	   console.log("image id "+i+": " + id);		       	$.get(		    		    serverAddress.concat(getPhotoURL).concat(id),		    		    function(datadd) {		    		    	alert("get "+id);		    		    	writeToFile(id.concat(".jpeg"), datadd);		    		    }		    		);	       }    	    }*/        function getImageList(){        var serverAddress = getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);  	        $.ajax({    	          url: serverAddress+getPhotosURL,    	            type: "get",              /*     beforeSend: function (request)                   {                   request.setRequestHeader("Authorization", "Bearer "+userToken);                   },*/    	            data: [],           	            success: function(response, textStatus, jqXHR) {    	               alert(response);    	               alert(textStatus);    	            },    	            error: function(jqXHR, textStatus, errorThrown) {    	                alert(textStatus + " " + errorThrown);    	                alert("������ ��� ����������� ����� " + errorThrown.code);    	            }    	        });    	    }    function getUserToken(login, password){    	// alert(login+" "+password);       // alert(serverAddress+getTokenURL);        var serverAddress = getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);    	$.mobile.loading("show",{    		text: "��������",    		textVisible: true,    		theme: 'e',    	});        $.ajax({               url:serverAddress+getTokenURL,               type: "POST",               contentType: "application/x-www-form-urlencoded",             //  data:'grant_type=password&username=aworux@gmail.com&password=cd73geW8',               data:'grant_type=password&username='+login+'&password='+password,               		               success: function(response, textStatus, jqXHR) {            	   //  alert(jqXHR.responseText);                    var obj = jQuery.parseJSON(jqXHR.responseText);                   userToken = obj.access_token;                   putSetting(SETTING_USER_LOGIN, login);                   putSetting(SETTING_USER_PASSWORD, password);                   putSetting(SETTING_USER_TOKEN, userToken);           		$.mobile.loading("hide");                   showMainPage();                                  },               error: function(jqXHR, textStatus, errorThrown) {            	   alert(textStatus + " " + errorThrown+" "+jqXHR.responseText);           		$.mobile.loading("hide");            	   // ��� �������, ������!!            	 //  showMainPage();               }                });      }    function getUserEnvironment(){//    	https://billview.cloudapp.net/receipts/api/account/environment        var serverAddress = getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);    	   $.ajax({    	          url: serverAddress+getEnvironmentURL,    	            type: "get",                beforeSend: function (request)                {                request.setRequestHeader("Authorization", "Bearer "+userToken);                },    	            data: [],           	            success: function(response, textStatus, jqXHR) {    	               alert(jqXHR.responseText);    	            },    	            error: function(jqXHR, textStatus, errorThrown) {    	                alert(textStatus + " " + errorThrown);    	                alert("������ ��� ��������� ��������� ������������ " + errorThrown.code);    	            }    	        });    }    function writeToFile(fileName,data){    	fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function gotFileEntry(fileEntry){    		  fileEntry.createWriter( function gotFileWriter(writer) {    		        writer.write(data);    		    }, onError);    	}, onError);    }                    