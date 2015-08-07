/*
 *  /// <summary>
  /// Типы валют счета 
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
  
  // цвета строк списка покупок
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

/*
 Enum MeasureType = 
    {
        /// Штуки
        Piece = 0,
        /// Литр
        Liter = 1,
        /// Банка
        Jar = 2,
        /// Бутылка
        Bottle = 3,
        /// Грамм        
        Gram = 4,
        /// Килограмм
        Kilogram = 5,
        /// Метр
        Meter = 6,
        /// Упаковка
        Pack = 7,
        /// Час, для обозначения времени проката/парковки
        Hour = 8,
        /// Сутки
        /// </summary>
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