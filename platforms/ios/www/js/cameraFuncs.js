<<<<<<< HEAD

 // Called when a photo is successfully retrieved    //    function onPhotoDataSuccess(imageData) {      // Uncomment to view the base64-encoded image data      // console.log(imageData);      // Get image handle      //      var smallImage = document.getElementById('largeImage');      // Unhide image elements      //      smallImage.style.display = 'block';      // Show the captured photo      // The in-line CSS rules are used to resize the image      //      smallImage.src = "data:image/jpeg;base64," + imageData;      currentPhoto = imageData;    }    // Called when a photo is successfully retrieved    //    function onPhotoURISuccess(imageURI) {      // Uncomment to view the image file URI      // console.log(imageURI);      // Get image handle      //      var largeImage = document.getElementById('largeImage');      // Unhide image elements      //      largeImage.style.display = 'block';      // Show the captured photo      // The in-line CSS rules are used to resize the image      //      largeImage.src = imageURI;      currentPhoto = imageURI;    }    // A button will call this function    ///*    function capturePhoto() {        // Take picture using device camera and retrieve image as base64-encoded string        navigator.camera.getPicture(onPhotoURISuccess, onPhotoFail, { quality: getSetting(SETTING_JPEG_QUALITY),          destinationType:  destinationType.FILE_URI,          targetWidth: getSetting(SETTING_OUTPUT_WIDTH),          targetHeight: getSetting(SETTING_COLOR_MODE));      }*/    // A button will call this function    //    function capturePhotoEdit() {      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string      navigator.camera.getPicture(onPhotoDataSuccess, onPhotoFail, { quality: 20, allowEdit: true,        destinationType: destinationType.DATA_URL });    }    // A button will call this function    //    function getPhoto(source) {      // Retrieve image file location from specified source      navigator.camera.getPicture(onPhotoURISuccess, onPhotoFail, { quality: 20,        destinationType: destinationType.FILE_URI,        sourceType: source });    }    // Called if something bad happens.    //    function onPhotoFail(message) {      alert('Failed because: ' + message);    }                 function captureCustomPhoto(){    //	alert("Jpeg quality: " +getSetting(SETTING_JPEG_QUALITY));   // 	alert("width: " +getSetting(SETTING_OUTPUT_WIDTH));   // 	alert("Color mode: " +getSetting(SETTING_COLOR_MODE));   // 	imageURI =    window.resolveLocalFileSystemURL("file:///storage/emulated/0/testtt.jpg", onSuccess, onError);    	navigator.customCamera.getPicture("photo.jpg",onCustomPhotoSuccess, onPhotoFail,{    		filename: "photo.jpg"    	    ,quality: getSetting(SETTING_JPEG_QUALITY, JPEG_QUALITY_DEFAULT)    		,targetWidth:getSetting(SETTING_OUTPUT_WIDTH, OUTPUT_WIDTH_DEFAULT)    		,targetHeight:getSetting(SETTING_COLOR_MODE, COLOR_MODE_DEFAULT)    		,colorMode:getSetting(SETTING_COLOR_MODE, COLOR_MODE_DEFAULT)    	});	      }            function onCustomPhotoSuccess(jsonResult) {    //	alert(JSON.stringify(jsonResult));   //     alert ("Filepath: "+jsonResult.ImageUri);    	alert ("Coords: "+jsonResult.Latitude+" "+jsonResult.Longitude);        addBill(jsonResult.ImageUri, jsonResult.Latitude, jsonResult.Longitude, jsonResult.Altitude);
        alert("Altitude: "+jsonResult.Altitude);        uploadPhoto();    }    
=======
 // Called when a photo is successfully retrieved    //    function onPhotoDataSuccess(imageData) {      // Uncomment to view the base64-encoded image data      // console.log(imageData);      // Get image handle      //      var smallImage = document.getElementById('largeImage');      // Unhide image elements      //      smallImage.style.display = 'block';      // Show the captured photo      // The in-line CSS rules are used to resize the image      //      smallImage.src = "data:image/jpeg;base64," + imageData;      currentPhoto = imageData;    }    // Called when a photo is successfully retrieved    //    function onPhotoURISuccess(imageURI) {      // Uncomment to view the image file URI      // console.log(imageURI);      // Get image handle      //      var largeImage = document.getElementById('largeImage');      // Unhide image elements      //      largeImage.style.display = 'block';      // Show the captured photo      // The in-line CSS rules are used to resize the image      //      largeImage.src = imageURI;      currentPhoto = imageURI;    }    // A button will call this function    ///*    function capturePhoto() {        // Take picture using device camera and retrieve image as base64-encoded string        navigator.camera.getPicture(onPhotoURISuccess, onPhotoFail, { quality: getSetting(SETTING_JPEG_QUALITY),          destinationType:  destinationType.FILE_URI,          targetWidth: getSetting(SETTING_OUTPUT_WIDTH),          targetHeight: getSetting(SETTING_COLOR_MODE));      }*/    // A button will call this function    //    function capturePhotoEdit() {      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string      navigator.camera.getPicture(onPhotoDataSuccess, onPhotoFail, { quality: 20, allowEdit: true,        destinationType: destinationType.DATA_URL });    }    // A button will call this function    //    function getPhoto(source) {      // Retrieve image file location from specified source      navigator.camera.getPicture(onPhotoURISuccess, onPhotoFail, { quality: 20,        destinationType: destinationType.FILE_URI,        sourceType: source });    }    // Called if something bad happens.    //    function onPhotoFail(message) {      alert('Failed because: ' + message);    }                 function captureCustomPhoto(){    //	alert("Jpeg quality: " +getSetting(SETTING_JPEG_QUALITY));   // 	alert("width: " +getSetting(SETTING_OUTPUT_WIDTH));   // 	alert("Color mode: " +getSetting(SETTING_COLOR_MODE));   // 	imageURI =    window.resolveLocalFileSystemURL("file:///storage/emulated/0/testtt.jpg", onSuccess, onError);    	navigator.customCamera.getPicture("photo.jpg",onCustomPhotoSuccess, onPhotoFail,{    		filename: "photo.jpg"    	    ,quality: getSetting(SETTING_JPEG_QUALITY, JPEG_QUALITY_DEFAULT)    		,targetWidth:getSetting(SETTING_OUTPUT_WIDTH, OUTPUT_WIDTH_DEFAULT)    		,targetHeight:getSetting(SETTING_COLOR_MODE, COLOR_MODE_DEFAULT)    		,colorMode:getSetting(SETTING_COLOR_MODE, COLOR_MODE_DEFAULT)    	});	      }            function onCustomPhotoSuccess(jsonResult) {       /* alert(JSON.stringify(jsonResult));        alert ("Filepath: "+jsonResult.ImageUri);    	alert ("Coords: "+jsonResult.Latitude+" "+jsonResult.Longitude);*/        addBill(jsonResult.ImageUri, jsonResult.Latitude, jsonResult.Longitude);        uploadPhoto();    }    
>>>>>>> 21de7dbaf59b527935df8db90c062904b55d522a
