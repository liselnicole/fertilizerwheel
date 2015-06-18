//----------------------------------
//GEO Location
//----------------------------------

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var currentLocation = {
    latitude: null,
    longitude: null
}
var onLocationSuccess = function(position) {
    currentLocation.latitude = position.coords.latitude;
    currentLocation.longitude = position.coords.longitude;

    //console.log(currentLocation); 
};

// onError Callback receives a PositionError object
//
function onError(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
//----------------------------------
//Check for Connection Status
//----------------------------------

var initNetworkState;
var online;
var error; 
var dataExists;
var agreement; 

function onLoad() {
    //alert('onload called');
    document.addEventListener("deviceready", init, false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("resume", onResume, false);
    
    function init() {
        //alert('init() called');
        //CHECK FOR DATA
        if (localStorage.getItem("productList") !== null) {
            dataExists = true;
            //alert("init()" + dataExists);
        }
        else {
            dataExists = false;
            //alert("init()" + dataExists);
        }
        if(navigator.onLine) {
            online = true;
            initNetworkState = "online";
            if (localStorage.getItem("productList") !== null) {
                dataExists = true;
                //Remove any messages
                $('.message').empty(); 
                $('.firstOption').removeClass('ui-state-disabled');
            }
            else {
                $('.message').empty().append('<span>Error getting data, please check internet connection.</span>');
                $('.firstOption').addClass('ui-state-disabled');
            }
        }
        else {
            online = false;
            initNetworkState = "offline";
            $('.network').empty().append(online);
            if(dataExists == false) {
                $('.message').empty().append('Please connect to the internet.');
                $('.firstOption').addClass('ui-state-disabled');
            }
            $('#distributorsButton').addClass('ui-state-disabled');
        }

        //Check for location
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onError);
    } 
    //This is called by the event listener
    function onOnline() {
        //Get active page
        var activePage = $.mobile.activePage.attr('id'); 
        
        //Update online status
        online = true;
        
        //Get new product list when the app comes back online
        getProductsList();
        
        //Enable distributor link and remove message
        $('.distMessage').empty();
        $('#distributorsButton').removeClass('ui-state-disabled');
        
        //If data exists enable Best products and N buttons
        if(dataExists == true) {
            $('.firstOption').removeClass('ui-state-disabled');
        }
        //If the user is on the distributor page, close the error message
        if(activePage == "distributors") {
            $('#mapOffline').popup('close'); 
        }
        
    }
    //This is called by the Offline event listener
    function onOffline() {
        //Get the active page
        var activePage = $.mobile.activePage.attr('id');
        
        //Update online status 
        online = false;
        
        //Check for data and disable buttons if it is not there
        if (localStorage.getItem("productList") === null) {
                dataExists = false;
                $('.firstOption').addClass('ui-state-disabled');
            }
        
        //Disable distributor button and add message
        $('#distributorsButton').addClass('ui-state-disabled');
        $('.distMessage').empty().append('Please connect to the internet to view distributor locations.');
        
        //If the user is on the distributors page, alert message
        if(activePage == "distributors") {
            $('#mapOffline').popup('open'); 
        }
        
    }
    //On resume, get updated product list
    function onResume() {
        //alert('resume');
        getProductsList();
    }

}

//----------------------------------
//AJAX Calls
//----------------------------------
//Timestamp function for last updated date
function timeStamp() {
  var now = new Date();
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
  time[0] = time[0] || 12;
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
  return date.join("/") + " " + time.join(":") + " " + suffix;
}


//Get Product List Function
    function getProductsList() {
        $.ajax({
            type: 'GET',
            //url: "http://www.simplot.com/services/best_products",
            url: "http://simplot.sundoginteractive.com/services/best_products",
            contentType: "application/json",
            dataType: 'jsonp',
            jsonp : "callback",
            jsonpCallback: 'jsonpCallbackProducts',
            success: function(data) {
                //Check for error in data set
                var errorInData;
                $.each(data.product, function(i, theProduct) {
                    if(theProduct.error){
                        errorInData = true;
                    }
                    else {
                        errorInData = false;
                    }
                });
                //console.log(errorInData);
                //Upload data set to local storage if there is no error
                if(errorInData == false){
                var dataToStore = JSON.stringify(data);
                        localStorage.setItem('productList', dataToStore);
                        localStorage.setItem('updateDate', timeStamp());
                }
                
               //Check to make sure data was stored successfully
                if (localStorage.getItem("productList") !== null) {
                    dataExists = true;
                    //Remove any messages
                    $('.message').empty(); 
                    $('.firstOption').removeClass('ui-state-disabled');
                }
                else {
                    $('.message').empty().append('Error getting data, please check internet connection.');
                }
               
            },
            error: function (xhr, ajaxOptions, thrownError) {
                /*alert("Error: " + xhr.status + "\n" +
                       "Message: " + xhr.statusText + "\n" +
                       "Response: " + xhr.responseText + "\n" + thrownError);*/
                error = 'Error getting data.';
                //alert(error);
            }
        });
    }
    
    //Get Privacy Policy
    function getPrivacyPolicy() {
        $.ajax({
            type: 'GET',
            url: "http://www.simplot.com/services/privacy_policy",
            contentType: "application/json",
            dataType: 'jsonp',
            jsonp : "callback",
            jsonpCallback: 'jsonpCallbackPrivacyPolicy',
            success: function(data) {
              //console.log(data.policy);
              var errorInData;
                $.each(data.policy, function(i, theText) {
                    if(theText.error){
                        errorInData = true;
                    }
                    else {
                        errorInData = false;
                    }
                });
                if(errorInData == false){
                  $.each(data.policy, function(i, theText) {
                    //console.log(theText.text);
                    $('#privacyPolicyText').empty();
                    $('#privacyPolicyText').append(theText.text);
                  });          
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //error = 'Error getting privacy policy.';
                //alert(error);
                $('#privacyPolicyText').empty();
                $('#privacyPolicyText').append('Error getting privacy policy text.');
            }
        });
    }

//-----------------------------------
//WHEEL FUNCTIONS AND SPREAD CALCULATIONS 
//-----------------------------------

 $(function($) {
    //Wheel page functions
    function resetSlider() {
        // console.log('resetSlider called');
        $(".theSlider input").val(1).slider('refresh');
    }
    function lbsper1000(value) {
        var lbs = $('#lbs').val();
        var lbsper1000 = ((lbs / value) * 100).toFixed(1);
        var $theContainer = $('.lbsper1000');
        $theContainer.empty();
        $theContainer.append('<h2>' + lbsper1000 + '</h2>');
        //console.log(lbsper1000);
    }
    function lbsperAcre(value) {
        var lbs = $('#lbs').val();
        var lbsperAcre = (((lbs / value) * 100) * 43.56).toFixed(1);
        var $theContainer = $('.lbsperacre');
        $theContainer.empty();
        $theContainer.append('<h2>' + lbsperAcre + '</h2>');
        //console.log(lbsperacre);
    }
    $('.theSlider').bind( "change", function(event, ui) {
        var value = $('.knob').val();
        lbsper1000(value);
        lbsperAcre(value);
    });

    $(document).ready(function() { 
        var value = $(".knob").val();
        lbsper1000(value);
        lbsperAcre(value);
    });

    $(".knob").knob({
        change : function (value) {
            //console.log("change : " + value);
            resetSlider();
            lbsper1000(value);
            lbsperAcre(value);
        },
        release : function (value) {
            //console.log(this.$.attr('value'));
            lbsper1000(value);
            lbsperAcre(value);
            promoProduct(value);
        },
        cancel : function () {
            console.log("cancel : ", this);
        },
        /*format : function (value) {
            return value + '%';
        },*/
        draw : function () {
            // "tron" case
            if(this.$.data('skin') == 'tron') {
    
                this.cursorExt = 0.3;
    
                var a = this.arc(this.cv)  // Arc
                    , pa                   // Previous arc
                        , r = 1;
    
                    this.g.lineWidth = this.lineWidth;
    
                    if (this.o.displayPrevious) {
                        pa = this.arc(this.v);
                        this.g.beginPath();
                        this.g.strokeStyle = this.pColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                        this.g.stroke();
                    }
    
                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                    this.g.stroke();
    
                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();
    
                    return false;
                }
            }
        });
  });
//-----------------------------------
//Mobile Init
//-----------------------------------
    $( document ).bind( "mobileinit", function() {
        //alert('here');
        $.support.cors = true;
        $.mobile.allowCrossDomainPages = true;
        getProductsList();
    });
//-----------------------------------
//Page Init
//-----------------------------------   
    $(document).on( "pageshow", function() {
        //Remove any active states on the landing page 
        $('.landingPageBtn').removeClass('active'); 
        //alert('page init!')
        $('.theFooter').load("templates/footer.html", function() {
            $(this).trigger('create');
        });
    });

    //Function to open links in the app
    function inAppBrowser(url, page) {
        //alert(url);
        if (online != false) {
            if (page == 'distributors') {
                if ((currentLocation.longitude != null) && (currentLocation.latitude != null)) {
                    window.open(url + '&q=' + currentLocation.latitude + ',' + currentLocation.longitude, '_blank', 'location=yes');
                }
                else {
                    window.open(url, '_blank', 'location=yes');
                }
            }
            else {
                window.open(url, '_blank', 'location=yes');
            }
        }
        else {
            if(page == 'selectedProd') {
                $("#datasheetOffline").popup("open");
            }
            else {
                $("#detailsOffline").popup("open");
            }
        } 
    }
//-----------------------------------
//LANDING PAGE
//-----------------------------------
//On clicking "I Agree" set storage item to true
    function setAgree() {
        localStorage.setItem('agree', true);
    }



//Call functions on page create
$(document).on( "pageshow", "#one", function(event, ui) {
    //Prompt user for Agree Statement
    function promptAgreement() {
        //alert('popup');
        $("#disclaimer").popup("open");
    }
    //CHECK IF AGREE EXISTS
    /*if (localStorage.getItem("agree") === null) {
        setTimeout(promptAgreement, 3500);
    }*/
    
    $('.landingPageBtn').on('tap', function() {
        $('.landingPageBtn').removeClass('active'); 
        var isDisabled = $(this).children('a').hasClass('ui-state-disabled');
        //alert(isDisabled);
        if(isDisabled == false) {
            $(this).addClass('active');
        }
    });
    
    $(window).bind("load", function() {
        if (localStorage.getItem("agree") === null) {
            setTimeout(promptAgreement, 500);
        }
    });
});

//-----------------------------------
//PRODUCT PROMO
//-----------------------------------
function promoProduct(value) {
    var promoIDMatch;
    var localData = JSON.parse(localStorage.getItem('productList'));
    //console.log('local data:' + localData);
    var $productPromoContainer = $('.ui-content.promo');
    var $productPromo = $('#productPromo');
    var $footer = $('.ui-footer'); 

    $productPromoContainer.removeClass('gray-background');
    $productPromo.empty();
    $footer.addClass('stick-bottom');
    $.each(localData.product, function(i, theProduct) {
        //console.log(theProduct.nitrogen_level);
        //console.log(value);

        if((theProduct.nitrogen_level == value) && (theProduct.suggested_product == "Yes")) {
            //console.log(promoIDMatch + ":" + theProduct.name);
            var description;
            var aIndex = theProduct.description.indexOf("<a");
            if (aIndex != -1){
                description = theProduct.description.substring(0,aIndex); 
            }
            else {
                description = theProduct.description;
            }
            //var description = theProduct.description.substring(0,theProduct.description.indexOf("<a")); 
            //console.log('index of <a:' + description);
            $productPromo.empty();
            $footer.removeClass('stick-bottom');
            $productPromoContainer.removeClass('gray-background');
            $productPromo.append('<h4>Suggested Product</h4>');
            if((theProduct.image_thumbnail != "") && (online == true)
            ) {
                $productPromo.append('<div class="suggestedProdImg"><img src="' + theProduct.image_thumbnail + '"></div>');
            }
            $productPromo.append('<div class="suggestedProdDesc"><a href="#" onclick="inAppBrowser(\'http://www.simplot.com/turf_horticulture/best/products_all#'+ theProduct.id +'\', \'suggestedProd\')">' + theProduct.name + '</a><p>' + description + '</p></div><div style="clear:both;"></div>');
        }
    });
}

//Call functions on page create
$(document).on( "pagecreate", "#enterNit", function() {
    var value = $('.knob').val();
    promoProduct(value);
});
    
//-----------------------------------
//PRODUCT LIST PAGE
//-----------------------------------

//Populate Product List Page Function
function productsList() {
    var localData = JSON.parse(localStorage.getItem('productList'));

    $.each(localData.product, function(i, theProduct) {
        //console.log(theProduct.name);
        $('#productsList').append('<li><a id="productSelected" href="#selectedProd" data-productID="' + theProduct.id + '">' +
                '<h4>' + theProduct.name + '</h4>' +
                '</a></li>');
    });
    $('#productsList').listview('refresh');
}

//Call functions on page create
$(document).on( "pagecreate", "#selectProd", function( e ) {
    productsList();
});

//Store product ID when product is clicked
$(document).on('pagebeforeshow', '#selectProd', function(){       
    $(document).on('click', '#productSelected', function(){     
        // set product ID
        var theProductID =  $(this).attr('data-productID');
        localStorage.setItem('productID', theProductID);
        
    });    
});

//-----------------------------------
//SELECTED PRODUCT PAGE
//-----------------------------------
//Product Page functions 
    function lbsper1000Prod(value) {
        var lbs = $('#prodlbs').val();
        var lbsper1000 = ((lbs / value) * 100).toFixed(1);
        var $theContainer = $('.lbsper1000Prod');
        $theContainer.empty();
        $theContainer.append('<h2>' + lbsper1000 + '</h2>');
        //console.log(lbsper1000);
    }
    function lbsperAcreProd(value) {
        var lbs = $('#prodlbs').val();
        var lbsperAcre = (((lbs / value) * 100) * 42.56).toFixed(1);
        var $theContainer = $('.lbsperacreProd');
        $theContainer.empty();
        $theContainer.append('<h2>' + lbsperAcre + '</h2>');
        //console.log(lbsperacre);
    }
    function resetProdSlider() {
        // console.log('resetSlider called');
        $(".theProdSlider input").val(1).slider('refresh');
    }
    $(document).ready(function() { 
        $('.theProdSlider').bind( "change", function(event, ui) {
            var value = $('.knob.prod').val();
            lbsper1000Prod(value);
            lbsperAcreProd(value);
        });
    });

//Populate Selected Product Details Page Function
function selectedProduct() {
    //console.log(online);
    var localData = JSON.parse(localStorage.getItem('productList'));
    var productID = localStorage.getItem('productID');

    resetProdSlider(); 
    
    $.each(localData.product, function(i, theProduct) {
            //console.log('Looping ID=' + theProduct.id);
            //console.log('set ID=' + productID);
        if(theProduct.id == productID) {
            var description;
            var aIndex = theProduct.description.indexOf("<a");
            if (aIndex != -1){
                description = theProduct.description.substring(0,aIndex); 
            }
            else {
                description = theProduct.description;
            }
            //console.log('match!');
            $('#selectedProdDetails').empty();
            $('#selectedProdTitle').empty();
            $('#selectedProdTitle').append('<h2 id="selectedProductName">' + theProduct.name + '</h2>');
            $('#selectedProdDetails').append('<h4>Product Details</h4><div style="clear:both;"></div>');
            if((theProduct.image_thumbnail != "") && (online == true)) {
                $('#selectedProdDetails').append('<div class="selectedProdImg"><img src="' + theProduct.image_thumbnail + '"></div>');
            }
            $('#selectedProdDetails').append(description);
            if(theProduct.datasheet_url != "") {
                $('#selectedProdDetails').append('<a class="ui-btn ui-corner-all" href="#" onclick="inAppBrowser(\''+ theProduct.datasheet_url +'\', \'selectedProd\')">Product Datasheet</a>');
            }
            $('#selectedProductKnob .knob').val(theProduct.nitrogen_level).trigger('change');
            lbsper1000Prod(theProduct.nitrogen_level);
            lbsperAcreProd(theProduct.nitrogen_level);
        }
    });
        
    
}

//Call functions on page create
$(document).on( "pagebeforeshow", "#selectedProd", function() {
    //alert('the Product Page');
    selectedProduct(); 
});

//-----------------------------------
//MAP PAGE
//-----------------------------------
//Call function for the map page
$(document).on( "pagebeforeshow", "#distributors", function() {
    //alert(initNetworkState);
    var iframeEmbedExists = $('#iframeHolder').children('iframe').length;
    if(iframeEmbedExists === 0 ) {
        $('#iframeHolder').append('<iframe src="http://batchgeo.com/map/180a4f2614047605521d8f04d78f79a0" frameborder="0" width="100%" height="100%" style="border:1px solid #aaa;border-radius:10px;margin-bottom:10px;"></iframe>');
        $('#iframeHolder').append('<div class="unlink"></div>');
        $('#iframeHolder').append('<a href="#" onclick="window.open(\'https://www.google.com/maps?ll=16.09595,146.608924&z=2&t=m&hl=en-US&gl=US&mapclient=apiv3\', \'_system\');" class="unlinkG"></a>');
        $('#iframeHolder').append('<a href="#" onclick="window.open(\'http://www.google.com/intl/en-US_US/help/terms_maps.html\', \'_system\');" class="unlinkTerms"></a>');
    }
});
//-----------------------------------
//POLICY PAGE
//-----------------------------------
//Call functions on policy page create
$(document).on( "pagebeforeshow", "#privacy", function() {
    //alert('the Privacy Page');
    getPrivacyPolicy(); 
});


