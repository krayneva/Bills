/*
 *  /// <summary>
  /// “ипы валют счета 
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
 */


function getCurrencyString(currency){
	switch(currency){
	case 1:
		return "р.";
	case 2:
		return "$";
	case 3:
		return "&#8364;";
	}
}