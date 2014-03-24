var $jQ = jQuery.noConflict(), // Prevent any future library conflicts
MLS = {}, // Container for firing common and page-specic JavaScript
MLSUTIL = {}, //

//Device variables
isTouch = $jQ("html").hasClass("touch") ? true : false,
Mobile_Dev = (isTouch && $jQ(window).outerWidth() < 700) ? true : false,
Tablet_Dev = (isTouch && $jQ(window).outerWidth() >= 700) ? true : false,

R = this.Response;

if (typeof siteCatalyst != 'function')
{
    siteCatalyst = function() {};
}

// Re-initialize social buttons after Ajax loads.
$jQ(document).ajaxComplete(function () {
    try {
        // Facebook button
        FB.XFBML.parse();
        // Twitter button
        twttr.widgets.load();


        // reset lazyloader
        MLS.ui.lazyLoader();

    } catch (ex) {}
});




/* Response.js Hook */
Response.create({
    prop: 'width', // property to base tests on
    prefix: 'r src', // custom aliased prefixes
    breakpoints: [0, 320, 768, 1024, 1280], // custom breakpoints
    lazy: true // enable lazyloading
});

/*
 * Global Functions
 */

/* Debounce Function
 * Credit: underscore.js
 */
var debounce = (function () {
    var timeout;
    return function (func, wait, immediate) {
        var context = this, args = arguments,
        later = function () {
            timeout = null;
            if (!immediate) { func.apply(context, args); }
        },
        callNow;
        callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) { func.apply(context, args); }
    };
})();

/*
 * Cross Browser Placeholder
 */
$jQ(function () {
    $jQ.support.placeholder = false;
    var test = document.createElement('input');
    if ('placeholder' in test) {
        $jQ.support.placeholder = true;
    }
});

/*
function navHelpHandler(needHelp, opts) {
    // if (R.viewportW() < 1024 && R.viewportW() >= 768) {
        needHelp.on('click', function () {
            opts.fadeToggle('fast');
        });
    // } else {
        // needHelp.off('click');
        // opts.attr('style', '');
    // }
}
*/



/*
 * Enable and Fire Page Specific Functionality
 */

