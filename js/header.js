MLS.header = (function () {

    /*=========================================
    =            Private variables            =
    =========================================*/
    var $modal, $input, $resetButton, $closeButton, $tooltip; 
    var $winHeight = $jQ(window).outerHeight();
    /*-----  End of Private variables  ------*/

    // function deviceLI (name, url) {
    //     url = url || '#';
    //     var $elem = $jQ('<li><span class="facet-check"></span></li>')
    //             .prepend($jQ('<a href="' + url + '"><span class="facet-name">' + name + '</span>'));

    //     return $elem;
    // }



    var pub = {

        /*===================================
        =            Initializer            =
        ===================================*/

        init : function () {
            $modal = $jQ('#mls-compatibility-mobile-modal');
            $input = $jQ('#search-device-or-brand, .search-device-or-brand').find('input#search-input, input.search-input');
            $resetButton = $modal.find('.search-reset');
            $closeButton = $modal.find('.close');
            $tooltip = $jQ('#select-device');
            $closeTooltip = $jQ('.show-tooltip').find('.close-Tooltip');
            tooltipFlag = false;            

            // adding to make the header stick
            var $megamenu = $jQ('#site-header'),
                $omniNav = $jQ('#omninav'),
                $vzwGlobalNav = $jQ("#globalNavId"),
                $minicartBorderBlock = $jQ(".minicart-border-block"),
                $navCart = $jQ("#nav-mobile-cart"),
                $navMenu = $jQ("#nav-mobile-tabs-primary.nav-tabs li.nav-item"),
                searchInputOpen = false;

            if(isTouch) {
                $megamenu = $jQ('#mls-nav-mobile-gmenu');
            }
            else {
                $megamenu = $jQ('#mls-nav');
            }

        
                
            $jQ("a.btn-search").click(function(){
                if($jQ(this).hasClass("collapsed")){
                    searchInputOpen = true;
                    $navCart.css({opacity: "0", top: "0", "z-index":"-999"});
                    $navMenu.css({opacity: "0", top: "0", "z-index":"-999"});
                    $jQ(".m_vgn_nav_right").css({ "z-index":"999"});
                }else{
                    searchInputOpen = false;
                    $navCart.delay(300).animate({opacity: "1", top: "-62px"}, 100);
                    $navMenu.delay(300).animate({opacity: "1", top: "-62px"}, 100);
                }
            })
/**********************/
            $jQ(window).on("resize", function(){
                    $winHeight = $jQ(window).outerHeight();
            })
/********************/
            if($jQ("html").hasClass("touch") && $jQ(window).outerWidth() < 700)
                {
                    //Mobile
                    $megamenu = $jQ('#site-header #mls-nav-mobile-gmenu');
                    $jQ("header#omninav, header#site-header").wrapAll($jQ("<div id='mainHeader'/>"));
                    $jQ("#mainHeader").css("z-index", "12000");
                    $jQ("#mainHeader").addClass("fixed");
                    $GGMenu_ul = $jQ('#mls-nav-mobile-content');
                    var $DeviceModal = $jQ('#mls-compatibility-mobile-modal');
                    var $DeviceModalHeight = $jQ('#mls-compatibility-mobile-modal').outerHeight();
                    var $omniHeight = $jQ('#omninav').outerHeight(true);
                    $mainHeaderHeight = $jQ('#mainHeader').outerHeight(true);
                    $GGMenu_ul.css({
                        "max-height": $winHeight - $mainHeaderHeight,
                        "overflow": "scroll"
                    });
                    $jQ(window).on("resize", function(){
                        $GGMenu_ul.css({
                            "max-height": $winHeight - $mainHeaderHeight
                        });
                    });

                    $DeviceModal.css({
                        "max-height": $winHeight - $omniHeight,
                        "height": $winHeight - $omniHeight,
                        "overflow": "scroll"
                    });

                }else if($jQ("html").hasClass("touch") && $jQ(window).outerWidth() >= 700){

                    //Tablet
                    $megamenu = $jQ('#site-header #mls-nav-mobile');
                    $jQ(window).scroll(function() {
                        if ($megamenu.length > 0 && $jQ(window).scrollTop() > $omniNav.outerHeight(true))
                        {  
                            $megamenu.css({"position":"fixed", "z-index":"12000"});
                        } else {
                            $megamenu.css({"position":"absolute", "z-index":"12000"});
                        }
                    });
                }else{
                   //Desktop
                    $megamenu = $jQ('#mls-nav');

                    $jQ(window).scroll(function() {
                        if($megamenu.length > 0 && $jQ(window).scrollTop() > $vzwGlobalNav.outerHeight(true))
                        {  
                         $megamenu.css({"position":"fixed", "z-index": "12000"});
                        } else {
                         $megamenu.css({"position":"absolute", "z-index": "12000"});
                        }
                    });
                }
        

            $jQ(document).ajaxSuccess(function(a,b,c,r) {
                if (r && r.length == 0)
                {
                    if ($jQ("#unknown-device").length == 0)
                    {
                        var nf = $jQ("#device-not-found"),
                            text = "Oops, we do not recognize this device. Please, check the name and spelling of your device and try again.";

                        if (nf.length > 0)
                        {   
                            text = nf.find("p");
                        }

                        $jQ("#search-device-or-brand").after("<div id='unknown-device'></div>");
                        $jQ("#unknown-device").append(text.clone(true));
                    }

                    $jQ("#unknown-device").show();
                } else {
                    $jQ("#unknown-device").hide();
                }
            });

            // search text field
            $input.typeahead({
                name: 'devices',
                remote: {
                    url: MLS.ajax.endpoints.SEARCH_DEVICES + '?Ntk=product.displayName&Ntt=%QUERY*'
                },
                limit: 15
            }).on('change keyup typeahead:selected typeahead:closed', pub.getDevices);

            // reset form
            $resetButton.bind('click', pub.resetForm);

            // close modal
            $closeButton.bind('click', pub.closeModal);

            // Tooltip
            if (!$jQ.cookie('returning_visitor')) {
                $tooltip.find('.dropdown-panel').fadeIn();
                $tooltip.find('.dropdown-close').on('click', pub.closeToolTip);
            }
            
            // Added for new tooltip requirement 
            $closeButton.bind('click', pub.showAlert);
            $closeTooltip.bind('click', pub.stopAlert);
        },

        /*-----  End of Initializer  ------*/




        /*================================================
        =            Finalize (unbing events)            =
        =================================================*/

        finalize : function () {
            // search text field
            $input.unbind('change keyup typeahead:selected typeahead:closed', pub.getDevices);

            // reset form
            $resetButton.unbind('click', pub.resetForm);

            // close modal
            $closeButton.unbind('click', pub.toggleModal);

        },

        /*-----  End of Finalize (unbing events)  ------*/


        /*============================================
        =            Reinit: on ajax load            =
        ============================================*/

        reInit: function () {
            pub.finalize();
            pub.init();
        },

        /*-----  End of Reinit: on ajax load  ------*/



        /*========================================
        =            Open/Close Modal            =
        ========================================*/

        // Using the same toggle approach from content-grid.js
        // so we can re-use the styles.

        openModal: function () {
            $jQ(".downArrow").html("&nbsp;<b> &and; </b>");
            var viewportHeight = Response.viewportH();
            $jQ("#unknown-device").hide();

            $modal.show(function () {
                $jQ(this).children('.filter-panel').show();
                $jQ(this).animate({
                    height: Math.max(viewportHeight, $jQ("body").height())
                });
                // $jQ('body').addClass('noscroll');
            });
        },

        closeModal: function () {
            $modal.animate({height: 0}, function () {
                $jQ(this).hide();
                // $jQ('body').removeClass('noscroll');
            });
        },

        /*-----  End of Open/Close Modal  ------*/




        /*==================================
        =            reset form            =
        ==================================*/

        resetForm: function () {
            $resetButton.hide();
            $jQ(this).parent('form').find('input[type=text]').val('');
        },

        /*-----  End of reset form  ------*/


        /*================================
        =            Tooltip           =
        ================================*/

        // close tooltip
        closeToolTip: function () {
            $jQ(this).parents('.dropdown-panel').fadeOut();
            $jQ.cookie('returning_visitor', true);
        },

        // set cookie

        // read cookie

        /*-----  End of Tooltip  ------*/




        /*===================================
        =            Get devices            =
        ===================================*/

        getDevices: function (e, item) {
            e.type === 'typeahead:closed' && $jQ(this).blur();
            
            $resetButton.show();

            e.type === 'typeahead:selected' && pub.selectDevice(item);
            
            e.type === 'keyup' && MLS.ajax.mastHead({ pCheck: e.type }, function() {
                // callback for the masthead function
            });
        },

        /*-----  End of Get devices  ------*/



        /*==============================================
        =            Select Device Callback            =
        ==============================================*/
        /*
        selectDevice: function (item) {
            MLS.home.searchProducts($input.parents('form').serialize());
            pub.closeModal();
        }
        */

        selectDevice: function (item) {
            var contextPath = $jQ('#pageContextPath').val();

            // re-change of requirement, use pushstate
            // if (window.history.pushState && item.id) {
            //    window.history.pushState({}, 'Title', contextPath + "/allproducts" + item.id);
            // }
            
            // yet another change in requirement: redirect on device selection
            // document.location = contextPath + "/allproducts" + item.id;
            
            MLS.ajax.mastHead({ 
                pName: $jQ('#search-input').val()
            }, function() {
                document.location = contextPath + "/allproducts" + item.id;
            }, function() {
                document.location = contextPath + "/allproducts" + item.id;
            });
        },
        /*-----  End of Select Device Callback  ------*/
       
       
       /*==============================================
        =           New tooltip requirement            =
        ==============================================*/
             
       showAlert: function(container){
            $jQ(".downArrow").html("&nbsp;<b> &or; </b>");
			var link = $jQ('.show-tooltip').find('.dropdown-link');
				pannel = $jQ(link).next('.dropdown-panel'),
				marker = $jQ(link).find(".marker");
	
            if(tooltipFlag==false)	
            {
            	pannel.css({	
                    right: (marker.length > 0) ? 3 + marker.position().right - pannel.width() / 3 : (pannel.css('right') || 0)	
	                }).delay(1500).fadeIn(50);	
                tooltipFlag = true;	
            };		
    		$jQ(link).next('.dropdown-panel').delay(2000000).fadeOut(200);	
       },
       
       stopAlert: function(){
       	$jQ('.show-tooltip').find('.dropdown-panel').stop().show();	
           	
       },

       /* Mobile UI Enhancements starts here */
       openProductsPage: function(myselection){
            window.location = $jQ(myselection).find('option:selected').val();
       },

       openDeviceList: function(){
            var ajaxendpoint = MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                splitURL = ajaxendpoint.split("?"),
                selVal = $jQ('#brand-select :selected').val(),
                ajaxURL = splitURL[0] + "?" + selVal + "&Ntt=*&" + splitURL[1];

                $jQ('#select-a-brand #brandlabel').html($jQ('#brand-select :selected').text());

                MLS.ajax.sendRequest(
                    ajaxURL,
                    $jQ(this).serialize(),              
                    function( data ) {
                        if(data.success.responseHTML !== "")
                        {
                            $jQ("#select-a-device").html(data.success.responseHTML).css("cursor","pointer").removeAttr("disabled","disabled");
                        }
                    }
                );
       }

       /* Mobile UI Enhancements ends here */
       
       /*------------------  End of tooltip---------------*/


    };

    return pub;

}());
