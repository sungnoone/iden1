/*

 */
var USERNAME = "e99999";
var PASSWORD = "e99999";
var APP_NAME = "iden1";
var IDFA = "";
var IDFV = "";
var pass_result = "";

var RESTFUL_HOST = "http://192.168.1.229:8088";
var RESTFUL_URL_APP_VALIDATE_1 = "/msrv2/security/app_validation_request/";//IDFA驗證服務位址
var RESTFUL_URL_APP_VALIDATE_2 = "/msrv2/security/app_register_request/";//附加密語IDFA驗證服務位址
var RESTFUL_URL_APP_VALIDATE_3 = "/msrv2/security/app_reset_pass_word/";//重置驗證碼

document.addEventListener("deviceready",function(){
    window.plugins.AppleAdvertising.getIdentifiers(
        function(identifiers) {
            IDFA = identifiers.idfa;
            IDFV = identifiers.idfv;
            validation_by_text();
        },
        function() {
            alert("取得本機資訊錯誤");
        }
    );
},false);



document.addEventListener("resume",function(){
/*    window.plugins.AppleAdvertising.getIdentifiers(
        function(identifiers) {
            IDFA = identifiers.idfa;
            IDFV = identifiers.idfv;
            validation_by_text();
        },
        function() {
            alert("取得本機資訊錯誤");
        }
    );*/
},false);

/*=======================================================================*/

//查詢ID，設定ID變數值
function show_idfa(){
    alert(IDFA);

}

//index.html
//明碼驗證(idfa)
function validation_by_text(){
    var Valid_Info = JSON.stringify({
        "Username":USERNAME,
        "Password":PASSWORD,
        "Idfa":IDFA,
        "App_Name":APP_NAME
    });
    //alert(IDFA);
    $.ajax({
        type:"POST",
        url:RESTFUL_HOST+RESTFUL_URL_APP_VALIDATE_1,
        data:Valid_Info,
        contentType:"application/json",
        dataType:"text",
        success: function(data, status, jqXHR){
            pass_result = data.toString();
            if(pass_result=="00x000"){
                $("#btn_showid").removeClass("ui-disabled");
                $("#btn_validate").removeClass("ui-disabled");
                $("#btn_register").removeClass("ui-disabled");
                $("#message").append("<p>驗證通過</p>");
            }else if(pass_result=="00x002") {
//                $("#btn_showid").addClass("ui-disabled");
//                $("#btn_validate").addClass("ui-disabled");
//                $("#btn_register").addClass("ui-disabled");
                $.mobile.pageContainer.pagecontainer("change", "#page_pass", {reload: false});
            }else if(pass_result=="00x008"){
                reset_pass();
            }else{
                //alert(pass_result);
                $.mobile.pageContainer.pagecontainer("change","#page_no_pass",{reload:false});
                $("#nopass_message").append("<p>"+pass_result+"</p>");
            }
        },
        error: function(jqXHR, status){
            pass_result = "fail";
            $("#message").append("<p>"+pass_result+"</p>");
        }
    });

}

//要求重設重送通關密語
function reset_pass(){
    var Valid_Info = JSON.stringify({
        "Username":USERNAME,
        "Password":PASSWORD,
        "Idfa":IDFA,
        "App_Name":APP_NAME
    });
    $.ajax({
        type:"POST",
        url:RESTFUL_HOST+RESTFUL_URL_APP_VALIDATE_3,
        data:Valid_Info,
        contentType:"application/json",
        dataType:"text",
        success: function(data, status, jqXHR){
            pass_result = data.toString();
            if(pass_result=="00x002") {
                $.mobile.pageContainer.pagecontainer("change", "#page_pass", {reload: false});
            }else{
                //alert(pass_result);
                $.mobile.pageContainer.pagecontainer("change","#page_no_pass",{reload:false});
                $("#nopass_message").append("<p>"+pass_result+"</p>");
            }
        },
        error: function(jqXHR, status){
            pass_result = "fail";
            $("#message").append("<p>"+pass_result+"</p>");
        }
    });
}


//askpass.html
//傳送通關密語
function send_pass_word(){
    PASS = $("#app_pass_word").val();
    if(PASS=="" || PASS==null){
        $("#pass_message").append("<p>請輸入通關密語！！</p>");
        return;
    }

    var Valid_Info = JSON.stringify({
        "Username":USERNAME,
        "Password":PASSWORD,
        "Idfa":IDFA,
        "App_Name":APP_NAME,
        "Sys_Pass_Word":$("#app_pass_word").val()
    });
    $.ajax({
        type:"POST",
        url:RESTFUL_HOST+RESTFUL_URL_APP_VALIDATE_2,
        data:Valid_Info,
        contentType:"application/json",
        dataType:"text",
        success: function(data, status, jqXHR){
            //alert(data);
            $("#pass_message").append("<p>"+data.toString()+"</p>");
            if(data.toString()=="00x000"){
                $.mobile.pageContainer.pagecontainer("change","index.html",{reload:true});
                $("#btn_showid").removeClass("ui-disabled");
                $("#btn_validate").removeClass("ui-disabled");
                $("#btn_register").removeClass("ui-disabled");
            }else{
                //密語未通過
                $.mobile.pageContainer.pagecontainer("change","page_no_pass",{reload:true});
                $("#nopass_message").append("<p>"+data.toString()+"</p>");
            }
        },
        error: function(jqXHR, status){
            pass_result = "fail";
            $("#pass_message").append("<p>"+pass_result+"</p>");
        }
    });
}

/*//明碼驗證需附密語(idfa)
 function app_register_validate_with_pass_word(){
 var Valid_Info = JSON.stringify({
 "Username":USERNAME,
 "Password":PASSWORD,
 "Idfa":IDFA,
 "App_Name":APP_NAME,
 "Sys_Pass_Word":"2712"
 });
 $.ajax({
 type:"POST",
 url:RESTFUL_HOST+RESTFUL_URL_APP_VALIDATE_2,
 data:Valid_Info,
 contentType:"application/json",
 dataType:"text",
 success: function(data, status, jqXHR){
 validate_result = data;
 alert(validate_result);
 },
 error: function(jqXHR, status){
 validate_result = "fail";
 alert(validate_result);
 }
 });

 }*/


/*=======================================================================*/

