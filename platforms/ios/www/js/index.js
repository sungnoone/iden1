/*

 */
document.addEventListener("deviceready",function(){
    show_id();
},false);

var USERNAME = "e99999";
var PASSWORD = "e99999";
var IDFA = "";
var IDFV = "";

var RESTFUL_HOST = "http://192.168.1.229:8088";
var RESTFUL_URL_APP_VALIDATE_1 = "/msrv2/security/app_validation_request/";//Username+Password+IDFA驗證服務位址


/*=======================================================================*/

//查詢ID，設定ID變數值
function show_id(){
       window.plugins.AppleAdvertising.getIdentifiers(
        function(identifiers) {
            IDFA = identifiers.idfa;
            IDFV = identifiers.idfv;
            $("#message").append("<p> IDFA: "+identifiers.idfa+"</p>");
            $("#message").append("<p> IDFV: "+identifiers.idfv+"</p>");
            $("#message").append("<p> got trackingEnabled: "+identifiers.trackingEnabled+"</p>");
        },
        function() {
            $("#message").append("<p> error loading identifiers</p>");
        }
    );
}

//明碼驗證(idfa)
function validation_by_text(){
    var Valid_Info = JSON.stringify({
        "Username":USERNAME,
        "Password":PASSWORD,
        "Idfa":IDFA
    });
    $.ajax({
        type:"POST",
        url:RESTFUL_HOST+RESTFUL_URL_APP_VALIDATE_1,
        data:Valid_Info,
        contentType:"application/json",
        dataType:"text",
        success: function(data, status, jqXHR){
            alert(data);
        },
        error: function(jqXHR, status){
            alert("FAIL!");
        }
    });

}


/*=======================================================================*/
