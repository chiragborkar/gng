MLS.page404 = {
    init : function() {
        //$jQ(".add-cart-cta").uniform();

        /* browser cache causes an issue on minicart, so we cannot use history.back
        var backElem = $jQ('#back');
        backElem.click(function(e){
            history.back();
            e.preventDefault();   
        });
        */ 

	    /*$jQ('#best-sellers-module').flexslider({
	        animation: 'slide',
	        controlsContainer: '#best-sellers-module .slide-nav',
	        animationLoop: true,
	        controlNav: false,
	        directionNav: true,
	        minItems: 1,
    		maxItems: 4,
	        slideshow: false,
	        animationSpeed: 500,
	        itemMargin: 0,
			itemWidth: 200
        });

        $jQ(window).resize(function () {
            $jQ('#best-sellers-module').data('flexslider').setOpts({itemWidth: 200});
        });*/

        // similar products slider install......
        $jQ('#best-sellers-module').flexslider({
            animation: 'slide',
            controlsContainer: '#best-sellers-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 215,
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Best Sellers");
            }
        });
	}
};

