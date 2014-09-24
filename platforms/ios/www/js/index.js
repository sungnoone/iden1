/*

 */
var USERNAME = "";
var PASSWORD = "";
var APP_NAME = "iden1";
var IDFA = "";
var IDFV = "";
var pass_result = "";

var RESTFUL_HOST = "http://192.168.1.229:8088";
var RESTFUL_URL_APP_VALIDATE_1 = "/msrv2/security/app_validation_request/";//IDFA驗證服務位址
var RESTFUL_URL_APP_VALIDATE_2 = "/msrv2/security/app_register_request/";//附加密語IDFA驗證服務位址
var RESTFUL_URL_APP_VALIDATE_3 = "/msrv2/security/app_reset_pass_word/";//重置驗證碼

var FILE_USER_INFO = "login.txt"


/*===============  fileSystemFail() Filesystem 共通性錯誤處理 ===================*/
{

function fileSystemFail(error) {
    alert("FileSystem Fail!! "+error.code);
}

}


/*=============== document events ===================*/

document.addEventListener("deviceready",function(){
    //取得身份
    //$.mobile.pageContainer.pagecontainer("change","#page_login",{reload:true});

    //驗證
    window.plugins.AppleAdvertising.getIdentifiers(
        function(identifiers) {
            IDFA = identifiers.idfa;
            IDFV = identifiers.idfv;
            checkUser();
            //validation_by_text();
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


$(document).on("pageinit", "#page_login", function(){
    loadUserAccount();
});

/*========================== 驗證 ====================================*/

{/* start 驗證*/

//查詢ID，設定ID變數值
    function show_idfa(){
        alert(IDFA);
    }

function checkUser(){
    //$.mobile.pageContainer.pagecontainer("change","#page_login",{reload:false});
    alert("Before Load file");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(FILE_USER_INFO, {create: true, exclusive: false}, function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                alert(reader.toString());
                reader.onloadend = function(evt){
                    var s = evt.target.result;
                    if(s==null || s==""){
                        $.mobile.pageContainer.pagecontainer("change","#page_login",{reload:true});
                        return;
                    }
                    var obj_json = $.parseJSON(s);
                    USERNAME = obj_json.username.toLowerCase();
                    PASSWORD = obj_json.password;
                    if(USERNAME=="" || USERNAME==null){
                        alert("load login");
                        $.mobile.pageContainer.pagecontainer("change","#page_login",{reload:true});
                    }else{
                        alert(USERNAME+" "+PASSWORD);
                        //驗證
                        validation_by_text();
                    }
                };
                reader.readAsText(file);
                alert("After Load file");
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
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
                    //$("#btn_showid").removeClass("ui-disabled");
                    //$("#btn_validate").removeClass("ui-disabled");
                    //$("#btn_register").removeClass("ui-disabled");
                    $("a").removeClass("ui-disabled");
                    $("#message").append("<p>驗證通過</p>");
                }else if(pass_result=="00x002") {
                    //等待驗證碼
                    $.mobile.pageContainer.pagecontainer("change", "#page_pass", {reload: false});
                }else if(pass_result=="00x008") {
                    //idfa未啟動
                    reset_pass();
                }else if(pass_result=="00x004" || pass_result=="00x005"){
                    //帳號密碼有誤
                    //$.mobile.pageContainer.pagecontainer("change","#page_no_pass",{reload:false});
                    //$("#nopass_message").append("<p>帳號密碼有誤："+pass_result+"</p>");
                    //$("#nopass_message").append("<p>"+USERNAME+":"+PASSWORD+"</p>");
                    $.mobile.pageContainer.pagecontainer("change","#page_login",{reload:true});
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
                    //等待驗證碼
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
                    //$("#btn_showid").removeClass("ui-disabled");
                    //$("#btn_validate").removeClass("ui-disabled");
                    //$("#btn_register").removeClass("ui-disabled");
                    $("a").removeClass("ui-disabled");
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

}/* end 驗證 */



/*============================= 帳號 =================================*/

//


//reset account
function restAccount(){
    $.mobile.pageContainer.pagecontainer("change","#page_login",{reload:true});
}

function saveUserAccount(){
    //儲存帳號資訊
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        //alert("Before saving file");
        var username = $("#login_username").val();
        var password = $("#login_password").val();
        fileSystem.root.getFile(FILE_USER_INFO, {create: true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(writer){
                writer.onwriteend = function(evt) {
                    alert("儲存完成!");
                };
                writer.write('{"username":"'+username.toLowerCase()+'","password":"'+password+'"}');//結果寫入
                //alert("After saving file");
            },fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
    //帳號儲存完畢，一律順便更新帳號資訊相關變數資訊
    //其他功能在執行時，就不要重複執行讀取帳號檔案的動作。
    // 帳號資訊檔案載入

    //alert("Before Load file");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(FILE_USER_INFO, {create: true, exclusive: false}, function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt){
                    var s = evt.target.result;
                    var obj_json = $.parseJSON(s);
                    USERNAME = obj_json.username.toLowerCase();
                    PASSWORD = obj_json.password;
                    //alert(USERNAME+"  "+PASSWORD);
                    $("#login_username").val(USERNAME);
                    $("#login_password").val(PASSWORD);
                };
                reader.readAsText(file);
                //alert("After Load file");
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);

}

function loadUserAccount(){
    //alert("Before Load file");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile(FILE_USER_INFO, {create: true, exclusive: false}, function(fileEntry){
            fileEntry.file(function(file){
                var reader = new FileReader();
                reader.onloadend = function(evt){
                    var s = evt.target.result;
                    var obj_json = $.parseJSON(s);
                    USERNAME = obj_json.username.toLowerCase();
                    PASSWORD = obj_json.password;
                    $("#login_username").val(USERNAME);
                    $("#login_password").val(PASSWORD);
                };
                reader.readAsText(file);
                //alert("After Load file");
            }, fileSystemFail);
        }, fileSystemFail);
    }, fileSystemFail);
}




