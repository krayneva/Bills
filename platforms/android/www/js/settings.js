
// ����� ��������
var SETTING_JPEG_QUALITY = "jpegQuality";
var SETTING_COLOR_MODE = "colorMode";
var SETTING_OUTPUT_WIDTH = "outputWidth";
var SETTING_USER_LOGIN = "userLogin";
var SETTING_USER_PASSWORD = "userPassword";
var SETTING_USER_TOKEN = "userToken";
var SETTING_SERVER_ADDRESS = "ServerAddress";
var SETTING_DB_NAME = "DBName";

var BILL_ID_KEY = "BillIdKey";
var CATEGORY_ID_KEY = "CategoryIdKey";
var TRANSACTION_ID_KEY = "TransactionIdKey";
var RECEIPT_ID_KEY = "ReceiptIdKey";
var ERROR_MESSAGE = "ErrorMessage";

var DIALOG_MESSAGE = "DialogMessage";
var DIALOG_HEADER = "DialogHeader";

// registration fields
var ACCEPT_RULES_KEY = "AcceptRulesKey";
var IS_ROBOT_KEY = "IsRobotKey";
var NICK_KEY = "NickKey";
var EMAIL_KEY = "EmailKey";
var PROMO_KEY = "PromoKey";
var LATITUDE_KEY = "LatitudeKey";
var LONGITUDE_KEY = "LongitudeKey";

// ��������� ��������
var JPEG_QUALITY_DEFAULT = "100";
var COLOR_MODE_DEFAULT = "565";
var OUTPUT_WIDTH_DEFAULT = "0";
var USER_LOGIN_DEFAULT = "";
var USER_PASSWORD_DEFAULT= "";
var USER_TOKEN_DEFAULT = "";
var DB_NAME_DEFAULT = "";
var SERVER_ADDRESS_DEFAULT = "https://billview.cloudapp.net/rec/";
//http://ryoga.esed.kodeks.ru/ReceiptsAPI/

function removeSetting(setting){
	try{
		window.localStorage.removeItem(setting);
	}
    catch(e){
    	dumpError("removeSetting",e);
    }

}

// ���������� ���� �������� � ������ ��������
function saveSettings(){
	try{
		var quality = document.getElementById("jpegQualitySetting").value;
		var colorMode = document.getElementById("colorModeSetting").value;
		var outputWidth = document.getElementById("outputWidthSetting").value;
		if (outputWidth==0)  outputWidth = "";
		if (outputWidth=="undefined") outputWidth = "";
		putSetting(SETTING_JPEG_QUALITY, quality);
		putSetting(SETTING_COLOR_MODE, colorMode);
		putSetting(SETTING_OUTPUT_WIDTH, outputWidth);
		
		console.log(getSetting(SETTING_JPEG_QUALITY));
		console.log(getSetting(SETTING_OUTPUT_WIDTH));
		console.log(getSetting(SETTING_COLOR_MODE));
	}
    catch(e){
    	dumpError("saveSettings",e);
    }

}


/**
 * ���������� ��������� ������ �������
 */
function saveConnectionSettings(){
	try{
		var serverAddress = document.getElementById("serverAddress").value;
		if (serverAddress =="") serverAddress = SERVER_ADDRESS_DEFAULT;
		//putSetting(SETTING_SERVER_ADDRESS, serverAddress);
		window.localStorage.setItem(SETTING_SERVER_ADDRESS, serverAddress);
	}
    catch(e){
    	dumpError("saveConnectionSettings",e);
    }
}

function getSettingFromStorage(setting,defaultValue){
	try{
		var res = window.localStorage.getItem(setting);
		if (res!=undefined)
			return res;
		else return defaultValue;
	}
    catch(e){
    	dumpError("getSettingFromStorage",e);
    }
}

