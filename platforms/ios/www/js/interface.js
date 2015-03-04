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
		document.getElementById('login').value =  getSetting(SETTING_USER_LOGIN, USER_LOGIN_DEFAULT);
		document.getElementById('password').value= getSetting(SETTING_USER_PASSWORD, USER_PASSWORD_DEFAULT);
	}
	
	
	function showSettingsPage(){
		currentPage = "pageSettings";
		$.mobile.pageContainer.pagecontainer( "change", "settings.html",{transition:"none"});
	}
	
	
	

	
	
	function showMainPage(){
		currentPage = "pageMain";
	//	$(":mobile-pagecontainer" ).pagecontainer( "load", ",main.html");
		$.mobile.pageContainer.pagecontainer( "change", "main.html" ,{transition:"none"});
	/*	$('#pageMain').on('taphold', function(ev) {
			plugins.appBlade.showFeedbackDialog("true");
		});
      */ 
	}