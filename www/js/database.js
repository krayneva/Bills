	function openDB(){
		try { 
			 if (!window.openDatabase) {
	             alert('Databases are not supported in this browser.');
	             return;
	           } 
			 if (!db) {
			      db = window.openDatabase("BillsDatabase", "1.0", "PhoneGap Training", 200000);
			    }
			// пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
			 db.transaction(populateDB, onError, onSuccess);
		 } catch(e) { 
			 onError("Error in database "+e);
		 } 
			 
	}
	


    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
     * @param tx
     */
    function populateDB(tx) {
     //    tx.executeSql('DROP TABLE IF EXISTS Bills');
    //	tx.executeSql('DROP TABLE IF EXISTS UserEnvironment');
    //	tx.executeSql('DROP TABLE IF EXISTS Transactions');
    //	 tx.executeSql('DROP TABLE IF EXISTS ShopLists');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Bills' 
        		 		+'(id integer primary key autoincrement,name, description,'
        		 		+'createdate,path, sent, latitude,longitude,altitude)');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (1, "пїЅпїЅпїЅпїЅ 1","пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ 1","/mnt/sdcard/test.jpg")');
     //    tx.executeSql('INSERT INTO Bills (id, name, description,path) VALUES (2, "пїЅпїЅпїЅпїЅ 2","пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ 2","/mnt/sdcard/test.jpg")');
         tx.executeSql('CREATE TABLE IF NOT EXISTS UserEnvironment' 
 		 		+' (id integer primary key autoincrement,environment)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Transactions' 
  		 		+' (id text primary key,transactionJSON, purseID, transactionDate, categoryID)');
    
         tx.executeSql('CREATE TABLE IF NOT EXISTS Widgets' 
   		 		+' (id text primary key,json)');
     
         
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
         
         // таблица для списка покупок
         tx.executeSql('CREATE TABLE IF NOT EXISTS ShopLists' 
 		 		+'(id text primary key,name, createdAt, fullJSON, itemsJSON)');
         
         // таблица  продуктов
         tx.executeSql('CREATE TABLE IF NOT EXISTS Goods' 
  		 		+'(id integer primary key autoincrement,tag, value, measure, color,soundTranscription,json)');
         
         // таблица единиц измерения
         tx.executeSql('CREATE TABLE IF NOT EXISTS Measures' 
   		 		+'(id integer primary key,name)');

    }
    
    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅ пїЅ пїЅпїЅ
     * @param filePath пїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅпїЅ
     * @param latitude пїЅпїЅпїЅпїЅпїЅпїЅ
     * @param longitude пїЅпїЅпїЅпїЅпїЅпїЅпїЅ
     */
    function addBill(filePath, latitude, longitude,altitude){
       
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
    
    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ "пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ" пїЅпїЅпїЅпїЅ
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
     * пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅ (пїЅпїЅпїЅпїЅпїЅпїЅпїЅ)
     */
    function clearBillsTable(){
        db.transaction(
        		function(transaction) { 
            		transaction.executeSql(
            		'delete from Bills')} ,
            		 onError, onSuccess);
          refreshBills();
    }
    
    
    
    /** пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ\пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
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
     * пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅ
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
     * пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
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
  // 	console.log("SQL: "+'SELECT '+setting+' FROM Settings where id=1;');
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
    
    
    
    
    /** добавление данных о транзакциях пользователя
     * @param transaction
     */
    function addTransaction(id,transactionJSON, purseID, transactionDate, categoryID){
    	
    	var sql=  "INSERT OR REPLACE INTO Transactions (id, transactionJSON, purseID,transactionDate, categoryID) " +
		" values ("
		+"'"+id+"',"
		+"'"+transactionJSON.replace(/'/g,"''")+"',"
		+"'"+purseID+"',"
		+"'"+transactionDate+"',"
		+"'"+categoryID+
		"')";
        db.transaction(
    		function(transaction) { 
        		transaction.executeSql(
        		sql
        		);},
        		function onError(error){
    		    	console.log("Error trying to add transaction!"+error.message);
    		    	console.log("SQL: "+sql);
    		    }, onSuccess);
   }
    
    /**
     * получение всех транзацкций
     */
    function getTransactions(){
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
        
    
    /**
     * получение транзакций по категории
     */
    function getTransactionsByCategoryID(categoryID){
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
    
    
    function getTransaction(transactionID){
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
    
    function addWidget(id,json){
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
    
    
    function getWidget(id){
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
    
    function getWidgets(){
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
    
    function addShopList(id,name, createdAt, fullJSON, itemsJSON){
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

    	
    	 db.transaction(
    	   function(transaction) { 
    	   		transaction.executeSql(
    	      		"INSERT OR REPLACE INTO ShopLists (id, name, createdAt, fullJSON, itemsJSON) " +
    	      		" values ('"
    	       		+id+"',"
    	       		+"'"+name+"',"
    	       		+"'"+createdAt+"',"
    	       		+"'"+fullJSON+"',"
    	       		+"'"+itemsJSON+"')"
    	   		);},
    	     onSuccess,function onError(error){
    		    	console.log("Error trying to add transaction!"+error.message);
    		    	console.log("SQL: "+sql);
    		    });
    }
    
    
    function getShopLists(){
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
    
    
    function getShopList(listID){
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
    
    

    /** добавление продукта в список покупок
     * @param listID
     * @param product
     * @returns
     */
    function addToShopList(listID,product){
    	
    	//var listID = window.localStorage.getItem("ShopListID");
    	var deferred = $.Deferred();
    //	alert ("ListID: "+listID);
    //	alert ("Product String: "+product);
    	// обрабатываем строку продукта
    	//var expr = new RegExp('[0-9]*[.,/\*]*[0-9]*', 'i');
    	var expr = new RegExp('[0-9][.,\*]?[0-9]?');
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
    	
    	value = value.replace(/\s/g, '');
    	measure = measure.replace(/\s/g, '');
    	
    	getShopList(listID).done(function(res){
    	var itemsJSON =jQuery.parseJSON(res.rows.item(0).itemsJSON);
    	//	alert(JSON.stringify(itemsJSON));
    		itemsJSON.push({
    			'Tag': 'TAG_OTHER', 
    			'Value': value,
    			'Quantity':quantity,
    			'Measure':measure,
    			'Color':'2',
    			'bought':'0'
    			});
    	//alert(JSON.stringify(itemsJSON));
    	db.transaction(
      		    function(transaction) {
      		        transaction.executeSql("UPDATE ShopLists set itemsJSON='"+JSON.stringify(itemsJSON)+"' where id='"+listID+"'", [],
      		        		function(transaction, result) {
      		        	deferred.resolve(result);
        		    }, function onError(error){
        		    	console.log("Error trying to add to shop list!"+error.message);
        		    	console.log("SQL: "+sql);
        		    });
      		 });    	
    	});
    	return deferred;
    }
    
    /** удаление продукта из списка покупок
     * @param listID
     * @param product
     * @returns
     */
    function removeFromShopList(listID, product){
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
            		    	console.log("Error trying to remove from shop lisr!"+error.message);
            		    	console.log("SQL: "+sql);
            		    });
          		 });    	
    	});
    	return deferred;

    }

    
    
    function updateShopList(listID, itemsJSON){
    	var deferred = $.Deferred();
        	db.transaction(
          		    function(transaction) {
          		        transaction.executeSql("UPDATE ShopLists set itemsJSON='"+JSON.stringify(itemsJSON)+"' where id='"+listID+"'", [],
          		        		function(transaction, result) {
          		        	deferred.resolve(result);
            		    }, function onError(error){
            		    	console.log("Error trying to remove from shop lisr!"+error.message);
            		    	console.log("SQL: "+sql);
            		    });
          		 });    	
    	return deferred;
    }
    
    function getShopListCount(){
    	var deferred = $.Deferred();
    	db.transaction(
      		    function(transaction) {
      		        transaction.executeSql("select count(*) as count from ShopLists ", [],
      		        		function(transaction, result) {
      		        	var count = result.rows.item(0).count;
      		        	deferred.resolve(count);
        		    }, function onError(error){
        		    	console.log("Error trying to get count of shop lists!"+error.message);
        		    	console.log("SQL: "+sql);
        		    });
      		 });    	
	return deferred;
    }
    
    
    // таблица  продуктов
 /*   tx.executeSql('CREATE TABLE IF NOT EXISTS Goods' 
		 		+'(id integer primary key autoincrement,tag, value, measure, color,soundTranscription,json)');
   
    */
    
    function deleteGoodItemsTable(){
    	   db.transaction(
           		function(transaction) { 
               		transaction.executeSql(
               		'delete from Goods')} ,
               		 onError, onSuccess);
    }
    function deleteGoodMeasuresTable(){
    	   db.transaction(
           		function(transaction) { 
               		transaction.executeSql(
               		'delete from Measures')} ,
               		 onError, onSuccess);
    }
    
  function addGoodItem(tag, value,measure,color,soundTranscription,json){
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
	    	     onSuccess,function onError(error){
	    		    	console.log("Error trying to add good item!"+error.message);
	    		    	console.log("SQL: "+sql);
	    		    });
    }
    // таблица единиц измерения
 /*   tx.executeSql('CREATE TABLE IF NOT EXISTS Measures' 
		 		+'(index integer primary key,name)');
*/
  
    function addGoodMeasure(index, name){
    	 db.transaction(
  	    	   function(transaction) { 
  	    	   		transaction.executeSql(
  	    	      		"INSERT OR REPLACE INTO Measures (id, name) " +
  	    	      		" values ("
  	    	       		+index+","
  	    	       		+"'"+name+"')"
  	    	   		);},
  	    	     onSuccess,function onError(error){
  	    		    	console.log("Error trying to add measure item!"+error.message);
  	    		    	console.log("SQL: "+sql);
  	    		    });
    }
    
    
    function getGoodItems(){
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
    
    
    function getMeasure(index){
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
    