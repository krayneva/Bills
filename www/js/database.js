	function openDB(){
		try { 
			 if (!window.openDatabase) {
	             alert('Databases are not supported in this browser.');
	             return;
	           } 
			 if (!db) {
			      db = window.openDatabase("BillsDatabase", "1.0", "PhoneGap Training", 200000);
			    }
			// ���� �������� ������ ��������
			 db.transaction(populateDB, onError, onSuccess);
		 } catch(e) { 
			 onError("Error in database "+e);
		 } 
			 
	}
	
 

    /** ������� �������
     * @param tx
     */
    function populateDB(tx) {
     //    tx.executeSql('DROP TABLE IF EXISTS Bills');
    	tx.executeSql('DROP TABLE IF EXISTS UserEnvironment');
    	tx.executeSql('DROP TABLE IF EXISTS Transactions');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Bills' 
        		 		+'(id integer primary key autoincrement,name, description,'
        		 		+'createdate,path, sent, latitude,longitude,altitude)');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (1, "���� 1","�������� ����� 1","/mnt/sdcard/test.jpg")');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (2, "���� 2","�������� ����� 2","/mnt/sdcard/test.jpg")');
         tx.executeSql('CREATE TABLE IF NOT EXISTS UserEnvironment' 
 		 		+' (id integer primary key autoincrement,environment)');
   
         tx.executeSql('CREATE TABLE IF NOT EXISTS Transactions' 
  		 		+' (id text primary key,transactionJSON, purseID, transactionDate, categoryID)');
    
         
         tx.executeSql('CREATE TABLE IF NOT EXISTS Settings' 
  		 +'(id integer primary key autoincrement,'
  		+SETTING_USER_LOGIN+','
  		+SETTING_USER_PASSWORD+','
  		+SETTING_USER_TOKEN+','
  		+SETTING_SERVER_ADDRESS
         +')');
 
         
         tx.executeSql('SELECT * FROM Settings;', [],
		        		function(transaction, result) {
		        	if (result.rows.length==0){
		        		 tx.executeSql('INSERT INTO Settings' 
		        		  		 +'('
		        		  		+SETTING_USER_LOGIN+','
		        		  		+SETTING_USER_PASSWORD+','
		        		  		+SETTING_USER_TOKEN+','
		        		  		+SETTING_SERVER_ADDRESS
		        		         +') values '
		        		         +'("'
		        		  		+USER_LOGIN_DEFAULT+'","'
		        		  		+USER_PASSWORD_DEFAULT+'","'
		        		  		+USER_TOKEN_DEFAULT+'","'
		        		  		+SERVER_ADDRESS_DEFAULT+'"'
		        		         +')'
		        		 );
		        		 
		        	}
		        	        	
		    }, onError);
         
         
         tx.executeSql('SELECT * FROM UserEnvironment;', [],
	        		function(transaction, result) {
	        	if (result.rows.length==0){
	        		 tx.executeSql('INSERT INTO UserEnvironment' 
	        		  		 +'(environment) values '
	        		         +'("")'
	        		 );
	        		 
	        	}
	        	        	
	    }, onError);
         

    }
    
    /** ���������� ���� � ��
     * @param filePath ���� � �����
     * @param latitude ������
     * @param longitude �������
     */
    function addBill(filePath, latitude, longitude,altitude){
        db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		'INSERT INTO Bills (name, description,createdate,path,sent,latitude,longitude,altitude) VALUES ("���","", "'
        		+new Date().toJSON()
        		+'","'+filePath+'",0'
        		+','+latitude
        		+','+longitude
        		+','+altitude
        		+')'
        		);},
        		 onError, onSuccess);
      refreshBills();
   }
    
    /** ��������� ������� "���������" ����
     * @param billID
     */
    function setBillSent(billID){
            db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		'UPDATE Bills set sent=1 where id='+billID);} ,
        		 onError, onSuccess);
      refreshBills();
    }

    
    
    /**
     * ������� ������� ����� (�������)
     */
    function clearBillsTable(){
        db.transaction(
        		function(transaction) { 
            		transaction.executeSql(
            		'delete from Bills')} ,
            		 onError, onSuccess);
          refreshBills();
    }
    
    
    
    /** ����������\���������� ��������� ������������
     * @param environment
     */
    function addUserEnvironment(environment){
    	
        db.transaction(
    		function(transaction) { 
    		//	environment.replace ('"','""');
        		transaction.executeSql(
        		"UPDATE UserEnvironment set environment='"+environment+"' where id=1"
        		);},
        		 onError, onSuccess);
   }
    
    /**
     * ��������� ��������� ������������ �� ��
     */
    function getUserEnvironment(){
    	var deferred = $.Deferred();
    	db.transaction(
  		    function(transaction) {
  		        transaction.executeSql('SELECT * FROM UserEnvironment where id=1', [],
  		        		function(transaction, result) {
  		        	deferred.resolve( result.rows.item(0).environment);
    		    }, onError);
  		 });
    	
    	return deferred;
    }
        
    
    /**
     * ���� ���������� ������� ����������
     */
    function getLastUpdateTime(){
    	
    }
    
    
    function putSetting(setting, value){
    	 console.log("SQL: "+'UPDATE Settings set '+setting+'="'+value+'" where id=1');
       db.transaction(
      		function(transaction) { 
          		transaction.executeSql(
           		'UPDATE Settings set '+setting+'="'+value+'"');} ,
           		 onError, onSuccess);
      
    }

    
    function getSetting(setting, defValue){
   	console.log("SQL: "+'SELECT '+setting+' FROM Settings where id=1;');
    var res = "";
   var deferred = $.Deferred();
	db.transaction(
		    function(transaction) {
		        transaction.executeSql('SELECT '+setting+' FROM Settings;', [],
		        		function(transaction, result) {
		        	var row =  result.rows.item(0);
		        	$.each(row, function(columnName, value) {
		        			res = value;
		        			deferred.resolve(res);
		        			if (res==="") res = defValue;
		        			console.log("Get setting "+setting+" returned "+res );
        	        });
		        	        	
		    },  function onError(error){
		    	alert("GetSetting: "+setting+" error: "+error);
		    	console.log(error);
		    });
		 });
	return deferred;
	}
    
    
    
    
    /** ���������� ������ � ����������� ������������
     * @param transaction
     */
    function addTransaction(id,transactionJSON, purseID, transactionDate, categoryID){
    	
        db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		"INSERT INTO Transactions (id, transactionJSON, purseID,transactionDate, categoryID) " +
        		" values ("
        		+"'"+id+"',"
        		+"'"+transactionJSON+"',"
        		+"'"+purseID+"',"
        		+"'"+transactionDate+"',"
        		+"'"+categoryID+
        		"')"
        		);},
        		 onError, onSuccess);
   }
    
    /**
     * ��������� ���� �����������
     */
    function getTransactions(){
   	var deferred = $.Deferred();
    	db.transaction(
  		    function(transaction) {
  		        transaction.executeSql('SELECT * FROM Transactions', [],
  		        		function(transaction, result) {
  		        	deferred.resolve(result);
    		    }, onError);
  		 });
    	return deferred;
    }
        
    
    /**
     * ��������� ���������� �� ���������
     */
    function getTransactions(categoryID){
   	var deferred = $.Deferred();
    	db.transaction(
  		    function(transaction) {
  		        transaction.executeSql('SELECT * FROM Transactions where categoryID="'+categoryID+'"', [],
  		        		function(transaction, result) {
  		        	deferred.resolve(result);
    		    }, onError);
  		 });
    	return deferred;
    }
    
