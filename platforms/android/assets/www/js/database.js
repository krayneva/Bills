	function openDB(){
		try { 
			 if (!window.openDatabase) {
	             alert('Databases are not supported in this browser.');
	             return;
	           } 
			 if (!db) {
			      db = window.openDatabase("BillsDatabase", "1.0", "PhoneGap Training", 200000);
			    }
			// пока забиваем руками значени€
			 db.transaction(populateDB, onError, onSuccess);
		 } catch(e) { 
			 onError("Error in database "+e);
		 } 
			 
	}
	
	  // Populate the database 
    //
    function populateDB(tx) {
     //    tx.executeSql('DROP TABLE IF EXISTS Bills');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Bills (id integer primary key autoincrement,name, description,createdate,path, sent)');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (1, "—чет 1","ќписание счета 1","/mnt/sdcard/test.jpg")');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (2, "—чет 2","ќписание счета 2","/mnt/sdcard/test.jpg")');

    }
    
    function addBill(filePath){
        db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		'INSERT INTO Bills (name, description,createdate,path,sent) VALUES ("„ек","", "'
        		+new Date().toJSON()
        		+'","'+filePath+'",0)');},
        		 onError, onSuccess);
      refreshBills();
   }
    
    function setBillSent(billID){
            db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		'UPDATE Bills set sent=1 where id='+billID);} ,
        		 onError, onSuccess);
      refreshBills();
    }

    
    
    function clearBillsTable(){
        db.transaction(
        		function(transaction) { 
            		transaction.executeSql(
            		'delete from Bills')} ,
            		 onError, onSuccess);
          refreshBills();
    }
    

