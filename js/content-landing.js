var contentLanding = {
    resizeSliders: function() {
        $jQ('.featured-item .thumbs').each(function() {
            $jQ(this).data('flexslider') && $jQ(this).data('flexslider').setOpts({itemWidth: 41 });
        });

        $jQ('.featured-item .focus').each(function() {
            $jQ(this).data('flexslider') && $jQ(this).data('flexslider').setOpts({itemWidth: $jQ('.featured-item').width() });
        });
    },

    init: function () {
        MLS.ui.module.cornerFeature('.content-item .content-fig', '.content-cta', '.featured-item', '.featured-item-hover', this.resizeSliders);
        $jQ(".sort-options").uniform();
        // $jQ(".sort-options, .featured-item-add-to-cart, .featured-item .add-cart-cta").uniform();

        $jQ('.load-more').on('click', contentLanding.loadMore);

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

        $jQ(window).unbind('resize', this.resizeSliders).resize(this.resizeSliders);
    },

    finalize: function () {
        $jQ('.load-more').unbind('click', contentLanding.loadMore);
        $jQ(window).unbind('resize', contentLanding.resizeSliders);
    },

    reInit: function () {
        contentLanding.finalize();
        contentLanding.init();
    },

    loadMore: function (e) {
        e.preventDefault();

        var $elem = $jQ(e.currentTarget),
            params,
            $self = $jQ(this),
            $loadMore = $jQ(this);

        params = MLS.util.getParamsFromUrl($elem.attr('href'));

        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.CONTENT_LANDING_LOAD_MORE,
            params,
            function (data) {
                if (data.hasOwnProperty('success')) {
                    // $loadMore = $jQ('#load-more-articles');
                    // append results
                    var $wrapper = $self.parents(".wrapper"),
                        $cnt = $wrapper.find(".main-column .featured-stories"),
                        $loadMore = $wrapper.find(".load-more"),
                        $loadAll = $wrapper.find(".load-remaining");

                    if ($cnt.length == 0)
                    {
                        $cnt = $jQ('#main-column .featured-stories');
                        $loadMore = $jQ("#main-column .load-more"),
                        $loadAll = $jQ("#main-column .load-remaining");
                    }

                    $cnt.append(data.success.responseHTML);

                    // If there are more results to load
                    MLS.ui.socialShare.init();

                    if (typeof data.success.more !== 'undefined' && data.success.more.count !== '0') {
                        // update data-offset
                        $loadMore.attr('href', data.success.more.url)
                            // update button "load %loadManyMore count" button
                            .find('.article-count').text(data.success.more.count);

                        // update "load remaining %remainingCount products" link
                        $loadAll.find(".article-count").text(data.success.more.remainingCount);
                        $loadMore.show();
                    } else { // hide buttons is there's no more
                        $loadMore.hide();
                        $loadAll.hide();
                    }

                    MLS.article.init();
                }
            }
        );
    }
};
