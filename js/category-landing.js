MLS.categoryLanding = {

    resizeSliders: function() {
        $jQ('.featured-item .thumbs').each(function() {
            $jQ(this).data('flexslider') && $jQ(this).data('flexslider').setOpts({itemWidth: 41 });
        });

        $jQ('.featured-item .focus').each(function() {
            $jQ(this).data('flexslider') && $jQ(this).data('flexslider').setOpts({itemWidth: $jQ('.featured-item').width() });
        });
    },

    itemWidth: function () {
        return R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.80 : $jQ(window).outerWidth();
    },

    init : function () {
        MLS.ui.module.cornerFeature('.content-item .content-fig', '.content-cta', '.featured-item', '.featured-item-hover', this.resizeSliders);
        
        $jQ('.featured-item').each(function() {
            var $thumbs = $jQ(this).find('.thumbs'),
                $slide = $jQ(this).find('.focus');

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
                sync: $thumbs
            });
        });
        
        //new arrivals
        $jQ('#new-arrivals-module').length > 0 && $jQ('#new-arrivals-module').flexslider({
            animation: 'slide',
            controlsContainer: '#new-arrivals-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: MLS.categoryLanding.itemWidth(),
            start: function(container) {
                MLS.common.flexsliderTracking(container, "New Arrivals");
            }
        });

        //new arrivals
        $jQ('#latest-stories-module').length > 0 && $jQ('#latest-stories-module').flexslider({
            animation: 'slide',
            controlsContainer: '#latest-stories-module .slide-nav',
            selector: '.latest-stories-slides > li',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: MLS.categoryLanding.itemWidth(),
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Latest Stories");
            }
        });

        //guides
        $jQ('#guides-module').length > 0 && $jQ('#guides-module').flexslider({
            animation: 'slide',
            controlsContainer: '#guides-module .slide-nav',
            animationLoop: true,
            controlNav: true,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 256,
            maxItems: 4,
            minItems: 1,
            start: function(container) {
                $jQ(window).resize();
                MLS.common.flexsliderTracking(container, "Latest Guides");
            }
        });

        //stories and guides
        $jQ('#stories-guides-module').length > 0 && $jQ('#stories-guides-module').flexslider({
            animation: 'slide',
            animationLoop: true,
            controlNav: false,
            directionNav: false,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: MLS.categoryLanding.itemWidth()
        });

        //best sellers
        $jQ('#best-sellers-module').length > 0 && $jQ('#best-sellers-module').flexslider({
            animation: 'slide',
            controlsContainer: '#best-sellers-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: MLS.categoryLanding.itemWidth(),
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Best Sellers");
            }
        });

        MLS.util.setMaxLengthForGuides("#latest-stories-module .content-detail", ".content-fig", ".content-copy", 0);
        MLS.util.setMaxLength("#guides-module .guide-copy", 45);
        
        $jQ(window).resize(function () {
            $jQ('#new-arrivals-module').length > 0 && $jQ('#new-arrivals-module').data('flexslider').setOpts({itemWidth: MLS.categoryLanding.itemWidth() });
            $jQ('#latest-stories-module').length > 0 && $jQ('#latest-stories-module').data('flexslider').setOpts({itemWidth: MLS.categoryLanding.itemWidth() });
            $jQ('#stories-guides-module').length > 0 && $jQ('#stories-guides-module').data('flexslider').setOpts({itemWidth: MLS.categoryLanding.itemWidth() });
            $jQ('#best-sellers-module').length > 0 && $jQ('#best-sellers-module').data('flexslider').setOpts({itemWidth: MLS.categoryLanding.itemWidth() });
        });
    }
}
