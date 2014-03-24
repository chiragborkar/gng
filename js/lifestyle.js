MLS.lifestyle = {
    /*
    search: function (e) {
        e.preventDefault();

        var $elem = $jQ(this),
            href = ($elem.is("a") ? $elem : $elem.find('a')).attr('href'),
            data = MLS.util.getParamsFromUrl(href);

        MLS.util.updateUrl(data);

        // make request
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.LIFESTYLE_LANDING_SEARCH,
            data,

            function(r) {
                if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                    return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true);
                }

                $jQ("#search-modules").html(r.success.responseHTML);

                MLS.miniCart.init();
                MLS.article.init();
                MLS.lifestyle.init(true);
                contentGrid.init();
                MLS.bazaarVoice.init($jQ("#search-modules"));
            }
        );

        // }

        return false;
    },
    */

    resizeCornerItems: function() {
        $jQ('.featured-item:visible').each(function() {
            var $thumbs = $jQ(this).find('.thumbs'),
                $slide = $jQ(this).find('.focus');
	    
            $thumbs.data('flexslider') && $thumbs.data('flexslider').setOpts({ itemWidth: 41 });
            $slide.data('flexslider') && $slide.data('flexslider').setOpts({ itemWidth: $jQ(this).parents(".story-fig").width() });
	    });
    },

    init : function (noglobal) {
        var contentItem = '.product-board-slide .content-item';
        MLS.ui.gridHover(contentItem, contentItem + ' .details', 40);

        noglobal || $jQ('#lifestyle-nav').find('.collapsible .dimension-header').on('click', function () {
            if ($jQ(this).parent().is("#dimension-features")) {
                $jQ(this).next().slideToggle('fast');
                $jQ(this).toggleClass('active');
            }
            else {
                $jQ(this).next().find(".viewport").slideToggle('fast', function () {
                    $jQ(".device-scroll").tinyscrollbar();
                    $jQ(".device-scroll").find(".scrollbar").toggleClass("visible");
                });
                $jQ(this).toggleClass('active');
            }
        });

        noglobal || MLS.ui.module.cornerFeature('.story-slider .story-fig', '.content-cta', '.featured-item', '.featured-item-hover');

        noglobal || MLS.compatibility.init({
            container: $jQ('#lifestyle-nav'),
            results: $jQ('#lifestyle-nav .compat-results')
            // , callback: MLS.lifestyle.search // comment if it should redirect
        });

        //trending
        $jQ('#trending-module').length > 0 && $jQ('#trending-module').flexslider({
            animation: 'slide',
            controlsContainer: '#trending-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            itemWidth: MLS.categoryLanding.itemWidth(),
            animationSpeed: 500,
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Trending Products");
            }
        });

        $jQ('#featured-story-module').length > 0 && $jQ('#featured-story-module').flexslider({
            animation: 'slide',
            controlsContainer: '#featured-story-module .slide-nav',
            selector: ".story-slider > li",
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.93,
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Stories");
            }
        });

        $jQ(".featured-item-hover .content-cta").click(MLS.lifestyle.resizeCornerItems);

        $jQ('.featured-item').each(function() {
            var $thumbs = $jQ(this).find('.thumbs'),
                $slide = $jQ(this).find('.focus');

            //$jQ(this).find(".add-cart-cta").uniform();

            $thumbs.flexslider({
                animation: "slide",
                controlNav: false,
                directionNav: false,
                animationLoop: false,
                slideshow: false,
                itemWidth: 41,
                itemMargin: 10,
                asNavFor: $slide
            });

            $slide.flexslider({
                animation: "slide",
                controlNav: false,
                directionNav: false,
                animationLoop: false,
                slideshow: false,
                sync: $thumbs,
                itemWidth: $jQ(this).parents(".story-fig").width()
            });
        });

        noglobal || $jQ(window).resize(function () {
            $jQ('#featured-story-module').length > 0 && $jQ('#featured-story-module').data('flexslider') && $jQ('#featured-story-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.93});
            MLS.lifestyle.resizeCornerItems();
        }).resize();

        //gallery
        $jQ('#gallery-module').length > 0 && $jQ('#gallery-module').flexslider({
            animation: 'slide',
            controlsContainer: '#gallery-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.93,
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Profiles");
            }
        });

        noglobal || $jQ(window).resize(function () {
            $jQ('#gallery-module').length > 0 && $jQ('#gallery-module').data('flexslider') && $jQ('#gallery-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.93});
        });

        //guides
        var $guidesModule = $jQ('#guides-module').length > 0 ? $jQ('#guides-module').flexslider({
            animation: 'slide',
            controlsContainer: '#guides-module .slide-nav',
            animationLoop: true,
            controlNav: true,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 280,
            maxItems: 5,
            minItems: 1,
            start: function (container) {
                noglobal || $jQ(window).resize();
                MLS.common.flexsliderTracking(container, "Guides");
            }
        }) : null;

        //user reviews
        $jQ('#user-reviews-module').length > 0 && $jQ('#user-reviews-module').flexslider({
            animation: 'slide',
            controlsContainer: '#user-reviews-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ('#user-reviews-module').outerWidth(true),
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Reviews");
            }
        });

        //lifestyle products
        $jQ('#shop-products-module').length > 0 && $jQ('#shop-products-module').flexslider({
            animation: 'slide',
            controlsContainer: '#shop-products-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.85,
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Products");
            }
        });

        noglobal || $jQ(window).resize(function () {
            $jQ('#shop-products-module').length > 0 && $jQ('#shop-products-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.85 });
            $jQ('#user-reviews-module').length > 0 && $jQ('#user-reviews-module').data('flexslider').setOpts({itemWidth: $jQ('#user-reviews-module').outerWidth(true) });
        });

        MLS.util.setMaxLines("#guides-module .guide-slide p.guide-copy", 5);

        //hotspots for step 7
        MLS.scene7.loadHotspots({
            element: "#gallery-module .gallery-slider.slides > li",
            figure: ".slide-fig"
        });
    }
};
