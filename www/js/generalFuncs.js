var pictureSource;   // picture sourcevar destinationType; // sets the format of returned value// ÔÓÒÎÂ‰Ìˇˇ ÙÓÚÓ„‡ÙËˇ Ò Í‡ÏÂ˚\‰ËÒÍ‡var currentPhoto;// ‡‰ÂÒ ÒÂ‚Â‡var addPhotoURL = "api/image/";var getPhotoURL = "api/image/";var getPhotosURL = "api/image/";var getTokenURL = "token";var getEnvironmentURL = "api/account/environment";var getTransactionsURL = "api/transactions";var fileSystem;var db = 0;var currentPage = "pageAuth";var menuStatus =false;document.addEventListener("online", onOnline, false);document.addEventListener("offline", onOffline, false);document.addEventListener("deviceready",onDeviceReady,false);function onDeviceReady() {        pictureSource=navigator.camera.PictureSourceType;    destinationType=navigator.camera.DestinationType;    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);	openDB();	$.mobile.allowCrossDomainPages = true;	//	refreshBills();//	showAuthPage();   var uuid = "593a33fc-2d22-418c-967a-a2ff60e40da6";    var token = "a676f0fc1be603eb9db15316490a605c";    var secret = "28bfa152cbb25ce82f447784994addc7";    var issuance = "1419938400";    plugins.appBlade.setupAppBlade(uuid,token, secret, issuance);    plugins.appBlade.catchAndReportCrashes();    plugins.appBlade.allowFeedbackReporting();  	    document.addEventListener("backbutton", function(e){    	console.log($( ":mobile-pagecontainer" ).pagecontainer( "getActivePage" ).prop("id"));        if($( ":mobile-pagecontainer" ).pagecontainer( "getActivePage" ).prop("id")==('pageAuth')){            //e.preventDefault();            navigator.app.exitApp();        }        else {            navigator.app.backHistory();        }    }, false);    var options = {		duration:	200,		easing:		'swing'	};     $.mobile.pageContainer.pagecontainer({ defaults: true });    console.log("SCREEN SIZE: "+window.devicePixelRatio+" ;"+screen.width+" ;"+window.innerWidth);        //(default: 10px)   // $.event.special.swipe.scrollSupressionThreshold = 1;     //(default: 1000ms)    $.event.special.swipe.durationThreshold = 1000;     //(default: 30px)    $.event.special.swipe.horizontalDistanceThreshold = 30;    //(default: 75px)    $.event.special.swipe.verticalDistanceThreshold  = 200;            $( ":mobile-pagecontainer" ).on('swipeleft', function(e) {    	$( "#mypanel" ).panel( "close" );	});    $( ":mobile-pagecontainer" ).on('swiperight', function(e) {    	$( "#mypanel" ).panel( "open" , options);			});              //SHOW    $( ":mobile-pagecontainer" ).on( "pagecontainershow", function( event, ui ) {    	ui.toPage.on('taphold', function(ev) {    		ev.preventDefault();    		ev.stopPropagation();			plugins.appBlade.showFeedbackDialog("true");			return false;		});         $('#alert_dialog').on('taphold', function(ev) {                ev.preventDefault();                 ev.stopPropagation();                 plugins.appBlade.showFeedbackDialog("true");                 return false;                 });    	// PAGE BIILS    	 if (ui.toPage.attr("id")=="pageBills"){     		refreshBills();     	  }    	// PAGE MAIN    	  if (ui.toPage.attr("id")=="pageMain"){  		    $(".categoryMenu").click(function(e){		        $('.widgetMenu').show();		        e.stopPropagation();		        $("body").click(function (t) {		            if (!$(t.target).hasClass('categoryMenu') || !$(t.target).hasClass('widgetMenuPanel')) {		                $('.widgetMenu').hide();		            };		        });		    });		    $(".menu").click(function(e){		        $('.menu').addClass('menuActive');		        $('.menuPanel').show();		        e.stopPropagation();		        $("body").click(function (t) {		            if (!$(t.target).hasClass('menu') || !$(t.target).hasClass('menuPanel')) {		                $('.menuPanel').hide();		                $('.menu').removeClass('menuActive');		            };		        });		    });		    		    $('.icoCategory').click(function(){		    	showExpensesPage();		    });      	  }    	  //PAGE CHECK    	  if (ui.toPage.attr("id")=="pageCheck"){    		    db.transaction(    			   	 function(transaction) {    			   		 var billID = window.localStorage.getItem(BILL_ID_KEY);    			   	        transaction.executeSql('SELECT * FROM Bills where id='+billID+';', [], function(transaction, result) {    			   	        	 var row = result.rows.item(0);    			   	        	 $('#billName').html(row.name+" "+row.id);    			   	        	 //$('#billDate').html(formatDate(row.createdate));    			   	        	 $('#billImage').attr('src',row.path);    			    	        }, onError);    		  	    });    	  }    	      	  //PAGE LOGIN    	  if (ui.toPage.attr("id")=="pageAuth"){   			getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT).done(function(res){   				document.getElementById('login').value = res;   			});   			document.getElementById('password').value= getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT);    	  }    	  // PAGE CONNECTION SETTINGS    	  if (ui.toPage.attr("id")=="pageConnectionSettings"){    			document.getElementById('serverAddress').value = getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT);    		//	console.log("Server Address "+getSetting(SETTING_SERVER_ADDRESS, SERVER_ADDRESS_DEFAULT));      	  }    	  // PAGE EXPENSES GRID    	  if (ui.toPage.attr("id")=="pageExpenses"){    		refreshExpenses();      	  }    	});    // ��� ��������� ��������    //$.when()    // HIDE    $( ":mobile-pagecontainer" ).on( "pagecontainerbeforehide", function( event, ui ) {    	// PAGE SETTINGS   	 if (ui.prevPage.attr("id")=="pageSettings"){    		saveSettings();    	  }   	if (ui.prevPage.attr("id")=="pageConnectionSettings"){		console.log("PAGE CONTAINER HIDE EVENT!");		saveConnectionSettings();   		}    });        showAuthPage();}     function gotFS(fs){     	fileSystem = fs;    }    function onSuccess(){    	     }        function onError(error){    	alert("Error: "+error);    	console.log(error);    }          	    	    	    	function onOnline() {		console.log("Network is online");		uploadPhoto();	}		function onOffline(){		console.log("Network is offline");	}	