MLS.bundleBuilder = {
    init : function () {
        // this is intended for demo purposes ONLY. Please remove.
        MLS.ui.lightbox($jQ('#bb-modal-link'));

        this.initDeviceSearch();
        this.initFilters();
        this.initTabs();
        this.Modal.init();

        //$jQ("form.upgrade input[type=submit]").uniform();
        $jQ("form.upgrade .close").click(function() {
            $jQ(this).parents("form").fadeOut();
            return false;
        });

        if ($jQ("body").hasClass("build")) {
            MLS.ajax.endpoints.QUICKVIEW_DETAILS = MLS.ajax.endpoints.QUICKVIEW_BUNDLE_BUILD;
        } else {
            MLS.ajax.endpoints.QUICKVIEW_DETAILS = MLS.ajax.endpoints.QUICKVIEW_BUNDLE_DETAILS;
        }

        //product slider
        if($jQ(window).width() < 768) {
                $jQ('#premium .slider-grid').flexslider({
                useCSS: false,
                animation: 'slide',
                animationLoop: true,
                controlNav: false,
                directionNav: false,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: MLS.categoryLanding.itemWidth()
            });
        }


        // FOR DEBUGGING PURPOSES ONLY
        // setTimeout(function() {
        //     var pbar = $jQ(".progress-bar");
        //    var one = pbar.find(".choose-case").toggleClass("active").toggleClass("selected");
        //    var two = pbar.find(".choose-protector").toggleClass("active");
        //    var three = pbar.find(".choose-charger");
        //    one.find("img").attr("src", "img/bb/step1-done.png");
        //    two.find("img").attr("src", "img/bb/step2-active.png");
        //     $jQ("#bb-item-module").toggleClass("step2");


        //     $jQ(".minicart-banner.brand").hide();
        //     $jQ(".minicart-banner.lifestyle").hide();
        //     $jQ(".minicart-banner.bundle-bonus").show();

        //    setTimeout(function () { 
        //     two.toggleClass("active").toggleClass("selected");
        //     two.find("img").attr("src", "img/bb/step2-done.png");
        //     three.toggleClass("active");
        //     three.find("img").attr("src", "img/bb/step3-active.png");

        //     $jQ("#bb-item-module").toggleClass("step2").toggleClass("step3");
        //    

        //     setTimeout(function () {
        //         three.toggleClass("active").toggleClass("selected");
        //         three.find("img").attr("src", "img/bb/step3-done.png");
        //          pbar.toggleClass("done");
        //         $jQ("#bb-item-module").toggleClass("step2").toggleClass("step3").toggleClass("done");
        //     }, 5000);
        //    }, 5000);
        // }, 5000);
        MLS.bundleBuilder.build.init();
    },

    initFilters: function() {
        // TODO: bind ajax on filters
         $jQ(".sort-options select, .filter-options select").uniform();
    },

    initTabs: function() {
        $jQ('.category-tabs li a').on('click', function (e) {
            var tab = $jQ(this).attr('href'),
                type = $jQ('.tab-content-wrapper[data-tab=' + tab + ']').attr('data-type'),
                results = $jQ('.tab-content-wrapper[data-tab=' + tab + ']').attr('data-result-count');

            $jQ('.category-tabs li a').parent().removeClass('active');
            $jQ(this).parent().addClass('active');
            $jQ('.tab-content-wrapper').removeClass('active');
            $jQ('.tab-content-wrapper[data-tab=' + tab + ']').addClass('active');
            return false;
        });
    },

    initDeviceSearch: function() {
        $jQ("#bb-modal").find("select.brand").uniform();

        $jQ('#bb-modal select[name=myDevice]').customSelectMenu({
            menuClass: 'select',
            openedClass: 'open',
            selectedClass: 'active',
            selectionMadeClass: 'selected'
        }).on('change', function () {
            if ($jQ(this).val().toLowerCase() == "other")
            {
                $jQ(this).parents("form").find(".search").show();
            } else {
                $jQ(this).parents("form").find(".search,.results").hide();
            }
        });

        $jQ('.mobile-model-select select').customSelectMenu({
            menuClass: 'select',
            openedClass: 'open',
            selectedClass: 'active',
            selectionMadeClass: 'selected'
        }).on('change', function () {
            var params = $jQ(this).val();

            window.location.hash = MLS.util.setHash("#" + params);
            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.PRODUCT_LISTING,
                params,
                function (data) {
                    var parent = $jQ("#main-column .tab-content-wrapper.active"),
                        container = parent.find(".content-grid");

                    if (parent.length == 0)
                    {
                        parent = $jQ("#main-column");
                        container = $jQ(".content-grid");
                    }

                    if (data.hasOwnProperty('success')) {
                        container.html(data.success.responseHTML);
                        parent.find('.content-filter-count strong').text(data.success.count);

                        contentGrid.reInit();
                        MLS.miniCart.init(container, MLS.miniCart.options);
                    } else {
                        container.html(data.error.responseHTML);
                    }
                }
            );
        });
    },

    Modal: {
        init: function(){
            console.log("modal: v19");
            $jQ.cookie("deviceToBundle", null); //force cookie

            this.Cookie.init();
            this.typeAhead();
        },

        Cookie:{
            init: function(){
                this.check();
                this.set();
            },

            deviceCookie: $jQ.cookie("deviceToBundle"),

            check: function(){
                //check cookie
                if (this.deviceCookie === "search") {
                    //show modal
                    $jQ("#bb-modal .results, #bb-modal fieldset:first-child" ).hide();
                    $jQ("#bb-modal").show();
                }

                // else if (this.deviceCookie === "results") {
                //     //show modal
                //     $jQ("#bb-modal .search, #bb-modal fieldset:first-child" ).hide();
                //     $jQ("#bb-modal").show();

                //     $jQ("#bb-modal .results li").click(function(){
                //         $jQ("#bb-modal .results li").removeClass('selected');
                //         $jQ(this).addClass('selected');
                //     });
                // }

                else if (this.deviceCookie == null) {
                    //show modal
                    $jQ("#bb-modal .search, #bb-modal .results" ).hide();

                    $jQ("#bb-modal").show();
                }
            },
            set: function(){
                // pass device and set cookie
                $jQ("#build-your-own").click(function(event){
                    event.preventDefault();

                    var device="";
                    if (this.deviceCookie === "search") {
                        device = $jQ("#bb-modal .search").serialize();
                    }

                    // else if (this.deviceCookie === "results") {
                    //     device = $jQ("#bb-modal .results li.selected a").attr("href");
                    // }

                    else if (this.deviceCookie == null) {
                        device = $jQ("#bb-search-my-devices .customSelect").val();
                    }

                    $jQ.cookie("deviceToBundle",  device, {path: "/"});
                    params = $jQ.cookie("deviceToBundle");

                    //request section
                    MLS.ajax.sendRequest(
                        MLS.ajax.endpoints.BB_CREATEBUNDLE_ITEMS,
                        params,
                        function (data) {
                            //hide modal
                            $jQ("#bb-modal").hide();

                            //console.log('ajax is in');
                            var container = $jQ(".slider-grid");

                            if (data.hasOwnProperty('success')) {
                                container.html(data.success.responseHTML);
                                   contentGrid.reInit();
                                   //console.log('success!!!');

                            } else {
                                container.html(data.error.responseHTML);
                            }
                        }
                    );
                });

                // pass device and set cookie, redirect
                $jQ("#browse-all").click(function(event){
                    event.preventDefault();

                    var device="";
                    if (this.deviceCookie === "search") {
                        device = $jQ("#bb-modal .search").serialize();
                    }
                    // else if (this.deviceCookie === "results") {
                    //     device = $jQ("#bb-modal .results li.selected a").attr("href");
                    // }
                    else if (this.deviceCookie == null) {
                        device = $jQ("#bb-search-my-devices .customSelect").val();
                    }

                    $jQ.cookie("deviceToBundle",  device, {path: "/"});

                    window.location.href = "/bb-browse.html";
                });
            }
        },

        typeAhead: function(){
             // search text field
            $jQ("#bb-modal .search input.device").unbind('keyup').bind('keyup', function() {
                var params = $jQ("#bb-modal .search").serialize();
                // call ajax to search for devices sending both drop down & search box values
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.BB_MODAL_TYPEAHEAD,
                    params,
                    function (data) {

                        var container = $jQ("#bb-modal .results");

                        if (data.hasOwnProperty('success')) {

                            container.html(data.success.responseHTML).show();
                            MLS.bundleBuilder.Modal.paginate();

                        } else {
                            container.html(data.error.responseHTML);
                        }
                    }
                );

            });
        },

        paginate: function(){
            $jQ("#bb-modal .results .pages a").bind('click', function(){
                var params = $jQ(this).attr("href");

                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.BB_MODAL_TYPEAHEAD,
                    params,
                    function (data) {
                        var container = $jQ("#bb-modal .results");
                        if (data.hasOwnProperty('success')) {
                            container.html(data.success.responseHTML).show();
                            $jQ("#bb-modal .results .pages a").click(function(){
                                MLS.bundleBuilder.Modal.paginate();
                            });
                            console.log('page param:' + params);
                        } else {
                            container.html(data.error.responseHTML);
                        }
                    }
                );
            });
        }
    }
};