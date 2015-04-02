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
         tx.executeSql('CREATE TABLE IF NOT EXISTS Bills' 
        		 		+'(id integer primary key autoincrement,name, description,'
        		 		+'createdate,path, sent, latitude,longitude)');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (1, "���� 1","�������� ����� 1","/mnt/sdcard/test.jpg")');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (2, "���� 2","�������� ����� 2","/mnt/sdcard/test.jpg")');
         tx.executeSql('DROP TABLE IF EXISTS UserEnvironment');
         tx.executeSql('CREATE TABLE IF NOT EXISTS UserEnvironment' 
 		 		+'(environment)');
       //  tx.executeSql('INSERT INTO UserEnvironment (environment) VALUES ("����!!")');

    }
    
    /** ���������� ���� � ��
     * @param filePath ���� � �����
     * @param latitude ������
     * @param longitude �������
     */
    function addBill(filePath, latitude, longitude){
        db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		'INSERT INTO Bills (name, description,createdate,path,sent,latitude,longitude) VALUES ("���","", "'
        		+new Date().toJSON()
        		+'","'+filePath+'",0'
        		+','+latitude
        		+','+longitude
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
    		//	alert(environment);
        		transaction.executeSql(
        		"INSERT OR REPLACE INTO UserEnvironment (environment) VALUES ('"+environment+"')"
        		//		'INSERT INTO UserEnvironment (environment) VALUES ("����")'
        		);},
        		 onError, onSuccess);
   }
    
    /**
     * ��������� ��������� ������������ �� ��
     */
    function getUserEnvironment(){
    	var res = "";
    	db.transaction(
  		    function(transaction) {
  		        transaction.executeSql('SELECT * FROM UserEnvironment;', [],
  		        		function(transaction, result) {
  		        	res =  result.rows.item(0).environment;
  		        	        	
    		    }, onError);
  		 });

    	return res;
    }
        
    
    /**
     * ���� ���������� ������� ����������
     */
    function getLastUpdateTime(){
    	
    }
    

