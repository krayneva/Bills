var debugMode = false;var buildVersion = "1.2.0";var pictureSource;   // picture sourcevar destinationType; // sets the format of returned value// ÔÓÒÎÂ‰Ìˇˇ ÙÓÚÓ„‡ÙËˇ Ò Í‡ÏÂ˚\‰ËÒÍ‡var currentPhoto;// ‡‰ÂÒ ÒÂ‚Â‡var addPhotoURL = "api/image/";var getPhotoURL = "api/image/";var getPhotosURL = "api/image/";var getTokenURL = "token";var getEnvironmentURL = "api/account/environment";/*GET /api/productlists - ��������� ����� ������GET /api/productlists/{id} - ��������� ������POST /api/productlists - �������� ������/����������*/var getTransactionsURL = "api/transactions";var getProductListsURL = "api/productlists";/*������ ���������GET /api/data/GoodItems/ru-ru������ ������ ���������GET /api/data/GoodMeasures/ru-ru*/var getGoodItemsURL = "api/data/GoodItems/ru-ru";var getGoodMeasuresURL = "api/data/GoodMeasures/ru-ru";var fileSystem;var db = 0;var currentPage = "pageAuth";var menuStatus =false;var keyboardHeight = 0; var currentBottom = 0;var currentPosition;document.addEventListener("online", onOnline, false);document.addEventListener("offline", onOffline, false);document.addEventListener("deviceready",onDeviceReady,false);var tempShopListID = '3113';// �������� �������� ������� ��������� �� ������var refreshIntervalId;function onDeviceReady() {        pictureSource=navigator.camera.PictureSourceType;    destinationType=navigator.camera.DestinationType;    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);//	openDB("simonita1@yandex.ru");//	$.mobile.allowCrossDomainPages = true;	//	refreshBills();//	showAuthPage();    var uuid = "593a33fc-2d22-418c-967a-a2ff60e40da6";    var token = "a676f0fc1be603eb9db15316490a605c";    var secret = "28bfa152cbb25ce82f447784994addc7";    var issuance = "1419938400";    plugins.appBlade.setupAppBlade(uuid,token, secret, issuance);    plugins.appBlade.catchAndReportCrashes();    plugins.appBlade.allowFeedbackReporting();  	        window.addEventListener('native.keyboardshow', keyboardShowHandler);    window.addEventListener('native.keyboardhide', keyboardHideHandler);               document.addEventListener("backbutton", function(e){    	console.log($( ":mobile-pagecontainer" ).pagecontainer( "getActivePage" ).prop("id"));        if($( ":mobile-pagecontainer" ).pagecontainer( "getActivePage" ).prop("id")==('pageAuth')){            //e.preventDefault();            navigator.app.exitApp();        }        else {            navigator.app.backHistory();        }    }, false);    var options = {		duration:	200,		easing:		'swing'	};    // $.mobile.pageContainer.pagecontainer({ defaults: true });    console.log("SCREEN SIZE: "+window.devicePixelRatio+" ;"+screen.width+" ;"+window.innerWidth);          //SHOW       $( ":mobile-pagecontainer" ).on( "pagecontainershow", function( event, ui ) {    	      	ui.toPage.on('taphold', function(ev) {    		ev.preventDefault();    		ev.stopPropagation();			plugins.appBlade.showFeedbackDialog("true");			return false;		});         $('#alert_dialog').on('taphold', function(ev) {                ev.preventDefault();                 ev.stopPropagation();                 plugins.appBlade.showFeedbackDialog("true");                 return false;                 });    	// PAGE BIILS    	 if (ui.toPage.attr("id")=="pageBills"){     		refreshBills();     	  }    	// PAGE MAIN    	  if (ui.toPage.attr("id")=="pageMain"){  		/*    $(".categoryMenu").click(function(e){		        $('.widgetMenu').show();		        e.stopPropagation();		        $("body").click(function (t) {		            if (!$(t.target).hasClass('categoryMenu') || !$(t.target).hasClass('widgetMenuPanel')) {		                $('.widgetMenu').hide();		            };		        });		    });*/		    $(".menu").click(function(e){		        $('.menu').addClass('menuActive');		        $('.menuPanel').show();		        e.stopPropagation();		        $("body").click(function (t) {		            if (!$(t.target).hasClass('menu') || !$(t.target).hasClass('menuPanel')) {		                $('.menuPanel').hide();		                $('.menu').removeClass('menuActive');		            };		        });		    });		    		    		    //(default: 10px)		   // $.event.special.swipe.scrollSupressionThreshold = 1;		     //(default: 1000ms)		 /*   $.event.special.swipe.durationThreshold = 3000;		     //(default: 30px)		    $.event.special.swipe.horizontalDistanceThreshold = 30;		    //(default: 75px)		    $.event.special.swipe.verticalDistanceThreshold  = 300;		   */ 		    		    $( ":mobile-pagecontainer" ).on('swipeleft', function(e) {		    	$( "#mypanel" ).panel( "close" );			});		    $( ":mobile-pagecontainer" ).on('swiperight', function(e) {		    	$( "#mypanel" ).panel( "open" , options);							});		    updateMainPage();      	  }    	  //PAGE CHECK    	  if (ui.toPage.attr("id")=="pageCheck"){    		    db.transaction(    			   	 function(transaction) {    			   		 var billID = window.localStorage.getItem(BILL_ID_KEY);    			   	        transaction.executeSql('SELECT * FROM Bills where id='+billID+';', [], function(transaction, result) {    			   	        	 var row = result.rows.item(0);    			   	        	 $('#billName').html(row.name+" "+row.id);    			   	        	 //$('#billDate').html(formatDate(row.createdate));    			   	        	 $('#billImage').attr('src',row.path);    			    	        }, onError);    		  	    });    	  }    	      	  //PAGE LOGIN    	  if (ui.toPage.attr("id")=="pageAuth"){    		 db = 0;    		 updateLoginPage();     	  }    	  // PAGE CONNECTION SETTINGS    	  if (ui.toPage.attr("id")=="pageConnectionSettings"){    		//  getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT).done(function(res){    		//	  document.getElementById('serverAddress').value =res;    		// });    	  document.getElementById('serverAddress').value =getSettingFromStorage(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);      	  }    	  // PAGE EXPENSES GRID    	  if (ui.toPage.attr("id")=="pageExpenses"){    		  window.localStorage.removeItem(TRANSACTION_ID_KEY);    		 // updateTransactionPage();    		  // ����������� ������ ���    		  requestAndUpdateTransactionPage();      	  }    	      	  // PAGE TRANSACTION INFO    	  if (ui.toPage.attr("id")=="pageTransactionInfo"){    		  updateTransactionInfoPage();    		        	  }    	      	  // PAGE SHOP LIST    	  if (ui.toPage.attr("id")=="pageShopList"){    		  // ���� �� ��������� �� ���� �������� ������ (� ������ �� ������� �-�) ��������� ���� �� ������ ������ ��� �����������    		  getShopListCount().done(function(res){    			 if (res==0){    				if (ui.prevPage.attr("id")=="pageCreateShopList")    					navigator.app.backHistory();    				else    					showCreateShopListPage();    				return;    			 }    		    		  // ������ ���� ������  		    $( ":mobile-pagecontainer" ).on('swiperight', function(e) {		    	$( "#mypanel" ).panel( "close" );			});		    $( ":mobile-pagecontainer" ).on('swipeleft', function(e) {		    	$( "#mypanel" ).panel( "open" , options);							});		    			// <li> <img class="ico" src="img/ico_8.png"/>�������� ������</li>		    // ��������� ������� �� ������� ������������ �������		    getShopLists().done(function(res){		    	$("#panelList").html('');		    		    			    	htm = "<li onclick='showCreateShopListPage()'>����� ������</li>";		    	for (var i=0; i<res.rows.length; i++){		    		var row =res.rows.item(i);		    		htm = htm+"<li id = 'list"+i+"' pos="+i+">"+row.name+"</li>";		    	}		    	/*		    	var listrowShopList = document.getElementById("shopListPanelRow").cloneNode(true);		    	for (var i=0; i<res.rows.length; i++){		    		var listrowShopList = document.getElementById("shopListPanelRow").cloneNode(true);		    		var row =res.rows.item(i);		    		listrowShopList.html("sadfasdfasdf");		    		  $('#panelList').append(listrowShopList);		    	}		    	*/		    	$("#panelList").html(htm);		    	$("#panelList").listview('refresh');	    			    			    	for (var i=0; i<res.rows.length; i++){		    	$("#list"+i).on( "tap",function(e){		    		showShopListByNumber(this.getAttribute("pos"));				 });		    	}		    		    		  console.log("Height of edit: "+  $('ul li:last').height());	     		 //window.setInterval(sendShopLists(), 5000);	     		//  refreshIntervalId =  setInterval(function(){ alert("Hello"); }, 3000);	     		  // ������ ��� ������ ������� ������ 	     		 refreshIntervalId =  setInterval(function(){	     			currentList = window.localStorage.getItem("CurrentShopListNum");	     			getShopLists().done(function(res){	     				var currentShopList = window.localStorage.getItem("CurrentShopListNum");	     				 if (currentShopList==undefined) {	     					 currentShopList = 0;	     					 window.localStorage.setItem("CurrentShopListNum",0);	     				 }	     				 var listID = res.rows.item(parseInt(currentShopList)).id;	     				 sendShopList(listID);	     			});	     				 	     			}, 1000*60*2);	     		updateShopListsPage(true);	     					     		  $('#shopListName').on( "swiperight",nextShopList);	     		  $('#shopListName').on( "swipeleft",previousShopList);	     		  $('#shopListName').bind( "tap",nextShopList);	     		  	     		/* $("#sendShopListImage").click(function(e){	     			 sendShopList(window.localStorage.getItem('ShopListID'));	     		 	});	     		 */	     		 $("#addToShopListImage").click(function(e){	     			 if ($('#inset-autocomplete-input').val()=="") return;	     				addToShopList(window.localStorage.getItem('ShopListID'),$('#inset-autocomplete-input').val()).done(	     						function (res){	     							updateShopListsPage(true);	     							 $( "#inset-autocomplete-input").val('');	     						}	     					);	     			});		    			    	});		    				});		        	  	}    	      	      	      	  // PAGE CREATE SHOP LIST    	  if (ui.toPage.attr("id")=="pageCreateShopList"){    			 $("#createShopListButton").click(function(e){    				 var s =  $("#shopListNameInput").val();	     			 	createShopList(s).done(function(){	     			 		console.log("createShopList Is done!");	     			 		sendShopList(tempShopListID).done(function(res){	     			 			console.log("send shop list is done, res: "+res);	     			 			if (res!="")	     			 			//	addShopListID(res, tempShopListID);	     			 			navigator.app.backHistory();	     			 			updateShopListsPage(true);	     			 		});	     			 	});	     		 	});      	  }    	      	});                                // ��� ��������� ��������    //$.when()    // HIDE    $( ":mobile-pagecontainer" ).on( "pagecontainerbeforehide", function( event, ui ) {    	// PAGE SETTINGS   	 if (ui.prevPage.attr("id")=="pageSettings"){    		saveSettings();    	  }   	 if (ui.prevPage.attr("id")=="pageShopList"){		  clearInterval(refreshIntervalId);			var currentShopList = window.localStorage.getItem("CurrentShopListNum");			getShopLists().done(function(res){				 var listID = res.rows.item(parseInt(currentShopList)).id;				 sendShopList(listID);			});		// sendShopLists();		  closeShopListsPage();		//  alert("Interval for send shop lists is cleared!!");   	 }   	if (ui.prevPage.attr("id")=="pageConnectionSettings"){		console.log("PAGE CONTAINER HIDE EVENT!");		saveConnectionSettings();   		}    });        showAuthPage();} function onPullDown(){	alert("dsaaaaaaaaaaaaaaaaa");}    function gotFS(fs){     	fileSystem = fs;    }    function onSuccess(){    	     }        function onError(error){    	alert("Error: "+error);    	console.log(error);    	console.log(error.message);    }          function onErrorSilent(error){    	console.log(error);    } 	    	    	    	function onOnline() {		console.log("Network is online");		uploadPhoto();	}		function onOffline(){		console.log("Network is offline");	}		function keyboardShowHandler(e){	 //alert('Keyboard height is: ' + e.keyboardHeight);        if(device.platform!='iOS'){		keyboardHeight = e.keyboardHeight;		if ((currentPage!="pageCreateShopList")&(currentPage!="pageTransaction")&(currentPage!="pageConnectionSettings"))			$("#"+currentPage).css({'top': -keyboardHeight});        }	}    function keyboardHideHandler(e){	//    alert('Goodnight, sweet prince')         if(device.platform!='iOS'){    	keyboardheight = 0;    	if ((currentPage!="pageCreateShopList")&(currentPage!="pageTransaction")&(currentPage!="pageConnectionSettings"))    		$("#"+currentPage).css({'top': 0});         }	 }