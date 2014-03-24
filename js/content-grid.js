var contentGrid = {
    freeForm : true,
    init : function (freeForm) {
        contentGrid.freeForm = true; // freeForm ? true : false;


        // temporarily we will remove uniform from here  and add it on the ui.js page line 357
        // $jQ('.content-grid .add-cart-cta, .quick-view-details .add-cart-cta').uniform();

        var $contentGrid = $jQ('.content-grid').not('.guide-grid'),
            $contentItems = $contentGrid.find('.content-item'),
            $quickviewLinks = $contentItems.find('.quick-view');

        if (!isTouch) {
            /*
            MLS.ui.gridHover($contentItems.not('.large, .no-hover'), {
                topBar: $contentItems.find('.color-picker'),
                actions: $contentItems.find('.content-details')
            }, 10);
            */
            $contentItems.not('.large, .no-hover').each(function() {
                var $t = $jQ(this);
                if (!$t.data('gridded'))
                {
                    $t.data('gridded', true);

                    setTimeout(function(){
                        MLS.ui.gridHover($t, {
                        topBar: $t.find('.color-picker'),
                        actions: $t.find('.content-details')
                    }, 10); 
                    },1500);

                    // MLS.util.setMaxLines($jQ(this).find(".content-detail .name > span"), 2); // no longed needed (done in css)
                }
            });

            // $contentItems.hover(contentGrid.productTileEnter, contentGrid.productTileLeave);
            // $quickviewLinks.not('.large').on('click', {'$contentGrid' : $contentGrid}, contentGrid.quickViewHandler);
            $quickviewLinks.not('.large').unbind('click', contentGrid.quickViewHandler).on('click', {'$contentGrid' : $contentGrid}, contentGrid.quickViewHandler);
        }

        /*===================================
        =            Event Binds            =
        ===================================*/


        // Load more...
        $jQ('[id=load-more], [id=load-remaining]').unbind('click', contentGrid.loadMore).on('click', contentGrid.loadMore);

        /*-----  End of Event Binds  ------*/

        /*----- Fix for IE8 Load More Button ------*/
        if(($jQ('html').hasClass('lt-ie9')) && (($jQ('body').hasClass('product-listing-page')) || ($jQ('body').hasClass('brand-landing-page')))){
            var questionMark = /\?/;
            var hashMark = /\%23/;
            var loadMoreURL = $jQ('#load-more').attr("href");
            var loadRestURL = $jQ('#load-remaining').attr("href");
            if (loadMoreURL.match(questionMark)){
                loadMoreURL = loadMoreURL.replace('?', '#?');
                $jQ('#load-more').attr("href", loadMoreURL);
            } else if (loadMoreURL.match(hashMark)) {
                loadMoreURL = loadMoreURL.replace('%23', '#');
                $jQ('#load-more').attr("href", loadMoreURL);
            };
            if (loadRestURL.match(questionMark)) {
                loadRestURL = loadRestURL.replace('?', '#?');
                $jQ('#load-remaining').attr("href", loadRestURL);
            } else if  (loadRestURL.match(hashMark)) {
                loadRestURL = loadRestURL.replace('%23', '#');
                $jQ('#load-remaining').attr("href", loadRestURL);
            };
        };





    },

    finalize: function (freeForm) {
        contentGrid.freeForm = true; // freeForm ? true : false;

        // $jQ('.content-grid .add-cart-cta, .quick-view-details .add-cart-cta').uniform();
        var $contentGrid = $jQ('.content-grid').not('.guide-grid'),
            $contentItems = $contentGrid.find('.content-item'),
            $featuredHide = $contentItems.find('.back-to-story');

        /*===================================
        =            Event Unbinds          =
        ===================================*/

        // Load more...
        $jQ('[id=load-more], [id=load-remaining]').unbind('click', contentGrid.loadMore);


        $jQ('[id=mobile-sort-filter] a.filter, .mobile-sort-filter a.filter').unbind('click');
        $jQ('[id=mobile-sort-filter] a.sort, .mobile-sort-filter a.sort').unbind('click');


        /*-----  End of Event Unbinds ----*/
    },

    reInit: function () {
        contentGrid.finalize();
        contentGrid.init();
    },

    loadMore: function (e) {
        e.preventDefault();

        var $elem = $jQ(e.currentTarget),
            params,
            href,
            $loadMore,
            $loadRemaining,
            $loadContainer,
            tab = $jQ("#main-column .tab-content-wrapper.active");

        if (tab.length == 0)
        {
            tab = $jQ('#main-column');
        }

        href = $elem.attr('href');
        params = MLS.util.getParamsFromUrl(href);
        MLS.util.updateUrl(href);

        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.PRODUCT_LOAD_MORE,
            params,
            function (data) {
                var $newItems;

                if (data.hasOwnProperty('success')) {
                    $loadMore = tab.find('#load-more');
                    $loadRemaining = tab.find('#load-remaining');
                    $loadContainer = tab.find('#load-actions');

                    // append results
                    tab.find('.content-grid > li').addClass("already-added");
                    tab.find('.content-grid').append(data.success.responseHTML);
                    $newItems = tab.find('.content-grid > li:not(.already-added)');
                    tab.find('.content-grid > .already-added').removeClass("already-added");

                    MLS.miniCart.init($newItems, MLS.miniCart.options);
                    contentGrid.reInit();

                    // If there's more results to load
                    if (typeof data.success.more !== 'undefined' && data.success.more.count !== '0') {

                        // update data-offset
                        $loadMore.attr('href', data.success.more.url)
                            .find('.product-count').text(data.success.more.count);

                        // update "load remaining %remainingCount products" link
                        $loadRemaining.attr('href', data.success.more.loadRemainingURL)
                            .find('.product-count').text(data.success.more.remainingCount);

                        $loadContainer.show();
                    } else { // hide buttons is there's no more
                        $loadContainer.hide();
                    }

                    $jQ("html,body").animate({
                        scrollTop: $newItems.first().offset().top
                    });

                    if(($jQ('html').hasClass('lt-ie9')) && (($jQ('body').hasClass('product-listing-page')) || ($jQ('body').hasClass('brand-landing-page')))){
                        var questionMark = /\?/;
                        var hashMark = /\%23/;
                        var loadMoreURL = $jQ('#load-more').attr("href");
                        var loadRestURL = $jQ('#load-remaining').attr("href");
                        if (loadMoreURL.match(questionMark)){
                            loadMoreURL = loadMoreURL.replace('?', '#?');
                            $jQ('#load-more').attr("href", loadMoreURL);
                        } else if (loadMoreURL.match(hashMark)) {
                            loadMoreURL = loadMoreURL.replace('%23', '#');
                            $jQ('#load-more').attr("href", loadMoreURL);
                        };
                        if (loadRestURL.match(questionMark)) {
                            loadRestURL = loadRestURL.replace('?', '#?');
                            $jQ('#load-remaining').attr("href", loadRestURL);
                        } else if  (loadRestURL.match(hashMark)) {
                            loadRestURL = loadRestURL.replace('%23', '#');
                            $jQ('#load-remaining').attr("href", loadRestURL);
                        };
                    };
                }
            }
        );
    },

    productTileEnter : function () {
        $jQ(this).addClass('active');
    },
    productTileLeave : function () {
        $jQ(this).removeClass('active');
    },
    quickViewHandler : function (e) {
        var pid = "",
            el = $jQ(e.currentTarget);

        if ($jQ(e.currentTarget).find('a').length == 0)
        {
            pid = $jQ(e.currentTarget).parents("form").attr('action');
        }
        else
        {
            pid = $jQ(e.currentTarget).find('a').attr('href');
        }

        MLS.ajax.quickView.init(MLS.util.getParamsFromUrl(pid), el);
        return false;
    },
    quickViewShow: function (e) {

        var $quickView = $jQ('#quick-view-overlay'),
        $parentTile = $jQ(e).parent().parent(),
        $contentTile = $parentTile.hasClass('featured') ? $parentTile.next() : $parentTile,
        $cTposition = $contentTile.position(),
        $closeQv = $jQ('#close-quick-view').on('click', { qv : $quickView }, contentGrid.quickViewClose),
        w = $jQ('#main-column .content-grid:not(.hover), .content-grid:not(.hover), #pdp .tabbed-wrapper').filter(":visible").not('.guide-grid').parent().outerWidth();
        if ($parentTile.hasClass('bundle')) {
            $quickView = $jQ('.quick-view-overlay.bundle');
        }
                                                                                //DO NOT DELETE/ added uniform call to the select element for the quick view overlay
        $jQ('#quick-view-modal').fadeIn('fast',function () { siteCatalyst(); $quickView.find("#pdp-size-select").uniform() });

        if (contentGrid.freeForm) {
            var mh = 530,
                h = $jQ('.content-item').not('.featured').outerHeight() * 2;
                h = h > mh ? h : mh;

            $quickView.css({
                'display' : 'block',
                'top' : '50%',
                // 'height' : h,
                'width' : w,
                'left' : '50%',
                'marginLeft' : '-' + w / 2 + 'px',
                'position' : 'fixed',
                'min-height' : mh,
                'z-index': '999999'
            });

            $quickView.css({
                'margin-top' : - $quickView.height() / 2
            });

            $jQ('#quick-view-overlay #product-colors .color', '#quick-view-overlay').on('click', function () {
                var colorTitle = $jQ(this).find('a').attr('title');
                $jQ('#product-colors .color').removeClass('active');
                $jQ(this).addClass('active');
                $jQ('.color-info .color-option', '#quick-view-overlay').text(colorTitle);
            });
            contentGrid.initSlider();
            setTimeout(function () { // ensure scroll is fully complete before attaching these event handlers
                $jQ(window).on({
                    'resize.quickView' : contentGrid.quickViewClose,
                    'scroll.quickView' : contentGrid.quickViewClose,
                    'click.quickView' : function (e) {
                        if ($jQ(e.target).closest($quickView).length === 0) {
                            contentGrid.quickViewClose(e);
                        }
                    }
                }, { 'qv' : $quickView });
            }, 1000);
        } else {
            var mx = $jQ('#site-container').outerWidth();
                w = w > mx ? mx : w;

            $quickView.show().css({
                'top' : $cTposition.top + ($parentTile.hasClass('featured') ? $parentTile.outerHeight() : 0) + 15,
                'height' : $jQ(".quick-view-details > form").height() + 85, // $jQ('.content-item').not('.featured').outerHeight() * 2, */
                'width' : w
            });

            $quickView.attr('scroll', $jQ(window).scrollTop());
            $jQ('html, body').animate({
                scrollTop : $cTposition.top + $contentTile.outerHeight() + 200
            }, 500, function () {
                contentGrid.initSlider();
                setTimeout(function () { // ensure scroll is fully complete before attaching these event handlers
                    $jQ(window).on({
                        'resize.quickView' : contentGrid.quickViewClose,
                        'scroll.quickView' : contentGrid.quickViewClose,
                        'click.quickView' : function (e) {
                            if ($jQ(e.target).closest($quickView).length === 0) {
                                contentGrid.quickViewClose(e);
                            }
                        }
                    }, { 'qv' : $quickView });
                }, 1000);
            });
        }
        $jQ('#quick-view-overlay #product-colors .color').on('click', function () {
            var colorTitle = $jQ(this).find('a').attr('title');
            $jQ('#quick-view-overlay #product-colors .color').removeClass('active');
            $jQ(this).addClass('active');
            $jQ('#quick-view-overlay .color-info .color-option').text(colorTitle);
        });
        // $jQ('#quick-view-overlay #pdp-size-select').uniform();
    },

    initSlider : function () {
        if ($jQ('#quick-view-slider').data('flexslider'))
        {
            console.log('ignoring');
            return;
        }

        MLS.scene7.loadGallery({
            galleryID: $jQ('#quick-view-overlay #heroImageSetID').val(),
            $largeContainer: $jQ('#quick-view-overlay #quick-view-slider'),
            $thumbsContainer: $jQ('#quick-view-overlay .slider-controls')
        });
    },

    setThumbnailMargins : function ($sT, pos) {
        var offset = pos === 'left' ? $sT.outerWidth() : $sT.outerHeight();
        $sT.css('margin-' + pos, '-' + (offset / 2) + 'px');
    },
    quickViewClose : function (e) {
        if (Math.abs(parseFloat($jQ('#quick-view-overlay').attr('scroll')) - parseFloat($jQ(window).scrollTop())) > 250 || e.type === 'click') {
            e.preventDefault();
            contentGrid.removeCloseListeners();
            var $qv = $jQ(e.data.qv);
            $qv.fadeOut('fast');
            $jQ('#quick-view-modal').fadeOut('fast');
        }
    },
    removeCloseListeners : function () {
        $jQ(window).off('resize.quickView');
        $jQ(window).off('scroll.quickView');
        $jQ(window).off('click.quickView');
    }
};

