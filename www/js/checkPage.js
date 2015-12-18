/**
 * Created by Irina on 14.12.2015.
 */


var transactionID;
function updateCheckPage(){

    try{

        var receiptID = window.localStorage.getItem(RECEIPT_ID_KEY);
       transactionID = window.localStorage.getItem(TRANSACTION_ID_KEY);
        $('#sendFeedbackButton').click(function()
        {
            var mark=5;

            $("input[name*=level]:checked").each(function() {
                mark = $(this).val();
            });

            sendFeedback(receiptID,3,$('#commentForProggers').val(),$('#select-native-3').val())
                .done(function(){
                    $('#modal').hide();
                    $('.my-modal').hide();
                    $('.my-modal').hide();
                });
        });
        $('#okButton').click(function(){
            $('#modal').hide();
            $('.my-modal').hide();
        });

        getTransaction(transactionID).done(function(res){
            var js = jQuery.parseJSON(res.rows.item(0).transactionJSON);
            var row = res.rows.item(0);
            var jsonText = row.transactionJSON;
            if ((js.Coords!=undefined)&(js.Coords!=null)&(js.Coords!="null")) {
                var lat = js.Coords.Latitude;
                var lon = js.Coords.Longitude;
                window.localStorage.setItem(LATITUDE_KEY, lat);
                window.localStorage.setItem(LONGITUDE_KEY, lon);
                preInitMap();
            }

            var now = new Date();
            $('#checkName').html(js.Name==null?"":js.Name);
            $('#shopName').html(js.Shop==null?"":js.Shop);
            $('#shopName2').html(js.Shop==null?"":js.Shop);


            if ((row.isFav==1)||(row.isFav=='1')){
                $('#checkFavouriteButton').removeClass('ui-btn-nostar');
                $('#checkFavouriteButton').addClass('ui-btn-star')	;
            }
            else{
                $('#checkFavouriteButton').removeClass('ui-btn-star');
                $('#checkFavouriteButton').addClass('ui-btn-nostar')	;
            }


            //subcategorys and purses

            refreshSubCategoryCombo(js.SubCategory);

            var html13 = $('#categoryRowTemplate').html();
            //------------combobox for category-----------////////
            $('#select-native-0').html('');
            getCategoryName(js.Category).done(function(categoryName){
                html13 = html13.replace(/\{catName\}/g,categoryName);
                html13 = html13.replace(/\{catValue\}/g,js.Category);
                $('#select-native-0').append(html13);

                getCategories().done(function(res){
                    for (var j=0;j<res.rows.length;j++){
                        if (js.Category==res.rows.item(j).id) continue;
                        var html111 = $('#categoryRowTemplate').html();
                        html111 = html111.replace(/\{catName\}/g,res.rows.item(j).name);
                        html111 = html111.replace(/\{catValue\}/g,res.rows.item(j).idtext);
                        $('#select-native-0').append(html111);
                        if (j==res.rows.length-1){
                            $("#select-native-0 option:first").attr('selected','selected');
                            $('#select-native-0').selectmenu("refresh", "true");
                        }
                    }
                });
            });
            var image = getCategoryImage(js.Category);
            $('#leftImage').attr("src",image);

            $('#select-native-0').change(function() {

                changeCategory(transactionID, $('#select-native-0').val()).done(function(){
                    var category = $('#select-native-0').val();
                    var image = getCategoryImage(category);
                    $('#leftImage').attr("src",image);
                    $('#select-native-0').selectmenu("refresh", "true");
                    getFirstSubCategory(category).done(function (res){
                        refreshSubCategoryCombo(res);
                    });

                });

            });

            ///----------------------------------------//



            var html2 = $('#purseRowTemplate').html();
            html2 = html2.replace(/\{purseName\}/g,"Кошелёк");
            $('#select-native-2').html(html2);
            $('#select-native-2').selectmenu( "refresh" );


            // tags


            $('#tagsList').html('');
            for (var k=0; k<js.Tags.length; k++){
                var html3 = $('#tagRowTemplate').html();
                html3 = html3.replace(/\{tagName\}/g,fullTagsArray[hashCode(js.Tags[k])]);
                $('#tagsList').append(html3);
            }



            //checkDetails
            var tableHTML="";
            $("#checkDetailstable > tbody").html('');
            for (var p=0; p< js.receiptData.Items.length; p++){
                var html5='<tr class="one-detail"><td>{positionName}</td><td><span>{positionCost}</span></td><td>{positionTag}</td></tr>' ;

                html5 = html5.replace(/\{positionName\}/g,js.receiptData.Items[p].ItemName);
                html5 = html5.replace(/\{positionCost\}/g,formatPrice(js.receiptData.Items[p].Value));
                html5 = html5.replace(/\{positionTag\}/g,fullTagsArray[hashCode(js.receiptData.Items[p].Tag)]);
                $('#checkDetailstable > tbody').append(html5);



            }




            $('#spent1').html(formatPrice(js.Amount));
            $('#spent2').html(formatPrice(js.Amount));
            // tax
            $('#discount').html("Скидка "+formatPrice(js.receiptData.TotalTax));
            $('#discount2').html(formatPrice(js.receiptData.TotalTax));
            //$('#spentdiv').html('<span>'+formatPrice(js.Amount)+'</span><div>Скидка: '
            //			+formatPrice(js.receiptData.TotalTax)+'</div>');


            var date = new Date(js.TransactionDate);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var month = date.getMonth()+1;
            var day =  date.getDate();
            var year = date.getYear()+1900;
            $('#checkDate').html((hours<10?'0':'')+hours+":"+(minutes<10?'0':'')+minutes+" | "+ (day<10?'0':'')+day+"."+(month<10?'0':'')+month+"."+year )
            $("#checkDetailstable").table("refresh");
        });


        //$( "#table" ).table( "rebuild" );
        var flag = false;
        $('.buttons-container button').click(function()
        {
            var id = $(this).data('href');
            $('.check-tab').hide();
            $(id).show();

            $('.active-icon-tab').removeClass('active-icon-tab');
            $(this).addClass('active-icon-tab');

            takeHeight();

            if(id == '#check-map')
            {
                if(flag) return 0;

                flag = true;
                initMap();

            }
            if (id== '#check-photo'){
                var receiptID = window.localStorage.getItem(RECEIPT_ID_KEY);
                var now2 = new Date();
                window.resolveLocalFileSystemURL(receivedPhotoDir +receiptID,
                    function success(fileEntry){
                        //	alert("success");
                        $('#checkImage').attr('src',receivedPhotoDir +receiptID+ '?' + now2.getTime());
                    },
                    function fail(error){
                        getImage(receiptID).done(function(res){
                            //alert("getImage done!");

                            $('#checkImage').attr('src',receivedPhotoDir +receiptID+ '?' + now2.getTime());
                        });
                    });
            }

        });


        $(document).ready(function()
        {
            $('#select-native-0-button').prepend('<img src="images/img.jpg" alt="" id = "leftImage">');
            $('#select-native-1-button').prepend('<img src="images/img.jpg" alt="">');
            $('#select-native-2-button').prepend('<img src="images/cash.png" alt="">');
                    $( "#modal" ).dialog({
                autoOpen: false,
                modal: true,
                show: {
                    effect: "blind",
                    duration: 1000
                },
                hide: {
                    effect: "explode",
                    duration: 1000
                }
            });

            takeHeight();
        });

        $('.message').click(function()
        {

            requestFeedback(receiptID).done(function(res){
                $.mobile.loading("hide");
                // no existing feedback
                if (res=='null'){
                    $('#modal').show();
                    $('#createFeedbackDialog').show();
                }
                // show existing feedback
                else{
                    //	alert(res);
                    var json = jQuery.parseJSON(res);
                    $('#modal').show();
                    $('#showFeedbackDialog').show();
                    $("#comment").html(json.Remark);
                    var nowdate = new Date();
                    if (json.Mark==1) $('#markImage').addClass('myimage1');
                    if (json.Mark==2) $('#markImage').addClass('myimage2');
                    if (json.Mark==3) $('#markImage').addClass('myimage3');
                    if (json.Mark==4) $('#markImage').addClass('myimage4');
                    if (json.Mark==5) $('#markImage').addClass('myimage5');

                    if (json.Reason==1)$("#reason").html('Все хорошо, спасибо вам, разработчики!');
                    if (json.Reason==2)$("#reason").html('Не распознались итоги или скидки');
                    if (json.Reason==3)$("#reason").html('Не распознались покупки');
                    if (json.Reason==4)$("#reason").html('Не определился магазин');
                    if (json.Reason==5)$("#reason").html('Низкое качество фотографии');
                    if (json.Reason==200)$("#reason").html('Другое');
                    //$('#markImage').attr('src',receivedPhotoDir +receiptID+ '?' + now.getTime());

                    if (json.State=1)$("#state").html('Новый отзыв');
                    if (json.State=2)$("#state").html('Рассмотрен, предприняты некоторые действия и закрыт');
                    if (json.State=3)$("#state").html('В работе. Необходимо доработать систему');

                    if (json.Reaction==null)$("#reaction").html('Нет ответа');
                    else $("#reaction").html(json.Reaction);
                };
            });
        });

        $(document).on('click','#modal',function(event)
        {
            $('#modal').hide();
            $('.my-modal').hide();
        });


        $('#checkDate').click(function() {
            changeDate();
        });

        $('#checkName').click(function() {
            changeName();
        });
        $('#shopName').click(function() {
            changeShop();
        });

    }
    catch(e){
        dumpError("updateCheckPage",e);
    }

}