MLS = {
    config : {
        // container for commonly used configs throughout site
    },

    placeholder :
    {
        focus: function() {
            if ($jQ(this).attr('placeholder') != '' && $jQ(this).val() == $jQ(this).attr('placeholder')) {
                $jQ(this).val('').removeClass('hasPlaceholder');

                /*
                if ($jQ(this).attr("type") == "password" || $jQ(this).data('is-password')) {
                    $jQ(this).attr('type', 'password');
                }
                */
            }
        },

        blur: function() {
            if ($jQ(this).attr('placeholder') !== '' && ($jQ(this).val() == '' || $jQ(this).val() == $jQ(this).attr('placeholder'))) {
                var me = $jQ(this);

                // typeahead interferes with this, need a little time
                setTimeout(function() {
                    me.removeClass('hasPlaceholder').val(me.attr('placeholder')).addClass('hasPlaceholder');
                    me.next('label').removeClass('success');

                    /*
                    if (me.attr("type") == "password" || me.data('is-password')) {
                        me.attr('type', 'text');
                        me.data('is-password', true);
                    }
                    */
                }, 100);
            }
        },

        submit: function () {
            $jQ(this).find('.hasPlaceholder').val('');
        },

        init: function(d) {
            if (!$jQ.support.placeholder) {
                var $d = $jQ(d || document),
                    active = document.activeElement,
                    selector = "input[placeholder]";

                $d.find(selector).unbind('focus', this.focus).focus(this.focus).unbind('blur', this.blur).blur(this.blur);
                $d.find(selector).blur();
                $jQ(active).focus();
                $jQ('form').unbind('submit', this.submit).submit(this.submit);
            }
        }
    },

    common : {

        lazyLoader: function () {
            $jQ('img[data-original]').lazyload({
                effect: 'fadeIn',
                skip_invisible: false,
                threshold: -200,

                load: function () {
                    // Force all images inside current flexslider
                    var $this = $jQ(this),
                        isFlexSlider = $this.parents('.flex-viewport').length > 0;

                    if (isFlexSlider) {
                        var $slider = $this.parents('.slide-wrapper'),
                            $catSectionSlider = $this.parents('.category-section'),
                            $tabContent = $this.parents('.tabs-content'),
                            $tabSlider = $slider.parents('.lifestyle-tab-content');

                        if ($slider.length <= 0 && $tabContent.length <= 0 && $catSectionSlider.length > 0) {
                            $slider = $this.parents('.category-section');
                        }    // for lifestyle landing page

                        if($slider.length > 0 && $tabSlider.length > 0 ) $slider = $tabSlider.find('.slide-wrapper');   // for nav tab

                        var $viewport = $slider.find('.flex-viewport');

                        MLS.common.forceLazyLoad($viewport);

                        $slider.length > 0 && $slider.data('flexslider') && $slider
                            .data('flexslider')
                            .setOpts({
                                after: function () {
                                    MLS.common.forceLazyLoad($viewport); $jQ(window).scroll();
                                }
                            }
                        );
                    }
                }
            });
        },

        forceLazyLoad: function ($viewport) {
            $viewport
                .find('img[data-original]')
                .each(function () {
                    $jQ(this).attr('src', $jQ(this).attr('data-original'));
                    $jQ(this).removeAttr('data-original');
                });
        },

        flexsliderTracking: function(container, module)
        {
            $jQ(container).find(".flex-next").click(function() {
                try {
                    // typeof console !== 'undefined' && console.log && console.log("Right Module Pagination - " + module);
                    typeof sitecatParam == 'function' && sitecatParam('Right Module Pagination', module);
                } catch(ex) {}
            });

            $jQ(container).find(".flex-prev").click(function() {
                try {
                    // typeof console !== 'undefined' && console.log && console.log("Left Module Pagination - " + module);
                    typeof sitecatParam == 'function' && sitecatParam('Left Module Pagination', module);
                } catch(ex) {}
            });
        },

        init : function () {
            MLS.placeholder.init();

            // tracking function failing in some scenarios. When it does, it shouldn't stop functionality
            if (typeof sitecatParam === 'function') {
                var wrap = sitecatParam;
                sitecatParam = function () {
                    try {
                        wrap.apply(this, arguments);
                    } catch (e) {}
                };
            }

            // initialize things that are used on every page
            MLS.header.init();


            /*==============================
            =            DELETE  (Sape local dev env only)          =
            ==============================*/
            // $jQ('img').each(function () {
            //     var $this = $jQ(this),
            //         src = $this.attr('src');

            //     $this
            //         .attr('src', 'placeholder')
            //         .attr('data-original', src);

            // });


            /*-----  End of DELETE  ------*/

            MLS.common.lazyLoader();












            var win = $jQ(window);
            // iniitialize site nav tabs
            // MLS.ui.navTabs('#mls-nav');

            // // order is important, accordion interferes with other nav
            MLS.ui.navAccordion('#nav-mobile-tab1 .accordion-nav');
            MLS.ui.navTabs('#mls-nav-mobile', true);
            MLS.ui.tabs('#nav-tab1', true);

            MLS.article.init();
            MLS.cart.dd.init();
            MLS.ui.complexItem.init();

            /*
            win.on('resize', function () {
                debounce(function () {
                    // navHelpHandler(needHelp, opts);
                    console.log('Window width: %dpx', win.width()); // DEBUG FOR MEDIA QUERIES, WILL NOT BE IN FINAL JS
                });
            });
            */

            if ( $jQ("html").hasClass("lt-ie9") ){
                var chat = function () {
                    debounce(function () {
                        if(win.width() < 1024)
                        {
                            $jQ("#nav-help").addClass("small");
                        }
                        else 
                        {
                            $jQ("#nav-help").removeClass("small");
                        }
                    }, 300);
                };

                win.bind('resize', chat);
                chat();
            }

            if ($jQ("#generic-error").length > 0)
            {
                MLS.modal.open($jQ("#generic-error").html(), false, true, true);
            }

            if (!R.band(640))
            {
                $jQ(".data-quickview").unbind('click', MLS.miniCart.callbacks.addItem).bind('click', MLS.miniCart.callbacks.addItem);
            } else {
                $jQ(".data-quickview").unbind('click', contentGrid.quickViewHandler).on('click', contentGrid.quickViewHandler);    
            }
            
            var guidedNav = $jQ('#secondary-column'),
                mainColumn = $jQ('#main-column'),
                footer = $jQ('#footer'),
                gh = $jQ('#mls-nav'),
                sc = $jQ('body'),
                animating = false,
                ch = $jQ(".content-landing-header");

            if (guidedNav.length == 0)
            {
                guidedNav = $jQ("#checkout-sidebar > .cart-sidebar-wrap");
                mainColumn = $jQ("#checkout");
                !isTouch && guidedNav.css({ width: guidedNav.parent().width() }) && $jQ(window).resize(function() {
                    guidedNav.css({ width: guidedNav.parent().width() });
                });
            }

            // guided nav animation for touch devices (due to issue with position: fixed)
            isTouch && guidedNav.length > 0 && $jQ(window).scroll(function() {
                if (animating)
                {
                    setTimeout(function() {
                        $jQ(window).scroll();
                    }, 500);
                    return false;
                }

                if (mainColumn.attr("id") !== "main-column" && mainColumn.attr("id") !== "checkout")
                {
                    mainColumn = $jQ('#main-column');
                }

                if (guidedNav.css({ position: 'absolute' }).height() >= mainColumn.height())
                {
                    guidedNav.css({ position: 'relative', top: 0 });
                    return false;
                }

                var st = $jQ(window).scrollTop(),
                    wh = $jQ(window).height(),
                    po = guidedNav.parent().offset().top,
                    fo = 0,
                    b = 0;

                try
                {
                    fo = footer.is(":visible") ? footer.offset().top : sc.height();
                } catch(ex) {
                    fo = sc.height();
                }

                if (st > fo - guidedNav.height())
                {
                    st = fo - guidedNav.height();
                }

                if (st < po)
                {
                    st = po + ch.outerHeight(true);
                }

                animating = true;
                guidedNav.animate({
                    top: st - po
                }, {
                    complete: function() {
                        animating = false;
                    }
                });
            });

            // guided nav animation for non touch (desktop)
            !isTouch && guidedNav.length > 0 && $jQ(window).scroll(function() {
                if (mainColumn.attr("id") !== "main-column" && mainColumn.attr("id") !== "checkout")
                {
                    mainColumn = $jQ('#main-column');
                }

                if (guidedNav.addClass('locked').height() >= mainColumn.height())
                {
                    guidedNav.removeClass('locked').css({ bottom: 'auto' });
                    return false;
                }

                var st = $jQ(window).scrollTop(),
                    wh = $jQ(window).height(),
                    fo = 0,
                    b = 0;

                if (st + wh > guidedNav.height() + mainColumn.offset().top)
                {
                    try
                    {
                        fo = footer.is(":visible") ? footer.offset().top : sc.height();
                    } catch(ex) {
                        fo = sc.height();
                    }

                    b = fo - st - wh;
                    b = b > 0 ? 0 : -b;

                    if (wh > guidedNav.height())
                    {
                        if (st + gh.height() > mainColumn.offset().top)
                        {
                            if (st + gh.height() + guidedNav.height() < fo)
                            {
                                guidedNav.addClass('locked').css({
                                    top: gh.height(),
                                    bottom: 'auto'
                                });
                            } else {
                                guidedNav.addClass('locked').css({
                                    bottom: b,
                                    top: 'auto'
                                });
                            }
                        }
                        else
                        {
                            guidedNav.removeClass('locked').css({ bottom: 'auto' });
                        }
                    } else {
                        guidedNav.addClass('locked').css({
                            bottom: b,
                            top: 'auto'
                        });
                    }
                }
                else
                {
                    guidedNav.removeClass('locked').css({ bottom: 'auto' });
                }
            });

            if($jQ('#too-many-modal').length == 1)
            {
                MLS.ui.tooManyModal && MLS.ui.tooManyModal('#too-many-modal');
            }

            $jQ('.header-message .content-header-message').truncate(175);
        },
        finalize: function () {
            // non priority calls go here, runs after all init functions
        }
    },
    'home-page' : {
        init : function () {
            MLS.home.init();
            MLS.miniCart.init();
            // MLS.bazaarVoice.init();
        }
    },
    'brand-landing-page' : {
        init : function () {
            $jQ('select#sort-options').uniform();
            contentGrid.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.BRAND_LANDING,
                container: $jQ('#main-column .content-grid'),
                callback: function () {
                    contentGrid.reInit();
                    $jQ('select#sort-options').uniform();
                }
            });

            MLS.homeCompatibility.init({
                //endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                container: $jQ('#phntbltwrapper'),
                results: $jQ('#phntbltwrapper'),
                callback: function(e){
                    e.preventDefault();
                    contentGrid.reInit();
                    console.log("scripts.js - homeCompatibility.init callback");        
                }
            });


            MLS.miniCart.init();
            productListingHover();
            // headerMoreLess();
            // $jQ('.header-message .content-header-message').truncate(180);
        }
    },
    'cart-page': {
    	init : function () {
            MLS.cart.init();
            MLS.miniCart.init(null, MLS.cart.options);
        }
    },
    'checkout-signin': {
        init: function() {
            MLS.miniCart.init();
            MLS.signin.init();
        }
    },
    'checkout-page': {
        init : function () {
            MLS.checkout.init();
            MLS.miniCart.init(null, MLS.checkout.options);
        }
    },
    'checkout-success-page': {
        init : function () {
            MLS.ui.socialShare.init();
            MLS.checkout.vzwValidationRules();
            // MLS.productDetail.init();
            MLS.miniCart.init();
            MLS.ui.module.trendingLifestyles();
            MLS.ui.module.cornerFeature('.featured-tile .content-fig', '.content-cta', '.featured-item', '.featured-item-hover', MLS.ui.resizeSliders);

            // Below code is commented and added a line as a part of QC# 9567 fix.
            /*$jQ("#mixed-checkout .tooltip-close").click(function(e) {
                e.preventDefault();
                $jQ(this).parent().fadeOut();
                return false;
            });*/
            $jQ("#mixed-checkout .dropdown-tooltip").fadeOut(1500);

            $jQ('#pdp-others-bought-module').length > 0 && $jQ('#pdp-others-bought-module').flexslider({
                animation: 'slide',
                controlsContainer: '#pdp-others-bought-module .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: $jQ(window).outerWidth() * 0.85,
                start: function(container) {
                    MLS.common.flexsliderTracking(container, "Others Also Bought");
                }
            });

            //$jQ(".button").uniform();
            $jQ("#newsletterForm").validate({
                ignore: '.ignore, :hidden',
                success: function(label){
                    label.addClass('success').text('');
                },
                highlight: function(element, errorClass, validClass) {
                    if ( element.type === "radio" ) {
                        this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                    } else {
                        $jQ(element).addClass(errorClass).removeClass(validClass);
                    }
                    $jQ(element).siblings(".error.success").removeClass('success');
                },
                focusCleanup: true,
                rules: {
                    newsletterSignup: {
                        required: true,
                        noPlaceholder: true,
                        maxlength: 80,
                        email: true
                    }
                },
                messages: {
                     newsletterSignup: {
                        required: "Please enter your email address",
                        noPlaceholder: "Please enter your email address",
                        maxlength: "Please enter a valid email address",
                        email: "Please enter a valid email address"
                    }
                }
            });
            $jQ(".print-receipt").click(function(e) {
                e.preventDefault();
                window.print();
                return false;
            })

            $jQ('#stories-guides-module').length > 0 && $jQ('#stories-guides-module').flexslider({
                useCSS: false,
                animation: 'slide',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                controlsContainer: '#special-offers .slide-nav',
                itemWidth: MLS.specialOffers.itemWidth(),
                start: function(container) {
                    MLS.common.flexsliderTracking(container, "Stories & Guides");
                }
            });
        }
    },
    'content-landing-page' : {
        init : function () {
            //searchResults.styleDropDown();
            contentGrid.init();
            contentLanding.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.CONTENT_LANDING,
                callback: function () {
                    MLS.article.init();
                    MLS.ui.socialShare.init();
                    contentLanding.reInit();
                },
                container: '.wrapper.tab-content-wrapper:visible .main-column'
            });

            MLS.miniCart.init();
            MLS.ui.socialShare.init();

            //tabs
            $jQ('.category-tabs li a').on('click', function (e) {
                var tab = $jQ(this).attr('href'),
                    type = $jQ('.tab-content-wrapper[data-tab]').filter(function() {
                        return $jQ(this).data("tab") == tab;
                    }).attr('data-type'),

                    results = $jQ('.tab-content-wrapper[data-tab]').filter(function() {
                        return $jQ(this).data("tab") == tab;
                    }).attr('data-result-count');

                // e.preventDefault();

                $jQ('.category-tabs li a').parent().removeClass('active');
                $jQ(this).parent().addClass('active');
                $jQ('.tab-content-wrapper').removeClass('active');
                $jQ('.tab-content-wrapper[data-tab]').filter(function() {
                    return $jQ(this).data("tab") == tab;
                }).addClass('active');

                // There are headers per tab, so no need to do it this way
                // $jQ('.content-landing-header .results-count').text(results);
                // $jQ('.content-landing-header .type').text(type);
            });

            if (document.location.hash != "")
            {
                var h = document.location.hash.substr(1);
                $jQ('.category-tabs li a').filter(function() { return $jQ(this).attr("href").indexOf(h) > -1; }).click();
            }

            productListingHover();

            // headerMoreLess();
            // $jQ('.header-message .content-header-message').truncate(180);
        }
    },

    'bundle-builder-page': {
        init: function() {
            MLS.bundleBuilder.init();
            contentGrid.init();
            MLS.ui.socialShare.init();
            MLS.miniCart.init();

            // I don't want the other page initializer to trigger
            MLS['category-landing-page'].init = null;
        }
    },

    'category-landing-page' : {
        init : function () {
            MLS.categoryLanding.init();
            contentGrid.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.CATEGORY_PAGE,
                container: $jQ('#main-column'),
                forceRedirect: true,
                callback: function () {
                     contentGrid.reInit();
                     MLS.categoryLanding.init();
                     MLS.article.init();
                }
            });
            // headerMoreLess();
            // $jQ('.header-message .content-header-message').truncate(180);

            /*
            MLS.compatibility.init({
                container: $jQ('#secondary-column'),
                results: $jQ('#secondary-column .compat-results')
            });
            */
            MLS.homeCompatibility.init({
                //endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                container: $jQ('#phntbltwrapper'),
                results: $jQ('#phntbltwrapper'),
                callback: function(e){
                    e.preventDefault();
                    contentGrid.reInit();
                    console.log("scripts.js - homeCompatibility.init callback");        
                }
            });
            
            MLS.miniCart.init();
            productListingHover();
        }
    },
    'lifestyle-landing-page' : {
        init : function() {
            MLS.lifestyle.init();
            contentGrid.init();
            MLS.miniCart.init();
            MLS.bazaarVoice.init();
            // $jQ(".mls-nav").removeClass("fixed-nav");
            $jQ('#phntblselectors select').select2();
            var featuredCopyMargin = function() {
                if (R.band(0, 767)) {
                    $jQ(".featured-lifestyle").css({
                        'margin-bottom': $jQ(".featured-lifestyle .featured-copy").height()
                    });
                } else {
                    $jQ(".featured-lifestyle").removeAttr('style');
                }
            };

            $jQ(window).resize(featuredCopyMargin);
            featuredCopyMargin();

            MLS.homeCompatibility.init({
                //endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                container: $jQ('#phntbltwrapper'),
                results: $jQ('#phntbltwrapper'),
                callback: function(e){
                    e.preventDefault();
                    contentGrid.reInit();
                    console.log("scripts.js - homeCompatibility.init callback");        
                }
            });
        }

    },
    'product-listing-page' : {

        init : function () {
            contentGrid.init();
            MLS.miniCart.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.PRODUCT_LISTING,
                container: $jQ('#main-column .content-grid'),
                callback: function () {
                    contentGrid.reInit();
                }
            });

            // simple offer toggle..
            // may break out into a general module that handles interactions (if other js is necessary) in offers
            var hdrOffer = $jQ('#spec-offer-header'),
            hdrOfferHeight = hdrOffer.outerHeight();
            hdrOffer.find('.offer-actions .toggle').on('click', function(e) {
                e.preventDefault();
                hdrOffer.toggleClass('open');
                /*
                hdrOffer.toggleClass('open', 1600).promise().done(function() {
                    var height = hdrOffer.hasClass('open') ? hdrOffer.prop('scrollHeight') : hdrOfferHeight;
                    hdrOffer.animate({ height: height }, 'slow');
                });
                */
            });
            // end offer toggle
            productListingHover();

            //$jQ(".populate").select2({
            //    allowClear: true
            //});
            MLS.homeCompatibility.init({
                //endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                container: $jQ('#phntbltwrapper'),
                results: $jQ('#phntbltwrapper'),
                callback: function(e){
                    e.preventDefault();
                    contentGrid.reInit();
                    console.log("scripts.js - homeCompatibility.init callback");        
                }
            });
            // headerMoreLess();
            // $jQ('.header-message .content-header-message').truncate(180);
        }
    },
    'product-detail' : { // add -page
        init : function () {
            // contentGrid.init(); // adobe handles this and there's no quickview or add to cart (requested by Chintan 07-31 17:50)
            MLS.ui.socialShare.init();
            MLS.productDetail.init();
            MLS.miniCart.init();
        }
    },

    'search-results-page' : {
        init : function() {
            $jQ("#sort-options").uniform();
            contentGrid.init();
            MLS.ajax.colorPicker.init();
            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.PRODUCT_LISTING,
                container: $jQ('#main-column .content-grid'),
                callback: function () {
                    contentGrid.reInit();
                }
            });
            MLS.ajax.cart.init();
        }
    },

    'special-offers-landing-page' : {
        init : function() {
            contentGrid.init();
            MLS.miniCart.init();
            MLS.specialOffers.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.SPECIAL_OFFERS,
                container: $jQ('#main-column'),
                forceRedirect: true,
                callback: function () {
                    contentGrid.reInit();
                    MLS.specialOffers.init();
                }
            });
            productListingHover();

            MLS.homeCompatibility.init({
                //endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                container: $jQ('#phntbltwrapper'),
                results: $jQ('#phntbltwrapper'),
                callback: function(e){
                    e.preventDefault();
                    contentGrid.reInit();
                    console.log("scripts.js - homeCompatibility.init callback");        
                }
            });
        }
    },
    'fourofour-page' : {
        init : function() {
            MLS.page404.init();
            contentGrid.init();
            MLS.miniCart.init();
        }
    }

};



