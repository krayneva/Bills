
/**
 *  объект бд
 */
var db = 0;
var pictureSource;   // picture source
var destinationType; // sets the format of returned value


$(document).ready(function() {
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
	//openDatabase();
	//alert('dsfasd!!');
	
});
 


$('#pageBills').live('pagebeforecreate',function(event){
	//  alert('This page was just inserted into the dom!');
	  $('#billList').append(
		      '<li>'
		       +'<a href="#">'
		        +'<img src="icon_notes.png">'
		        +'<h4>Bill 1</h4>'
		        +'<p>Google Chrome is a free, open-source web browser. Released in 2008.</p>'
		        +'</a>'
		      +'</li>'
		      +'<li>'
		        +'<a href="#">'
		        +'<img src="icon_radio.png">'
		        +'<h4>Bill 2</h4>'
		        +'<p>Firefox is a web browser from Mozilla. Released in 2004.</p>'
		        +'<button onclick="openDB();"> нопка</button>'
		        +'</a>'
		      +'</li>'
		    );
	});

	$('#pageBills').live('pagecreate',function(event){
	  //alert('This page was just enhanced by jQuery Mobile!');
	});

	
	$('div').live('pageshow',function(event, ui){
		//  alert('This page was just hidden: '+ ui.prevPage);
		// $('#billList').page();
		// alert('This page was just shown: ');
		
		});

	$('div').live('pagehide',function(event, ui){
		//  alert('This page was just shown: '+ ui.nextPage);
	});
			
	
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
			 db.transaction(populateDB, errorCB, successCB);
		 } catch(e) { 
			      alert("Erros during creating database"); 

		 } 
			 
	}
	
	  // Populate the database 
    //
    function populateDB(tx) {
         tx.executeSql('DROP TABLE IF EXISTS Bills');
         tx.executeSql('CREATE TABLE IF NOT EXISTS Bills (id unique, name, description)');
         tx.executeSql('INSERT INTO Bills (id, name, desctiption) VALUES (1, "—чет 1","ќписание счета 1")');
         tx.executeSql('INSERT INTO Bills (id, name, description) VALUES (2, "—чет 2","ќписание счета 2")');
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
        alert('Error processing SQL: '+err);
    }
    
    
    
    



    // Transaction success callback
    //
    function successCB() {
        alert('success!');
    }
    
    
    function showAlert(){
    	alert("alert test!");
    }
    
    

    
    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
        // Retrieve image file location from specified source
    /*    navigator.camera.getPicture(uploadPhoto,
                                    function(message) { alert('get picture failed'); },
                                    { quality: 50, 
                                    destinationType: navigator.camera.DestinationType.FILE_URI,
                                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
                                    );
     */ 
    	
    	   navigapictureSource=navigator.camera.PictureSourceType;
           destinationType=navigator.camera.DestinationType;
    }
    
   

    //function uploadPhoto(imageURI) {
    function uploadPhoto() {
   	//  window.resolveLocalFileSystemURI("file:///test.jpg", onResolveSuccess, fail);
   	  //window.resolveLocalFileSystemURI("file:///www/test.jpg", onResolveSuccess, fail);
    //	imageURI =    window.resolveLocalFileSystemURI("file:///android_asset/www/test.jpg", onSuccess, onError);
    //	imageURI =    window.resolveLocalFileSystemURI("file:///storage/emulated/0/test.jpg", onSuccess, onError);
    //	imageURI = "file:///android_asset/www/test.jpg";
    	imageURI = "file:///storage/emulated/0/test.jpg";
        var options = new FileUploadOptions();
        options.fileKey="test.jpg";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="multipart/form-data";

        var params = new Object();
        // params.value1 = "test";
        // params.value2 = "param";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI("http://ryoga.esed.kodeks.ru/recapi/api/image"), win, fail, options, true);
    }

    function win(r) {
        console.log("RESPONSE FROM SERVER" + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    function fail(error) {
       alert("An error has occurred: Code = " + error.code);
      
    
	    console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    
/*    function onSuccess(fileEntry) {
        console.log(fileEntry.name);
    }
    
    function onResolveSuccess(fileEntry) {
        console.log(fileEntry.name);
    }
    
    function onFileSystemSuccess(fileSystem) {
        console.log(fileSystem.name);
    }
 */
    
    function takePictureCustom(){
  	imageURI = "file:///storage/emulated/0/testttt.jpg";
   
    	navigator.customCamera.getPicture(onPictureTaken(imageURI),onPictureError, {
    	    quality: 80, 
    	  //  targetWidth: 120,
    	  //  targetHeight: 120,
    	    destinationType: Camera.DestinationType.DATA_URL
    	});
  
    //	 var image = document.getElementById('cameraImage');
     //    image.src = imageURI;
    }
    
    
    function takePicture(){
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPictureTaken, onPictureError, { quality: 50,
          destinationType: destinationType.DATA_URL });
    }
    
  

    function onPictureTaken(imageURI) {
    	// alert("File location: " );//+ imageURI);
     /*   var image = document.getElementById('cameraImage');
        image.style.display = 'block';
        image.src = imageURI;*/
        //
        var smallImage = document.getElementById('cameraImage');
        smallImage.style.display = 'block';
        smallImage.src = "data:image/jpeg;base64," + imageData;
    }
    
    function onPictureError(message){
    	  alert('Failed because: ' + message);
    }
/*
    function onFail(message) {
        alert('Failed because: ' + message);
    }
*/