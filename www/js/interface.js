function refreshBills() {
  if (!db){
       $('#billsHeader').html('�� ��������� �� ������ ����');
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
              $('#billsHeader').html('������ �����');
              $('#uploadButton').show();
              $('#clearBillsButton').show();
            }
            else{
             $('#billsHeader').html('�� ��������� �� ������ ����');
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