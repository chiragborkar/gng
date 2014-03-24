MLS.ui = {

    /*
     * Social Share - Handle clicking of social share toolbar
     *
     */
    /*var serverError = 'Something went wrong. Mind trying again?',
        successMessageTitle = 'Success!',
        successMessage1 = 'You have shared the',
        successMessage2 = 'with:';*/

    socialShare : {
        init: function (d) {
            var $d = $jQ(d || document),
                $socialList = $d.find('.social-share-module').find('.social-list'),
                $socialItems = $socialList.find('.social-item'),
                $socialItemsWithContext,
                $overlay,
                $scope,
                listWidth,
                overlayWidth,
                clickCallback = function (e) {
                    e.preventDefault();
                    $scope = $jQ(this);
                    $socialItemsWithContext = $scope.parents('.social-list').find('.social-item');

                    socialItemReset($socialItemsWithContext);
                    $scope.addClass('active');

                    if ($scope.hasClass('email')) {
                        var $emlModal = $scope.find('.overlay').html();

                        if ($jQ('#share-modal-overlay').length <= 0) {
                            $jQ('<div id="share-modal-overlay"/>').appendTo("body");
                        }

                        if ($jQ('#share-modal-display').length <= 0) {
                            $jQ('<div id="share-modal-display"/>').appendTo("body");
                        }

                        $socialItemsWithContext.css('width', '20%');

                        var $shareModalDisplay = $jQ('#share-modal-display');
                        $shareModalDisplay.html($emlModal);
                        MLS.placeholder.init($shareModalDisplay);

                        // center modal on screen

                        if($jQ("html").hasClass("touch") && $jQ(window).outerWidth() < 700)
                            {
                                //Mobile
                                $shareModalDisplay.show().css({
                                position: "scroll",
                                top:"50%"
                                }).hide();
                            }   
                        else 
                            {
                                //Tablet and desktop
                                 $shareModalDisplay.show().css({
                                top: "15%",
                                left: ($jQ(window).outerWidth() / 2 - $shareModalDisplay.outerWidth() / 2) ,
                                position: "fixed"
                                }).hide();
                            }
                        

                        $jQ('#share-modal-overlay, #share-modal-display').hide().fadeIn('medium', function () {
                            $jQ('#share-modal-overlay').unbind('click', modalClose).click(modalClose);
                            $jQ('#share-modal-display').unbind('click', modalClose).one('click', '.close-overlay', modalClose);
                            $jQ(document).off('keyup.social').on('keyup.social', function (e) {
                                if (e.keyCode === 27) {
                                    modalClose();
                                }
                            });
                        });

                        // $shareModalDisplay.find("input[type=submit]").uniform();

                        MLS.ui.placeholderValidationRules();
                        var $shareForm = $shareModalDisplay.find('form');
                        MLS.ui.emailValidation($shareForm);

                        $shareForm.off('submit').on('submit', function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            var shareFormValid = false;
                            shareFormValid = $shareForm.valid();
                            if (shareFormValid && !$shareForm.data('submitted')) {
                                $shareForm.data('submitted', true);
                                MLS.ajax.sendRequest(
                                    MLS.ajax.endpoints.SOCIAL_EMAIL_SHARE,
                                    $jQ(this).serialize(),
                                    // AJAX request success
                                    function (d) {
                                        $shareForm.data('submitted', false);
                                        // server success response
                                        if (d.hasOwnProperty('success')) {
                                            $shareModalDisplay.html(d.success.responseHTML);
                                        }

                                        // server error response
                                        else {
                                            $shareForm[0].reset(); //reset fields
                                            $jQ('#share-modal-display .share-error').html(d.error.responseHTML);
                                        }
                                    },
                                    // AJAX request error
                                    function (d) {
                                        $shareForm.data('submitted', false);
                                        $shareModalDisplay.html('<span>Unable To Process The Request</span>');
                                    }
                                );
                            }

                            return false;
                        });
                    }
                    else {
                        $overlay = $scope.find('.overlay'),
                        $socialList = $socialItemsWithContext.parents('.social-list'),
                        listWidth = $socialList.outerWidth();

                        overlayWidth = $overlay.outerWidth();
                        $overlay.show().css('width', 0);
                        $scope.find('.social-link').hide();

                        $socialItemsWithContext.not($scope).stop(false, false).animate({
                            width: ((listWidth - overlayWidth) / $socialItemsWithContext.length)
                        }, { duration: 'fast', queue: false });

                        $overlay.stop(false, false).animate({
                            width: overlayWidth
                        }, { duration: 'fast', queue: false });

                        $scope.stop(false, false).animate({
                            width: overlayWidth
                        }, { duration: 'fast', queue: false });

                    }

                    return false;
                },

                socialItemReset = function ($context) {
                    if ($context !== undefined) {
                        $context.removeClass('active').removeAttr('style');
                        $context.find('.overlay').removeAttr('style');
                        $context.find('.social-link').removeAttr('style');
                    } else {
                        $socialItems.removeClass('active').removeAttr('style');
                        $socialItems.find('.overlay').removeAttr('style');
                        $socialItems.find('.social-link').removeAttr('style');
                    }
                },

                modalClose = function(e) {
                    e && e.preventDefault();
                    $jQ('#share-modal-overlay, #share-modal-display').fadeOut('medium');
                    $jQ(document).off('keyup.social');
                };

            // Call social media APIs and load buttons
            /* trigger on hover / tap
            var initializeSocial = function() {
                if ($jQ(this).data('social-initialized')) {
                    return;
                }

                $socialList.each(function() {
                    $jQ(this).data('social-initialized', true);
                });

                MLS.ui.socialShare.buttons.facebook();
                MLS.ui.socialShare.buttons.twitter();
                MLS.ui.socialShare.buttons.googleplus();
                MLS.ui.socialShare.buttons.pinterest();
            };

            $socialList.unbind('mouseenter touchstart', initializeSocial).bind('mouseenter touchstart', initializeSocial);
            */
            if(!$jQ('body').hasClass('product-detail')){
                MLS.ui.socialShare.buttons.facebook();
                MLS.ui.socialShare.buttons.twitter();
                MLS.ui.socialShare.buttons.googleplus();
                //MLS.ui.socialShare.buttons.pinterest();
            }   

            socialItemReset();
            $socialItems.not('.active').unbind('click', clickCallback).bind('click', clickCallback);

            /* share on hover
            if ('touchstart' in window)
            {
                $socialItems.not('.active').unbind('click', clickCallback).bind('click', clickCallback);
            }
            else
            {
                $socialItems.filter(".email").not('.active').unbind('click', clickCallback).bind('click', clickCallback);
                $socialItems.not('.active, .email').unbind('mouseenter', clickCallback).bind('mouseenter', clickCallback);
            }
            */

            $jQ('.social-share-module').show();
        },
        buttons: {

            facebook: function () {
                var s = 'script',
                    d = document,
                    id = 'facebook-jssdk',
                    js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s);
                js.id = id;
                js.src = '//connect.facebook.net/en_US/all.js#xfbml=1';
                fjs.parentNode.insertBefore(js, fjs);
            },

            twitter: function () {
                var d = document,
                    s = 'script',
                    id = 'twitter-wjs',
                    js,
                    fjs = d.getElementsByTagName(s)[0],
                    p = /^http:/.test(d.location) ? 'http' : 'https';

                if (!d.getElementById(id)) {
                    js = d.createElement(s);
                    js.id = id;
                    js.src = p + '://platform.twitter.com/widgets.js';
                    fjs.parentNode.insertBefore(js, fjs);
                }
            },

            googleplus : function () {
                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = '//apis.google.com/js/plusone.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            },

            pinterest: function () {
                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = '//assets.pinterest.com/js/pinit.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            }
        }
    },
    placeholderValidationRules : function () {
        $jQ.validator.addMethod('noPlaceholder', function (value, element) { // don't validate placeholder text
            if (value === $jQ(element).attr('placeholder')) {
                return false;
            } else {
                return true;
            }
        });
        $jQ.validator.addMethod("alphanumericExtended", function(value, element) {
            return this.optional(element) || /^([a-zA-Z0-9 _\-\.\']+)$/.test(value);
        }, "Please enter a valid address");
    },
    emailValidation : function (formId) {
        $jQ(formId).validate({
                ignore: '.ignore, :hidden',
                success: function (label) {
                    label.addClass('success').text('');
                },
                focusCleanup: false,
                rules: {
                    shareName: {
                        required: true,
                        alphanumericExtended: true,
                        noPlaceholder: true,
                        maxlength: 15
                    },
                    shareEmail: {
                        required: true,
                        noPlaceholder: true,
                        email: true,
                        maxlength: 125
                    },
                    shareRecipientName: {
                        required: true,
                        noPlaceholder: true,
                        alphanumericExtended: true,
                        maxlength: 15
                    },
                    shareRecipient: {
                        required: true,
                        noPlaceholder: true,
                        email: true,
                        maxlength: 125
                    }
                },
                messages: {
                    shareName: {
                        required: 'Please enter your name',
                        alphanumericExtended: 'Please enter your name',
                        noPlaceholder: 'Please enter your name',
                        maxlength: 'Invalid name'
                    },
                    shareEmail: {
                        required: 'Please enter your email address',
                        noPlaceholder: 'Please enter your email address',
                        email: 'Invalid email address',
                        maxlength: 'Invalid email address'
                    },
                    shareRecipientName: {
                        required: 'Please enter the recipient name',
                        alphanumericExtended: 'Please enter the recipient name',
                        noPlaceholder: 'Please enter the recipient name',
                        maxlength: 'Invalid recipient name'
                    },
                    shareRecipient: {
                        required: 'Please enter the recipients address',
                        noPlaceholder: 'Please enter the recipients address',
                        email: 'Invalid email address',
                        maxlength: 'Invalid email address'
                    }
                }
            });
    },
    complexItem: {
        init: function () {
            $jQ('.close-btn', '#complex-item-modal').on('click', MLS.ui.complexItem.close);
        },
        open: function () {
            $jQ('#complex-item-modal-overlay').show(300, function () {
                $jQ('#complex-item-modal').show(200);
            });
        },
        close: function () {
            $jQ('#complex-item-modal').fadeOut(300, function () {
                $jQ('#complex-item-modal-overlay').fadeOut(200);
            });
        }
    },

    /*
     * Grid Hover (popout)
     * @selector: grid item(s), @details: detail contents to push into grid pop out, @padding: control offset amount
     */
    gridHover : function (selector, content, padding, props) {
        var zIndex = 1000,
            globalpadding = $jQ('#site-container').offset().top,
            props = props ? props : {};

        if (!Response.band(768) && props.redirect) {
            // go to PDP
            $jQ(content.element).find("a:eq(0)").click();
            document.location.href = $jQ(content.element).find("a:eq(0)").attr("href");
        }

        $jQ(selector).on(props.touch ? 'mouseenter touchstart' : 'mouseenter', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var el = $jQ(this),
                pop = $jQ('#grid-pop-out').removeClass("on-sale"),
                click = function(ev) {
                    if (ev.target.id == "grid-pop-out")
                    {
                        el.find("a:eq(0)").click();
                        document.location.href = el.find("a:eq(0)").attr("href");
                    }
                },

                // el.offset() gets the position of the element based on the width of the document.
                // We must account the gap betweent the window and the width of the container...
                documentWidth = $jQ(document).width(),
                wrapperWidth = $jQ('#site-container').width(),
                // outerGap = wrapperWidth < documentWidth ? (documentWidth - wrapperWidth) / 2 : 0,

                width = props.width ? props.width : el.outerWidth(),
                height = props.height ? props.height : el.outerHeight(),
                // offset = el.offset(),

                pos = {
                    left: el.offset().left - $jQ('#site-container').offset().left,
                    top: el.offset().top - (padding / 2) - globalpadding
                },

            detailHeight = pop.find('.details').height(); // need to dump contents from cell into this...
            padding = (padding !== undefined) ? padding : 40;

            if ($jQ(this).is("li"))
            {
                // if (!$jQ(this).data('uniformed'))
                // {
                //     $jQ(this).data('uniformed', 1).find('.add-cart-cta').uniform();
                // }

                pop.find('.content-grid').remove();
                $jQ('<ul></ul>')
                    .addClass('content-grid hover')
                    .append($jQ(this).clone(false).removeAttr('style').addClass('grid-hover-active'))
                    .appendTo('#grid-pop-out');
            } else if (content.element) {
                // if (!$jQ(content.element).data('uniformed'))
                // {
                //     $jQ(content.element).data('uniformed', 1).find('.add-cart-cta').uniform();
                // }

                pop.find('.content-grid').remove();
                $jQ('<ul></ul>')
                    .addClass('content-grid hover')
                    .append($jQ(content.element).clone(true).addClass('grid-hover-active'))
                    .appendTo('#grid-pop-out');
            }

            pop.click(click);

            if (Response.band(768)) {
                // $jQ('.content-item').find('.stars').removeClass('red');
                $jQ('.content-item.active').removeClass('active grid-hover-active');
                el.addClass('active');

                $jQ('.grid-hover-active').find('.stars').addClass('red');

                if (content.topBar !== undefined) {
                    pop.find('.top-bar').html($jQ(content.topBar).html());
                }

                if (content.actions !== undefined) {
                    pop.find('.details')
                        .html($jQ(content.actions).clone(true))
                        .find('input:submit').unbind('click').click(function (e) {
                            e.preventDefault();
                            $jQ(content.actions).find('input:submit').eq(0).click();
                            return false;
                        }
                    );
                }

                pop.css({
                    width: props.width ? width : (width + padding + 6),
                    height: props.height ? height : (height + padding + detailHeight),
                    zIndex: zIndex++
                }).css({
                    top: props.top ? props.top() : pos.top,
                    left: props.left ? props.left() : (pos.left - (pop.outerWidth(true) - width) / 2)
                }).stop(true, true).fadeIn('fast').on('mouseleave', function () {
                    $jQ(this).stop(true, true).hide();
                    el.removeClass('active');
                    pop.find('.details').empty();
                    pop.unbind('click', click);
                });

                if (props.touch)
                {
                    $jQ('html').on('touchstart', function(e) {
                        pop.trigger('mouseleave');
                    });

                    pop.on('touchstart', function(e) {
                        e.stopPropagation();
                    });
                }
            }

            if (pop.find(".sale-tag").is(":visible"))
            {
                pop.addClass("on-sale");
            }
        });

        if (Response.band(768) && props.touch)
        {
            $jQ(selector).trigger('touchstart');
        }
    },

    /*
     * Clickable Tabs
     * @element: (string) parent (containing) element
     */

    tabs: function (element, hover) {
        var scope = element,
            $contentTabs = $jQ(scope + ' > .tab-content > .tab'),
            activeClass = 'active';

        $jQ(scope + ' > .tab-menu > .tab').each(function (i, el) {
            $jQ(this).add($contentTabs[i]).attr('tab', i + 1);
        });

        $jQ(scope + ' > .tab-menu > .tab').on((hover ? 'mouseenter' : 'click'), function (e) {
            if (!hover) {
                e.preventDefault();
            }

            var tab = $jQ(this).attr('tab');
            $jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
            $jQ(this).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);
        });

        $jQ(scope + ' > .tab-menu > .tab:first-child').add(scope + ' > .tab-content > .tab:first-child').addClass(activeClass);
    },

    /*
     * Navigation Tabs
     * @element: (string) containing element
     */
    navTabs: function (element, isMobile) {
        var scope = element,
            $navItems = $jQ(scope + ' > .tab-menu > .nav-item.tab'),
            $contentTabs = $jQ(element + ' > .tab-content > .tab'),
            activeClass = 'active';

        function clearActive(scope) {
            $navItems.add(scope + ' > .tab-content > .tab').removeClass(activeClass);
        }
        function setActive(el, scope, tab) {
            $jQ(el).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);
        }

        $navItems.each(function (i) {
            $jQ(this).add($contentTabs[i]).attr('tab', i + 1);
        });

        if (!isTouch) {
            $navItems.on('mouseenter', function () {
                if ($jQ(this).hasClass('disabled'))
                {
                    return true;
                }

                if (!$jQ(this).hasClass('nav-actions')) {
                    var tab = $jQ(this).attr('tab');

                    clearActive(scope);
                    setActive(this, scope, tab);

                    $jQ(scope).one('mouseleave', function () {
                        clearActive(scope);
                    });
                } else if (!($jQ(this).hasClass('logo') || $jQ(this).hasClass('nav-actions'))) {
                    clearActive(scope);
                }
            });
        }
        if (isTouch || isMobile) {
            $navItems.on('click', function (e) {
                var _click = $jQ(this);
                if (_click.hasClass('disabled') || _click.is('#nav-cart'))
                {
                    return true;
                }

                var tab = _click.attr('tab'),
                evt = (navigator.userAgent.match(/(iPad|iPhone)/i)) ? 'touchstart' : 'click';

                $jQ(document).on(evt + '.mobileclose', function (e) {
                    if ($jQ(scope).has(e.target).length === 0) {
                        clearActive(scope);
                        $jQ(scope).find('.tab-content .nav-item.tab').add($jQ(scope).find('.tab-content .nav-item.tab > a')).removeClass(activeClass);
                        $jQ(document).off(evt + '.mobileclose');
                    }
                });

                if (!_click.hasClass(activeClass)) {
                    e.preventDefault();
                    clearActive(scope);
                    $jQ(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);
                    _click.addClass(activeClass);
                } else if (_click.hasClass(activeClass) && $jQ(scope).attr('id') === 'mls-nav-mobile') {
                    clearActive(scope);
                    $jQ(scope + ' > .tab-content > .tab[tab=' + tab + ']').removeClass(activeClass);
                    _click.removeClass(activeClass);
                }

            });
        }
    },
    /*
     * Navigation Accordion (for mobile view)
     * @element: (string) containing element
     */
    navAccordion: function (element) {
        var scope = element,
            $accordionTabs = $jQ(scope + ' > .tab > a'),
            activeClass = 'active';

        $accordionTabs.on('click', function (e) {
            $jQ(scope + ' > .tab').removeClass(activeClass);
            var $clicked = $jQ(this),
                $acContent = $clicked.next(),
                $wHeight = $jQ(window).outerHeight(),
                $navHeight = $jQ('#nav-mobile-tabs-primary').outerHeight(),
                $acTabHeight = $jQ(scope + ' > .tab').outerHeight();

            if (!$clicked.hasClass(activeClass) && $acContent.hasClass('accordion-content')) {
                e.preventDefault();
                $clicked.addClass(activeClass).parent().addClass(activeClass);
                $acContent.css('height', 'auto');
            } else if ($clicked.hasClass(activeClass) && $acContent.hasClass('accordion-content')) {
                e.preventDefault();
                $clicked.removeClass(activeClass).parent().removeClass(activeClass);
                $acContent.css('height', 0);
            }
        });

        // As part Mobile Enchanements.
	if(isTouch)
        {
            $jQ('#nav-mobile-tabs-primary .nav-actions').on('click', function () {
                if($jQ('#nav-mobile-tab1').hasClass(activeClass)) {
                     $jQ('#nav-mobile-tabs-primary .nav-actions').removeClass(activeClass);
                     $jQ('#nav-mobile-tab1').removeClass(activeClass); 
                }
                else 
                {
                    $jQ('#nav-mobile-tabs-primary .nav-actions').addClass(activeClass);
                    $jQ('#nav-mobile-tab1').addClass(activeClass);    
                }            
            });            
        }
        /*
        $jQ('#nav-mobile-tabs-primary .nav-actions').on('click', function () {
            if ($jQ(this).hasClass(activeClass)) {
                $jQ(this).add('.tab').removeClass(activeClass);
            }
        });
        */
    },
    /*
     * Update Content
     * @container: (string) containing element
     * @data: (string) html data
     */
    updateContent: function (container, data) {
        $jQ(container).html(data);
    },

    tooManyModal: function (clicked){
        var thisModal = $jQ(clicked);
        $jQ(thisModal).fadeIn(300); // fade in
        $jQ(thisModal).find('.lightbox-close,.lightbox-back').click(function(){ // close click
            $jQ(thisModal).fadeOut(300); // fade out
        });
    },

    /*
     * Generic vertical scroll using 3dTransform, attaches new position as data atrribute
     *
     */
    css3Detected: null,
    detectCSS3: function()
    {
        if (MLS.ui.css3Detected !== null) return;

        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        MLS.ui.css3Detected = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    },

    vScroll: function (element, vValue) {
        MLS.ui.detectCSS3();

        if (MLS.ui.css3Detected)
        {
            $jQ(element).css({
                '-webkit-transform': 'translate3d(0,' + vValue + 'px,  0)',
                '-moz-transform' : 'translate3d(0,' + vValue + 'px,  0)',
                '-ms-transform' : 'translate3d(0,' + vValue + 'px,  0)',
                '-o-transform' : 'translate3d(0,' + vValue + 'px,  0)',
                'transform' : 'translate3d(0,' + vValue + 'px,  0)'
            }); // end css
        } else {
            $jQ(element).animate({
                top: vValue
            });
        }

        $jQ(element).attr('data-vpos', vValue);
    },

    /*
     * Generic horizontal slide action using 3dTransform
     *
     */
    hSlide:  function (element, hValue) {
        MLS.ui.detectCSS3();

        if (MLS.ui.css3Detected)
        {
            $jQ(element).css({
                '-webkit-transform': 'translate3d(' + hValue + 'px, 0, 0)',
                '-moz-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
                '-ms-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
                '-o-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
                'transform' : 'translate3d(' + hValue + 'px, 0, 0)'
            }); // end css
        } else {
            $jQ(element).animate({
                left: hValue + $jQ(element).offset().left
            }); // end css
        }
    },

    /*
     * Generic scroll page to certain point
     *
     */
    scrollPgTo: function (whereTo, topPad) {
        if (topPad === undefined) {
            topPadding = 0;
        }
        var moveTo = $jQ(whereTo).offset().top - topPad;
        $jQ('html, body').stop().animate({
            scrollTop: moveTo
        }, 250);
    },
    /*
     * Generic simple accordion for options in checkout, pdp, etc
     *
     */
    simpleAcc: function (control) {
        // change icon
        $jQ(control).find('.icon').toggleClass('close');
        // open/close panel
        $jQ(control).next('.acc-info').slideToggle(300);
    },
    /*
     * Generic dropdown display:
     *  no-touch : hover and no click
     *  touch : touch/click and no hover
     */
    dropdownDisplay: function (c) {
        $jQ(c).each(function() {
            var container = $jQ(this),
                link = $jQ(container).find('.dropdown-link');

            if ($jQ('html').hasClass('no-touch')) {
                $jQ(link).click(function (e) {
                    e.preventDefault();
                });

                $jQ(link).hover(
                    function () {
                        var pannel = $jQ(this).next('.dropdown-panel'),
                            marker = $jQ(this).find(".marker");

                        $jQ(this).parents('section').find('.dropdown-panel').fadeOut(25);

                        if (marker.length > 0)
                        {
                            pannel.css({
                                left: 4 + marker.position().left - pannel.width() / 2
                            });
                        }

                        pannel.fadeIn(200);
                    },

                    function () { 
                        $jQ(this).next('.dropdown-panel').delay(200).fadeOut(200); 
                    }
                );

                $jQ(container).find('.dropdown-panel').hover(
                    function () { 
                        $jQ(this).stop(true).show().css('opacity', 1);
                    },

                    function () { 
                        $jQ(this).fadeOut(300); 
                    }
                );
            } else {
                $jQ(link).click(function (e) {
                    e.preventDefault();
                    $jQ(this).siblings('.dropdown-panel').toggle();
                    // Below lines are added to fix QC# 9706.
                    $jQ('#replace-cart-form').find('.save-avail').removeClass('save-avail');
                    $jQ('#replace-cart-form').find('.dropdown-panel').removeClass('dropdown-panel');
                    $jQ('#replace-cart-form').find('.lightbox-fineprint p').css({'line-height':'1.2', 'font-size':'14px', 'margin-top':'-26px'});
                });
            }
        });
    },
    /*
     *  Lightbox activation for modal states using HTML pattern
     *  established in cart-base.html & CSS in _global.scss
     *
     */
    lightbox : function (clicked) {
        var thisModal = $jQ(clicked).attr('data-modal-id');
        $jQ(thisModal).fadeIn(300); // fade in

        $jQ(thisModal).find('.lightbox-close').click(function () { // close click
            $jQ(thisModal).fadeOut(300); // fade out
        });

    },
    moreLessBlock : function () {
        $jQ('.more-less-block').each(function () {
            var thisHeight = $jQ(this).height();
            if (thisHeight > 280) { // turn on more/less button
                $jQ(this).addClass('bound').removeClass('not-bound');
            } else { // turn off more/less button
                $jQ(this).addClass('not-bound').removeClass('bound');
            }
        });
    },
    resizeSliders: function() {
        $jQ('.lifestyle-tab-content .featured-item .thumbs').each(function() {
            try
            {
                $jQ(this).data('flexslider') && $jQ(this).data('flexslider').setOpts({itemWidth: 41 });
            } catch(e) {
                // nothing
            }
        });

        $jQ('.lifestyle-tab-content .featured-item .focus').each(function() {
            try
            {
                $jQ(this).data('flexslider') && $jQ(this).data('flexslider').setOpts({itemWidth: $jQ('.lifestyle-tab-content .featured-item').width() });
            } catch(e) {
                // nothing
            }
        });
    },
    module: {
        // item = provide narrow scope for elements containing cornerClass and contentClass, cornerClass = class on 'hot corner', contentClass = class on content to be revealed, hoverEl = class for hover (two-step) interaction
        cornerFeature: function (item, cornerEl, contentEl, hoverEl, onShow, onHide) {
            var context;

            $jQ(item).on('mouseenter', function () {
                context = this;
                if (hoverEl !== undefined) {
                    $jQ(cornerEl, context).on('mouseenter', function () {
                        $jQ(hoverEl, context).stop(false, false).animate({
                            opacity: 1
                        }, 'fast');
                    });
                    $jQ(cornerEl, context).on('mouseleave', function () {
                        $jQ(hoverEl, context).stop(false, false).animate({
                            opacity: 0
                        }, 'fast');
                    });
                }
            });

            $jQ(cornerEl, $jQ(item, context)).on('click', function (e) {
                if (context._isVisible === undefined) {
                    context._isVisible = false;
                }

                if (!context._isVisible) {
                    onShow && onShow.apply && onShow();
                    $jQ(contentEl, context).stop(false, false).addClass('active').hide().fadeIn('medium', function () {
                        context._isVisible = true;
                    });
                } else {
                    onHide && onHide.apply && onHide();
                    $jQ(contentEl, context).stop(false, false).removeClass('active').show().fadeOut('medium', function () {
                        context._isVisible = false;
                    });
                }
                e.preventDefault();
            });
        },
        trendingLifestyles: function () {
            var $lifestyleModule = $jQ('.trending-lifestyles-module'),
                $scrollWidth = $lifestyleModule.width() - 170, 
                resizeIcons;

            if ($jQ("html").hasClass("lt-ie9"))
            {
                resizeIcons = function() {
                    $jQ("section.trending-lifestyles-module span.icon").each(function() {
                        $jQ(this).removeAttr('style');
                        var src = $jQ(this).css("background-image").split('"')[1];
                        this.style.background = "none";
                        this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=" + src + ")";
                    });
                };
                resizeIcons();
            }

            $jQ('.lifestyle-tab-content').width($scrollWidth);
            $jQ('.trendingLifestyleSlider').each(function(i, item) {
                var current = 0,
                    items = $jQ(item).find(".trending-products-slides > li"),
                    container = items.eq(0).parent().css({
                        position: 'relative',
                        left: 0
                    }),
                    interval = 1,
                    animating = false,
                    startLeft = 0;

                $jQ(item).flexslider({
                    animation: 'slide',
                    controlsContainer: '.trending-lifestyles-module .slide-nav',
                    selector: '.trending-products-slides > li',
                    animationLoop: true,
                    controlNav: false,
                    directionNav: true,
                    slideshow: false,
                    animationSpeed: 500,
                    itemWidth: 764,
                    touch: false,
                    start: function (slider){
                        (items.length > 1) && items.eq(Math.floor(current)).addClass('flex-active-slide');
                        MLS.common.flexsliderTracking(slider, "Trending Lifestyles");
                    }
                });

                $jQ(item).data('flexslider', null);

                $jQ(item).find(".flex-direction-nav .flex-prev, .flex-direction-nav .flex-next").unbind("click mouseup touchstart touchend").click(function() {
                    if (R.band(0, 1023))
                    {
                        interval = .5;
                    } else {
                        interval = 1;
                        current = Math.floor(current);
                    }

                    if ($jQ(this).hasClass("flex-prev"))
                    {
                        current = (current - interval);
                        if (current < 0) current += items.length;
                    } else {
                        current = (current + interval);
                        if (current >= items.length) current -= items.length;
                    }

                    container.stop(true,false).animate({
                        left: -items.eq(Math.floor(current)).position().left - (Math.floor(current) != current ? 510 : 0)
                    });

                    items.removeClass('flex-active-slide');
                    (items.length > 1) && items.eq(Math.ceil(current)).addClass('flex-active-slide');

                    return false;
                });

                var startX = null,
                    startY = null,
                    dx = null,
                    startT;

                function onTouchMove(e) {
                    dx = startX - (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX);
                    scrolling = (Math.abs(dx) < Math.abs((e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY) - startY));

                    if (!scrolling)
                    {
                        e.preventDefault();

                        container.css({
                            left: startLeft - dx
                        });
                    }
                }

                function onTouchEnd() {
                    // finish the touch by undoing the touch session
                    container.unbind('touchmove', onTouchMove);
                    container.unbind('touchend touchcancel', onTouchEnd);

                    if (R.band(0, 1023))
                    {
                        interval = .5;
                    } else {
                        interval = 1;
                        current = Math.floor(current);
                    }

                    if (Math.abs(dx) > 50 && (Number(new Date()) - startT > 550))
                    {
                        if (Math.abs(dx) > (Math.floor(current) != current ? 510 : 254) / 2)
                        {
                            if (dx < 0)
                            {
                                current = (current - interval);
                                if (current < 0) current += items.length;
                            } else {
                                current = (current + interval);
                                if (current >= items.length) current -= items.length;
                            }
                        }
                    }

                    container.stop(true,false).animate({
                        left: -items.eq(Math.floor(current)).position().left - (Math.floor(current) != current ? 510 : 0)
                    });

                    items.removeClass('flex-active-slide');
                    (items.length > 1) && items.eq(Math.ceil(current)).addClass('flex-active-slide');

                    startX = null;
                    startY = null;
                    dx = null;
                }

                container.bind("touchstart", function(e) {
                    startT = Number(new Date());

                    if ($jQ(e.target).hasClass("featured-item") || $jQ(e.target).parents(".featured-item").length > 0)
                    {
                        return;
                    }

                    e = e.originalEvent;

                    if (!e.touches || e.touches.length === 1) {
                        startLeft = parseInt(container.css('left') || "0");
                        startX = !e.touches ? e.pageX : e.touches[0].pageX;
                        startY = !e.touches ? e.pageY : e.touches[0].pageY;

                        container.bind('mousemove touchmove', onTouchMove);
                        container.bind('mouseup touchend touchcancel', onTouchEnd);
                    }
                });
            });

            var tl = $jQ('.trending-lifestyles-module'),
                tlh = tl.find('.content-header'),
                ta = tl.find('.flex-direction-nav'),
                tc = tl.find(".tab-content"),
                f = function() {
                    if (tl.length > 0 && tc.length > 0)
                    {
                        ta.css({
                            left: tlh.offset().left + tlh.width() - (tc.offset().left || 0) - ta.width()
                        });
                    }
                };

            f();

            $jQ(window).resize(function () {
                $jQ('.lifestyle-tab-content').width($jQ('#site-container').width() - 170);
                f();
            });

            $jQ('.section-tabs a', '.trending-lifestyles-module').on('click', function (e) {
                e.preventDefault();
                var setTab = $jQ(this).attr('href');
                $jQ('.section-tabs .tab', '.trending-lifestyles-module').removeClass('active');
                $jQ(this).parent().addClass('active');
                $jQ('.tab-content', '.lifestyle-tab-content').removeClass('active');
                $jQ(setTab).addClass('active');
                // reset lazyloader
                $jQ(window).scroll();

                if ($jQ("html").hasClass("lt-ie9"))
                {
                    resizeIcons();
                }
            });

            $jQ('.lifestyle-tab-content .featured-item').each(function() {
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

            $jQ(window).resize(MLS.ui.resizeSliders);

            $jQ('.lifestyle-tab-content').find('.content-cta').on('click', function(e){
                e.preventDefault();
                $jQ(this).parents('.featured-tile').find('.details').toggleClass('hide');
            });

        },
        trendingProducts: function () {
            var $trendingProductsModule = $jQ('.trending-products-module'), tout = null,
            setSliderWidth = function() {
                var target = $trendingProductsModule.find('.tabs-content > li:visible');

                target.data('flexslider') && target.data('flexslider').setOpts({
                    itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.80 : $jQ(window).outerWidth()),
                });
            }, resizeSlider = function() {
                if (tout != null)
                {
                    clearTimeout(tout);
                    tout = null;
                }

                setSliderWidth();
                tout = setTimeout(setSliderWidth, 100);
            };

            $jQ('dd', '#detail-tabs').on('click', function (e) {
                e.preventDefault();
                var tab = $jQ(this).find('a').attr('href'),
                    module = $jQ('.trending-products-module .tabs-content'),
                    target = module.find(tab);

                $jQ('dd', '#detail-tabs').removeClass('active');
                $jQ(this).addClass('active');

                module.children().removeClass('active');
                target.addClass('active');
                MLS.common.forceLazyLoad($trendingProductsModule);

                resizeSlider();
            });

            $trendingProductsModule.length > 0 && $jQ(window).resize(resizeSlider);

            $trendingProductsModule.length > 0 && $trendingProductsModule.find('.tabs-content > li').flexslider({
                useCSS: false,
                animation: 'slide',
                controlsContainer: '.trending-products-module .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.80 : $jQ(window).outerWidth()),
                start: function(container) {
                    MLS.common.flexsliderTracking(container, "Related Stories & Guides");
                }
            });
        },

        featuredReviews: function () {
            var $featuredReviewsModule = $jQ('.featured-reviews-module');
            //select random color for each item entry
            var colorArray = ['green', 'yellow', 'blue', 'red', 'purple', 'charcoal'];
            $featuredReviewsModule.find('.product-img').each(function () {
                var color = Math.floor((Math.random() * colorArray.length));
                $jQ(this).addClass(colorArray[color]);
            });
        },

        madlib: {
            selectedDevice: "",

            init: function () {
                //Generic Typeahead
                var length = 0, timeout = null, error = $jQ("#device-not-found"), md = $jQ('#madlib-device'), scroll = function() {
                    var m = this.$menu;
                    
                    if(!m.is(":visible"))
                    {
                        return;
                    }

                    // scrollbar when too many (5+) items returned
                    if (length < 5)
                    {
                        m.children(".viewport").css({
                            height: m.find(".viewport > .overview").eq(0).height()
                        });
                    } else {
                        m.children(".viewport").removeAttr("style");
                    }
                    
                    if (m.data('tsb')) {
                        m.tinyscrollbar_update(0);
                    } else {
                        m.parent().addClass('device-scroll');
                        m.find('.tt-dataset-devices').addClass('viewport').children('.tt-suggestions').addClass('overview');
                        m.append('<div class="scrollbar"><div class="track"><div class="thumb"><div class="container"><div class="end"></div><div class="bottom"></div></div></div></div></div>');
                        m.tinyscrollbar({
                            size: 290
                        });
                    }
                };

                if (md.length == 0)
                {
                    return;
                }

                $jQ.ajaxSetup({
                    success: function(r) {
                        length = r ? r.length : 0;

                        if (r && r.length == 0)
                        {
                            error.css({
                                left: $jQ("#madlib-device").offset().left - $jQ("#site-container").offset().left,
                                top: 230
                            }).fadeIn().find(".tooltip-close").unbind('click').click(function() {
                                error.fadeOut();
                                return false;
                            });

                            if (timeout != null)
                            {
                                clearTimeout(timeout);
                                timeout = null;
                            }

                            timeout = setTimeout(function() {
                                error.fadeOut();
                                timeout = null;
                            }, 4000);
                        } else {
                            error.hide();
                        }
                    }
                });

                md.typeahead({
                    name: 'devices',
                    remote: MLS.ajax.endpoints.SEARCH_DEVICES + "?Ntk=product.displayName&Ntt=%QUERY*"
                }).on('change keyup typeahead:selected typeahead:closed', function (e, item) {
                    if (e.type === 'typeahead:closed') {
                        $jQ(this).blur();
                        typeof sitecatParam == 'function' && sitecatParam($jQ(this).val(), 'My Mobile Life');
                    }

                    if (e.type === 'typeahead:selected') {
                        var letter = item.value.substr(0,1).toLowerCase();

                        $jQ(this).parent().prev(".plural").remove();
                        if (letter == "a" || letter == "e" || letter == "i" || letter == "o" || letter == "u")
                        {
                            $jQ(this).parent().before("<span class='plural' style='display: inline-block; margin-left: -7px;'>n&nbsp;</span>");
                        }

                        MLS.ui.module.madlib.selectedDevice = item.id;
                        MLS.ui.module.madlib.truncatedName();
                        MLS.ui.module.madlib.searchProducts();
                    }

                    if (e.type === 'keyup') {
                        if ($jQ(this).val() === 'enter device' || $jQ(this).val() === '') {
                            $jQ(this).stop().animate({
                                width: 173
                            }, 100);
                        } else if ($jQ(this).val().length <= 20) {
                            if ($jQ(this).val().length > 3) {
                                $jQ(this).stop().animate({
                                    width: $jQ(this).val().length * 17
                                }, 100);
                            }
                        }
                    }
                });

                md.data('ttView').dropdownView.on('suggestionsRendered', scroll);

                // typeahead lib bug: it's not setting limit from the initializer options, so we need to manually change it (ugly!)
                md.data('ttView').datasets[0].limit = 999;

                $jQ('#madlib-select').customSelectMenu({
                    menuClass: 'madlib-select',
                    openedClass: 'open',
                    selectedClass: 'active',
                    selectionMadeClass: 'selected'
                }).on('change', MLS.ui.module.madlib.searchProducts);

                $jQ(window).on('resize', MLS.ui.module.madlib.truncatedName);
            },

            truncatedName: function () {
                var $input = $jQ('#madlib-device');
                    originalName = $input.val(),
                    truncatedName = originalName,
                    nameLength = originalName.length,
                    nameLimit = 19;

                if ($jQ(window).width() < 950)
                    nameLimit = 10;

                if ( nameLength > nameLimit )
                    truncatedName = originalName.substring(0, nameLimit) + '...';

                $jQ('#madlib-device')
                    .val(truncatedName)
                    .stop()
                    .css({
                        width: $input.val().length > 0 ? ($input.val().length * 17) : 173
                    }, 100);



            },

            searchProducts: function () {
                var data = $jQ('#madlib-select input').val(),
                    navStates = MLS.ui.module.madlib.selectedDevice.split('?'),
                    deviceNavState = navStates[0],
                    ajaxData = "";

                data = deviceNavState + data;
                data = data.replace('?','&');
                ajaxData = data;

                if(data == null || data == '' || data == undefined) {
                    data = 'N=0';
                    ajaxData = '';
                }

            }
        },
        newMadlib: {
            init: function () {
                jQuery(".populate").select2({ 
                    allowClear: true 
                });
                if ($jQ('#homePageCompatibility').length > 0) {
                    var url_temp = "/${{category}}/${{device}}",
                        devUrlStr = "", 
                        catUrlStr = "allproducts";

                    if (!isTouch || $jQ(window).width() >= 768) {
                         MLS.homeCompatibility.init({
                            endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                            container: $jQ('#home-page'),
                            results: $jQ('#home-page'),
                            callback: function(e){
                                e.preventDefault();
                                $jQ('#home-page').css('display', 'none');
                                $jQ('#uniform-device span').html($jQ(this).attr("title"));
                                if(Modernizr && Modernizr.ie8compat) {
                                    devUrlStr = $jQ(this).attr("href").replace($jQ('#pageContextPath').val(), '');
                                }
                                else {
                                    devUrlStr = $jQ(this).attr("href");
                                }
                            }

                         });   
                    }
                    else {
                        /* mobile compatibility filter */
                        MLS.compatibility.init({
                            endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                            container: $jQ('.compatibility', '.filter-panels'),
                            results: $jQ('.compatibility .compat-results', '.filter-panels'),
                            callback: $jQ("body").hasClass("category-landing-page") ? null : pub.facetClick
                        }); 
                    }

                    jQuery("#device").select2();
                    jQuery("#category").select2();
                    jQuery('#viewCompBtn').prop('disabled', true);
                    jQuery('#category').prop('disabled', true);
                    if($jQ('#selectedPhoneDetails').length != 0) {
                        var homeDevice = unescape(jQuery('#deviceTextSessionAttr').val());
                        $jQ('#selectedPhoneDetails').find('h5').html(homeDevice);
                        $jQ('#category').select2("enable", true);
                        $jQ('#viewCompBtn').removeClass("disabled").css('cursor', 'pointer').prop('disabled', false).select2("enable", true);
                        $jQ('#viewCompBtn').on('click', function(){
                            var path = $jQ('#pageContextPath').val(),
                            deviceUrl = $jQ('#deviceSessionAttr').val(),
                            categoryUrl = $jQ('#category').val();
                            $jQ('#viewCompBtn').attr("href", path + "/" + categoryUrl + "/");
                        })
                        jQuery('#category').click(function() {
                            jQuery('#viewCompBtn').on('click', function(){
                                var path = jQuery('#pageContextPath').val(),
                                deviceUrl = jQuery('#deviceSessionAttr').val(),
                                categoryUrl = jQuery('#category').val();
                                jQuery('#viewCompBtn').attr("href", path + "/" + categoryUrl + "/");
                            });
                        });
                    }
                    
                    //$jQ('#viewCompBtn').attr("href", $jQ('#pageContextPath').val() + url_temp.replace("${{device}}", devUrlStr).replace("${{category}}", catUrlStr).replace('//', '/')).css("cursor","pointer");

                    jQuery("#brand").click(function() {
						jQuery('#s2id_device .select2-choice').children().first().html("Select Phone/Tablet");
                        jQuery('#device').select2("enable", true);
                        jQuery('#category').select2("enable", false);
                        //jQuery('#viewCompBtn').removeClass("disabled").css('cursor', 'pointer').prop('disabled', false);
                        jQuery('#viewCompBtn').on('click', function(){
                            var path = "#",
                            deviceUrl = jQuery('#device').val(),
                            deviceUrl = deviceUrl.replace('/allproducts', '');
                            categoryUrl = jQuery('#category').val();
                            //categoryUrl = categoryUrl.replace('All Category', 'allproducts');
                            deviceUrl = deviceUrl.replace('Select Phone/Tablet', '');
                            jQuery('#viewCompBtn').attr("href", path);
                        })                        
                    });

                    jQuery('#device').click(function() {
                        jQuery('#category').prop('disabled', false);
                        jQuery('#category').select2("enable", true);
                        jQuery('#viewCompBtn').removeClass("disabled").css('cursor', 'pointer').prop('disabled', false);
                        jQuery('#viewCompBtn').on('click', function(){
                            var path = jQuery('#pageContextPath').val(),
                            deviceUrl = jQuery('#device').val(),
                            categoryUrl = jQuery('#category').val();
                            deviceUrl = deviceUrl.replace('allproducts', categoryUrl);
                            //categoryUrl = categoryUrl.replace('All Category', 'allproducts');
                            deviceUrl = deviceUrl.replace('Select Phone/Tablet', '');
                            jQuery('#viewCompBtn').attr("href", deviceUrl);
                        });
                    })
                    if($jQ('#selectedPhoneDetails').length = 0) {
                    jQuery('#category').click(function() {
                        jQuery('#viewCompBtn').prop('disabled', false);
                        jQuery('#viewCompBtn').removeClass("disabled").css('cursor', 'pointer').prop('disabled', false);
                        jQuery('#viewCompBtn').on('click', function(){
                            var path = jQuery('#pageContextPath').val(),
                            deviceUrl = jQuery('#device').val(),
                            categoryUrl = jQuery('#category').val();
                            deviceUrl = deviceUrl.replace('allproducts', categoryUrl);
                            //categoryUrl = categoryUrl.replace('All Category', 'allproducts');
                            deviceUrl = deviceUrl.replace('Select Phone/Tablet', '');
                            jQuery('#viewCompBtn').attr("href", deviceUrl);
                        });
                    });
                    }

                }
                else {
                    //$jQ('#category').select2();
                    console.log("In old home page");
                    var url_temp = "/${{category}}/${{device}}",
                        devUrlStr = "",
                        catUrlStr = "allproducts";
                    //if (!isTouch || $jQ(window).width() >= 768) {
                    //    MLS.compatibility.init({
                    //       endpoint: '/browse/ajax/devicesTypeAhead.jsp',
                    //        container: $jQ('#home-page'),
                    //        results: $jQ('#home-page .tt-dropdown-menu'),
                    //        callback: function(e){
                    //            e.preventDefault();
                    //            $jQ('#home-page .tt-dropdown-menu').css('display', 'none');
                    //            devUrlStr = $jQ('#tt-suggestion').val();
                    //            $jQ('#viewCompBtn').attr("href", $jQ('#pageContextPath').val() + url_temp.replace("${{device}}", devUrlStr).replace("${{category}}", catUrlStr).replace('//', '/')).css("cursor","pointer");

                    //        }
                    //    });
                    //} else {
                    //    /* mobile compatibility filter */
                    //    MLS.compatibility.init({
                    //        endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                    //        container: $jQ('.compatibility', '.filter-panels'),
                    //        results: $jQ('.compatibility .compat-results', '.filter-panels'),
                    //        callback: $jQ("body").hasClass("category-landing-page") ? null : pub.facetClick
                    //    });
                    //}
                    /*
                    $jQ('#home-page').find('#temp select').uniform();
                    $jQ('#temp').children().appendTo('.compatibility-filter');
                    $jQ('#uniform-brand').children().first().addClass('active');

                    $jQ("#brand").change(function() {
                        jQuery('#device').prop('disabled', false).css("cursor", "pointer");
                        jQuery('#uniform-device').children().first().addClass('active');

                        jQuery('#device').click(function(){
                            if(jQuery('#home-page .compat-results').css('display')=='none'){
                                $jQ('#home-page .compat-results').css('display', 'block');
                                $jQ('#home-page .compat-results .items').attr("tabindex",-1).focus();
                            } else {
                                $jQ('#home-page .compat-results').css('display', 'none');
                            }
                            $jQ('#uniform-device span').html("Select Device");
                        });
                        $jQ('#uniform-category span').html($jQ('#category option')[0].text);
                        $jQ('#uniform-device span').html("Select Device");
                        $jQ('select#device option').text('');
                    });

                    $jQ(document).on("click", ".compat-results a.product-link", function(){
                        jQuery('#category').prop('disabled', false).css("cursor", "pointer");
                        jQuery('#uniform-category').children().first().addClass('active');
                    });
                    */
                    console.log($jQ('#madlib-device + span').html($jQ(this).attr("title")));
                    console.log($jQ('#madlib-device').html($jQ(this).attr("id")));
                    console.log($jQ('#tt-selections').find('option:selected').text());

                    $jQ(document).on("click", ".tt-suggestion", function() {

                        //if(success.hasOwnProperty("id")) {
                        //  devUrlStr =
                        //}
                        //JQ.get('.tt-suggestion').alert("pkp");
                        //devUrlStr = $jQ.get('id').text();
                        //var test = $jQ.get('browse/ajax/devicesTypeAhead.jsp', function(data) { alert("Data: "+data); });
                        //$JQ('#tt-selection').get('browse/ajax/devicesTypeAhead.jsp' ,null, function(responseText) { alert("Response:\n" +"pkp-stw"); }) ;
                        devUrlStr = MLS.ui.module.madlib.selectedDevice;
                        devUrlStrStrip = devUrlStr.replace("/","");

                        console.log("Inside the click function");

                        $jQ.ajax({
                            url: mls_context + "/common/setDeviceAttribute.jsp?deviceValAttrParam=" + devUrlStrStrip + "&deviceTextAttrParam=" + $jQ('#madlib-device').val(),
                            cache: false,
                            dataType: "html",
                            success: function(d) {
                                console.log(d);
                            }
                        });

                        //devUrlStr = $jQ('#madlib-device').val();
                        //var test1 = $jQ('#tt-selections').find('option:selected').val();
                        //alert("Response:\n" +pkp1);
                        $jQ('#viewCompBtn').attr("href", $jQ('#pageContextPath').val() + url_temp.replace("${{device}}", devUrlStr).replace("${{category}}", catUrlStr).replace('//', '/'));
                    });
                    $jQ('#category').change(function(){
                        catUrlStr = $jQ('#category :selected').val();
                        $jQ('#viewCompBtn').attr("href", $jQ('#pageContextPath').val() + url_temp.replace("${{device}}", devUrlStr).replace("${{category}}", catUrlStr).replace('//', '/')).css("cursor","pointer").removeClass('disabled');
                    });
                }
            },
            
            clearHomeSelect: function(){
                if ($jQ('#selectedPhoneDetails').length != 0) {
                    window.setTimeout(function(){
                        $jQ('#selectedPhoneDetails').hide();
                    }, 100)
                    $jQ('#brandselector, #deviceselector').delay( 200 ).fadeIn( 200 );
                    jQuery("#device").select2();
                    jQuery("#category").select2();
                    jQuery('#s2id_brand .select2-choice').children().first().html(jQuery('#brand option')[0].text);
                    jQuery('#s2id_device .select2-choice').children().first().html("Select Phone/Tablet");
                    jQuery('#s2id_category .select2-choice').children().first().html(jQuery('#category option')[0].text);
                    jQuery('#device').select2("enable", false);
                    jQuery('#category').select2("enable", false);
                    jQuery('#viewCompBtn').addClass("disabled").css('cursor', 'not-allowed');
                    jQuery('#category').prop("disabled", true);
                } else {    
                    jQuery('#s2id_brand .select2-choice').children().first().html(jQuery('#brand option')[0].text);
                    jQuery('#s2id_device .select2-choice').children().first().html("Select Phone/Tablet");
                    jQuery('#s2id_category .select2-choice').children().first().html(jQuery('#category option')[0].text);
                    jQuery('#device').select2("enable", false);
                    jQuery('#category').select2("enable", false);
                    jQuery('#viewCompBtn').addClass("disabled").css('cursor', 'not-allowed');    
                }
            }
        }       
    }
}