/*
 * Markup-based DOM-Ready Execution
 * Credit: Paul Irish - http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */

MLSUTIL = {
    fire : function (func, funcname, args) {
        var namespace = MLS;  // indicate your obj literal namespace here
        funcname = (funcname === undefined) ? 'init' : funcname;
        if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
            namespace[func][funcname](args);
        }
    },
    loadEvents : function () {
        var bodyId = document.body.id;
        MLSUTIL.fire('common');
        $jQ.each(document.body.className.split(/\s+/), function (i, classnm) {
            MLSUTIL.fire(classnm);
            MLSUTIL.fire(classnm, bodyId);
        });
        MLSUTIL.fire('common', 'finalize');
    }
};

// Initialize
$jQ(document).ready(MLSUTIL.loadEvents);

//$jQ("#lightbox-email-send").uniform(); // make selects pretty

function headerMoreLess(){
    /*
    var featuresContainer = $jQ('.header-message'),
    showMoreCTA = featuresContainer.find('.more-less-link');

    showMoreCTA.click(function(e){
        e.preventDefault();
        var message = $jQ('.content-header-message');
        var link = $jQ('.more-less-link');
        if(link.hasClass('more'))
        {
            message.addClass('max')
            link.removeClass('more').addClass('less').html('...less &and;');
        }
        else if (link.hasClass('less'))
        {
            message.removeClass('max');
            link.removeClass('less').addClass('more').html('...more &or;');
        }
    });
    */
    $jQ('.header-message .content-header-message').truncate(180);
}

function productListingHover(){
    //Product Listing Images Hover
    //Audio
    $jQ('.icon-audio-video a').mouseover( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/audio_video_hover.png' );
    })
    $jQ('.icon-audio-video a').mouseout( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/audio_video.png' );
    })

    $jQ('.icon-fashion-style a').mouseover( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/fashion_style_hover.png' );
    })
    $jQ('.icon-fashion-style a').mouseout( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/fashion_style.png' );
    })

    $jQ('.icon-fitness-health a').mouseover( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/fitness_health_hover.png' );
    })
    $jQ('.icon-fitness-health a').mouseout( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/fitness_health.png' );
    })

    $jQ('.icon-fun a').mouseover( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/fun_hover.png' );
    })
    $jQ('.icon-fun a').mouseout( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/fun.png' );
    })

    $jQ('.icon-home a').mouseover( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/home_hover.png' );
    })
    $jQ('.icon-home a').mouseout( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/home.png' );
    })

    $jQ('.icon-travel a').mouseover( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/travel_hover.png' );
    })
    $jQ('.icon-travel a').mouseout( function () {
        $jQ(this).find('img').attr('src', '../img/content-filter/facet-icons/travel.png' );
    })
}