// ............. TEMP state toggle buttons in header .........

var stndrd = document.getElementById('state-standard');
var newProd = document.getElementById('state-new-products');
var featSale = document.getElementById('state-sale-featured');
var itemSale = document.getElementById('state-sale-item');

$jQ(stndrd).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(newProd).removeClass('on');
    $jQ(featSale).removeClass('on');
    $jQ(itemSale).removeClass('on');

    //turn off all special cases
    $jQ('.new-product').css('display', 'none');
    $jQ('.sale-featured').css('display', 'none');
    $jQ('.sale-item').css('display', 'none');

});

$jQ(newProd).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(stndrd).removeClass('on');

    // turn on new product elements
    $jQ('.new-product').css('display', 'block');

});

$jQ(featSale).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(stndrd).removeClass('on');

    //turn on featured sale elements & add class depending on screen width
    var pageWidth = document.body.clientWidth;
    if (pageWidth < 1281) {
        $jQ('.sale-featured.three-across').css('display', 'block').parent().addClass('sale-featured-block');
    } else if (pageWidth > 1280) {
        $jQ('.sale-featured.four-across').css('display', 'block').parent().addClass('sale-featured-block');
    }
});

$jQ(itemSale).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(stndrd).removeClass('on');

    //turn on item sale elements & turn off hover
    $jQ('.sale-item').css('display', 'block');

}); // end TEMP state buttons


$jQ('#product-listing .content-grid .featured .outOfStock-grid-add-cart').css('right','-15px');
$jQ('#product-listing .content-grid .featured .outOfStock-grid-add-cart').css('width','30%');