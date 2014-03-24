MLS.productDetail = (function() {

var pub = {
    init : function() {

        // this.loadHero.init();
        MLS.scene7.loadGallery({
            galleryID: $jQ('#heroImageSetID').val() || $jQ('#imageID').val(),
            $largeContainer: $jQ('#focus'),
            $thumbsContainer: $jQ('#thumbs'),
            center: true, // vertically center the images in the middle of the container
            callback: function () {
                $jQ('#thumbs .carousel-zoom').show();
            }
        });
        this.megaMenuOverlay();
        this.pdpModalTech();
        this.pdpDetailTabs();
        this.showMoreDevices();
        this.pdpFeaturesShowMore();
        this.compatibleDropDowns();
        this.compatibleTypeAhead();
        this.mapProductDetailTabs();
        this.pdpFeaturesGraphicTab();
        this.selectCompatibleProducts();
        //this.relatedStoriesSlider();
        //MLS.ui.module.trendingLifestyles();
        //MLS.ui.module.cornerFeature('.featured-tile .content-fig', '.content-cta', '.featured-item', '.featured-item-hover', MLS.ui.resizeSliders);
        $jQ('#pdp-size-select').uniform();

       var prepSmall = new MLS.productDetail.pdpMobileContent();

        $jQ('.pdp-banner-shipping').each(function(){
            MLS.ui.dropdownDisplay(this);
        });

        $jQ('.pdp-cart-shipping-item').each(function(){
            MLS.ui.dropdownDisplay(this);
        });

        $jQ('.learn-more').each(function(){
            MLS.productDetail.learnMoreDropdownDisplay(this);
        });

 
        MLS.ui.moreLessBlock();
        MLS.productDetail.moreLessBlockTruncate();
        MLS.productDetail.pdpColorOptions();
        MLS.productDetail.addCartValidation();
        MLS.productDetail.pdpSeeMoreColors();
        MLS.productDetail.tabSelected();


        // Similar prodcuts

        $jQ('#similar-products').find('.title').on('click', pub.mobileToggleSimilarProducts);

        // Highlight module
        if ($jQ(window).width() > 639) {
            $jQ('.highlight-module').find('.tabs').children().on('click', pub.highlightChangeTab);
        }


        // $jQ('#zoom-thumbs').length > 0 && $jQ('#zoom-thumbs').flexslider({
        //     animation: "slide",
        //     controlNav: false,
        //     animationLoop: false,
        //     slideshow: false,
        //     itemWidth: 45,
        //     itemMargin: 10,
        //     asNavFor: '#zoom-focus'
        // });

        // $jQ('#zoom-focus').length > 0 && $jQ('#zoom-focus').flexslider({
        //     animation: "slide",
        //     controlNav: false,
        //     animationLoop: false,
        //     slideshow: false,
        //     sync: "#zoom-thumbs"
        // });

        $jQ('#similar-products #pdp-similar-products-module').length > 0 && $jQ('#similar-products #pdp-similar-products-module').flexslider({
            animation: 'slide',
            controlsContainer: '#similar-products #pdp-similar-products-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 215,
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Similar Products");
            }
        });

        $jQ('#mobile-similar > span').click(function(){
            $jQ('#mobile-similar #pdp-similar-products-module').length > 0 && $jQ('#mobile-similar #pdp-similar-products-module').flexslider({
                animation: 'slide',
                controlsContainer: '#mobile-similar #pdp-similar-products-module .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: false,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 215
            });
        });

        $jQ('#mobile-highlights > span').click(function(){
            $jQ('#mobile-highlights .highlight-module-wrap').length > 0 && $jQ('#mobile-highlights .highlight-module-wrap').flexslider({
                animation: 'slide',
                controlsContainer: '#mobile-highlights .highlight-module-wrap .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: false,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 261
            });

            $jQ('#mobile-highlights .summary-wrap').length > 0 && $jQ('#mobile-highlights .summary-wrap').flexslider({
                animation: 'slide',
                controlsContainer: '#mobile-highlights .summary-wrap .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: false,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 270
            });
        });

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

        $jQ('.bundles.show-for-mobile > span').click(function() {
            var bundles = $jQ(this).siblings('.pdp-bundles-content').find('.more-less-block');

            bundles.length > 0 && bundles.flexslider({
                animation: 'slide',
                selector: ".bundle-items > li",
                animationLoop: true,
                controlNav: false,
                directionNav: false,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: $jQ(window).outerWidth() * 0.85
            });
        });

        $jQ('#mls-nav').addClass('fixed-nav');

        var f = function() {
            if ($jQ(window).scrollTop() > $jQ('#product-details').offset().top - 60) {
                $jQ('#btf-anchor').addClass('show-anchor');
                // $jQ('#mls-nav').addClass('fixed-nav');
            }
            else {
                $jQ('#btf-anchor').removeClass('show-anchor');
                // $jQ('#mls-nav').removeClass('fixed-nav');
            }
        };

        if ($jQ(window).width() > 719 && !isTouch) {
            $jQ(window).unbind('scroll', f).scroll(f);
        }

        $jQ(window).resize(function () {
            MLS.ui.moreLessBlock();

            if ($jQ(window).width() > 719 && !isTouch) {
                $jQ(window).unbind('scroll', f).scroll(f);
            }
        });

        MLS.productDetail.pdpColorSelect();


        // View 360
        if ( typeof($jQ('#pdp-hero').find('#imageSetID').val()) !== 'undefined' && $jQ('#pdp-hero').find('#imageSetID').val() !== '' ) {
            pub.view360.prepare();
            $jQ('.view-360').on('click', pub.view360.init);
        } else {
            $jQ('.view-360-box').hide();
        }

        // Zoom In Product
        $jQ('.carousel-zoom').on('click', pub.zoomProduct.init);

        // Close Overlay
        $jQ('#zoom-close').on('click', function () {
            pub.overlay.finalize(true)
        });

        // close with esc key
        $jQ(document).keyup(function(e) {
          if (e.keyCode == 27) { $jQ('#zoom-close').click(); }   // esc
        });

        $jQ('#view-scale').click(function(){
            $jQ('#toggle-scale').text('Hide Scale').parent().toggleClass('hide-action');
            $jQ('#zoom-thumbs').toggle();
        });

        $jQ('#toggle-scale').on('click', function(){
            // toggle scale content
            $jQ('#zoom-block').find("#zoom-scale-content").toggle();
            $jQ('#zoom-thumbs').toggle();
            $jQ('#zoom-focus').toggleClass('hide-slides');
            //toggle link class and text
            if ($jQ(this).parent().hasClass('hide-action')) {
                $jQ(this).text('View to Scale').parent().removeClass('hide-action');
            } else {
                 $jQ(this).text('Hide Scale').parent().addClass('hide-action');
            }


        });

        $jQ('#pdp-add-to-cart-submit').click(function(){
            $jQ("#pdp-add-to-cart-submit").validate();
            var formValid = $jQ("#pdp-add-to-cart").valid();
            if (formValid == true){
                $jQ('.size-select-box').find('.selector').removeClass('error');
                return false;
            } else {
                $jQ('.size-select-box').find('.selector').addClass('error');
                return false;
            }
        });

        $jQ('#pdp-size-select').change(function(){ // remove select error on choice
            $jQ('.size-select-box').find('.selector').removeClass('error');
            $jQ('.size-select-box').find('label.error').hide();
        });

        $jQ('.pdp-bundle-block .item').click(function(e){ // bundle modal
            e.preventDefault;
            MLS.ui.lightbox(this);
        });

        $jQ('#add-cart-server-error').find('.lightbox-close').click(function(){ // close click
            $jQ('#add-cart-server-error').fadeOut(300); // fade out
        });

        $jQ('.pdp-accordion').find('.acc-control').click(function(){
            MLS.ui.simpleAcc(this);
            setTimeout(function(){
                MLS.ui.moreLessBlock();
            }, 350);
        });

        // RELATED STORIES MODULE SEQUENCE

        /*$jQ('#pdp-related-stories-module').find('li.small-story').each(function(i, el){
             if ( i%2 > 0) {
                var previous = $jQ(this).prev('li.small-story')
                $jQ(this).addClass('adjusted').appendTo(previous);
            }
        });

        $jQ('#pdp-related-stories-module dd a').click(function(){
            var whichClick = $jQ(this).attr('id');
            var whichClickArray = whichClick.split('-');
            whichClick = whichClickArray[2];

            var navs = $jQ(this).parents('section').find('.slide-nav');
            $jQ(navs).hide();
            $jQ(navs).each(function(){
                var whichNav = $jQ(this).attr('id');
                var whichNavArray = whichNav.split('-');
                whichNav = whichNavArray[1];
                if (whichClick == whichNav) {
                    $jQ(this).show();
                    return false;
                }
            });
        });*/
        var container = $jQ('.key-features').eq(0);
        $jQ("video").each(function() {
            $jQ(this).mediaelementplayer({
                pluginPath: '/img/player/',
                defaultVideoWidth: 1280,
                defaultVideoHeight: 720,
                enableAutosize: true,
                videoWidth: 1280,
                videoHeight: 720,
                alwaysShowControls: true,
                success: MLS.util.responsiveVideo($jQ(this), container, function (mediaElement, domObject) {
                    // mediaElement.play();
                }),
                error: function () {
                    MLS.modal.open("Unable to process you request. Please, try again", false, true, true);
                }
            });
        });
    },

    finalize: function () {

    },

    reInit: function () {
        this.finalize();
        this.init();
    },

    tabSelected: function () {
        if ( window.location.hash !== '' ) {
            var hashName = window.location.hash.replace('#',''),
                isAccordion = !$jQ('.detail-tabs').is(':visible'),
                $activeTab, tabPosition;

            if (hashName == 'review') {
                hashName = "reviews";
            }

            if ( isAccordion ) {
                $activeTab = $jQ('.detail-tabs-accordion li[data-tabname]').filter(function() {
                    return $jQ(this).data('tabname') == hashName;
                });

                if ($activeTab.length > 0)
                {
                    $activeTab = $activeTab.find('span').first();
                    tabPosition = $activeTab.offset().top + 100;
                }
            } else {
                $activeTab = $jQ('.detail-tabs li[data-tabname]').filter(function() {
                    return $jQ(this).data('tabname') == hashName;
                });

                if ($activeTab.length > 0)
                {
                    tabPosition = $activeTab.offset().top - 100;
                }
            }

            $activeTab.length > 0
                && $activeTab.click()
                && $jQ('body').delay(2000).animate( { scrollTop: tabPosition }, 100 );
        }
    },
	
	loadRelatedStories: function(){
		var end = jQuery(" .trending-lifestyles-module").offset().top; 
		var viewEnd = jQuery(window).scrollTop() + jQuery(window).height(); 
		var distance = end - viewEnd; 
		//console.log(distance);
		if (!MLS.pdpSectionLoaded && distance < 300 ){
			// ajax call get data from server and append to the section
			if (!$jQ('html').hasClass('touch')){
				MLS.pdpSectionLoaded = true;
				$jQ(window).unbind("scroll", MLS.productDetail.loadRelatedStories);
				MLS.ajax.showLoadingOverlay();
				$jQ.ajax({
					type: 'GET',
					url: MLS.ajax.endpoints.RELATED_STORIES_GUIDES,
					//data: data,
					cache : false,
					success : function(data) {
						if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
							return MLS.modal.open(data.error ? data.error.responseHTML : null, false, true, true);
						}
						// insert the response
						jQuery(" .trending-lifestyles-module").length > 0 && jQuery(" .trending-lifestyles-module").append(data.success.responseHTML);
						MLS.ui.module.trendingLifestyles();
						MLS.ui.module.cornerFeature('.featured-tile .content-fig', '.content-cta', '.featured-item', '.featured-item-hover', MLS.ui.resizeSliders);
						MLS.ajax.hideLoadingOverlay();
					},
					error : function (xhr) {
						MLS.ajax.hideLoadingOverlay();
						if (xhr.statusText != "abort") 
						{
							if (MLS.ajax.errorModal && MLS.ajax.errorModal.is(":visible"))
							{
								// only show the latest error message.
								MLS.modal.close(MLS.ajax.errorModal);
							}

							MLS.ajax.errorModal = MLS.modal.open('Server is not responding,<br />please refresh and try again.', false, true, true);
						}
					},
					dataType: 'json'
				});
			}
		}
	},

    /*===============================================
    =            Load hero slider images            =
    ===============================================*/

    // loadHero: {
    //     init: function () {
    //         MLS.scene7.gallery( $jQ('#heroImageSetID').val(), function(images) {
    //             var self = this,

    //             $large = $jQ('#focus').find('.slides'),
    //             $thumbs = $jQ('#thumbs').find('.slides');

    //             if (!images || images.length == 0)
    //             {
    //                 images = [$jQ('#heroImageDefault').val()];
    //             }

    //             $jQ(images).each(function() {
    //                 $jQ('<li></li>').append(
    //                     $jQ(new Image()).attr({
    //                         src: self.mediumImage(this.toString()),
    //                         'data-zoom-medium': self.mediumImage(this.toString()),
    //                         'data-zoom-large': self.largeImage(this.toString())
    //                     })
    //                 ).appendTo($large);

    //                 $jQ('<li></li>').append(
    //                     $jQ(new Image()).attr({
    //                         src: self.thumbnailImage(this.toString())
    //                     })
    //                 ).append('<div class="vzn-active"></div>').appendTo($thumbs);

    //             });

    //             // Flexslider
    //             $jQ('#thumbs').length > 0 && $jQ('#thumbs').flexslider({
    //                 animation: "slide",
    //                 controlNav: false,
    //                 animationLoop: true,
    //                 slideshow: false,
    //                 itemWidth: 45,
    //                 itemMargin: 10,
    //                 asNavFor: '#focus'
    //             });
    //             $jQ('#focus').length > 0 && $jQ('#focus').flexslider({
    //                 animation: "slide",
    //                 controlNav: false,
    //                 animationLoop: true,
    //                 slideshow: false,
    //                 sync: "#thumbs"
    //             });

    //         });
    //     },
    //     finalize: function () {
    //         var $containers = $jQ('#thumbs, #focus');
    //         $containers.find('.slides').empty();
    //         // $containers.find('*[class^="flex-"]').remove();
    //         // $containers.prepend('<ul class="slides"></ul>');

    //         $containers.data("flexslider", null);



    //     }
    // },
    /*-----  End of Section comment block  ------*/


    /*===============================
    =            Overlay            =
    ===============================*/
    overlay: {

        init: function () {
            var $container = $jQ('#zoom-block');

            // Initializing an overlay that is already open.
            // In this case finalize it w/o closing the overlay.
            if ($container.hasClass('open')) {
                pub.view360.finalize();
                pub.zoomProduct.finalize();
                pub.overlay.finalize();
            } else {
                 // CSS animate in
                $container.addClass('open');
                $container.animate({
                    left: 0
                }, 350);
                // Avoid annoying vertical scroll on the background
                $jQ('html').addClass('body-zoom');
            }

            // clear content?




        },

        finalize: function (hide) {

            var hide = hide || false;

            $jQ("#focus .slides > li > img").each(function() {
                if ($jQ(this).attr("src") != $jQ(this).data("zoom-medium")) {
                    $jQ(this).attr("src", $jQ(this).data("zoom-medium"));
                }
            });

            // CSS animate out
            if (hide) {
                $jQ('#zoom-block').animate({
                    left: '-100%'
                }, 350, // time
                function () { // callback
                    $jQ('#zoom-block-dynamic-content').empty();
                    $jQ('#zoom-block').removeClass('open');
                    // Restore vertical scroll
                    $jQ('html, body').removeClass('body-zoom');
                    // Clear controllers
                    $jQ('#zoom-block').find('.controller').hide();
                });
            } else {
                // Clear controllers
                $jQ('#zoom-block').find('.controller').hide();
            }

        }

    },

    /*-----  End of Overlay  ------*/



    /*================================
    =            View 360            =
    ================================*/
    view360: {


        prepare: function() {
            MLS.scene7.gallery($jQ("#imageSetID").val(), function(images) {
                if (!images || images.length == 0)
                {
                    $jQ('#thumbs').find('.view-360-box').hide();
                    return;
                } else {
                    $jQ('#thumbs').find('.view-360-box').show();
                }
            });
        },

        init: function () {
            /*
            360 view
            1.- retrieve images (MLS.scene7.gallery)
            2.- preload all images (so the animation is not jumpy)
            3.- initialize image with the first image in the set
            4.- finalize events
            5.- (re-)initialize events (mousedown\touchstart, mousemove\touchmove, mouseup\touchend\touchcancel)
            */

            pub.view360.$content = $jQ('#zoom-block-dynamic-content');


            MLS.scene7.gallery($jQ("#imageSetID").val(), function(images) {
                if (!images || images.length == 0)
                {
                    $jQ('#thumbs').find('.view-360-box').hide();
                    return;
                } else {
                    $jQ('#thumbs').find('.view-360-box').show();
                }

                var self = this;
                // open panel...
                pub.overlay.init();

                $jQ('#thumbs').find('.carousel-zoom').addClass('active');
                // $jQ('#thumbs').find('.view-360-box').addClass('active');

                // Move nodes from the hero to the overlay
                // and place them back in pub.zoomProduct.finalize
                $jQ('#carousel').find('.thumb-wrap')
                    .appendTo('#zoom-block')
                    .find('.flex-viewport').hide();

                if ( $jQ("#view360-controller").length === 0 ) {
                    // if not a controller... add it
                    $jQ('<div id="view360-controller" class="controller"><span></span></div>').prependTo('.thumb-wrap');
                } else {
                    // otherwise use existing
                    $jQ('#view360-controller').prependTo('.thumb-wrap');
                }


                pub.view360.$controllers = $jQ('#view360-controller');
                pub.view360.$controller = $jQ('#view360-controller');
                pub.view360.$handler = $jQ('#view360-controller').find('span');

                // show controllers
                pub.view360.$controllers.show();

                // set initial handler position
                pub.view360.$handler.css({
                    left: 0
                });


                // load images...
                $jQ(images).each(function() {
                    $jQ(new Image()).attr({
                        'class': 'view-360-angle',
                        'src': self.mediumImage(this.toString()),
                        'draggable': false
                    }).appendTo(pub.view360.$content);
                });

                // Array of images loaded
                pub.view360.$images = pub.view360.$content.find('img');

                // controller width
                // $controller.width( ($images.length * 10) );

                pub.view360.$handler.on({
                    'mousedown': pub.view360.mousedown,
                    'mouseup': pub.view360.mouseup
                });

                // Show first image by default
                pub.view360.$images.first().addClass('view360-current');

                // Bind extra close events
                $jQ('#zoom-close').on('click', pub.view360.finalize);


            });
        },

        mousedown: function (e) {
            e.preventDefault();

            $jQ(document).data({
                down: true,
                oX: pub.view360.$controller.offset().left,
                hPX: $jQ(this).position().left,
                el: this
            })
                .on('mousemove', pub.view360.mousemove)
                .on('mouseup', pub.view360.mouseup);

        },

        mouseup: function (e) {
            $jQ(document)
                .data('down', false)
                    .off('mousemove', pub.view360.mousemove)
                    .off('mouseup', pub.view360.mouseup);
        },

        mousemove: function (e) {
            data = $jQ(document).data();

            if (data.down)
            {
                var w = pub.view360.$controller.width(),
                    p = (e.clientX - data.oX) / w,
                    idx = 0;

                if (p >= 0 && p <= 1)
                {
                    $jQ(data.el).css({
                        left: p * w - $jQ(data.el).width() / 2
                    });

                    idx = Math.round(p * (pub.view360.$images.length - 1));
                }

                pub.view360.$images.removeClass("view360-current").eq(idx).addClass("view360-current");
            }
        },


        finalize: function () {

            $jQ('#view360-controller').remove();

            $jQ('#thumbs').find('.carousel-zoom').removeClass('active');
            // $jQ('#thumbs').find('.view-360-box').removeClass('active');

            // unbind event listeners
            pub.view360.$handler && pub.view360.$handler.off({
                'mousedown': pub.view360.mousedown,
                'mouseup': pub.view360.mouseup
            });

            $jQ('#zoom-close').off('click', pub.view360.finalize);

            // place nodes back to hero
            $jQ('#zoom-block').find('.thumb-wrap')
                .appendTo('#carousel')
                .resize()
                .find('.flex-viewport').show();



            $jQ('img.view-360-angle').remove(); // delete all views

        }
    },
    /*-----  End of View 360  ------*/



    /*===============================
    =            Zoom In            =
    ===============================*/

    zoomProduct: {

        init: function () {

            pub.zoomProduct.$overlay = $jQ('#zoom-block');
            pub.zoomProduct.$content = $jQ('#zoom-block-dynamic-content');
            pub.zoomProduct.$bottomControls = $jQ('.bottom-controls');
            pub.zoomProduct.$controllers = $jQ('#zoom-controls');

            // Open overlay
            pub.overlay.init();
            pub.zoomProduct.$overlay.addClass('zoom-overlay');

            $jQ('#thumbs').find('.view-360-box').addClass('active');
            // $jQ('#thumbs').find('.carousel-zoom').addClass('active');

            $jQ('#zoom-controls').find('.bigger').addClass('active');

            // Move nodes from the hero to the overlay
            // and place them back in pub.zoomProduct.finalize
            $jQ('#carousel').find('#focus')
                .appendTo('#zoom-block-dynamic-content')
                .resize();
            $jQ('#carousel').find('.thumb-wrap')
                .appendTo('#zoom-block')
                .resize();

            // colors
            $jQ('#pdp-add-to-cart').appendTo('#thumbs');
            $jQ('#pdp-add-to-cart').find('.pdp-size-color').siblings(':visible').addClass('tmp-hidden');
            $jQ('#pdp-add-to-cart').find('.pdp-size-color').children(':not(.product-color):visible').addClass('tmp-hidden');

            // show controllers
            pub.zoomProduct.$controllers.show();


            // Zoom-In/Out event ...
            // pub.zoomProduct.$content.find('img').on('click', pub.zoomProduct.zoomToggle);
            // ... controller
            $jQ('#zoom-controls').find('.bigger').on('click',pub.zoomProduct.zoom.bigger);
            $jQ('#zoom-controls').find('.smaller').on('click', pub.zoomProduct.zoom.smaller);

            // Bind extra close events
            $jQ('#zoom-close').on('click', pub.zoomProduct.finalize);

            // remove zoom when slideshow changes
            $jQ('#thumbs').find('li').on('click', pub.zoomProduct.zoom.smaller);


        },

        finalize: function () {

            // place nodes back to hero
            $jQ('#zoom-block-dynamic-content').find('#focus')
                .appendTo('#carousel')
                .resize();
            $jQ('#zoom-block').find('.thumb-wrap')
                .appendTo('#carousel')
                .resize();

            // colors
            $jQ('#thumbs').find('#pdp-add-to-cart').prependTo('#cart-block .dark');
            $jQ('#pdp-add-to-cart').find('.tmp-hidden').removeClass('tmp-hidden');
            $jQ('#pdp-add-to-cart').find('.pdp-size-color').children(':not(.product-color):visible').removeClass('tmp-hidden');


            // Unbind events
            $jQ('#zoom-close').off('click', pub.zoomProduct.finalize);

            // Zoom-In/Out event ...
            // pub.zoomProduct.$content.find('img').off('click', pub.zoomProduct.zoomToggle);
            // ... controller
            $jQ('#zoom-controls').find('.smaller').off('click',pub.zoomProduct.zoom.bigger);
            $jQ('#zoom-controls').find('.bigger').off('click', pub.zoomProduct.zoom.smaller);

            // remove zoom when slideshow changes
            $jQ('#thumbs').find('li').off('click', pub.zoomProduct.zoom.smaller);
            pub.zoomProduct.zoom.smaller();

            // $jQ('#thumbs').find('.carousel-zoom').removeClass('active');
            $jQ('#thumbs').find('.view-360-box').removeClass('active');
        },


        zoom: {
            bigger: function () {
                var $activeImage = $jQ('#focus').find('.flex-active-slide').find('img');

                // not a carousel, only 1 image
                if ($activeImage.length == 0)
                {
                    $activeImage = $jQ('#focus').find('img');
                }

                $jQ('#zoom-controls').find('.smaller').addClass('active');
                $jQ('#zoom-controls').find('.bigger').removeClass('active');

                $activeImage.attr({
                    src: $activeImage.attr('data-zoom-large')
                });

                // Bind move around event
                $activeImage.on('mousemove', pub.zoomProduct.zoom.move.init);
            },
            smaller: function () {
                var $activeImage = $jQ('#focus').find('.flex-active-slide').find('img');

                // not a carousel, only 1 image
                if ($activeImage.length == 0)
                {
                    $activeImage = $jQ('#focus').find('img');
                }

                $jQ('#zoom-controls').find('.smaller').removeClass('active');
                $jQ('#zoom-controls').find('.bigger').addClass('active');

                $activeImage.attr({
                    src: $activeImage.attr('data-zoom-medium')
                });

                pub.zoomProduct.zoom.move.finalize();
                // Unbind move around event
                $activeImage.off('mousemove', pub.zoomProduct.zoom.move.init);
            },
            move: {
                init: function (e) {
                    $jQ(e.target).css({
                        position: 'relative',
                        top: (e.clientY)*(-1)
                    });
                },
                finalize: function () {
                    var $activeImage = $jQ('#focus').find('.flex-active-slide').find('img');

                    // not a carousel, only 1 image
                    if ($activeImage.length == 0)
                    {
                        $activeImage = $jQ('#focus').find('img');
                    }

                    $activeImage.css({
                        position: 'static',
                        top: 0
                    });
                }
            }

        }



    },
    /*-----  End of Zoom In  ------*/

    learnMoreDropdownDisplay: function (container) {

        var learnMore = $jQ(container),
            link = learnMore.find('.learn-more-link'),
            close = learnMore.find('.close'),
            dropdowns = $jQ('.learn-more').find('.learn-more-dropdown');

        if ($jQ('html').hasClass('no-touch')) {
            $jQ(link).on('click', function (e) {
                e.preventDefault();
            });
            $jQ(link).hover(
                function () {
                    var pannel = $jQ(this).next('.learn-more-dropdown'),
                        marker = $jQ(this).find('.marker');

                    $jQ(this).parents('.learn-more').find('.learn-more-dropdown').fadeOut(25);
                    pannel.fadeIn(200);
                },
                function () { $jQ(this).next('.learn-more-dropdown').delay(200).fadeOut(200); }
            );
            $jQ('.learn-more-dropdown').hover(
                function () { $jQ(this).stop().show(); },
                function () { $jQ(this).fadeOut(300); }
            );
        } else {
            $jQ(link).on('click', function (e) {
                e.preventDefault();
                var selDropdown = $jQ(this).next('.learn-more-dropdown');
                selDropdown.toggle();
                dropdowns.not(selDropdown).hide('fast');
                $jQ(close).on('click', function(e) {
                    e.preventDefault();
                    selDropdown.hide('fast');
                });
            });
        }
    },

    highlightChangeTab: function () {
        var $selected = $jQ(this),
        $contents = $selected
                        .parents('.highlight-module')
                        .find('.content');
        // hide all
        $contents.children().hide();
        // show current
        $contents
            .find('*[data-tabname="'+$selected.attr('data-tabname')+'"]')
            .show();

        $selected.parents('.tabs').children().removeClass('active');
        $selected.addClass('active');
    },

    mobileToggleSimilarProducts: function () {
        var $similarProducts = $jQ('#similar-products');
        $jQ(this).toggleClass('toggle');
        $similarProducts.find('.content-grid').toggleClass('toggle');
    },

    moreLessBlockTruncate : function(){
        $jQ('.pdp-overview-content .more-less-block .two-thirds, .pdp-features-content .more-less-block > ul, .pdp-features-content .more-less-block > ol').truncate(450);
        $jQ('li.features .pdp-features-content .more-less-link').css({'display':'inline', 'color':'#06c', 'textransform':'lowercase'});
    },

    pdpFeaturesShowMore : function(){
        var featuresContainer = $jQ('.pdp-features-content'),
            showMoreCTA = featuresContainer.find('.more-less-link');
            detailsList = featuresContainer.find('.details-list');

            showMoreCTA.click(function(){
                var currentNode = $jQ(this);
                currentNode.toggleClass('toggle');
                detailsList.toggleClass('toggle');
            });
    },

    mapProductDetailTabs : function(){
        var tabsParent = $jQ('#product-details li');

        $jQ('#pdp-cart-review-count, a.compat-link').click(function() {
            var currentNode = $jQ(this),
            targetTab = tabsParent.filter(function(){return $jQ(this).data('tabname') == currentNode.data('tabname');}).not(":hidden").find('> span');
            targetTab.click();

            setTimeout(function () {
                MLS.ui.scrollPgTo(targetTab, 100);
            } , 250);
        });
    },

    ellipsis : function(){
    },

    /*relatedStoriesSlider : function(){
        var parentSelector = $jQ('#related'),
            targetTabs = parentSelector.find('.tabs-content > li'),
            tabNavigaton = parentSelector.find('.tabs-controller > li');

            tabNavigaton.click(function(e){
                e.preventDefault();
                tabNavigaton.removeClass('active');
                var currentNode = $jQ(this),
                    currentIndex = currentNode.index();
                    currentNode.addClass('active');
                    targetTabs.removeClass('active');
                    targetTabs.eq(currentIndex).addClass('active');
            });

        $jQ('.vzn-slide').length > 0 && $jQ('.vzn-slide').flexslider({
            animation: 'slide',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 387
        });
    },*/

     pdpDetailTabs : function() {
        var detailSection = $jQ('#product-details'),
            visualTabs = detailSection.find('.detail-tabs > li'),
            // reviewTab = detailSection.find('.detail-tabs >li.reviews'),
            // reviewTabContent=detailSection.find('.detail-tabs-accordion > li.reviews'),
            tabContent = detailSection.find('.detail-tabs-accordion > li'),
            mobileTabs = tabContent.find('> span');

            mobileTabs.each(function(){
                var currentScope = $jQ(this),
                    contentTarget = currentScope.parent().find('.tab-wrapper');

                currentScope.click(function(){
                    currentScope.toggleClass('toggle');
                    contentTarget.toggleClass('toggle');
                    pub.compatibilityInitializer.apply(this, []);
                    // update hash
                    window.location.hash = currentScope.parent().data('tabname');
                });
            });

            visualTabs.each(function(){
                $jQ(this).click(function(){
                    var currentNode = $jQ(this),                  
                        targetTab = currentNode.data('tabname');

                    visualTabs.removeClass('active');
                    currentNode.addClass('active');
                    tabContent.removeClass('active');
                    tabContent.filter(function(){
                        return $jQ(this).data('tabname') == targetTab;
                    }).addClass('active');
                    pub.compatibilityInitializer.apply(this, []);
                });
            });

            /*
            if(window.location.hash=='#review')
            {
                visualTabs.each(function(){
                visualTabs.removeClass('active');
                tabContent.removeClass('active');
                reviewTab.addClass('active');
                reviewTabContent.addClass('active');
                var currentScope = $jQ(this);
                currentScope.click(function(){
                    var currentNode = $jQ(this),                  
                        targetTab = currentNode.data('tabname');

                    // update hash
                    window.location.hash = targetTab;

                    visualTabs.removeClass('active');
                    currentScope.addClass('active');
                    tabContent.removeClass('active');
                    tabContent.filter(function(){
                        return $jQ(this).data('tabname') == targetTab;
                    }).addClass('active');
                });
            });
                
            }else{
                 visualTabs.each(function(){
                var currentScope = $jQ(this);
                currentScope.click(function(){
                    var currentNode = $jQ(this),                  
                        targetTab = currentNode.data('tabname');

                    visualTabs.removeClass('active');
                    currentScope.addClass('active');
                    tabContent.removeClass('active');
                    tabContent.filter(function(){
                        return $jQ(this).data('tabname') == targetTab;
                    }).addClass('active');
                });
            });

            }
            */
           
        
    },




    pdpFeaturesGraphicTab : function(){
        var tabContainer = $jQ('.pdp-features-tab-box'),
            visualTabs =  tabContainer.find('#pdp-feature-tabs > dd'),
            tabContent = tabContainer.find('.tabs-content > li');

            visualTabs.each(function(){
                var currentScope = $jQ(this);
                currentScope.click(function(){
                    var currentNode = $jQ(this),
                        targetTab = currentNode.data('lifestyle');

                    visualTabs.removeClass('active');
                    currentScope.addClass('active');

                    tabContent.removeClass('active');
                    tabContent.filter(function(){
                        return $jQ(this).data('lifestyle') == targetTab;
                    }).addClass('active');
                });
            });
    },

    pdpColorOptions : function(){
        var numColors = $jQ('#product-colors').find('.color').length;
        if ( numColors > 6){
            $jQ('.light').addClass('reduced');
            $jQ('.dark').addClass('expanded');
        } else {
            $jQ('.light').removeClass('reduced');
            $jQ('.dark').removeClass('expanded');

            if (numColors > 3){
                $jQ('.size-select-box').addClass('more-than-3');
            }
        }
    },

    pdpSeeMoreColors : function(){
        var clickTarget = $jQ('.product-color .see-more');
        var showTarget = jQuery('#product-colors');

        clickTarget.click(function(){
            showTarget.toggleClass('show-all');
        });
    },

    pdpColorSelect : function(){
        $jQ('#product-colors .color').on('click', function () {
            if($jQ(this).hasClass('out-of-stock')) {
                return false;
            }
            var colorTitle = $jQ(this).find('a').attr('title');
            $jQ('#product-colors .color').removeClass('active');
            $jQ(this).addClass('active');
            $jQ('#pdp-current-color').text(colorTitle);
            $jQ('#pdp-color-select').val([]);
            $jQ('#pdp-color-select').find('option[value=' + colorTitle + ']').prop('selected', 'selected');
            var choice =  $jQ('#pdp-color-select option:selected').text();
        });
    },

    pdpMobileContent:  function () {
        $jQ('#pdp-cart-header').clone().appendTo('#pdp-mobile-cart-header');
        $jQ('.pdp-cart-shipping').clone().appendTo('.mobile-fieldset.shipping');
    },

    showMoreDevices : function(init) {
        var clickNode = $jQ('#product-details .compatibility .read-more'),
            baselineNode = $jQ('#product-details .compatibility'),
            clickNode = baselineNode.find('.read-more'),
            scrollNode = baselineNode.find('.device-scroll'),
            items = $jQ('#returned-items'), oldw = null, oldh = null,
            
        showMoreDevicesResizeCallback = function() {
            var w = $jQ(window).width(),
                h = $jQ(window).height(),
                v = baselineNode.hasClass("active");

            if (w == oldw && h == oldh)
            {
                // ie8 triggers window resize when checking if (scrollNode.height() * 1.1 > items.height())
                // weird, but we need to bypass it.
                return;
            }

            oldw = w;
            oldh = h;

            if (w > 640) {
                !scrollNode.data('tsb') && scrollNode.tinyscrollbar({ sizethumb: 65 });
            }

            if (!v)
            {
                baselineNode.addClass('active');
            }

            if (scrollNode.height() * 1.1 > items.height())
            {
                clickNode.hide();
            } else {
                clickNode.show();
            }
            
            if (!v)
            {
                baselineNode.removeClass('active');
            }
        },

        showMoreDeviceToggleCallback = function() {
            $jQ(this).toggleClass('toggle');
            scrollNode.toggleClass('scroll');

            if($jQ(window).width() > 640) {
                scrollNode.data('tsb').options({
                    wheel: $jQ(this).hasClass('toggle') ? 40 : 0
                });

                scrollNode.tinyscrollbar_update();
            }
        };

        $jQ(window).unbind('resize', showMoreDevicesResizeCallback).bind('resize', showMoreDevicesResizeCallback);
        showMoreDevicesResizeCallback();

        clickNode.unbind('click', showMoreDeviceToggleCallback).click(showMoreDeviceToggleCallback);
    },

    compatibleDropDowns : function(){
        if($jQ('html').hasClass('lt-ie9')){
            $jQ('#detail-brand-select, #size-select-box, #detail-device-select');
        } else {
            $jQ('#detail-brand-select, #size-select-box, #detail-device-select').uniform();
        };
    },

    selectCompatibleProducts : function(){
        $jQ('#detail-brand-select, #detail-device-select').change(this.searchCompatibleProducts);
    },

    compatibilityInitialized: false,
    compatibilityInitializer: function(val) {
        if (!pub.compatibilityInitialized && ($jQ(this).data("tabname") == "compatibility" || $jQ(this).parent().data("tabname") == "compatibility"))
        {
            var v = $jQ("#detail-search-box").val(), p = "";
            
            if (v == $jQ("#detail-search-box").attr("placeholder")) {
                v = "";
            }
            var detailSection = $jQ('#product-details'),
            visualTabs = detailSection.find('.detail-tabs > li'),
            // reviewTab = detailSection.find('.detail-tabs >li.reviews'),
            // reviewTabContent=detailSection.find('.detail-tabs-accordion > li.reviews'),
            tabContent = detailSection.find('.detail-tabs-accordion > li'),
            mobileTabs = tabContent.find('> span');

            mobileTabs.each(function(){
                var currentScope = $jQ(this),
                    contentTarget = currentScope.parent().find('.tab-wrapper');

                currentScope.click(function(){
                    currentScope.toggleClass('toggle');
                    contentTarget.toggleClass('toggle');
                    pub.compatibilityInitializer.apply(this, []);
                    // update hash
                    window.location.hash = currentScope.parent().data('tabname');
                });
            });

            visualTabs.each(function(){
                $jQ(this).click(function(){
                    var currentNode = $jQ(this),                  
                        targetTab = currentNode.data('tabname');

                    visualTabs.removeClass('active');
                    currentNode.addClass('active');
                    tabContent.removeClass('active');
                    tabContent.filter(function(){
                        return $jQ(this).data('tabname') == targetTab;
                    }).addClass('active');
                    pub.compatibilityInitializer.apply(this, []);
                });
            });
            p = (val || window.preselectedDevice || $jQ.cookie('preselectedDevice') || $jQ("#preselectedDevice").val() || v);
            MLS.ajax.sendRequest(
                $jQ("#detail-search-box").val(p).data("actionpage"),
                {
                    Ntt : p + "*"
                },
                function() {
                    pub.compatibilityCallback.apply(this, arguments);
                    pub.compatibilityInitialized = true;
                }
            );
        }
    },

    compatibilityCallback: function(data) {
        var returnedItems = $jQ('#returned-items'),
            itemsTotal = $jQ('#total-items > span'),
            $input = $jQ('#detail-search-box'),
            brands = $jQ('#detail-brand-select'),
            devices = $jQ('#detail-device-select');
            MLS.productDetail.init();
        returnedItems.html(data.success.responseHTML);

        if(!R.band(0, 640)) {
            returnedItems.closest('.device-scroll').tinyscrollbar_update();
        }
        
        itemsTotal.html(data.success.count);
        pub.showMoreDevices(true);

        if (data.success.hasOwnProperty('brands'))
        {
            v = brands.val();
            brands.data("stoptrigger", true).html(data.success.brands).val(v).change().data("stoptrigger", false);
            MLS.productDetail.init();
        }

        if (data.success.hasOwnProperty('devices'))
        {
            v = devices.val();
            devices.data("stoptrigger", true).html(data.success.devices).val(v).change().data("stoptrigger", false);
            MLS.productDetail.init();
        }

        if (data.success.count == 0)
        {
            var error = $jQ("#device-not-found");

            error.css({
                left: $input.offset().left - $jQ("#compatibilityForm").offset().left,
                top: 130
            }).fadeIn().find(".tooltip-close").unbind('click').click(function() {
                error.fadeOut();
                return false;
            });

            setTimeout(function() {
                error.fadeOut();
            }, 4000);

            MLS.productDetail.init();
        }
    },

    searchCompatibleProducts: function(e, u) {
        e && e.preventDefault();

        if (!$jQ(this).data("stoptrigger"))
        {
            // var selectType = $jQ(this).data('type'),
            var selectID = MLS.util.getParamsFromUrl($jQ(this).val()),
                formSubmit = $jQ(this).closest('form').attr('action');

            MLS.ajax.sendRequest(
                formSubmit,
                selectID,
                pub.compatibilityCallback
            );

            !u && $jQ(this).parents(".sorting-elements").find("input, select").not(this).val('').each(function (index, elem) {
                if($jQ(elem).is("select")) {
                    $jQ(elem).siblings("span").html($jQ(elem).find(":selected").text());
                }
            });
        }

        return false;
    },

    /* SAPE CODE
    compatibleTypeAhead : function(){
        var $input = $jQ('#detail-search-box'),
            self = this, enabled = false;

        $jQ.ajaxSetup({
            success: function() {
                enabled = true;
            }
        });;

        $input.typeahead({
            name: 'devices',
            prefetch: {
                url: $input.data('actionpage') + '?Ntk=product.displayName&Ntt=%QUERY'
            },
            limit: 10
        }).on('change keyup typeahead:selected typeahead:closed', function (e,item) {
            // do somehting?
            if (e.type === 'typeahead:closed') {
                $jQ(this).blur();
            }

            if (e.type === 'typeahead:selected') {
                self.searchCompatibleProducts.apply(this, [e]);
            }
        });

        $input.data('ttView').dropdownView.on('suggestionsRendered', function() {
            if (enabled)
            {
                if ($jQ(".tt-suggestions > div").length == 0) {
                    var error = $jQ("#device-not-found");

                    error.css({
                        left: $input.offset().left,
                        top: 130
                    }).fadeIn().find(".tooltip-close").unbind('click').click(function() {
                        error.fadeOut();
                        return false;
                    });

                    setTimeout(function() {
                        error.fadeOut();
                    }, 4000);
                }

                enabled = false;
            }
        });
    },
    */

    compatibleTypeAheadCooldown: null,

    compatibleTypeAhead: function(){
        var searchInput = $jQ('#detail-search-box'),
            typeAheadList = searchInput.parent().find('.type-ahead'),
            processingPage = searchInput.data('actionpage');

        searchInput.keyup(function(e) {
            var keyword = $jQ(this).val();

            if (keyword === $jQ(this).attr("placeholder"))
            {
                return false;
            }

            if (pub.compatibleTypeAheadCooldown != null)
            {
                clearTimeout(pub.compatibleTypeAheadCooldown);
                pub.compatibleTypeAheadCooldown = null;
            }

            pub.compatibleTypeAheadCooldown = setTimeout(function() {
                MLS.ajax.sendRequest(
                    processingPage,

                    {
                        Ntt : keyword + "*"
                    },

                    pub.compatibilityCallback
                );

                searchInput.parents(".sorting-elements").find("li select").val('').each(function(index, elem) {
                    $jQ(elem).siblings("span").html($jQ(elem).find(":selected").text());
                });
            }, 500);
        }).on('keypress',function(e) {
            if (e.keyCode==13) {
                return false;
            }
        });
    },

    addCartValidation : function() {
        $jQ.validator.addMethod("noEmptySelect", function (value, element) {
            if (value == '0') {
                return false;
            } else {
                return true;
            }
        });

        $jQ('#pdp-add-to-cart').validate({
            rules: {
                pdpColorSelect: {
                    required: true
                },
                pdpSizeSelect: {
                    required: true,
                    noEmptySelect: true
                }
            },
            messages: {
                pdpColorSelect: "Please choose a color",
                pdpSizeSelect: {
                    required: "Please choose a size",
                    noEmptySelect: "Please choose a size"
                }
            }
        });
    },

    pdpModalTech : function() {
            $jQ('.network-extender-modal').unbind('click').click(function() {
    	    $jQ('#extenderModal .lightbox-close').remove();
    	    MLS.modal.open($jQ('#extenderModal .lightbox-info-block').html(), false, true, true);
    	});
            $jQ('.network-extender-modal-tech').unbind('click').click(function() {
            $jQ('#extenderModalTech .lightbox-close').remove();
            MLS.modal.open($jQ('#extenderModalTech .lightbox-info-block').html(), false, true, true);
        });
    },

    megaMenuOverlay: function() {
        $jQ(document).on("mouseover", "#mls-nav", function(){
            if($jQ('.tab-dropdown').is(':visible')){
                $jQ('#btf-anchor').css('z-index', '0');
            }
        });
    }
};
return pub;
}());

if(jQuery.find('#pdp'))
{
if(jQuery.find('.outOfStock-cart'))	
{
jQuery('#anchor-add-to-cart').css('background','linear-gradient(#52585E,#3C4045) repeat scroll 0 0 #3C4045');
jQuery('#anchor-add-to-cart').css('cursor','not-allowed');
}
}
