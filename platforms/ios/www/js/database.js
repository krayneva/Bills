	function openDB(login){
        alert("open DB!");
		try { 
			 if (!window.openDatabase) {
	             alert('Databases are not supported in this browser.');
	             return;
	           } 
			 console.log("db now is "+db);
			 var dbName = login.replace('@','').replace('.','');
			 if (db==0) {
				 requestTransactionPageCount = 0;
				 window.localStorage.removeItem("CurrentShopListNum");
				  window.localStorage.removeItem(RECEIPT_ID_KEY);
				  window.localStorage.removeItem(TRANSACTION_ID_KEY);
			      db = window.openDatabase("Checomatic_"+dbName, "1.0", "Checkomatic_"+dbName, 200000);
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
				      db = window.openDatabase("Checomatic_"+dbName, "1.0", "Checkomatic_"+dbName, 200000);
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
        alert("populateDB");
    	try{
     // tx.executeSql('DROP TABLE IF EXISTS Bills');
    //	tx.executeSql('DROP TABLE IF EXISTS UserEnvironment');
    //	tx.executeSql('DROP TABLE IF EXISTS Transactions');
    //	 tx.executeSql('DROP TABLE IF EXISTS ShopLists');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Bills' 
        		 		+'(id integer primary key autoincrement,name, description,'
        		 		+'createdate,path, sent, latitude,longitude,altitude,uid)');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (1, "пїЅпїЅпїЅпїЅ 1","пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ 1","/mnt/sdcard/test.jpg")');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (2, "пїЅпїЅпїЅпїЅ 2","пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ 2","/mnt/sdcard/test.jpg")');
         tx.executeSql('CREATE TABLE IF NOT EXISTS UserEnvironment' 
 		 		+' (id integer primary key autoincrement,environment)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Transactions' 
  		 		+' (id text primary key,transactionJSON, purseID, transactionDate, categoryID, receiptImageID)');
    
         tx.executeSql('CREATE TABLE IF NOT EXISTS Widgets' 
   		 		+' (id text primary key,json)');
     
         
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
         
         // таблица для списка покупок
         tx.executeSql('CREATE TABLE IF NOT EXISTS ShopLists' 
 		 		+'(id text primary key,name, accountID,createdAt, fullJSON, itemsJSON)');
         
         // таблица  продуктов
         tx.executeSql('CREATE TABLE IF NOT EXISTS Goods' 
  		 		+'(id integer primary key autoincrement,tag, value, measure, color,soundTranscription,json)');
         
         // таблица единиц измерения
         tx.executeSql('CREATE TABLE IF NOT EXISTS Measures' 
   		 		+'(id integer primary key,name)');
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
	    		    	deferred.resolve(i,json);
	    		    });
	        return deferred;
    	}
		catch(e){
			  dumpError("addTransaction",e);
		  }			
   }
    
    
    function addSeveralTransactions(json,i, deferred){
    	try{
	    	if (deferred==undefined) deferred = $.Deferred();
	       	var transaction = json[i];
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
		   	var deferred = $.Deferred();
		    	db.transaction(
		  		    function(transaction) {
		  		        transaction.executeSql("SELECT * FROM Transactions order by datetime(transactionDate) desc", [],
		  		        		function(transaction, result) {
		  		        	deferred.resolve(result);
		    		    }, onError);
		  		 });
		    	
		    	return deferred;
    	}
		catch(e){
			  dumpError("getTransactions",e);
		  }			
    }
        
    
    /**
     * получение транзакций по категории
     */
    function getTransactionsByCategoryID(categoryID){
    	try{
		   	var deferred = $.Deferred();
		    	db.transaction(
		  		    function(transaction) {
		  		        transaction.executeSql("SELECT * FROM Transactions where categoryID='"+categoryID+"'  order by datetime(transactionDate) desc", [],
		  		        		function(transaction, result) {
		  		        	
		  		        	deferred.resolve(result);
		    		    }, onError);
		  		 });
		    	return deferred;
    	}
		catch(e){
			  dumpError("getTransactionsByCategoryID",e);
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
	        // таблица для списка покупок
	     	/*Пользователь может иметь несколько списков продуктов, идентифицируемых по ObjectId,  Name.
	     	   В БД SQLite необходимо сделать табличку для хранения таких объектов.
	     	каждый список имеет продуктов состоит из:
	     	идентификатора (ObjectId)
	     	наименования (Name)
	     	перечня продуктов, каждый продукт из:
	     	порядковый номер No,
	     	Тег  (TAG_BEEF, например),  Tag
	     	Наименование из классификатора (Говядина) , ItemName
	     	Количество,   Quantity
	     	Ед. измерения, Measure*/
	
	     /*  +'(id integer primary key,name, createdAt, fullJSON, itemsJSON)');
	 		*/
	
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
	    	//var listID = window.localStorage.getItem("ShopListID");
	    	var deferred = $.Deferred();
	    //	alert ("ListID: "+listID);
	    //	alert ("Product String: "+product);
	    	// обрабатываем строку продукта
	    	//var expr = new RegExp('[0-9]*[.,/\*]*[0-9]*', 'i');
	    	var expr = new RegExp('[0-9][.,\*]*[0-9]*');
	    /*	var quantityPos = expr.search(product);
	    	var quantity = expr.exec(product);
	    	alert ("Quantity: "+quantity);
	    	alert ("Quantity postition: "+quantityPos);
	    	var value = product.substr(0, quantityPos);
	    	var measure = product.substring((quantityPos+quantity.length), product.length);
	    	console.log('Value: '+value);
	    	console.log('Measure: '+measure);
	    	*/
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
	    /*	alert('Value:*'+value+"*");
	    	alert('Quantity:*'+quantity+"*");
	    	alert('Measure:*'+measure+"*");
	    	*/
	    	value = value.trim();
	    	measure = measure.trim();
	    	
	    	/*value = value.replace(/\s/g, '');
	    	measure = measure.replace(/\s/g, '');
	    	*/
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
    
    
    // таблица  продуктов
 /*   tx.executeSql('CREATE TABLE IF NOT EXISTS Goods' 
		 		+'(id integer primary key autoincrement,tag, value, measure, color,soundTranscription,json)');
   
    */
    
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
    // таблица единиц измерения
 /*   tx.executeSql('CREATE TABLE IF NOT EXISTS Measures' 
		 		+'(index integer primary key,name)');
*/
  
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
	    	window.localStorage.removeItem("CurrentShopListNum");
	    	getGoodItemsCount().done(function(res){
					requestShopLists().done(function(){
						requestGoodItems().done(function(){
							requestGoodMeasures().done(function(){
								requestUserEnvironment().done(function(){
									updateMainPage();
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
    