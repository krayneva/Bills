/*
 *  /// <summary>
  ///    
  /// </summary>
  public enum CurrenciesEnum
  {

    UndefinedCurrency = 0,

    [Display(Name = "ValutaDollar", ShortName = "ValutaDollarShort", ResourceType = typeof (Resources))]
    [UIHint("&#36;")] 
    Dollar = 1,

    [Display(Name = "ValutaRouble", ShortName = "ValutaRoubleShort", ResourceType = typeof(Resources))]
    [UIHint("&#8381;")]
    Rouble = 2,

    [Display(Name = "ValutaEuro", ShortName = "ValutaEuroShort", ResourceType = typeof(Resources))]
    [UIHint("&#8364;")]
    Euro = 3

  }
  
  //    
    public enum ColorSchemasEnum : byte
  {
    
    Orange = 1,
    Crimson = 2,
    LightSeaGreen = 3,
    Lime = 4,
    Teal = 5

  }
 */
var MeasureEnum = {
  0 : {valueRus:"шт", code: "Piece", defaultAmount:"1"}, 
  1 : {valueRus:"л.", code: "Liter", defaultAmount:"1"},
  2 : {valueRus:"бан.", code: "Jar", defaultAmount:"1"},
  3 : {valueRus:"бут.", code: "Bottle", defaultAmount:"1"},
  4 : {valueRus:"гр", code: "Gram", defaultAmount:"500"},
  5 : {valueRus:"кг", code: "Kilogram", defaultAmount:"1"},
  6 : {valueRus:"м", code: "Meter", defaultAmount:"1"},
  7 : {valueRus:"упак.", code: "Pack", defaultAmount:"1"},
  8 : {valueRus:"час.", code: "Hour", defaultAmount:"1"},
  9 : {valueRus:"сут.", code: "Day", defaultAmount:"1"}
};


 var MarkEnum= 
    {
       1:{value:"VeryBad"},
       2:{value:"Bad"},
       3:{value:"NotBad"},
       4:{value:"Good"},
       5:{value:"Excellent"}
    };
/*
 Enum MeasureType = 
    {
        /// 
        Piece = 0,
        /// 
        Liter = 1,
        /// 
        Jar = 2,
        /// 
        Bottle = 3,
        ///         
        Gram = 4,
  
        Kilogram = 5,
   
        Meter = 6,

        Pack = 7,
   
        Hour = 8,
 
        Day = 9
    }
*/

function getCurrencyString(currency){
	try{
		switch(currency){
		case 2:
			return "р.";
		case 1:
			return "$";
		case 3:
			return "&#8364;";
		}
	}
    catch(e){
    	dumpError("getCurrencyString",e);
    }

}

function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function formatPrice(price) {
    if (price==0) return price;
    if (price==undefined) return 0;
    if (price==null) return 0;
    return Math.round(price * 100) / 100;
}

function formatVolume(volume){
    if (volume==0) return volume;
    if (volume==undefined) return 0;
    if (volume==null) return 0;
    return Math.round(volume/10) / 100;

}