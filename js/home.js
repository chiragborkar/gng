MLS.home = {
	init: function () {
        //Modules
		MLS.ui.module.madlib.init();
        MLS.ui.module.trendingProducts();
        MLS.ui.module.trendingLifestyles();
        MLS.ui.module.newMadlib.init();
        MLS.contentFilter.init();

        // MLS.ui.module.featuredReviews(); // adding color classe should be pre-rendered by the backend
        contentGrid.init(true);
        MLS.ajax.colorPicker.init();

		//Flex Sliders
		MLS.home.sliders.init();

        // $jQ('.featured-item-add-to-cart .add-cart-cta').uniform();
        MLS.ui.module.cornerFeature('.featured-tile .content-fig', '.content-cta', '.featured-item', '.featured-item-hover', MLS.ui.resizeSliders);

        // this.heroSpaceCheck(); // affects performance, do not enable
	},

    /* unused code, no need to compile it
    heroSpaceCheck: function() {
        MLS.util.setMaxLength("#home-hero-slider li.alt .hero-info h1", 15);
        MLS.util.setMaxLength("#home-hero-slider li:not(.alt) .hero-info h3", 30);
        MLS.util.setMaxLength("#home-hero-slider li:not(.alt) .hero-copy", 120);
        MLS.util.setMaxLength("#home-hero-slider li:not(.alt) .hero-copy", 120);
    },
    */

	sliders: {
		init: function () {
            // check for wow
            var container = $jQ('#home-hero-slider'),
                videos = container.find("video");

            if (!isTouch && videos.length > 0)
            {
                var cuepoints = [],
                slides = container.find("li.slide[data-cuepoint]"),
                slide = videos.eq(0).parents("li.slide"),
                on = slide.children(".hero-title"),
                off = on.clone(true).insertBefore(on),
                current = -1,
                lastTime = -1;

                slides.each(function() {
                    if ($jQ(this).data("cuepoint") !== null)
                    {
                        cuepoints.push($jQ(this).data("cuepoint"));
                        $jQ(this).data('title', $jQ(this).children(".hero-title").html());
                    }
                });

                videos.eq(0).each(function() {
                    $jQ(this).mediaelementplayer({
                        mode: 'auto',
                        pluginPath: '/img/player/',
                        defaultVideoWidth: 1280,
                        defaultVideoHeight: 720,
                        enableAutosize: true,
                        videoWidth: 1280,
                        videoHeight: 720,
                        autoplay: true,
                        alwaysShowControls: false,
                        enableKeyboard: false,
                        loop: true,
                        success: MLS.util.responsiveVideo($jQ(this), container, function (mediaElement, domObject) {
                            mediaElement.addEventListener('click', function(e) {
                                mediaElement.play();
                            });

                            domObject.addEventListener('click', function(e) {
                                mediaElement.play();
                            });

                            // update the hero copy based on time update
                            mediaElement.addEventListener('timeupdate', function(e) {
                                var ms = Math.round(mediaElement.currentTime * 1000), 
                                    changed = false;

                                if (current < cuepoints.length - 1 && ms >= cuepoints[current+1])
                                {
                                    current++;
                                    changed = true;
                                } else if (ms < lastTime) {
                                    current = 0;
                                    changed = true;
                                }

                                if (changed)
                                {
                                    off.html(slides.eq(current).data("title")).hide().fadeIn();
                                    on.fadeOut(function() {
                                        var _tmp = on;
                                        on = off;
                                        off = _tmp;
                                    });

                                    lastTime = ms;
                                }
                            }, false);

                            if (mediaElement.pluginType == 'flash') 
                            {
                                mediaElement.addEventListener('canplay', function() {
                                    mediaElement.play();
                                }, false);
                            }
                        }),
                        error: function () {
                            MLS.modal.open("Unable to process you request. Please, try again", false, true, true);
                        }
                    });
                });
            } else {
                // fallback for non-autoplay browsers (tablet / mobile)
                if (isTouch && videos.length > 0)
                {
                    videos.each(function() {
                        $jQ(this).replaceWith($jQ("<img />").attr({
                            src: $jQ(this).attr("poster")
                        }).addClass('background-media'));
                    });
                }

                $jQ('#home-hero-slider').flexslider({
                    animation: 'fade',
                    controlNav: true,
                    animationLoop: true,
                    slideshow: true,
                    directionNav: false,
                    controlNav: true,
                    slideshowSpeed: 7000
                });
            }

            $jQ('.trending-categories .fslider').flexslider({
                animation: 'slide',
                controlsContainer: 'section.trending-categories .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                // itemWidth: 1024 / (($jQ(window).width() < 1280) ? ($jQ(window).width() < 1024) ? 3 : 4 : 5),
                itemWidth: 215,
                itemMargin: 0,
                start: function(container) {
                    MLS.common.flexsliderTracking($jQ(container).parents(".trending-categories"), "Product Categories");
                }
            });

            $jQ('.featuredReviewSlider').length > 0 && $jQ('.featuredReviewSlider').flexslider({
                animation: 'slide',
                controlsContainer: 'section.featured-reviews-module .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: $jQ('.featuredReviewSlider').outerWidth() * 0.80,
                start: function(container) {
                    MLS.common.flexsliderTracking($jQ(container).parent(), "Featured Reviews");
                }
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
                itemWidth: MLS.specialOffers.itemWidth(),
                start: function(container) {
                    MLS.common.flexsliderTracking(container, "Featured Reviews");
                }
            });

            $jQ('#new-arrivals-module').length > 0 && $jQ('#new-arrivals-module').flexslider({
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
                    MLS.common.flexsliderTracking(container, "New Arrivals");
                }
            });
            $jQ('#stories-guides-module').length > 0 && $jQ('#stories-guides-module').flexslider({
                useCSS: false,
                animation: 'slide',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                controlsContainer: '#special-offers .slide-nav',
                itemWidth: $jQ('#stories-guides-module').outerWidth() * 0.80,
                start: function(container) {
                    MLS.common.flexsliderTracking(container, "Latest Stories & Guides");
                }
            });

            $jQ(window).resize(function () {
                try
                {
                    $jQ('.featuredReviewSlider').length > 0 && $jQ('.featuredReviewSlider').data('flexslider') && $jQ('.featuredReviewSlider').data('flexslider').setOpts({itemWidth: $jQ('.featuredReviewSlider').outerWidth() * 0.80});
                    $jQ('#special-offers').length > 0 && $jQ('#special-offers').data('flexslider') && $jQ('#special-offers').data('flexslider').setOpts({itemWidth: MLS.specialOffers.itemWidth() });
                } catch(e) {
                    // nothing
                }
            });

            setTimeout(function () {
                $jQ(window).resize();
            }, 1000);
		}
	}
}
