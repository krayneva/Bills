/*
 *  /// <summary>
  /// ���� ����� ����� 
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
  
  // ����� ����� ������ �������
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
  0 : {valueRus:"��", code: "Piece", defaultAmount:"1"}, 
  1 : {valueRus:"�.", code: "Liter", defaultAmount:"1"},
  2 : {valueRus:"���.", code: "Jar", defaultAmount:"1"},
  3 : {valueRus:"���.", code: "Bottle", defaultAmount:"1"},
  4 : {valueRus:"��", code: "Gram", defaultAmount:"500"},
  5 : {valueRus:"��", code: "Kilogram", defaultAmount:"1"},
  6 : {valueRus:"�", code: "Meter", defaultAmount:"1"},
  7 : {valueRus:"����.", code: "Pack", defaultAmount:"1"},
  8 : {valueRus:"���.", code: "Hour", defaultAmount:"1"},
  9 : {valueRus:"���.", code: "Day", defaultAmount:"1"}
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
        /// �����
        Piece = 0,
        /// ����
        Liter = 1,
        /// �����
        Jar = 2,
        /// �������
        Bottle = 3,
        /// �����        
        Gram = 4,
        /// ���������
        Kilogram = 5,
        /// ����
        Meter = 6,
        /// ��������
        Pack = 7,
        /// ���, ��� ����������� ������� �������/��������
        Hour = 8,
        /// �����
        /// </summary>
        Day = 9
    }
*/

function getCurrencyString(currency){
	try{
		switch(currency){
            case 2:
			//return "р.";
            return'<span style="font-family:Verdana,SansSerif,Arial,Times,TimesNewRoman;">&#8381;</span>';
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