MLS.article = {
    container: null,
    details: null,

    close: {
        btn: null,
        disabled: false
    },

    nav: {
        prev: null,
        next: null
    },

    preview: {
        prev: null,
        next: null
    },

    initialized: false,

    init: function (d) {
        //console.log("v5");
        if (this.container == null) {
            this.container = $jQ('.article-detail-wrapper');
            if (this.container.length == 0) {
                this.container = $jQ('<div class="article-detail-wrapper"><article id="article-detail" class="article-detail"></article><div class="article-modal-overlay"></div></div>').appendTo("body");
            }

            this.details = $jQ('#article-detail');
        }

        d = $jQ(d || document);
        d.find('.data-article').unbind('click', this.loadArticleCallback).click(this.loadArticleCallback);
        d.find('.data-infographic').unbind('click', this.loadInfographicCallback).click(this.loadInfographicCallback);

        // Article page was opened by accesing permalink
        $jQ('#article-detail').is(':visible') && MLS.ui.socialShare.init( MLS.article.details );

        // weird issue in android 4.0 (article overlay interferes with overflow:hidden)
        if (!this.fixedElement) {
            this.fixedElement = $jQ("<div>-</div>").css({
                position: "fixed",
                top: 0,
                right: 0,
                width: 1,
                height: 1,
                background: "#fff",
                opacity: .5
            }).appendTo("body");
        }

        if (!this.initialized)
        {
            this.initialized = true;

            var data = MLS.util.getSectionHash("article");
            
            if (data !== false)
            {
                MLS.article.getArticleContent(data);
            }

            if ($jQ("article.article-detail header.article-header").length > 0) 
            {
                this.close.disabled = true;
                
                $jQ('#article-content').css({
                    "min-height": this.details.show().height() - 300
                });

                MLS.article.displayContent(false, true);
            }
        }
    },

    loadArticleCallback: function (e) {
        e.preventDefault();
        var data = MLS.util.getParamsFromUrl($jQ(this).attr('href'));
        MLS.util.updateSectionHash("article", data);
        MLS.article.getArticleContent(data);
        return false;
    },

    getArticleContent: function (data) {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.ARTICLE,
            data,
            MLS.article.displayContent
        );
    },

    /////// Get Infographic Article (dummy)
    loadInfographicCallback: function (e) {
        e.preventDefault();
        var data = MLS.util.getParamsFromUrl($jQ(this).attr('href'));
        MLS.util.updateSectionHash("article", data);
        MLS.article.getInfographic(data);
    },

    getInfographic: function (data) {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.INFOGRAPHIC,
            data,
            MLS.article.displayContent
        );
    },
    //////////

    displayContent: function (data) {
        if (data && MLS.errors.checkForInlineErrors(data)) {
            return;
        }

        var a = MLS.article;

        if (data)
        {
            a.details.hide();
            MLS.ui.updateContent(a.details, data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
            MLS.ui.socialShare.init(a.details);
        }
        
        a.details.find('.article-cta').hover(
            function () {
                $jQ(this).next('.article-preview-container').show();
            },
            function () {
                $jQ(this).next('.article-preview-container').hide();
            }
        );

        a.close.btn = a.container.find('.close');
        
        /*
        $jQ("#prev-article, #next-article, #article-prev, #article-next").each(function() {
            $jQ(this).css({
                position: 'fixed',
                top: '50%',
                marginTop: -$jQ(this).height() / 2
            });
        });
        */

        // a.close.top = parseInt(a.close.btn.css('top'), 10);
        a.nav.prev = $jQ('#prev-article');
        a.nav.next = $jQ('#next-article');

        // a.nav.top = parseInt(a.nav.next.css('top'), 10);
        a.preview.prev = $jQ('#article-prev');
        a.preview.next = $jQ('#article-next');

        // a.nav.topPreview = parseInt(a.nav.nextPreview.css('top'), 10);
        a.close.btn.add(a.container.find('.article-modal-overlay'));
        if (!a.close.disabled)
        {
            a.close.btn.unbind('click', a.onClose).bind('click', a.onClose);
        }

        a.onOpen();
        a.init(a.details);

        a.container.find('.stories').flexslider({
            useCSS: false,
            animation: 'slide',
            touch: true,
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: a.container.find('.story').width(),
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Related Stories");
            }
        });

        typeof siteCatalyst == 'function' && siteCatalyst();
    },

    onOpen: function () {
        var scrollTop = $jQ(window).scrollTop(),
            width = parseInt(this.details.removeAttr('style').css('max-width'), 10),
            height = this.details.height();


        if (scrollTop !== 0) {
            height += 160;
        }

        if (width > $jQ(window).width()) {
            width = $jQ(window).width();
        }

        $jQ('html,body').animate({
            scrollTop: 0
        });

        this.details.css({
            top: 0,
            maxWidth: width,
            marginLeft: -width / 2
        });

        this.container.fadeIn();

        MLS.article.close.btn.data('top', $jQ(MLS.article.close.btn).position().top);
        
        // MLS.article.container.on('scroll', MLS.article.onScroll);
        $jQ(window).unbind('scroll', MLS.article.onScroll).bind('scroll', MLS.article.onScroll);
        MLS.article.onScroll();
    },

    onClose: function (e) {
        e.preventDefault();
        MLS.article.container.fadeOut(500, function () {
            MLS.util.updateSectionHash("article", "");
            MLS.article.details.empty();
        });
    },

    onScroll: function () {
        var a = MLS.article,
            st = $jQ(window).scrollTop(),
            h = $jQ(window).height(),
            els = [a.nav.prev, a.nav.next, a.preview.prev, a.preview.next],
            fh = a.details.find('.article-footer').height(),
            f = isTouch ? 'animate' : 'css';

        if (st + h >= a.details.offset().top + a.details.height() - fh)
        {
            $jQ(els).each(function() {
                if ($jQ(this).length == 0) return;

                $jQ(this).stop(false,true)[f]({
                    top: a.details.offset().top + a.details.height() - fh - h / 2 - $jQ(this).height() / 2 - $jQ(this).parent().offset().top
                }, {
                    duration: 1000
                });
            });

            a.close.btn.stop(false,true)[f]({
                top: a.details.offset().top + a.details.height() - fh - h + $jQ(this).data('top')
            }, {
                duration: 1000
            });
        } else {
            $jQ(els).each(function() {
                if ($jQ(this).length == 0) return;
                
                $jQ(this).stop(false,true)[f]({
                    top: st + h / 2 - $jQ(this).height() / 2 - $jQ(this).parent().offset().top
                }, {
                    duration: 1000
                });
            });

            a.close.btn.stop(false,true)[f]({
                top: st + $jQ(a.close.btn).data('top')
            }, {
                duration: 1000
            });
        }

        a.container.find('.article-highlights > .featured-item').each(function(i) {
            var top = $jQ(this).offset().top,
                ah = $jQ(this).height(),
                bot = top + ah,

                min = st + h * .4,
                max = st + h * .6;

            if (top >= max || bot <= min)
            {
                $jQ(this).removeClass("on");
            } else {
                $jQ(this).addClass("on");
            }
        });
    }
};
