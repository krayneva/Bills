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

/*
  public enum MeasureType
    {
        /// <summary>
        /// �����
        /// </summary>
        Piece = 0,
        /// <summary>
        /// ����
        /// </summary>
        Liter = 1,
        /// <summary>
        /// �����
        /// </summary>
        Jar = 2,
        /// <summary>
        /// �������
        /// </summary>
        Bottle = 3,
        /// <summary>
        /// �����
        /// </summary>
        Gram = 4,
        /// <summary>
        /// ���������
        /// </summary>
        Kilogram = 5,
        /// <summary>
        /// ����
        /// </summary>
        Meter = 6,
        /// <summary>
        /// ��������
        /// </summary>
        Pack = 7,
        /// <summary>
        /// ���, ��� ����������� ������� �������/��������
        /// </summary>
        Hour = 8,
        /// <summary>
        /// �����
        /// </summary>
        Day = 9
    }
*/

function getCurrencyString(currency){
	switch(currency){
	case 2:
		return "�.";
	case 1:
		return "$";
	case 3:
		return "&#8364;";
	}
}