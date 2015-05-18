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

/*
  public enum MeasureType
    {
        /// <summary>
        /// Штуки
        /// </summary>
        Piece = 0,
        /// <summary>
        /// Литр
        /// </summary>
        Liter = 1,
        /// <summary>
        /// Банка
        /// </summary>
        Jar = 2,
        /// <summary>
        /// Бутылка
        /// </summary>
        Bottle = 3,
        /// <summary>
        /// Грамм
        /// </summary>
        Gram = 4,
        /// <summary>
        /// Килограмм
        /// </summary>
        Kilogram = 5,
        /// <summary>
        /// Метр
        /// </summary>
        Meter = 6,
        /// <summary>
        /// Упаковка
        /// </summary>
        Pack = 7,
        /// <summary>
        /// Час, для обозначения времени проката/парковки
        /// </summary>
        Hour = 8,
        /// <summary>
        /// Сутки
        /// </summary>
        Day = 9
    }
*/

function getCurrencyString(currency){
	switch(currency){
	case 2:
		return "р.";
	case 1:
		return "$";
	case 3:
		return "&#8364;";
	}
}