function refreshBills() {
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

/*var expenses = {
		"expenses":[
		{"title": "День рождения",
			"comment": "Билеты в парк отдыха на четверых",
			"date": "06.12.2014",
			"time": "14:17",
			"cost": "4000"}
		+"{\"title\": \"Игрушка\",comment: \"Купил игрушку для дочки\",date: \"13.11.2014\","
		+"\"time\": \"12:28\",\"cost\": \"525\"},"

		+"{\"title\": \"Бильярд\",\"comment\": \"Поход в бильярд на 1.5 часа\",\"date\": \"13.11.2014\","
		+"\"time\": \"20:29\",\"cost\": \"1000\"},"

		+"{\"title\": \"Поход в кино\",\"comment\": \"2 билета на фильм\",\"date\": \"10.11.2014\","
		+"\"time\": \"19.30\",\"cost\": \"900\"}"

		
		]};*/

 

var dictionary = {
	 /*   "employee1":[
	        {"id":"0","name":"Google"},
	        {"id":"1","name":"eBay"}
	    ],
	    "employee2": [
	        {"id":"2","name":"Yahoo"},
	        {"id":"3","name":"Facebook"}
	    ]*/
	};

function refreshExpenses(){
	/*var json = '{"expenses":[{"title": "День рождения","comment": "Билеты в парк отдыха на четверых","date": "06.12.2014","time": "14:17","cost": "4000"}]}';
    obj = JSON.parse(json);

	alert(obj.count);
	alert(obj.expenses.count);*/
//	var exp = JSON.parse(dictionary);
/*	for (var i=0; i<exp.length;i++){
		alert(exp[i]);
	}*/
   /* for (var i = 0; i < result.rows.length; i++) {
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
	*/
}

function refershBillSendStatus(rowID){
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




	

	function formatDate(jsD){
	jsDate = new Date(jsD);
	var  hm =  (jsDate.getHours()<10?("0"+jsDate.getHours()):jsDate.getHours()) + ":" + (jsDate.getMinutes()<10?("0"+jsDate.getMinutes()):jsDate.getMinutes());
  	var dmy =  (jsDate.getDate()<10?("0"+jsDate.getDate()):jsDate.getDate()) + "." + 
      ((jsDate.getMonth()+1)<10?("0"+(jsDate.getMonth()+1)):(jsDate.getMonth()+1)) + "." + 
      jsDate.getFullYear();
    return hm+" "+dmy;
}

	function hideTesterDiv(){
	 $('#testDiv').hide();
	}
	
	function showCheck(billID){
	    currentPage = "pageCheck";
	    window.localStorage.setItem(BILL_ID_KEY, billID);
		$.mobile.pageContainer.pagecontainer( "change", "check.html",{transition:"none"});

	}
	
	function showBillsList(){
		currentPage = "pageBills";
		$.mobile.pageContainer.pagecontainer( "change", "bills.html",{transition:"none"});
		//refreshBills();
	}
	
	

	
	function showAuthPage(){
		currentPage = "pageAuth";
		$.mobile.pageContainer.pagecontainer( "change", "login.html", {transition:"none"});
	}
	
	
	function showSettingsPage(){
		currentPage = "pageSettings";
		$.mobile.pageContainer.pagecontainer( "change", "settings.html",{transition:"none"});
	}
	
	
	function showMainPage(){
		currentPage = "pageMain";
		$.mobile.pageContainer.pagecontainer( "change", "main.html" ,{transition:"none"});
	}
	
	function showConnectionSettingsPage(){
		currentPage = "pageConnectionSettings";
		$.mobile.pageContainer.pagecontainer( "change", "connectionSettings.html" ,{transition:"none"});
	}
	
	function showExpensesPage(){
		currentPage = "pageExpenses";
		$.mobile.pageContainer.pagecontainer( "change", "expenses.html" ,{transition:"none"});
	}
	
	function showTransactionPage(){
		currentPage = "pageTransaction";
		$.mobile.pageContainer.pagecontainer( "change", "transaction.html" ,{transition:"none"});
	}
	
	
/*	(function($){
		console.log("SLIDE MENUCALLED!!");
		$.fn.slideMenu = function(options) {
			// If options exist, merge them with the default settings
			options = $.extend({
				duration:	500,
				easing:		'swing'
			}, options);
			
			return this.each(function() {
				var obj = $(this);
				
				var menuStatus = false;
			
				$(document).on('click', 'a.showMenu', function(e) {
					if(!menuStatus){
						$('#side-menu').css('visibility','visible');
						$('.ui-page-active').animate({
							marginLeft: '165px',
						}, options.duration, options.easing, function(){menuStatus = true});
						return false;
					} else {
						$('.ui-page-active').animate({
							marginLeft: '0px',
						}, options.duration, options.easing, function(){menuStatus = false});
						return false;
					}
				});
			
				$( ":mobile-pagecontainer" ).on('swipeleft', function(e) {
					console.log("SIPE LEFT!!");
					if (menuStatus){
						$('.ui-page-active').animate({
							marginLeft: '0px',
						}, options.duration, options.easing, function(){menuStatus = false; $('#side-menu').css('marginTop', $(window).scrollTop());});
					}
				});
			
				$( ":mobile-pagecontainer" ).on('swipeleft', function(e) {
					if (!menuStatus){
						//alert($(window).scrollTop() + ' - ' + $('#side-menu').offset().top);
						$('#side-menu').css('marginTop', $(window).scrollTop());
						$('#side-menu').css('visibility','visible');
						$('.ui-page-active').animate({
							marginLeft: '165px',
						}, options.duration, options.easing, function(){menuStatus = true});
					}
				});
			
				$('#side-menu li a').click(function(){
					var p = $(this).parent();
					if($(p).hasClass('active')){
						$('#side-menu li').removeClass('active');
					} else {
						$('#side-menu li').removeClass('active');
						$(p).addClass('active');
					}
					menuStatus = false;
				});
			});
		};
	})(jQuery);*/
	
	
	function showUserEnvironment(){
		var environment = getUserEnvironment();
		alert(environment);
	}