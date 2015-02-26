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
               // var newEntryRow = $('#entryTemplate').clone();
               // newEntryRow.removeAttr('id');
               // newEntryRow.removeAttr('style');
               // newEntryRow.data('entryId', row.id);
               // newEntryRow.appendTo('#patientList ul');
               // newEntryRow.find('.label').text(row.pName);
                $('#billList').append(
		      	'<li onclick = "showBillInfo('+row.id+')">'
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
         
      
         //$('#pageBills').trigger('create');
    });
  
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

$('#pageBills').live('pageshow',function(event, ui){
	
	refreshBills();
	hideTesterDiv();
	currentPage = "pageBills";
	});




$('#pageBillInfo').live('pageshow',function(event, ui){
	currentPage = "billInfo";
	});
	
$('#pageAuth').live('pageshow',function(event, ui){
	currentPage = "pageAuth";
	});
	
$('#pageSettings').live('pageshow',function(event, ui){
	currentPage = "pageSettings";
	});

$('#pageMain').live('pageshow',function(event, ui){
	currentPage = "pageMain";
	});
	

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
	
	function showBillInfo(billID){
	    db.transaction(
	    	 function(transaction) {
	    	        transaction.executeSql('SELECT * FROM Bills where id='+billID+';', [], function(transaction, result) {
	    	        	 var row = result.rows.item(0);
	    	        	 $('#billName').html(row.name+" "+row.id);
	    	        	 $('#billDate').html(formatDate(row.createdate));
	    	        	 $('#billImage').attr('src',row.path);
	    	        }, onError);

	    	    });
		
		
currentPage = "pageBillInfo";
		
		document.getElementById('pageSettings').style.display = 'none';
		document.getElementById('pageBillInfo').style.display = 'block'; 
		document.getElementById('pageBills').style.display = 'none';
		document.getElementById('pageMain').style.display = 'none';
		document.getElementById('pageAuth').style.display = 'none';  

	}
	
	function showBillsList(){
		currentPage = "pageBills";
		refreshBills();
		document.getElementById('pageBillInfo').style.display = 'none';
		document.getElementById('pageAuth').style.display = 'none';  
		document.getElementById('pageSettings').style.display = 'none';
		document.getElementById('pageMain').style.display = 'none';
		document.getElementById('pageBills').style.display = 'block';
		// не работает!
		//   $.mobile.changePage( "#pageBills" );
	}
	
	function showMainPage(){
		currentPage = "pageMain";
		document.getElementById('pageBillInfo').style.display = 'none';
		document.getElementById('pageAuth').style.display = 'none';  
		document.getElementById('pageSettings').style.display = 'none';
		document.getElementById('pageBills').style.display = 'none';
		document.getElementById('pageMain').style.display = 'block';
		// не работает!
		//   $.mobile.changePage( "#pageBills" );
	}
	
	function saveSettingsAndShowBillsList(){
		saveSettings();
		showBillsList();
	}
	
	function showAuthPage(){
		currentPage = "pageAuth";
		document.getElementById('pageBillInfo').style.display = 'none'; 
		document.getElementById('pageBills').style.display = 'none';
		document.getElementById('pageSettings').style.display = 'none';
		document.getElementById('pageAuth').style.display = 'block'; 
		document.getElementById('pageMain').style.display = 'none';
		//alert( getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT));
		document.getElementById('login').value =  getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT);
		document.getElementById('password').value= getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT);
		
		$('#pageAuth').on('taphold', function(ev) {
			plugins.appBlade.showFeedbackDialog("true");
		});
	}
	
	
	function showSettingsPage(){
		currentPage = "pageSettings";
		document.getElementById('pageBillInfo').style.display = 'none'; 
		document.getElementById('pageBills').style.display = 'none';
		document.getElementById('pageAuth').style.display = 'none'; 
		document.getElementById('pageMain').style.display = 'none';
		document.getElementById('pageSettings').style.display = 'block';
	}
	
	
	
	function showTesterPage(){
		$.mobile.loadPage( "testerPage.html", { showLoadMsg: false } );
	     //  showBillsList();
	}