function refreshSubCategoryCombo(subcategory){
    var html1 = $('#categoryRowTemplate').html();
    $('#select-native-1').html('');
    if (subcategory==0){
        $('#select-native-1').selectmenu("refresh", "true");
    }
    getSubCategoryName(subcategory).done(function(subcategoryName){
        html1 = html1.replace(/\{catName\}/g,subcategoryName);
        html1 = html1.replace(/\{catValue\}/g,subcategory);
        $('#select-native-1').append(html1);

        getSubCategoryParent(subcategory).done(function(catID){
            getSubCategories(catID).done(function(res){

                for (var j=0;j<res.rows.length;j++){
                    if (subcategory==res.rows.item(j).id) continue;
                    var html11 = $('#categoryRowTemplate').html();
                    html11 = html11.replace(/\{catName\}/g,res.rows.item(j).name);
                    html11 = html11.replace(/\{catValue\}/g,res.rows.item(j).idtext);
                    $('#select-native-1').append(html11);
                    if (j==res.rows.length-1){
                        $("#select-native-1 option:first").attr('selected','selected');
                        $('#select-native-1').selectmenu("refresh", "true");
                    }
                }
            });
        });
    });
    $('#select-native-1').change(function() {
        changeSubCategory(transactionID, $('#select-native-1').val());
    });
}



function changeName(){
    alert("editName!");
}

// shops are not visible yet (no value from server)
function changeShop(){
  //  alert("editShop!");
}


function changeDate(){
    alert("editDate!");
}

function deleteTag(){
    alert("deleteTag");
}
