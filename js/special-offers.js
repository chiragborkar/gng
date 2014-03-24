MLS.specialOffers = {
    itemWidth: function () {
        return R.viewportW() < 768 ? Math.ceil($jQ(window).outerWidth() * 0.80) : $jQ(window).outerWidth();
    },

    init : function() {
        //guides

        $jQ('#offers-onsale').length > 0 && $jQ('#offers-onsale').flexslider({
            useCSS: false,
            animation: 'slide',
            controlsContainer: '#offers-onsale .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: MLS.specialOffers.itemWidth(),
            start: function(container) {
                MLS.common.flexsliderTracking(container, "On Sale Now");
            }
        });

        $jQ('#bundle-deals').length > 0 && $jQ('#bundle-deals').flexslider({
            useCSS: false,
            animation: 'slide',
            controlsContainer: '#bundle-deals .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: MLS.specialOffers.itemWidth(),
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Bundle Deals");
            }
        });

        //hotspots for step 7
        MLS.scene7.loadHotspots({
            element: "#bundle-deals .bundle-deals-slide",
            figure: ".quick-view-item .bundle"
        });

        $jQ('#special-offers').length > 0 && $jQ('#special-offers').flexslider({
            useCSS: false,
            animation: 'slide',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            controlsContainer: '#special-offers .slide-nav',
            itemWidth: 250,
            maxItems: 4,
            minItems: 1,
            start: function (container) {
                if (R.band(320, 640)) {
                    $jQ('#special-offers').data('flexslider').setOpts({itemWidth: 250});
                }
                $jQ(window).resize();
                MLS.common.flexsliderTracking(container, "Special Offers");
            }
        });

        $jQ(window).resize(function () {
            $jQ('#offers-onsale').length > 0 && $jQ('#offers-onsale').data('flexslider').setOpts({itemWidth: MLS.specialOffers.itemWidth() });
            $jQ('#bundle-deals').length > 0 && $jQ('#bundle-deals').data('flexslider').setOpts({itemWidth: MLS.specialOffers.itemWidth() });
        });
    }
}
