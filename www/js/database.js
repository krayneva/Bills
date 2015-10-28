	var SYNC_TRANSACTIONS = "synctransactions";

	function openDB(login){
     //   alert("open DB!");
		try {
			var dbName = login.replace('@','').replace('.','');
			// if (!window.openDatabase) {
			if (!window.sqlitePlugin.openDatabase({name: dbName+".db"})){
	             alert('Databases are not supported in this browser.');
	             return;
	           } 
			 console.log("db now is "+db);

			 if (db==0) {
				 requestTransactionPageCount = 0;
				 window.localStorage.removeItem("CurrentShopListNum");
				  window.localStorage.removeItem(RECEIPT_ID_KEY);
				  window.localStorage.removeItem(TRANSACTION_ID_KEY);
			      db = window.sqlitePlugin.openDatabase({name: dbName+".db"});
				  db.transaction(populateDB, onError, onSuccess);
			      putSetting(SETTING_DB_NAME, dbName);
			    }
			 else{
				 var usingName = getSetting(SETTING_DB_NAME);
				 if (usingName!= dbName){
					 window.localStorage.removeItem("CurrentShopListNum");
					  window.localStorage.removeItem(RECEIPT_ID_KEY);
					  window.localStorage.removeItem(TRANSACTION_ID_KEY);

					 requestTransactionPageCount = 0;
				      db = window.sqlitePlugin.openDatabase({name: dbName+".db"});
					  db.transaction(populateDB, onError, onSuccess);
				      putSetting(SETTING_DB_NAME, dbName);
				 }
			 }
			// пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
		 } catch(e) { 
			 onError("Error in database "+e);
			 dumpError("openDB",e);
		 } 
			 
	}
	


    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
     * @param tx
     */
    function populateDB(tx) {
   //     alert("populateDB");
    	try{
     // tx.executeSql('DROP TABLE IF EXISTS Bills');
    //	tx.executeSql('DROP TABLE IF EXISTS UserEnvironment');
    //	tx.executeSql('DROP TABLE IF EXISTS Transactions');
    //	 tx.executeSql('DROP TABLE IF EXISTS ShopLists');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Bills' 
        		 		+'(id integer primary key autoincrement,name, description,'
        		 		+'createdate,path, sent, latitude,longitude,altitude,uid)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS UserEnvironment'
 		 		+' (id integer primary key autoincrement,environment)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Transactions' 
  		 		+' (id text primary key,transactionJSON, purseID, transactionDate, categoryID, receiptImageID)');
    
         tx.executeSql('CREATE TABLE IF NOT EXISTS Widgets' 
   		 		+' (id text primary key,json)');
  		tx.executeSql('CREATE TABLE IF NOT EXISTS Habits'
 		 		+' (id integer primary key autoincrement,habits)');

         tx.executeSql('CREATE TABLE IF NOT EXISTS Settings' 
  		 +'(id integer primary key autoincrement,'
  		+SETTING_USER_LOGIN+','
  		+SETTING_USER_PASSWORD+','
  		+SETTING_USER_TOKEN+','
  		+SETTING_SERVER_ADDRESS+','
  		+SETTING_DB_NAME
         +')');
 
         
         tx.executeSql('SELECT * FROM Settings;', [],
		        		function(transaction, result) {
		        	if (result.rows.length==0){
		        		 tx.executeSql('INSERT INTO Settings' 
		        		  		 +'('
		        		  		+SETTING_USER_LOGIN+','
		        		  		+SETTING_USER_PASSWORD+','
		        		  		+SETTING_USER_TOKEN+','
		        		  		+SETTING_SERVER_ADDRESS+','
		        		  		+SETTING_DB_NAME
		        		         +') values '
		        		         +'("'
		        		  		+USER_LOGIN_DEFAULT+'","'
		        		  		+USER_PASSWORD_DEFAULT+'","'
		        		  		+USER_TOKEN_DEFAULT+'","'
		        		  		+SERVER_ADDRESS_DEFAULT+'","'
		        		  		+DB_NAME_DEFAULT+'"'
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

			tx.executeSql('SELECT * FROM Habits;', [],
				function(transaction, result) {
					if (result.rows.length==0){
						tx.executeSql('INSERT INTO Habits'
							+'(habits) values '
							+'("")'
						);

					}

				}, onError);
         
         // таблица для списка покупок
         tx.executeSql('CREATE TABLE IF NOT EXISTS ShopLists' 
 		 		+'(id text primary key,name, accountID,createdAt, fullJSON, itemsJSON)');
         
         // таблица  продуктов
         tx.executeSql('CREATE TABLE IF NOT EXISTS Goods' 
  		 		+'(id integer primary key autoincrement,tag, value, measure, color,soundTranscription,json)');
         
         // таблица единиц измерения
         tx.executeSql('CREATE TABLE IF NOT EXISTS Measures' 
   		 		+'(id integer primary key,name)');

   		 tx.executeSql('CREATE TABLE IF NOT EXISTS Categories'
                   		 		+' (id text primary key,name)');

         tx.executeSql('CREATE TABLE IF NOT EXISTS Tags'
                  +' (id text primary key,name)');

         tx.executeSql('CREATE TABLE IF NOT EXISTS SubCategories'
          	+' (id text primary key,name,category)');

          tx.executeSql('CREATE TABLE IF NOT EXISTS Sync'
                   	+' (name text primary key,date)');
    	}
		catch(e){
			  dumpError("populateDB",e);
		  }			

    }
    
    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅ пїЅ пїЅпїЅ
     * @param filePath пїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅ
     * @param latitude пїЅпїЅпїЅпїЅпїЅпїЅ
     * @param longitude пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
     */
    function addBill(filePath, latitude, longitude,altitude){
       try{
        db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		'INSERT INTO Bills (name, description,createdate,path,sent,latitude,longitude,altitude) VALUES ("Чек","", "'
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
		catch(e){
			  dumpError("addBill",e);
		  }			
   }
    
    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ "пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ" пїЅпїЅпїЅпїЅ
     * @param billID
     */
    function setBillSent(billID){
    	try{
	            db.transaction(
	    		function(transaction) { 
	        		transaction.executeSql(
	        		'UPDATE Bills set sent=1 where id='+billID);} ,
	        		 onError, onSuccess);
	      refreshBills();
    	}
		catch(e){
			  dumpError("setBillSent",e);
		  }			
      
    }
    
    
    /**установка уида для отправленного чека - для привязки к фото
     * @param billID айдишник чека 
     * @param uid уид чека, фото
     */
    function setBillUID(billID, uid){
    	try{
            db.transaction(
    	    		function(transaction) { 
    	        		transaction.executeSql(
    	        		'UPDATE Bills set uid="'+uid+'" where id='+billID);} ,
    	        		 onError, onSuccess);
    	}
    	catch(e){
    		var json = new Object();
    		json.billID = billID;
    		json.billUID = uid;
    		dumpError("setBillSent",e,json);
    	}
    	
    }

    
    
    /**
     * пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ (пїЅпїЅпїЅпїЅпїЅпїЅпїЅ)
     */
    function clearBillsTable(){
    	try{
	        db.transaction(
	        		function(transaction) { 
	            		transaction.executeSql(
	            		'delete from Bills')} ,
	            		 onError, onSuccess);
	          refreshBills();
    	}
		catch(e){
			  dumpError("clearBillsTable",e);
		  }			
    }
    
    
    
    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ\пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
     * @param environment
     */
    function addUserEnvironment(environment){
    	try{
	        db.transaction(
	    		function(transaction) { 
	    		//	environment.replace ('"','""');
	        		transaction.executeSql(
	        		"UPDATE UserEnvironment set environment='"+environment+"'"
	        		);},
	        		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("addUserEnvironment",e);
		  }			
   }
    
    /**
     * пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅ
     */
    function getUserEnvironment(){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql('SELECT * FROM UserEnvironment', [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve( result.rows.item(0).environment);
	    		    }, onError);
	  		 });
	    	
	    	return deferred;
    	}
		catch(e){
			  dumpError("getUserEnvironment",e);
		  }			
    }


         function getBadHabits(){
            	try{
        	    	var deferred = $.Deferred();
        	    	db.transaction(
        	  		    function(transaction) {
        	  		        transaction.executeSql('SELECT * FROM Habits', [],
        	  		        		function(transaction, result) {
        	  		        	deferred.resolve( result.rows.item(0).habits);
        	    		    }, onError);
        	  		 });

        	    	return deferred;
            	}
        		catch(e){
        			  dumpError("getBadHabits",e);
        		  }
            }
    
    /**
     * пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
     */
    function getLastUpdateTime(){
    	
    }
    
    
    function putSetting(setting, value){
    	try{
	    	console.log("SQL: "+'UPDATE Settings set '+setting+'="'+value+'" where id=1');
	    	if (setting==SETTING_USER_LOGIN)
	    		window.localStorage.setItem(SETTING_USER_LOGIN,value);
	    	if (setting==SETTING_USER_PASSWORD)
	    		window.localStorage.setItem(SETTING_USER_PASSWORD,value);
	
	       db.transaction(
	      		function(transaction) { 
	          		transaction.executeSql(
	           		'UPDATE Settings set '+setting+'="'+value+'"');} ,
	           		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("putSetting",e);
		  }			
    	}

    
    function getSetting(setting, defValue){
    	try{
	   	console.log("SQL: "+'SELECT '+setting+' FROM Settings where id=1;');
	    var res = "";
	   var deferred = $.Deferred();
		db.transaction(
			    function(transaction) {
			        transaction.executeSql('SELECT '+setting+' FROM Settings;', [],
			        		function(transaction, result) {
			        	var row =  result.rows.item(0);
			        	// первый аргумент - порядковый номер
			        	// второй - значение, объект
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
		catch(e){
			  dumpError("getSetting",e);
		  }			
	}
    
    
    
    
    /** добавление данных о транзакциях пользователя
     * @param transaction
     */
    function addTransaction(i,json,id,transactionJSON, purseID, transactionDate, categoryID, receiptImageID){
    	try{
			var start = new Date().getTime();
	    	var deferred = $.Deferred();
	    	var sql=  "INSERT OR REPLACE INTO Transactions (id, transactionJSON, purseID,transactionDate, categoryID, receiptImageID) " +
			" values ("
			+"'"+id+"',"
			+"'"+transactionJSON.replace(/'/g,"''")+"',"
			+"'"+purseID+"',"
			+"'"+transactionDate+"',"
			+"'"+categoryID+"',"
			+"'"+receiptImageID+
			"')";
	        db.transaction(
	    		function(transaction) { 
	        		transaction.executeSql(
	        		sql
	        		);},
	        		function onError(error){
	    		    	console.log("Error trying to add transaction!");
	    		    	console.log("SQL: "+sql);
	    		    	deferred.resolve(i,json);
	    		    }, function onSuccess(res){
					var end = new Date().getTime();
					var time = end - start;
					console.log('add transaction time: ' + time);
	    		    	deferred.resolve(i,json);
	    		    });
	        return deferred;
    	}
		catch(e){
			  dumpError("addTransaction",e);
		  }			
   }


	function addTransactionInTransaction(json, transaction){
		try{
			var id = json.Id;
			var purseID = json.PurseID;
			var transactionDate = json.TransactionDate;
			var categoryID = json.CategoryID;
			var receiptImageID =  json.ReceiptImageID;
			var sql=  "INSERT OR REPLACE INTO Transactions (id, transactionJSON, purseID,transactionDate, categoryID, receiptImageID) " +
				" values ("
				+"'"+id+"',"
				+"'"+JSON.stringify(json).replace(/'/g,"''")+"',"
				+"'"+purseID+"',"
				+"'"+transactionDate+"',"
				+"'"+categoryID+"',"
				+"'"+receiptImageID+
				"')";
				transaction.executeSql(sql);
		}
		catch(e){
			dumpError("addTransactionInTransaction",e);
		}
	}
    
    
    function addSeveralTransactions(json,i, deferred){
    	try{
	    	if (deferred==undefined) deferred = $.Deferred();
	       	var transaction = json[i];
	       	// на случай если у анс не массив а одна единственная транзакция в json
	       	if (transaction==undefined)
	       		transaction = json;
	       	var id = transaction.Id;
	    	var purseID = transaction.PurseID;
	    	var transactionDate = transaction.TransactionDate;
	    	var categoryID = transaction.CategoryID;
	    	var receiptImageID =  transaction.ReceiptImageID;
	       	addTransaction(i,json,id,JSON.stringify(transaction), purseID, transactionDate, categoryID, receiptImageID).done(function(i, json){
	       		if (i==json.length-1) {
	  	   			deferred.resolve(''); 
	  	   			return deferred;
	  	   		}
	  	   		else{
	  	   			addSeveralTransactions(json, i+1, deferred);
	  	   		}
	  	   	});
	     	return deferred;
    	}
		catch(e){
			  dumpError("addSeveralTransactinos",e);
		  }			
    }
    
    /**
     * получение всех транзацкций
     */
    function getTransactions(){
    	try{
			var start = new Date().getTime();
		   	var deferred = $.Deferred();
		    	db.transaction(
		  		    function(transaction) {
		  		        transaction.executeSql("SELECT * FROM Transactions order by date(transactionDate) desc", [],
		  		        		function(transaction, result) {
									var end = new Date().getTime();
									var time = end - start;
									console.log('getTransactions time: ' + time);
		  		        	deferred.resolve(result);
		    		    }, onError);
		  		 });
		    	
		    	return deferred;
    	}
		catch(e){
			  dumpError("getTransactions",e);
		  }			
    }



	function getPeriodTransactions(period){
		var p = "";
		if (period=="week")
			p="-7 day";
		if (period=="month")
			p="-1 month";
		if (period=="year")
			p="-1 year";
		alert("period is "+period);
		try{
			var deferred = $.Deferred();
			db.transaction(
				function(transaction) {
					transaction.executeSql("SELECT * FROM Transactions " +
						" where date(transactionDate)>=(SELECT date('now','"+p+"'))"
						+"order by date(transactionDate) desc", [],
						function(transaction, result) {

							deferred.resolve(result);
						}, onError);
				});

			return deferred;
		}
		catch(e){
			dumpError("getPeriodTransactions",e);
		}
	}
    
    /**
     * получение транзакций по категории
     */
    function getTransactionsByCategoryID(categoryID){
    	try{
			var start = new Date().getTime();
		   	var deferred = $.Deferred();
		    	db.transaction(
		  		    function(transaction) {
		  		        transaction.executeSql("SELECT * FROM Transactions where categoryID='"+categoryID+"'  order by date(transactionDate) desc", [],
		  		        		function(transaction, result) {
									var end = new Date().getTime();
									var time = end - start;
									console.log('getTransactionsByCategoryID time: ' + time);
		  		        	deferred.resolve(result);
		    		    }, onError);
		  		 });
		    	return deferred;
    	}
		catch(e){
			  dumpError("getTransactionsByCategoryID",e);
		  }			
    }


	/**
	 * получение транзакций по категории
	 */
	function getTransactionsByCategoryIDAndPeriod(categoryID, period){
		try{
			var p = "";
			if (period=="week")
				p="-7 day";
			if (period=="month")
				p="-1 month";
			if (period=="year")
				p="-1 year";
			var deferred = $.Deferred();
			db.transaction(
				function(transaction) {
					transaction.executeSql("SELECT * FROM Transactions where categoryID='"+categoryID+"'"
						+" and date(transactionDate)>=(SELECT date('now','"+p+"'))"
						+"  order by date(transactionDate) desc", [],
						function(transaction, result) {

							deferred.resolve(result);
						}, onError);
				});
			return deferred;
		}
		catch(e){
			dumpError("getTransactionsByCategoryIDAndPeriod",e);
		}
	}
    
    function getTransaction(transactionID){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql("SELECT * FROM Transactions where id='"+transactionID+"'", [],
	  		        		function(transaction, result) {
	  		        	
	  		        	deferred.resolve(result);
	    		    }, onError);
	  		 });
	    	return deferred;
    	}
		catch(e){
			  dumpError("getTransaction",e);
		  }			
    }
    
    function addWidget(id,json){
    	try{
	       db.transaction(
	       		function(transaction) { 
	           		transaction.executeSql(
	           		"INSERT OR REPLACE INTO Widgets (id, json) " +
	           		" values ("
	           		+"'"+id+"',"
	           		+"'"+json+
	           		"')"
	           		);},
	     		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("addWidget",e);
		  }			
    }

	function addWidgetInTransaction(id,json, transaction){
		try{
			transaction.executeSql(
				"INSERT OR REPLACE INTO Widgets (id, json) " +
				" values ("
				+"'"+id+"',"
				+"'"+json+
				"')"
			);
		}
		catch(e){
			dumpError("addWidgetInTransaction",e);
		}
	}
    
    
    function getWidget(id){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql("SELECT * FROM Widgets where id='"+id+"'", [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve(result.rows.item(0).json);
	    		    }, onError);
	  		 });
	    	return deferred;
    	}
		catch(e){
			  dumpError("getWidget",e);
		  }			
    }
    
    function getWidgets(){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql("SELECT * FROM Widgets", [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve(result);
	    		    }, onError);
	  		 });
	    	return deferred;
    	}
		catch(e){
			  dumpError("getWidgets",e);
		  }			
    }
    
    function addShopList(i,json,id,name, accountID,createdAt, fullJSON, itemsJSON){
    	try{
	
	    	var deferred = $.Deferred();
	    	 db.transaction(
	    	   function(transaction) { 
	    	   		transaction.executeSql(
	    	      		"INSERT OR REPLACE INTO ShopLists (id, name, accountID,createdAt, fullJSON, itemsJSON) " +
	    	      		" values ('"
	    	       		+id+"',"
	    	       		+"'"+name+"',"
	    	       		+"'"+accountID+"',"
	    	       		+"'"+createdAt+"',"
	    	       		+"'"+fullJSON+"',"
	    	       		+"'"+itemsJSON+"')"
	    	   		);},
	    	     function onError(error){
	    		    	console.log("Error trying to add transaction!"+error.message);
	    		    	deferred.resolve(i, json);
	    		    },function onSuccess(){
	    		    	deferred.resolve(i, json);
	    		    });
	    	 return deferred;
    	}
		catch(e){
			  dumpError("addShopList",e);
		  }			
    }
    
    
    
    function addSeveralShopLists(json, i, deferred){
    	try{
	    	if (deferred==undefined) deferred = $.Deferred();
	 		  var shopList = json[i];
	   		  var id = shopList.Id;
	   		  var name = shopList.Name;
	   		  var createdAt = shopList.CreatedAt;
	   		  var accountID = shopList.AccountID;
	   		  var itemsJSON = JSON.stringify(shopList.Items);
	   		  var fullJSON = JSON.stringify(shopList);
	   		  
	   		addShopList(i, json,id,name, accountID,createdAt, fullJSON, itemsJSON).done(function(i, json){
		   			if (i==json.length-1) {
		   				deferred.resolve(''); 
		   				return deferred;
		   			}
		   			else{
		   				addSeveralShopLists(json, i+1, deferred);
		   			}
		   		});
	   		return deferred;
    	}
		catch(e){
			  dumpError("addSeveralShopLists",e);
		  }			
    }
    
    
    function createShopList(name){
    	try{
	    	var deferred = $.Deferred();
	    	var accountID = "";
	
	    	getUserEnvironment().done(function(res){
	    		
	    	
	    	accountID = jQuery.parseJSON(res).AccountID;
	   // 	alert("acountID is: "+accountID);
	    	var fullJSON = new Object();
	    	fullJSON.AccountID = accountID;
	    	fullJSON.Number = 1;
	    	fullJSON.Name = name;
	    	fullJSON.Items ='';
	    	fullJSON.CollectionName = '';
	    	fullJSON.Id = null;
	    	fullJSON.CreatedAt = null;
	    	
	  //  	alert("fullJSOn is"+JSON.stringify(fullJSON));
	    	db.transaction(
	      		    function(transaction) {
	      		    	transaction.executeSql(
	       	    	   			"INSERT OR REPLACE INTO ShopLists (id, name, accountID, createdAt, fullJSON, itemsJSON) " +
	    	    	      		" values ('"
	    	    	       		+tempShopListID+"',"
	    	    	       		+"'"+name+"',"
	    	    	       		+"'"+accountID+"',"
	    	    	       		+"'',"
	    	    	       		+"'"+JSON.stringify(fullJSON)+"',"
	    	    	       		+"'null')", [],
	      		        		function(transaction, result) {
	      		        	
	      		        	deferred.resolve(result);
	        		    }, onError);
	      		 });
	    	});
	
	    	 return deferred;
    	}
		catch(e){
			  dumpError("createShopList",e);
		  }			
    }
    
    
    function addShopListID(id, oldID){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	      		    function(transaction) {
	      		        transaction.executeSql("UPDATE ShopLists set id='"+id+"' where id='"+oldID+"'", [],
	      		        		function(transaction, result) {
	      		        	tempShopListID = tempShopListID+1;
	      		        	db.transaction(
	      		        		    function(transaction) {
	      		        		        transaction.executeSql("SELECT *  FROM ShopLists where id='"+id+"'", [],
	      		        		        		function(transaction, result) {
	      		        		        	
	      		        		        	var fullJSON = jQuery.parseJSON(result.rows.item(0).fullJSON);
	      		        		        	
	      		        		        	fullJSON.Id = id;
	      		        		        	
	      		        		        	db.transaction(
	      		        		        		    function(transaction) {
	      		        		        		        transaction.executeSql("UPDATE ShopLists set fullJSON='"+JSON.stringify(fullJSON)+"' where id='"+id+"'", [],
	      		        		        		        		function(transaction, result) {
	      		        		        		        	deferred.resolve(result);
	      		        		          		    }, onError);
	      		        		        		 });
	      		        		        	deferred.resolve(result);
	      		          		    }, onError);
	      		        		 });
	      		        	
	      		        	
	        		    }, function onError(error){
	        		    	console.log("Error trying to add ID to shop list!"+error.message);
	        		    	console.log("SQL: "+sql);
	        		    });
	      		 });    	
	    	return deferred;
    	}
		catch(e){
			  dumpError("addShopListID",e);
		  }			
    }
    
    function getShopLists(){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql("SELECT * FROM ShopLists", [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve(result);
	    		    }, onError);
	  		 });
	    	return deferred;
    	}
		catch(e){
			  dumpError("getShopLists",e);
		  }			
    }
    
    
    function getShopList(listID){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql("SELECT * FROM ShopLists where id='"+listID+"'", [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve(result);
	    		    }, onError);
	  		 });
	    	return deferred;
    	}
		catch(e){
			  dumpError("getShopList",e);
		  }			
    }
    
    

    /** добавление продукта в список покупок
     * @param listID
     * @param product
     * @returns
     */
    function addToShopList(listID,product){
    	try{
	    	var deferred = $.Deferred();
	    	// обрабатываем строку продукта
	    	//var expr = new RegExp('[0-9]*[.,/\*]*[0-9]*', 'i');
	    	var expr = new RegExp('[0-9][.,\*]*[0-9]*');

	    	var value,measure ;
	    	var quantityPos = product.search(expr);
	    	var quantityArray = expr.exec(product);
	    	var quantity = null;
	    	if (quantityArray!=null)
	    		quantity = expr.exec(product)[0];
	    	else
	    		quantity = null;
	    	if (quantity!=null){
		    //	alert("Quantity: "+quantity);
		    	value = product.substr(0, quantityPos);
		    	measure = product.substring((quantityPos+quantity.length), product.length);
		    	console.log('Value: '+value);
		    	console.log('Quantity: '+quantity);
		    	console.log('Measure: '+measure);
	    	}
	    	else{
	    		value = product;
	    		quantity = "";
	    		measure ="";
	    	}

	    	value = value.trim();
	    	measure = measure.trim();

	    	getShopList(listID).done(function(res){
	    	var itemsJSON;
	    	//alert(res.rows.item(0).id);
	    	if ((res.rows.item(0).itemsJSON=="") |(res.rows.item(0).itemsJSON==null)|(res.rows.item(0).itemsJSON=='null')
	    			|(res.rows.item(0).itemsJSON=="''")){
	    		itemsJSON = [];
	    		var json={ "Tag":"TAG_OTHER", "Value":value,"Quantity":quantity,"Measure":measure,"Color":"2","bought":"0"};
	    		itemsJSON.push(json);
	    	}
	    	else{
	    //		alert("JSON is: "+res.rows.item(0).itemsJSON);
	    		itemsJSON =jQuery.parseJSON(res.rows.item(0).itemsJSON);
	    		if (!(itemsJSON instanceof Array)){
	    			itemsJSON = [];
	    		}
	    	//	alert(JSON.stringify(itemsJSON));
	    		itemsJSON.push({
	    			'Tag': 'TAG_OTHER', 
	    			'Value': value,
	    			'Quantity':quantity,
	    			'Measure':measure,
	    			'Color':'2',
	    			'bought':'0'
	    			});
	    	}
	    	//alert(JSON.stringify(itemsJSON));
	    	db.transaction(
	      		    function(transaction) {
	      		        transaction.executeSql("UPDATE ShopLists set itemsJSON='"+JSON.stringify(itemsJSON)+"' where id='"+listID+"'", [],
	      		        		function(transaction, result) {
	      		        	deferred.resolve(result);
	        		    }, function onError(error){
	        		    	console.log("Error trying to add to shop list!");
	        		    	console.log("SQL: "+sql);
	        		    });
	      		 });    	
	    	});
	    	return deferred;
    	}
		catch(e){
			  dumpError("addToShopList",e);
		  }			
    }
    
    /** удаление продукта из списка покупок
     * @param listID
     * @param product
     * @returns
     */
    function removeFromShopList(listID, product){
    	try{
	    	console.log("Trying to find item: "+product);
	    	var deferred = $.Deferred();
	    	getShopList(listID).done(function(res){
	        	var itemsJSON =jQuery.parseJSON(res.rows.item(0).itemsJSON);
	        	var pos = 0;
	        	for (var i=0; i<itemsJSON.length;i++){
	        		console.log("Found item: "+itemsJSON[i].Value);
	        		if (itemsJSON[i].Value==product){
	        			pos = i;
	        			console.log("FOUND MATCH!");
	        			break;
	        		}
	        	}
	        	itemsJSON.splice(pos, 1);
	        	db.transaction(
	          		    function(transaction) {
	          		        transaction.executeSql("UPDATE ShopLists set itemsJSON='"+JSON.stringify(itemsJSON)+"' where id='"+listID+"'", [],
	          		        		function(transaction, result) {
	          		        	deferred.resolve(result);
	            		    }, function onError(error){
	            		    	console.log("Error trying to remove from shop lisr!");
	            		    });
	          		 });    	
	    	});
	    	return deferred;
    	}
		catch(e){
			  dumpError("removeFromShopList",e);
		  }			

    }

    
    
    function updateShopList(listID, itemsJSON){
    	try{
	    	var deferred = $.Deferred();
	        	db.transaction(
	          		    function(transaction) {
	          		        transaction.executeSql("UPDATE ShopLists set itemsJSON='"+JSON.stringify(itemsJSON)+"' where id='"+listID+"'", [],
	          		        		function(transaction, result) {
	          		        	deferred.resolve(result);
	            		    }, function onError(error){
	            		    	console.log("Error trying to remove from shop list!");
	
	            		    });
	          		 });    	
	    	return deferred;
    	}
		catch(e){
			  dumpError("updateShopList",e);
		  }			
    }
    
    function getShopListCount(){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	      		    function(transaction) {
	      		        transaction.executeSql("select count(*) as count from ShopLists ", [],
	      		        		function(transaction, result) {
	      		        	var count = result.rows.item(0).count;
	      		        	deferred.resolve(count);
	        		    }, function onError(error){
	        		    	console.log("Error trying to get count of shop lists!");
	        		    });
	      		 });    	
	    	return deferred;
    	}
		catch(e){
			  dumpError("getShopListCount",e);
		  }			
    }
    
    

    
    function deleteGoodItemsTable(){
    	try{
    	   db.transaction(
           		function(transaction) { 
               		transaction.executeSql(
               		'delete from Goods')} ,
               		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("deleteGoodItemsTable",e);
		  }			
    }
    function deleteGoodMeasuresTable(){
    	try{
    	   db.transaction(
           		function(transaction) { 
               		transaction.executeSql(
               		'delete from Measures')} ,
               		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("deleteGoodMeasuresTable",e);
		  }			
    }
    
    function deleteShopListsTable(){
    	try{
	 	   db.transaction(
	        		function(transaction) { 
	            		transaction.executeSql(
	            		'delete from ShopLists')} ,
	            		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("deleteShopListsTable",e);
		  }			
 }
    

    function deleteUserEnvironmentTable(){
    	try{
	 	   db.transaction(
	        		function(transaction) { 
	            		transaction.executeSql(
	            		'delete from UserEnvironment')} ,
	            		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("deleteUserEnvironmentTable",e);
		  }			
 }

 function deleteDictionariesTable(){
	 try{
			   db.transaction(
						function(transaction) {
							transaction.executeSql(
							'delete from Categories')} ,
							 onError, onSuccess);
				db.transaction(
                        function(transaction) {
                         transaction.executeSql(
                         'delete from SubCategories')} ,
                          onError, onSuccess);
                 db.transaction(
                        function(transaction) {
                        transaction.executeSql(
                        'delete from Tags')} ,
                         onError, onSuccess);
			}
 		catch(e){
 			  dumpError("delete Dictionaries Tables",e);
 		  }
 }
    
  function addGoodItem(tag, value,measure,color,soundTranscription,json){
	  try{
		  db.transaction(
		    	   function(transaction) { 
		    	   		transaction.executeSql(
		    	      		"INSERT OR REPLACE INTO Goods (tag, value, measure, color,soundTranscription, json) " +
		    	      		" values ('"
		    	       		+tag+"',"
		    	       		+"'"+value+"',"
		    	       		+"'"+measure+"',"
		    	       		+"'"+color+"',"
		    	       		+"'"+soundTranscription+"',"
		    	       		+"'"+json+"')"
		    	   		);},
		    	     function onError(error){
		    		    	console.log("Error trying to add good item!");
	
		    		    },onSuccess);
	  }
		catch(e){
			  dumpError("addGoodItem",e);
		  }			
    }



	function addGoodItemInTransaction(tag, value,measure,color,soundTranscription,json, transaction){
		try{
			transaction.executeSql(
				"INSERT OR REPLACE INTO Goods (tag, value, measure, color,soundTranscription, json) " +
				" values ('"
				+tag+"',"
				+"'"+value+"',"
				+"'"+measure+"',"
				+"'"+color+"',"
				+"'"+soundTranscription+"',"
				+"'"+json+"')"
			);
		}
		catch(e){
			dumpError("addGoodItemInTransaction",e);
		}
	}

  function addCategory(id,name){
  	try{
  	    	 db.transaction(
  	  	    	   function(transaction) {
  	  	    	   		transaction.executeSql(
  	  	    	      		"INSERT OR REPLACE INTO Categories (id, name) " +
  	  	    	      		" values ('"
  	  	    	       		+id+"',"
  	  	    	       		+"'"+name+"')"
  	  	    	   		);},
  	  	    	     function onError(error){
  	  	    		    	console.log("Error trying to add category item!");
  	  	    		    },onSuccess);
      	}
  		catch(e){
  			  dumpError("addCategory",e);
  		  }
  }


	function addCategoryInTransaction(id, name, transaction){
		try{
			transaction.executeSql(
				"INSERT OR REPLACE INTO Categories (id, name) " +
				" values ('"
				+id+"',"
				+"'"+name+"')"
			);
		}
		catch(e){
			dumpError("addCategoryInTransaction",e);
		}
	}


    function addTag(id,name){
    	try{
    	    	 db.transaction(
    	  	    	   function(transaction) {
    	  	    	   		transaction.executeSql(
    	  	    	      		"INSERT OR REPLACE INTO Tags (id, name) " +
    	  	    	      		" values ('"
    	  	    	       		+id+"',"
    	  	    	       		+"'"+name+"')"
    	  	    	   		);},
    	  	    	     function onError(error){
    	  	    		    	console.log("Error trying to add tag item!");
    	  	    		    },onSuccess);
        	}
    		catch(e){
				dumpError("addTag",e);
             }
    }


	function addTagInTransaction(id,name, transaction){
		try{
			transaction.executeSql(
				"INSERT OR REPLACE INTO Tags (id, name) " +
				" values ('"
				+id+"',"
				+"'"+name+"')"
			);
		}
		catch(e){
			dumpError("addTagInTransaction",e);
		}
	}




      function addSubCategory(id,name,category){
      	try{
      	    	 db.transaction(
      	  	    	   function(transaction) {
      	  	    	   		transaction.executeSql(
      	  	    	      		"INSERT OR REPLACE INTO SubCategories (id, name,category) " +
      	  	    	      		" values ('"
      	  	    	       		+id+"',"
      	  	    	       		+"'"+name+"',"
      	  	    	       		+"'"+category+"')"
      	  	    	   		);},
      	  	    	     function onError(error){
      	  	    		    	console.log("Error trying to add subcategory item!");
      	  	    		    },onSuccess);
          	}
      		catch(e){
      			  dumpError("addsubCategory",e);
      		  }
      }

	function addSubCategoryInTransaction(id,name,category, transaction){
		try{

			transaction.executeSql(
				"INSERT OR REPLACE INTO SubCategories (id, name,category) " +
				" values ('"
				+id+"',"
				+"'"+name+"',"
				+"'"+category+"')"
			);
		}
		catch(e){
			dumpError("addsubCategoryInTransaction",e);
		}
	}



    function addGoodMeasure(index, name){
    	try{
	    	 db.transaction(
	  	    	   function(transaction) { 
	  	    	   		transaction.executeSql(
	  	    	      		"INSERT OR REPLACE INTO Measures (id, name) " +
	  	    	      		" values ("
	  	    	       		+index+","
	  	    	       		+"'"+name+"')"
	  	    	   		);},
	  	    	     function onError(error){
	  	    		    	console.log("Error trying to add measure item!");
	  	    		    },onSuccess);
    	}
		catch(e){
			  dumpError("addGoodMeasure",e);
		  }			
	   }

	function addGoodMeasureInTransaction(index, name, transaction){
		try {
			transaction.executeSql(
				"INSERT OR REPLACE INTO Measures (id, name) " +
				" values ("
				+ index + ","
				+ "'" + name + "')"
			);
		}
		catch(e){
			dumpError("addGoodMeasure",e);
		}
	}

    
    function getGoodItems(){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql("SELECT * FROM Goods", [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve(result);
	    		    }, onError);
	  		 });
	    	return deferred;
    	}
		catch(e){
			  dumpError("getGoodItems",e);
		  }			
    }
    
    
    function getGoodItemsCount(){
    	try{
	     	var deferred = $.Deferred();
	    	db.transaction(
	      		    function(transaction) {
	      		        transaction.executeSql("select count(*) as count from Goods ", [],
	      		        		function(transaction, result) {
		      		        	var count = result.rows.item(0).count;
		      		        	deferred.resolve(count);
	        		    }, function onError(error){
	        		    	console.log("Error trying to get count of goods!");
	        		    });
	      		 });    	
	    	return deferred;
    	}
		catch(e){
			  dumpError("getGoodItemsCount",e);
		  }			
	   }
    
    function getMeasure(index){
    	try{
	    	var deferred = $.Deferred();
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql("SELECT * FROM Measures where index="+index, [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve(result);
	    		    }, onError);
	  		 });
	    	return deferred;
    	}
		catch(e){
			  dumpError("getMeasure",e);
		  }			
    }
    
    // обнуляем и инициализируем бд заново!
    function updateDatabase(){
    	try{
	    	//вычищаем таблицы
	    	clearBillsTable();
	    	deleteGoodItemsTable();
	    	deleteGoodMeasuresTable();
	    	deleteShopListsTable();
	    	deleteUserEnvironmentTable();

	    	deleteDictionariesTable();
	    	window.localStorage.removeItem("CurrentShopListNum");
	    	getGoodItemsCount().done(function(res){
					requestShopLists().done(function(){
						requestGoodItems().done(function(){
							requestGoodMeasures().done(function(){
								requestDictionaries().done(function(){
									requestBadHabits().done(function() {
										requestUserEnvironment().done(function () {

											updateMainPage();
										});
									});
								});
							});
						});
					});
	    	});
    	}
		catch(e){
			  dumpError("updateDatabase",e);
		  }	
    }
    
    function getReceiptID(transactionID){
    	var deferred = $.Deferred();
    	try{
	    	db.transaction(
	  		    function(transaction) {
	  		        transaction.executeSql('SELECT * FROM Transactions where id="'+transactionID+'"', [],
	  		        		function(transaction, result) {
	  		        	deferred.resolve( result.rows.item(0).receiptImageID);
	    		    }, onError);
	  		 });
	    	

    	}
		catch(e){
			  dumpError("getReceiptID",e);
		  }
    	return deferred;
    }


    function getTagName(tagID, pos, len){
             	try{
     				var res = "";
     			    var deferred = $.Deferred();
     			    if ((tagID==undefined)||(tagID=="")){

     			    	deferred.resolve("",tagID,pos,len);
     			    	return deferred;
     			    }
     				db.transaction(
     						function(transaction) {
     							transaction.executeSql('SELECT * FROM Tags where id="'+tagID+'";', [],
     									function(transaction, result) {
     									if (result.rows.length!=0) {
											res = result.rows.item(0).name;

										}
     									deferred.resolve(res,tagID,pos,len);
     							}, onError);
     					 });
     				return deferred;
             	}
         		catch(e){
         			  dumpError("getTagName",e);
         		  }
         }


	function getTagNameInTransaction(tagID, pos, len, transaction){
		try{
			var deferred = $.Deferred();
			transaction.executeSql('SELECT * FROM Tags where id="'+tagID+'";', [],
				function(transaction, result) {
					if (result.rows.length != 0) {
						console.log("tag name is "+result.rows.item(0).name);
						deferred.resolve(result.rows.item(0).name);
					}
					else deferred.resolve("");
				});
		}
		catch(e){
			dumpError("getTagName",e);
			deferred.resolve("");
		}
		return deferred;
	}


         function getCategoryName(categoryID){
                 	try{
         				var res = "";
         			    var deferred = $.Deferred();
         				db.transaction(
         						function(transaction) {
         							transaction.executeSql('SELECT * FROM Categories where id ="'+categoryID+'";', [],
         									function(transaction, result) {
         									if (result.rows.length!=0)
         										res =  result.rows.item(0).name;
         									deferred.resolve(res);
         							}, onError);
         					 });
         				return deferred;
                 	}
             		catch(e){
             			  dumpError("getCategoryName",e);
             		  }
             }

	function getSubCategoryName(subcategoryID){
                 	try{
         				var res = "";
         			    var deferred = $.Deferred();
         				db.transaction(
         						function(transaction) {
         							transaction.executeSql('SELECT * FROM SubCategories where id ="'+subcategoryID+'";', [],
         									function(transaction, result) {
         									var res =  result.rows.item(0).name;
         									deferred.resolve(res);
         							}, onError);
         					 });
         				return deferred;
                 	}
             		catch(e){
             			  dumpError("getSubCategoryName",e);
             		  }
             }
	function getSubCategoryParent(subcategoryID){
		try{
    				var res = "";
    			    var deferred = $.Deferred();
    				db.transaction(
    						function(transaction) {
    							transaction.executeSql('SELECT category FROM SubCategories where id ="'+subcategoryID+'";', [],
    									function(transaction, res) {
    									res = res.rows.item(0).category;
    									deferred.resolve(res);
    							}, onError);
    					 });
    				return deferred;
         	}
     		catch(e){
     			  dumpError("getSubCategoryParent",e);
     		  }
	}


	function getSubCategories(categoryID){
		try{
				var res = "";
			    var deferred = $.Deferred();
				db.transaction(
						function(transaction) {
							transaction.executeSql('SELECT * FROM SubCategories where category ="'+categoryID+'";', [],
									function(transaction, res) {
									
									deferred.resolve(res);
							}, onError);
					 });
				return deferred;
     	}
 		catch(e){
 			  dumpError("getSubCategories",e);
 		  }
	}


	function getCategories(){
		try{
			var res = "";
			var deferred = $.Deferred();
			db.transaction(
				function(transaction) {
					transaction.executeSql('SELECT * FROM Categories;', [],
						function(transaction, res) {

							deferred.resolve(res);
						}, onError);
				});
			return deferred;
		}
		catch(e){
			dumpError("getCategories",e);
		}
	}

	function getFirstSubCategory(categoryID) {
		try {
			var res = "";
			var deferred = $.Deferred();
			db.transaction(
				function (transaction) {
					transaction.executeSql('SELECT * FROM SubCategories where category ="' + categoryID + '";', [],
						function (transaction, res) {
							if (res.rows.length==0) deferred.resolve("");
							deferred.resolve(res.rows.item(0).id);
						}, onError);
				});
			return deferred;
		}
		catch (e) {
			dumpError("getFirstSubCategory", e);
		}
	}

	function addSyncDate(name,date){
	try{
            db.transaction(
        		function(transaction) {
            		transaction.executeSql(
            		'INSERT OR REPLACE INTO Sync (name, date) VALUES ("'
             		+name
            		+'","'+date
            		+'")'
            		);},
            		 onError, onSuccess);
           }
    		catch(e){
    			  dumpError("addSyncDate",e);
    		  }
	}

	function getSyncDate(name){
	try{


    	    	var deferred = $.Deferred();
    	    	db.transaction(
    	  		    function(transaction) {
    	  		        transaction.executeSql('SELECT date FROM Sync where name="'+name+'"', [],
    	  		        		function(transaction, result) {

    	  		        		if (result.rows.length==0)
    	  		        			deferred.resolve(0);
    	  		        		else
    	  		        			deferred.resolve(result.rows.item(0).date);
    	    		    }, onError);
    	  		 });

    	    	return deferred;
        	}
    		catch(e){
    			  dumpError("getSyncDate",e);
    		  }

	}

function addBadHabits(habits){
    	try{
	        db.transaction(
	    		function(transaction) {
	        		transaction.executeSql(
	        		"UPDATE Habits set habits='"+habits+"'"
	        		);},
	        		 onError, onSuccess);
    	}
		catch(e){
			  dumpError("addBadHabits",e);
		  }
   }