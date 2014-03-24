MLS.checkout = {
    email: null,
    truncEmail: null,
    options: { // minicart options
        disableFlyout: true
    },

    /* disabled: requirement on hold
    updateShippingOptions: function(zipcode) {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.CHECKOUT_SHIPPING_OPTIONS,

            {
                zipcode: zipcode
            },

            function(r) {
                if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                    return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true);
                }

                $jQ(".shipping-option-radios").html(r.success.responseHTML).find("input[name=shipRadio]").click(MLS.checkout.selectShippingOption);

                $jQ('.shipping-option-radios .checkout-dropdown').each(function(){
                    MLS.ui.dropdownDisplay(this);
                });
            }
        );
    },
    */

    /* disabled: requirement on hold
    selectShippingOption: function() {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.CHECKOUT_SELECT_SHIPPING,

            {
                 shipping: $jQ(".shipping-option-radios input[name=shipRadio]:checked").val()
            },

            function(r) {
                if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                    return MLS.modal.open(r.error ? r.error.responseHTML : null);
                }

                MLS.checkout.update(r);
            }
        );
    },
    */

    /* PA INTRODUCED CODE: not sure if it's needed anymore */
    hideStepinfoSummary: function () {
        if ($jQ(".bill-card").hasClass("checked") && $jQ('#choose-new-card').attr('checked')=='checked') {
            $jQ('#billing-info').find('.step-info-summary.billing-address').addClass('hidden').hide();
        } else {
            $jQ('.new-billing-info-form').addClass('hidden').hide();
        }
    },

    // EDIT VALIDATED INFO BUTTON (after next-step click)
    editStepCallback: function(e)
    {
        var $step = $jQ(this).parents('.checkout-step');
        $step.parent().siblings("div, form").find('.checkout-step').find('.hide-complete').each(function() { // close open input & open its summary
            $jQ(this).not('hidden').addClass('hidden').hide().siblings('.step-info-summary').not('.blank').removeClass('hidden').show();
        });
        $jQ(this).parents('.step-info-summary').addClass('hidden').hide(); // close this panel's summary next

        // show this panel's inputs & buttons
        $step.find('.hide-complete').removeClass('hidden').show();

        // if step 2
        if ($jQ(this).hasClass('edit-billing')) {
            $jQ('.new-billing-info-form, .billing-detail-content.details-card').find('.checkout-input').removeClass('not'); // make fields validate-able again

            $jQ('.sidebar-finish').removeClass('on'); // reverse side bar changes
            $jQ('.checkout-accordion.sidebar').find('.acc-info').css('display', 'none');
            $jQ('#card-code-saved, #card-code').removeClass("valid").val(""); // require CVV to be re-validated
            $jQ('#card-code-saved, #card-code').siblings("label.error").addClass('hidden').hide();

            if (!$jQ("#bill-to-account").is(":checked"))
            {
                // $jQ("#saved-info-edit").addClass('hidden').hide();
                if ($jQ("#choose-saved-card").is(":checked"))
                {
                    $jQ(".step-info-summary.billing-address").addClass('hidden').hide();
                } else {
                    $jQ('.new-billing-info-form').removeClass('hidden').show();
                }
            } else {
                $jQ(".step-info-summary.billing-address").addClass('hidden').hide();
            }

            /*
            $infoform
                .addClass('hidden').hide()
                .removeAttr("style")
                .siblings(".step-info-summary.billing-address")
                    .removeClass('hidden').show()
                    .removeAttr("style"); // hide form so edit button in summary works
            */


            /*
            if ($jQ('#bill-to-account').is(':checked')) { // IF account hide billing summary for pay with account
                $step.find('.step-info-summary.billing-address').addClass('hidden').hide();
            }
            */
        }

        // last, scroll page to top of re-opened section
        MLS.ui.scrollPgTo($step, 7);
    },

    initEditStep: function() {
        $jQ('.edit-checkout-step').not('#saved-info-edit').unbind("click", this.editStepCallback).click(this.editStepCallback);
    },

    editBillingCallback: function() {
        $jQ(this).parents('.billing-address').slideToggle(300).next('.billing-address').slideToggle(300);

        if ($jQ("#same-as-shipping").is(":checked"))
        {
            $jQ("#same-as-shipping").click().click();
        }
    },

    dropdownValidationEnhancement: function() {
        $jQ(this).parents('.selector').removeClass('error-style').find('span').removeClass('select-placeholder').find('.select-error-message').remove();
    },

    initDropdowns: function() {
        // enhance initial uniform.js select style
        $jQ('#checkout-sequence .selector').find('span').addClass('select-placeholder');

        // enhance uniform.js select performance
        $jQ('#checkout-sequence .selector').find('select').unbind('change', this.dropdownValidationEnhancement).change(this.dropdownValidationEnhancement);
    },

    checkoutModals: function(){
        // detail ship
        $jQ('.detail-link-ship').unbind('click').click(function(e) {
            e.preventDefault();
            $jQ('#detailShip .lightbox-close').remove();
            MLS.modal.open($jQ('#detailShip .lightbox-info-block').html(), false, true, true);
        });

        $jQ('.detail-link-return').unbind('click').click(function(e) {
            e.preventDefault();
            $jQ('#detailReturn .lightbox-close').remove();
            MLS.modal.open($jQ('#detailReturn .lightbox-info-block').html(), false, true, true);
        });

    	$jQ('.free-checkout-link-ship').unbind('click').click(function(e) {
            e.preventDefault();
    	    $jQ('#freeCheckoutShip .lightbox-close').remove();
    	    MLS.modal.open($jQ('#freeCheckoutShip .lightbox-info-block').html(), false, true, true);
    	});

    	$jQ('.free-checkout-foot-link-ship').unbind('click').click(function(e) {
            e.preventDefault();
    	    $jQ('#freeCheckoutFootShip .lightbox-close').remove();
    	    MLS.modal.open($jQ('#freeCheckoutShip .lightbox-info-block').html(), false, true, true);
    	});
    },

    signatureShipping: function() {
        $jQ('.shipping-option-radios .form-input-wrap input:checked').parent().find('.signatureText').show();
        $jQ('.shipping-option-radios .form-input-wrap input').on("change", function(){
            $jQ('.signatureText').hide();
            if($jQ(this).is(':checked')){
                $jQ(this).parent().find('.signatureText').show();
            } 
        });
    },

    init : function() {
        // don't trigger the first minicart update
        MLS.miniCart.started = true;

        // adding to remove nav-bar stickiness only on checkout page
        !isTouch && $jQ(window).scroll(function() {
            $jQ('#mls-nav').removeClass('fixed');
        });

        /* disabled: featured removed from batch 3
        $jQ('select[name=final-qty]').change(function() {
            MLS.miniCart.updateItem(
                $jQ(this).data("cart-id"), // id
                null, // size (null = do not change)
                null, // color (null = do not change)
                $jQ(this).val()
            );
        });
        */

        /* not enough space for sticky summary
        $jQ(window).bind('scroll resize', function() {
            var $e = $jQ("#checkout-sidebar"),
                $p = $e.parent(),
                $w = $jQ(window);

            if ($w.scrollTop() >= $p.offset().top - 45 && $jQ(window).width() >= 945)
            {
                $e.removeAttr("style");
                $e.css({
                    width: $e.width(),
                    top: 45,
                    right: 'auto',
                    left: $e.offset().left,
                    position: 'fixed'
                });
            } else {
                $e.removeAttr("style");
            }
        });
        */

        // ONLOAD ...............................................................................
        var pgWidth = document.body.clientWidth; // get page width

        // COMMON (cart, minicart & checkout)
        MLS.checkout.vzwValidationRules(); // add methods to all validations
        $jQ("input:checkbox, select.checkout-input, select.cart-revise-qty,  .cart-item-qty").uniform(); // style form elements

        MLS.ui.dropdownDisplay($jQ('.checkout-dropdown'));
        /*
        $jQ('.checkout-dropdown').each(function(){ // display rules for inline dropdowns
            MLS.ui.dropdownDisplay(this);
        });
        */

        MLS.ui.dropdownDisplay($jQ('.special-offer-block'));
        /*
        $jQ('.special-offer-block').each(function(container){ // display rules for offer dropdowns
            if ($jQ('html').hasClass('no-touch')) {
                var link = $jQ(container).find('.dropdown-link');
                $jQ(link).click(function (e) {
                    e.preventDefault();
                });
                $jQ(link).hover(
                    function () {
                        $jQ(this).parents('section').find('.dropdown-panel').fadeOut(25);
                        $jQ(this).next('.dropdown-panel').fadeIn(200);
                    },
                    function () { $jQ(this).next('.dropdown-panel').delay(200).fadeOut(200); }
                );
                
                link.siblings('.dropdown-panel').hover(
                    function () { $jQ(this).stop().removeClass('hidden').show(); },
                    function () { $jQ(this).fadeOut(300); }
                );
            } else {
                $jQ(link).click(function (e) {
                    e.preventDefault();
                    $jQ(this).siblings('.dropdown-panel').toggle();
                });
            }
        });
        */

        // CHECKOUT only
        // MLS.checkout.beginCheckoutValidation();
        MLS.checkout.mainCheckoutValidation();
	   MLS.checkout.sidebarOrderButton();

        // MLS.checkout.checkoutSidebarScroll(pgWidth); // set scrolling
        MLS.checkout.smallScreenContent(); // prepare small device content
        MLS.checkout.initDropdowns();
    //  ........................................................................END ONLOAD

    // CHECKOUT EVENTS ........................................................................
        /* disabled: requirement on hold
        $jQ("#checkout-ship-zip").keyup(function(e) {
            if ($jQ(this).val().length == 5)
            {
                // assume valid zipcode
                MLS.checkout.updateShippingOptions($jQ(this).val());
            }
        });
        */

        // checkout sidebar special offer
        $jQ('#checkout-sidebar').find('.special-offer-block').each(function(){
            MLS.ui.dropdownDisplay(this);
        });

        $jQ('.save-cart-link, .privacy-policy-link, .return-policy-link').click(function(){
            MLS.ui.lightbox(this);
        });



        // checkout accordions
        MLS.checkout.initDiscounts();

        $jQ('#checkout-where-to-ship').change(function(){ // main checkout sequence : step 1, home/business select
            /*$jQ(this).parents('.step-info-block').find('#destination').children().each(function(){
                if ( $jQ(this).hasClass('not') ) {
                    $jQ(this).removeClass('not');
                    $jQ(this).find('.checkout-input').removeClass('not');
                } else {
                    $jQ(this).addClass('not');
                    $jQ(this).find('.checkout-input').addClass('not');
                }
            });*/

            /* code introduced by PA */
            var fname = $jQ(this).parents('.step-info-block').find('#checkout-ship-first-name').parent('.form-input-wrap'),
                lname = $jQ(this).parents('.step-info-block').find('#checkout-ship-last-name').parent('.form-input-wrap'),
                residenceAddressType = $jQ(this).parents('.step-info-block').find('#checkout-residence-addressType'),
                fnrules = MLS.checkout.validationRules.checkoutFirstName,
                lnrules = MLS.checkout.validationRules.checkoutLastName,
                iptfn = $jQ("[name=checkoutFirstName]"),
                iptln = $jQ("[name=checkoutLastName]");

            if ($jQ(this).val() == 'business') {
                fname.children('label:eq(0)').text('Company');
                fname.children('input').removeClass('hasPlaceholder').attr('placeholder', 'Company Name').val("").change();
                lname.children('label:eq(0)').text('C/O');
                lname.children('input').removeClass('hasPlaceholder').attr('placeholder', 'Name').val("").change();
                residenceAddressType.val('C');

                fnrules = MLS.checkout.validationRules.checkoutCompany;
                lnrules = MLS.checkout.validationRules.checkoutCO;

                fnrules.messages = MLS.checkout.validationMessages.checkoutCompany;
                lnrules.messages = MLS.checkout.validationMessages.checkoutCO;
            } else {
                fname.children('label:eq(0)').text('First Name');
                fname.children('input').removeClass('hasPlaceholder').attr('placeholder', 'First Name').val("").change();
                lname.children('label:eq(0)').text('Last Name');
                lname.children('input').removeClass('hasPlaceholder').attr('placeholder', 'Last Name').val("").change();
                residenceAddressType.val('R');

                fnrules.messages = MLS.checkout.validationMessages.checkoutFirstName;
                lnrules.messages = MLS.checkout.validationMessages.checkoutLastName;
            }

            iptfn.rules("remove");
            iptfn.rules("add", fnrules);
            iptfn.rules("remove", "messages");
            iptln.rules("remove");
            iptln.rules("add", lnrules);
            iptln.rules("remove", "messages");

            // MLS.checkout.validationMessages.checkoutFirstName = MLS.checkout.validationMessages.checkoutCompany;
            // MLS.checkout.validationMessages.checkoutCompany = _tmp;
        });

        MLS.checkout.stepTwoSequence(); // card & billing decisions

        MLS.checkout.giftCardSequence();   // discount code & giftcards

        MLS.checkout.nextStepSequence(); // next step button for steps 1 & 2

        MLS.checkout.initEditStep(); // 'edit step' button after a step has been completed

        // if BTA is selected, disable gift card
        MLS.checkout.initGiftCard();
    //............................................................................... END CHECKOUT EVENTS
        MLS.checkout.initSummaryTooltip();
        // Checkout Modals
        MLS.checkout.checkoutModals();
        // Show / Hide of signature text on shipping options.
        MLS.checkout.signatureShipping();

        if ($jQ("#confirm-order .step-info-block").is(":visible"))
        {
            MLS.checkout.toggleMobileCheckout();
        }

        if($jQ("html").hasClass("touch"))
        {
            $jQ('#mobile-checkout-summary .acc-control .icon').removeClass('close');
        }
    }, // end init

    appliedGiftCards: 0,

    disabledCallback: function(e)
    {
        e.preventDefault();
        $jQ(e.target).blur();
        return false;
    },


    checkBTATabs: function() {
        var $billing = $jQ("#vzn-checkout-billing");

        if (MLS.checkout.appliedGiftCards <= 0)
        {
            // enable tab
            $billing.find(".bill-account").removeClass("disabled");
        } else {
            // disable tab
            $billing.find(".bill-account").addClass("disabled");
        }
         
        
    },

    vzwValidationRules : function() { // ALL VALIDATION add these methods.................... BEGIN FUNCTIONS ...................
        $jQ.validator.addMethod("phoneUS", function(phone_number, element) { // phone number format
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
        }, "Please specify a valid phone number");

        $jQ.validator.addMethod("zipcodeUS", function(value, element) {
            return this.optional(element) || /^\d{5}-\d{4}$|^\d{5}$/.test(value);
        }, "Please enter your 5-digit zip code");

        $jQ.validator.addMethod("alphanumeric", function(value, element) {
            return this.optional(element) || /^([a-zA-Z0-9]+)$/.test(value);
        }, "Please enter a valid card number");

        $jQ.validator.addMethod("alphanumericExtended", function(value, element) {
            return this.optional(element) || /^([a-zA-Z0-9 _\-\.\']+)$/.test(value);
        }, "Please enter a valid value");

        $jQ.validator.addMethod("address", function(value, element) {
            return this.optional(element) || /^([a-zA-Z0-9 _\-\.\'#]+)$/.test(value);
        }, "Please enter a valid address");

        $jQ.validator.addMethod("alphaExtended", function(value, element) {
            return this.optional(element) || /^([A-Za-z _\-\.\'])+$/.test(value);
        }, "Please enter a valid alphabetic string");

        $jQ.validator.addMethod("noPOBox", function(value, element) {
            return this.optional(element) || !/^(.*)p(\.|[o|0]st)?\s*[o|0]+(\.|ffic[e|3])?\s*(b[o|0]x)?\s*(\d)+(.*)/gi.test(value);
        }, "Sorry, no P.O. Boxes");

        $jQ.validator.addMethod("validCCExpYear", function(value, element) {
            return $jQ("#card-year").valid();
        }, "Please select year of expiration");

        $jQ.validator.addMethod("validCCExpMonth", function(value, element) {
            return $jQ("#card-month").valid();
        }, "Please select month of expiration");



        $jQ.validator.addMethod("noPlaceholder", function (value, element) { // don't validate placeholder text
            if (value == $jQ(element).attr('placeholder')) {
                return false;
            } else {
                return true;
            }
        });

        $jQ.validator.addMethod("ccRecognize", function (value, element) { // improved credit card recognition
            var relValue = value.substring(0,2);

            if (relValue >= 40 && relValue <= 49 ) { // visa
                return true;
            } else if (relValue == 34 || relValue == 37) { // amex
                return true;
            } else if (relValue >= 50 && relValue <= 55 ) { // mc
                return true;
            } else if (relValue == 65 || value.substring(0,4) == 6011) { // discover
                return true;
            } else {
                return false;
            }
        });
    },

    initSummaryTooltip: function() {
        MLS.ui.dropdownDisplay($jQ(".checkout-cart-summary"));
        
        /*
        $jQ(".checkout-cart-summary .dropdown-link").each(function() {
            var link = $jQ(this);

            if ($jQ('html').hasClass('no-touch')) {
                link.hover(
                    function () {
                        $jQ(this).parents('section').find('.dropdown-panel').fadeOut(25);
                        $jQ(this).next('.dropdown-panel').fadeIn(200);
                    },
                    function () { $jQ(this).next('.dropdown-panel').delay(200).fadeOut(200); }
                );

                $jQ(this).siblings('.dropdown-panel').hover(
                    function () { $jQ(this).stop().removeClass('hidden').show(); },
                    function () { $jQ(this).fadeOut(300); }
                );
            } else {
                $jQ(link).click(function (e) {
                    e.preventDefault();
                    $jQ(this).siblings('.dropdown-panel').toggle();
                });
            }
        });
        */
    },

    update: function(r) {
        $jQ(".checkout-cart-summary").empty().html(r.success.summaryHTML);
        $jQ(".final-cart-table").empty().html(r.success.finalCartHTML);

        MLS.checkout.initSummaryTooltip();

        /* feature removed
        $jQ(".final-cart-table").find('select[name=final-qty]').change(function() {
            MLS.miniCart.updateItem(
                $jQ(this).data("cart-id"), // id
                null, // size (null = do not change)
                null, // color (null = do not change)
                $jQ(this).val()
            );
        }).uniform();
        */

        $jQ(".final-cart-table select[name=final-qty]").uniform();

        $jQ(".final-cart-table .checkout-final").click(function(e) {
            this.form.action = MLS.ajax.endpoints.CHECKOUT_STEP_3;
            return true;
        })/*.uniform()*/;

        // checkout accordions
        $jQ('.checkout-cart-summary .checkout-accordion .acc-control').click(function() {
            MLS.ui.simpleAcc(this);
        });

        MLS.checkout.disableCCBasedOnTotal();
    },

    disableCCBasedOnTotal: function()
    {
        /* requirement removed, cc is always needed
        var ccinfo = $jQ("#card-number, #card-month, #card-year, #card-code, #card-code-saved");

        if (parseFloat($jQ("#total").text().replace("$", "")) == 0)
        {
            // if the total is 0, cc info is not required
            ccinfo.addClass("ignore").removeClass("error").parent().removeClass('error-style').find("label.error").addClass('hidden').hide();
        } else {
            ccinfo.removeClass("ignore");
        }
        */
    },

    toggleMobileCheckout: function () {
        var f = function() {
            R.band(960) ? $jQ(".mobile-checkout-finish").hide() : $jQ(".mobile-checkout-finish").show();
        };

        f();
        $jQ(window).unbind('resize scroll', f).bind('resize scroll', f);
    },

    smallScreenContent : function() { // CHECKOUT copy to mobile-only fields ....................................................
        // top
	$jQ('#mobile-checkout-place-cta div div').removeClass("button").addClass("");
        $jQ('#checkout .checkout-accordion.sidebar').clone().appendTo('#mobile-checkout-summary');
        $jQ('#mobile-checkout-summary .checkout-accordion.sidebar .item-color').each(function(){
            var newDiv = $jQ(this).next('.item-size');
            $jQ(this).appendTo(newDiv);
        });

        // bottom
        $jQ('#checkout .special-offer-block').clone().appendTo('#mobile-checkout-offers');
        $jQ('#checkout .sidebar-finish').clone().appendTo('#mobile-checkout-place-cta');
        $jQ('#checkout .totals').clone().appendTo('#mobile-checkout-totals');
        $jQ('#checkout .checkout-disclaimers').clone().appendTo('#mobile-checkout-disclaimers');
    },

    stepTwoSequence : function() { // CHECKOUT card & billing choices...............................................................
        var $radiobutton = $jQ('input[name=cardChoice]:checked');
    	$jQ('.billing-info-block .CCV').hide().prop('disabled', true);
        $jQ('input[name=cardChoice]:checked').parent().find('.CCV').show().prop('disabled', false);

        $jQ('.billing-option', '#billing-info').on('click', function() {
            if ($jQ(this).hasClass("disabled"))
            {
                return false;
            }
            typeof siteCatalyst == 'function' && siteCatalyst();

            var $context = $jQ(this),
            $billingOpts = $context.siblings(),
            $billingOptsInfo = $jQ('.billing-detail-content', '#billing-info .billing-info-block');

            $billingOpts.removeClass('checked').find('span').removeClass('checked');
            $context.addClass('checked').find('span').addClass('checked');

            $billingOptsInfo.addClass('hidden').hide();
            $jQ($billingOptsInfo[$context.index()]).removeClass('hidden').show();
        });


        $jQ('input[name=cardChoice]').change(function(){ //signed-in new card or saved card
            $jQ(this).siblings('.card-choice-detail-block').removeClass('hidden').show().parent().siblings('.form-input-wrap').find('.card-choice-detail-block').addClass('hidden'); // handle detail block under button

            // card choice
            $jQ('.billing-info-block .CCV').hide().prop('disabled', true);
            $jQ('input[name=cardChoice]:checked').parent().find('.CCV').show().prop('disabled', false);

	    // card choice ends

            if ($jQ(this).parent().hasClass('new-card')) {
                if ($jQ("#same-as-shipping").is(":checked"))
                {
                    // show 'edit' button from billing summary
                    // $jQ("#saved-info-edit").removeClass('hidden').show();
                    $jQ("#same-as-shipping").click().click();
                }
                else
                {
                    // new card, show form, hide summary
                    $jQ(".step-info-summary.billing-address").addClass('hidden').hide();
                    $jQ('.billing-address.new-billing-info-form').removeClass('hidden').show();
                    $jQ("#card-code-saved").addClass("ignore");
                }

                $jQ(".form-input-wrap.saved-card").children(".form-input-wrap").addClass('hidden').hide(); // hide saved card cvv2 info
            } else {
                // old card, hide form, show summary
                $jQ(".step-info-summary.billing-address").removeClass('hidden').show();
                $jQ(".form-input-wrap.saved-card").children(".form-input-wrap").removeClass('hidden').show();
                $jQ('.billing-address.new-billing-info-form').addClass('hidden').hide();
                $jQ("#card-code-saved").removeClass("ignore");

                // hide 'edit' button from billing summary
                // $jQ("#saved-info-edit").addClass('hidden').hide();
                $jQ("#saved-add-1, #saved-add-2, #saved-sum-city, #saved-sum-state, #saved-sum-zip, #saved-sum-first, #saved-sum-last, #saved-sum-email, #saved-sum-phone").each(function() {
                    if ($jQ(this).data('saved'))
                    {
                        $jQ(this).html($jQ(this).data('saved'));
                    }
                });
            }

            MLS.checkout.disableCCBasedOnTotal();
        });

        $jQ('.edit-saved-card').click(function(){ // signed-in edit saved card information
            // saved card off
            $jQ('.saved-card').find('.checkout-radio-input').prop('checked', false).siblings('.card-choice-detail-block').addClass('hidden').hide();
            // new card on
            $jQ('.new-card').find('.checkout-radio-input').prop('checked', true).siblings('.card-choice-detail-block').removeClass('hidden').show();
            // edit button off
            $jQ(this).addClass('hidden').hide();

            // handle saved billing/new billing form below
            $jQ('.billing-address').toggleClass('hidden');
        });

        var notTheSame = function() {
            var $bt = $jQ('#same-as-shipping'),
                $form = $bt.parents("form");

            /*
            do not clear the values, if it comes from and 'edit', the values should be prepopulated
            $jQ('.billing-address-block').find('.SaS').each(function() {
                $jQ(this).val('').removeClass('valid');

                if ($jQ(this).is("select"))
                {
                    $jQ(this).val($jQ(this).find("option").eq(0).attr("value")).change();
                }
            });
            */

            $bt.addClass('check');

            // hide summary
            $form.find(".step-info-summary.billing-address").addClass('hidden').hide();
            // .find(".edit-checkout-step").addClass('hidden').hide(); // hide 'edit billing address'?
            $form.find(".new-billing-info-form.billing-address").removeClass('hidden').show();
            // Below line added to show 'Same as shipping address' check box as a checked
            // When the user clicked on the Edit button in the Billing Information Section.
            //$jQ("#same-as-shipping").parent('span').addClass("checked");
            return false;
        },

        sameAsShippingClick = function () {
            // notTheSame();
            $jQ('#same-as-shipping:checked').click(); // will not trigger .change
        };

        $jQ('#same-as-shipping').change(function() { // billing info same as shipping
            if($jQ(this).hasClass('check')){
                $jQ(this).removeClass('check');
                $jQ('#shipping-info').find('.SaS').each(function(shipI){
                    var shipValue = $jQ(this).val();
                    // don't copy placeholder values
                    if (shipValue == $jQ(this).attr("placeholder") ||
                        (
                            $jQ(this).attr("name") == "checkoutFirstName"
                            && $jQ("#checkout-where-to-ship").val() == "business"
                        ) ||
                        (
                            $jQ(this).attr("name") == "checkoutLastName"
                            && $jQ("#checkout-where-to-ship").val() == "business"
                        )
                    )
                    {
                        shipValue = "";
                    }

                    $jQ('.billing-address-block').find('.SaS').each(function(billI){ // paste stuff
                        if ( shipI == billI ) { //paste it
                            $jQ(this).val(shipValue).valid();
                            //$jQ.uniform.update(this);
                            return false;
                        }
                    });
                });

                // copy to summary
                $jQ("#saved-add-1, #saved-add-2, #saved-sum-city, #saved-sum-state, #saved-sum-zip, #saved-sum-first, #saved-sum-last, #saved-sum-email, #saved-sum-phone").each(function() {
                    if (!$jQ(this).data('saved'))
                    {
                        $jQ(this).data('saved', $jQ(this).html());
                    }
                });


                $jQ("#saved-sum-first").html($jQ("#bill-first-name").val());
                $jQ("#saved-sum-last").html($jQ("#bill-last-name").val());
                $jQ("#saved-sum-phone").html($jQ("#bill-phone").val());
                $jQ("#saved-add-1").html($jQ("#bill-address-1").val());
                $jQ("#saved-add-2").html($jQ("#bill-address-2").val());
                $jQ("#saved-sum-city").html($jQ("#bill-city").val());
                $jQ("#saved-sum-state").html($jQ("#bill-state").val());
                // Below lines were added to display selected state value in captials in billing address, shipping address sections.
                $jQ('#bill-state').prev('span').html($jQ("#bill-state").val());
                $jQ('#bill-state').prev('span').attr('style', 'text-transform: uppercase !important');
                $jQ('#checkout-ship-state').prev('span').attr('style', 'text-transform: uppercase !important');
                if($jQ("#ship-sum-email").html().length > 19)
                    $jQ("#saved-sum-email").html( truncEmail );
                else
                    $jQ("#saved-sum-email").html( email );
                $jQ("#saved-sum-zip").html($jQ("#bill-zip").val());

                if ($jQ("#checkout-where-to-ship").val() != "business")
                {
                    // show summary
                    $jQ(this.form).find(".step-info-summary.billing-address").removeClass('hidden').show()
                    .find(".edit-checkout-step").removeClass('hidden').show().unbind('click', sameAsShippingClick).click(sameAsShippingClick);

                    $jQ(this.form).find(".new-billing-info-form.billing-address").addClass('hidden').hide();
                }
            } else { // clear all fields
                notTheSame();
            }
        });


        // main checkout sequence : step 2, edit saved billing information information
        $jQ('#saved-info-edit').unbind('click', MLS.checkout.editBillingCallback).click(MLS.checkout.editBillingCallback);


        // main checkout sequence : step 2, new card info : card icon recognition
        $jQ('#card-number, #card-number-gc').on('paste', function(e) {
            e.preventDefault();
            return false;
        }).on('keyup', function() {
            if (this.value.length == 2 || this.value.length == 4) {
                var number = this.value,
                    cardListItem = 0;

                if (number >= 40 && number <= 49 ) {
                    cardListItem = 'visa';
                } else if (number == 34 || number == 37) {
                     cardListItem = 'amex';
                } else if ( number >= 50 && number <=55 ) {
                    cardListItem = 'mastercard';
                } else if ( number == 65 || number == 6011) {
                    cardListItem = 'discover';
                }

                $jQ(this).parents('.form-input-wrap').next().next().find('.' + cardListItem).addClass('entered').siblings().removeClass('entered');
                $jQ('.bill-summary-card').find('.card-image').addClass(cardListItem);
            } else if(this.value == "" || this.value.length === 1) {
                $jQ(this).parents('.form-input-wrap').next().next().find('li').removeClass('entered');
            }
        });
    },

    /*=================================
    =            Discounts            =
    =================================*/
    initDiscounts: function () {

        $jQ('.checkout-accordion .acc-control').click(function() {
            if ($jQ(this).parents('.checkout-accordion').hasClass("disabled"))
            {
                return false;
            }
            MLS.ui.simpleAcc(this);
        });

        $jQ('#begin-gift-card').click(function() {
            if ($jQ(this).parents('.checkout-accordion').hasClass("disabled"))
            {
                return false;
            }
            $jQ("#gift-card-warning").removeClass('hidden').show();

        });

        $jQ("#gift-card-warning .tooltip-close").click(function (){
            $jQ(this).parents("#gift-card-warning").fadeOut();
            return false;
        });


        // Add more discountrs
        MLS.checkout.addAnotherDiscountCode();
        // Apply discount
        MLS.checkout.applyDiscount();
        MLS.checkout.removeDiscountButton($jQ('#vzn-checkout-code form'));

        // Form styles
        //$jQ("#vzn-checkout-code").find('input').uniform();

    },

    applyDiscount: function () {

        $jQ("#vzn-checkout-code form").each(function() {
            var $form = $jQ(this),
                // $applied = $form.find('.discount-success').eq(0).find(".success-msg"),
                $submit = $form.find('input[type=submit]');

            // if ($applied.length > 0)
            // {
            //     MLS.checkout.applyDiscountCallback({
            //         success: {
            //             responseHTML: $applied.parent().html()
            //         }
            //     }, $form, $submit);
            // }

            $submit
                .off('click', submitForm) // reset bind
                .on('click', submitForm);
        });

        function submitForm (e) {
            e.preventDefault();

            var $self = $jQ(this),
                $submmitedForm = $self.parents('form');

            $submmitedForm.validate();

            $submmitedForm.find("input[name*=discountCode]").valid() &&
            MLS.ajax.postRequest(
                MLS.ajax.endpoints.CHECKOUT_APPLY_DISCOUNT,
                $submmitedForm.serialize(),
                function(r) {
                    MLS.checkout.applyDiscountCallback(r, $submmitedForm, $self);
                }
            );

            return false;
        }


    },

    addAnotherDiscountCode: function () {
        $jQ('.checkout-discount-block .add-discount-code').click(function (e) {
            e.preventDefault();
            $jQ(this).toggleClass('close');

            var othercodes = $jQ(this).parents("form").siblings('form'), 
                i = othercodes.length,
                f = function() {
                    i--;
                    
                    if (i > 0)
                    {
                        othercodes.eq(i-1).slideToggle(300, f);
                    }
                };

            if (othercodes.length == 0)
            {
                othercodes = $jQ(this).parents("form").next('div');
            }
            
            othercodes.eq(i-1).slideToggle(300, f);
        });
    },

    removeDiscountButton: function ($form) {

        $form
            .find("a.discount-remove")
            .off('click', removeFunction) // reset
            .on('click', removeFunction);

        function removeFunction (e) {
            e.preventDefault();

            var $remove = $jQ(this),
                $form = $remove.parents('form');

            MLS.ajax.postRequest(
                MLS.ajax.endpoints.CHECKOUT_APPLY_DISCOUNT,
                $remove.attr("href").split("#")[0].split("?")[1],
                function(r) {
                    if ($jQ("#vzn-checkout-code .acc-info > div > form .discount-success:visible").length <= 1)
                    {
                        $jQ("#add-discount-code-2").fadeIn();
                    }

                    $form.find("input.valid").removeClass('valid').addClass('hasPlaceholder');
                    $remove.parents('.discount-success').prev('.discount-input').slideToggle(300);
                    $remove.parents('.discount-success').slideToggle();
                    MLS.checkout.update(r); // update totals
                }
            );

            return false;
        }
    },

    applyDiscountCallback: function(r, $form, $self) {
        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
            return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true);
        }

        $form.find(".discount-success div:eq(0)")
            .html(r.success.responseHTML)
            .parent()
            .slideToggle(300);

        if ($jQ("#vzn-checkout-code .acc-info > div:visible .discount-success:visible").length > 0)
        {
            $jQ("#add-discount-code-2").fadeOut();
        } else {
            $jQ("#add-discount-code-2").fadeIn();
        }

        $form.find("input[type=text]").val("").change();

        MLS.checkout.removeDiscountButton($form);

        $self.parents('.discount-input').slideToggle(300);
        // $self.parents('.discount-input').next('.discount-success').slideToggle(300);

        MLS.checkout.update(r); // update totals
    },
    /*-----  End of Discounts  ------*/





    /*==================================
    =            Girftcards            =
    ==================================*/
    initGiftCard: function() {
        var $form = $jQ("#vzn-checkout-gift"),
            $billing = $jQ("#vzn-checkout-billing"),
            $bta = $jQ("#bill-to-account"),
            $cc = $jQ("#pay-with-card");

        // edit billing info disabled
        // $jQ("#saved-info-edit").addClass('hidden').hide();

        if ($bta.is(":checked"))
        {
            $billing.find(".billing-address").addClass('hidden').hide();
            $form.addClass("disabled");
        } else {
            $billing.find(".billing-address").removeClass('hidden').show();
            $form.removeClass("disabled");
        }

        MLS.checkout.hideStepinfoSummary();

        $form.find(".open").click(function() {
            return !$form.hasClass("disabled");
        });

        $billing.find(".bill-account").click(function(e) {
            var $self = $jQ(this),
                bta = $self.find("input")[0],
                cc = $billing.find(".bill-card input")[0];

            if ($self.hasClass("disabled"))
            {
                return false;
            }

            bta.checked = true;
            cc.checked = false;

            setTimeout(function() {
                if (!$self.hasClass(".checked"))
                {
                    $form.addClass("disabled");
                } else {
                    $form.removeClass("disabled");
                }
            }, 100);

            $billing.find(".billing-address").addClass('hidden').hide();
        });

        $billing.find(".bill-card").click(function(e) {
            var $self = $jQ(this),
                bta = $billing.find(".bill-account input")[0],
                cc = $self.find("input")[0];

            bta.checked = false;
            cc.checked = true;

            if ($jQ("#choose-saved-card").is(":checked"))
            {
                $billing.find(".step-info-summary.billing-address").removeClass('hidden').show();
            } else {
                $billing.find(".new-billing-info-form.billing-address").removeClass('hidden').show();
            }

            setTimeout(function() {
                if (!$self.hasClass(".checked"))
                {
                    $form.removeClass("disabled");
                } else {
                    $form.addClass("disabled");
                }
            }, 100);
        });



        // Add more discountrs
        MLS.checkout.addAnotherGiftCard();
        // Apply discount
        MLS.checkout.applyGiftCard();
        MLS.checkout.removeGiftCard($jQ('#vzn-checkout-gift'));

         // Form styles
        //$jQ("#vzn-checkout-gift").find('input').uniform();

    },

    applyGiftCard: function () {

        $jQ("#vzn-checkout-gift form").each(function() {
            var $form = $jQ(this),
                $applied = $form.find('.discount-success').eq(0).find(".success-msg"),
                $submit = $form.find('input[type=submit]');

            // if ($applied.length > 0)
            // {
            //     MLS.checkout.applyGiftCardCallback({
            //         success: {
            //             responseHTML: $applied.parent().html()
            //         }
            //     }, $form, $submit);
            // }

            $submit
                .off('click', submitForm) // reset bind
                .on('click', submitForm);
        });

        function submitForm (e) { // apply & validate gift card 1

            e.preventDefault();

            var gcValid = true,
                $self = $jQ(this),
                $submmitedForm = $self.parents('form');

            if ($jQ("#vzn-checkout-gift").hasClass("disabled"))
            {
                return false;
            }

            $self.parents('.checkout-discount-block').find('.selector').each(function(){ // validate selects first
                var selectsValid = MLS.checkout.validateSelect(this);
                if(selectsValid == false) {
                    gcValid = false;
                }
            });

            $submmitedForm.validate(); // validate form
            if ($submmitedForm.find('input[type=text]').valid() && gcValid == true ) {
                MLS.ajax.postRequest(
                    MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                    $submmitedForm.serialize(),
                    function(r) {
                        MLS.checkout.applyGiftCardCallback(r, $submmitedForm, $self);
                    }
                );
            }

            return false;
        }



    },

    addAnotherGiftCard: function () {
         $jQ('.checkout-discount-block .add-gift-card').click(function(){  // add another gift card (only when BTA is hidden)
            if ($jQ("#vzn-checkout-gift").hasClass("disabled"))
            {
                return false;
            }

            /*
            if ($jQ(this).hasClass("close"))
            {
                // if there are discount codes implemented,
                // and the uses closes the accordion, remove them.
                var $remove = $jQ(this).parents("form").next('form').find(".discount-success:visible .discount-remove");
                if ($remove.length > 0)
                {
                    $remove.click();
                }
            }
            */

            $jQ(this).toggleClass('close');
            $jQ(this).parents("form").next('form').slideToggle(300);
        });
     },

    removeGiftCard: function ($form) {

        $form.find("a.discount-remove")
            .off('click', removeFunction) // reset
            .on('click', removeFunction);

        function removeFunction (e) {
            e.preventDefault();

            var $remove = $jQ(this),
                $form = $remove.parents('form');

            if ($form.hasClass("disabled")) {
                return false;
            }

            MLS.ajax.postRequest(
                MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                $remove.attr("href").split("#")[0].split("?")[1],
                function(r) {
                    if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                        return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true);
                    }

                    MLS.checkout.appliedGiftCards--; // decrease applied discounts

                    if (MLS.checkout.appliedGiftCards == $jQ("#vzn-checkout-gift form").length)
                    {
                        $jQ("#add-gift-card-2").fadeOut();
                    } else {
                        $jQ("#add-gift-card-2").fadeIn();
                    }

                    MLS.checkout.checkBTATabs();

                    $form.find("input.valid").removeClass('valid').addClass('hasPlaceholder');

                    // $jQ('.gift-card-cc-block').slideToggle(300); // what is this one?
                    $remove.parents('.discount-success').prev('.discount-input').slideToggle();
                    $remove.parents('.discount-success').slideToggle();

                    MLS.checkout.update(r); // update totals
                }
            );

            return false;

        }

    },

    applyGiftCardCallback: function(r, $form, $self) {
        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
            return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true);
        }

        MLS.checkout.appliedGiftCards++; // increase applied discounts

        if (MLS.checkout.appliedGiftCards == $jQ("#vzn-checkout-gift form").length)
        {
            $jQ("#add-gift-card-2").fadeOut();
        } else {
            $jQ("#add-gift-card-2").fadeIn();
        }

        MLS.checkout.checkBTATabs();

        $form
            .find(".discount-success div:eq(0)")
            .html(r.success.responseHTML)
            .parent()
            .slideToggle(300);

        $form.find("input[type=text]").val("").change();

        MLS.checkout.removeGiftCard($form);

        // $jQ('.gift-card-cc-block').slideToggle(300); // what's this one?
        $self.parents('.discount-input').slideToggle();
        // $self.parents('.discount-input').next('.discount-success').slideToggle();

        MLS.checkout.update(r); // update totals
    },


    /*-----  End of Girftcards  ------*/





    giftCardSequence : function() { // main checkout sequence : step 2 .............................................................
        // toggle the message & form
        $jQ('#begin-gift-card').click(function(e){ //grab CC info (if present) and copy to GC form
            if ($jQ("#vzn-checkout-gift").hasClass("disabled"))
            {
                return false;
            }

            var ecValid = true;
            $jQ('#enter-card-info').find('.selector').each(function(){ // validate main cc selects first
                var selectsValid = MLS.checkout.validateSelect(this);
                if(selectsValid == false) {
                    ecValid = false;
                }
            });

            $jQ('#vzn-checkout-billing').validate(); // validate the rest
        });


    },

    validateSelect : function(selector, ignored) { // CHECKOUT  validation/error messages for custom selects created with uniform.js
        var thisSelect = $jQ(selector).find('select');
        if (ignored == undefined) {
            var ignoredClass = 0;
        } else {
            var ignoredClass = ignored;
        }

        if ($jQ(thisSelect).hasClass(ignoredClass)){
            var selectsValid = true; // we're not validating it
        } else { // we are
            var thisValue = $jQ(selector).find(':selected').val();
            var selectsValid = true; // because we're optimists

            if (thisValue == 0) {
                $jQ(selector).addClass('select-box-error');
                if ($jQ(thisSelect).hasClass('error')) { //don't add multiple messages
                } else {
                    $jQ('<div class="select-error-message error">Please click to select </div>').appendTo(selector);
                }
                $jQ(thisSelect).addClass('error');
                selectsValid = false;
            } else { // remove any error states & messages & proceed
                $jQ(selector).removeClass('select-box-error');
                $jQ(selector).find('.select-error-message').remove();
                $jQ(thisSelect).removeClass('error');
            }
        }
        return selectsValid;
    },

    /* HOOK THE AJAX CALLS IN HERE */
    nextStepSequence : function(){ // CHECKOUT  next step event .................................................................
        $jQ('.next-step-input').click(function(e) {
            e.preventDefault();
            $jQ(this).parents('.checkout-step').find('label.error').each(function(){
                $jQ(this).addClass('hidden').hide().removeClass('success'); // reset all error & success messages on next step click
            });

            var which = $jQ(this).attr('id'),
                valid = true,
                $form = "";

            if (which == 'ship-info-complete') { // STEP 1 prevalidate
                var radios = $jQ(this).parents('.next-step-button-box').siblings('.step-info-block').find('.checkout-radio-input'); // validate step 1 radio buttons
                var radioValid = false;
                var i = 0;

                $jQ(radios).each(function(i) {
                    if (this.checked) {
                        radioValid = true;
                        $jQ('#no-shipping-selected').addClass('hidden').hide();
                        var shippingType = $jQ('input[name=shipRadio]:checked').siblings('label').html();
                        $jQ('#sum-shipping').html(shippingType);
                    }
                }); // end each

                $form = $jQ("form#vzn-checkout-shipping");

                if (radioValid == false ) {
                    $form.validate();
                    $form.valid();

                    $jQ('#no-shipping-selected').removeClass('hidden').show();
                    MLS.ui.scrollPgTo($form.find("label.error:visible:not(.success), #no-shipping-selected").eq(0), $jQ("#mls-nav").height() + 50);
                    return false;
                }
            } // endstep 1 prevalidate

            if (which == 'billing-info-complete') { // STEP 2 prevalidate
                // var signedinBranch = 'new',
                var seq = $jQ('#checkout');

                $form = $jQ("form#vzn-checkout-billing");

                if ($jQ('.billing-complete').is(':not(.blank)')) { // if second time through, remove previous info
                    $jQ('#name-on-card').empty();
                    $jQ('#bill-address-summary-name').empty();
                }

                /* unused code (?)
                if ($jQ(seq).hasClass('signed-in')) { // check for saved info
                    if ($jQ('#bill-to-account').is(':checked') || $jQ('#choose-saved-card').is(':checked')) { // saved info, no validation required
                        // signedinBranch = 'saved';
                        $jQ('.new-billing-info-form, .billing-detail-content.details-card').find('.checkout-input').addClass('not');
                        $jQ('.step-info-summary.billing-address').addClass('hidden').hide();

                        $form.find(".checkout-input.CCV").removeClass("not"); // saved card requires cvv validation
                    }
                }
                */
            } // end if step 2 prevalidate

            var validator = $form.validate(), // VALIDATE
                formValid = $form.valid();

            var completed;

            if (valid && formValid) {
                var params = $form.serializeArray(),
                    serialized  = {},
                    ex = null;

                for(var i in params)
                {
                    try
                    {
                        serialized[params[i].name] = (params[i].value == $jQ("[name=" + params[i].name + "]").attr("placeholder")) ? "" : params[i].value;
                    } catch (ex) {
                        serialized[params[i].name] = params[i].value;
                    }
                }

                if (which == 'ship-info-complete') { // STEP 1 postvalidate
                    MLS.ajax.postRequest(
                        MLS.ajax.endpoints.CHECKOUT_STEP_1,
                        serialized,

                        function (r) {
                            if (r.hasOwnProperty('error') && r.error.hasOwnProperty("responseHTML") && r.error.responseHTML != "") {
                                return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true);
                            }

                            if (r.hasOwnProperty('error') && r.error.hasOwnProperty("inlineHTML")) {
                                $jQ(".error.success").removeClass("success");

                                validator.showErrors(r.error.inlineHTML);
                                MLS.ui.scrollPgTo($form.find(".error:not(.success)").eq(0), $jQ("#mls-nav").height() + 50);
                                return;
                            }

                            // billingHTML
                            // step 2 restart
                            $jQ("#vzn-checkout-billing").replaceWith(r.success.billingHTML);
                            $jQ("#vzn-checkout-billing").find("input:checkbox, select.checkout-input, select.cart-revise-qty,  .cart-item-qty").uniform(); // style form elements

                            $jQ("#vzn-checkout-billing").find('.checkout-dropdown').each(function(){ // display rules for inline dropdowns
                                MLS.ui.dropdownDisplay(this);
                            });

                            $jQ("#vzn-checkout-billing").find('.special-offer-block').each(function(){ // display rules for offer dropdowns
                                MLS.ui.dropdownDisplay(this);
                            });

                            $jQ("#card-year, #card-month").change(function() {
                                $jQ("#card-code").focus();
                                $jQ("#card-code").blur();
                            });

                            /*=================================
                            =            Discounts   and Giftcards         =
                            =================================*/
                            if ( r.success.discountHTML && r.success.discountHTML != '' ) {
                                $jQ('.checkout-discount-block').replaceWith(r.success.discountHTML);

                                $jQ('.checkout-discount-block .checkout-dropdown').each(function(){
                                    MLS.ui.dropdownDisplay(this);
                                });

                                // rebind events
                                MLS.checkout.initDiscounts();
                                MLS.checkout.initGiftCard();

                                // Expand success messages
                                $jQ('#vzn-checkout-code .discount-success div:first-child').not(":empty").length > 0
                                && $jQ('#vzn-checkout-code').find('.acc-control').click()
                                && $jQ('#vzn-checkout-code .discount-success div:first-child').not(":empty").parent().show().siblings(".discount-input").hide();

                                if ($jQ("#vzn-checkout-code .acc-info > div:visible .discount-success:visible").length > 0)
                                {
                                    $jQ("#add-discount-code-2").fadeOut();
                                } else {
                                    $jQ("#add-discount-code-2").fadeIn();
                                }
                            }


                            MLS.checkout.mainCheckoutValidation($jQ("#vzn-checkout-billing"));
                            MLS.checkout.stepTwoSequence();
                            // end step 2 restart

                            $jQ(".step-info-summary:eq(0)").html(r.success.responseHTML);
                            MLS.checkout.initEditStep();

                            completed = $jQ('#shipping-info'); // hide/show/scroll ..............
                            completed.find('.hide-complete').addClass('hidden').hide();
                            completed.find('.step-info-summary').removeClass('hidden').show();

                            MLS.checkout.hideStepinfoSummary();

                            var step2Complete = $jQ('#billing-info .billing-complete'); // which part of step 2 to open
                            if ($jQ(step2Complete).hasClass('blank')){
                                $jQ('#billing-info .hide-complete').removeClass('hidden').show();
                            } else {
                                $jQ('#confirm-order').find('.hide-complete').removeClass('hidden').show(); // open step 3 form & leave step 2 alone
                            }

                            // show step 2 in edit mode
                            var $editStep2 = $jQ(".edit-checkout-step.edit-billing");
                            if ($editStep2.is(":visible"))
                            {
                                $editStep2.click();
                            }

                            if ($jQ("#vzn-checkout-billing .billing-select-block.disable-bta").length > 0)
                            {
                                $jQ("#vzn-checkout-billing .bill-card.billing-option").click();
                            }

                            MLS.ui.scrollPgTo(completed, 7);
                            MLS.checkout.initDropdowns();
                            MLS.checkout.update(r);

                            //Truncating Email length
                            email = $jQ("#ship-sum-email").html();
                            if($jQ("#ship-sum-email").html().length > 19)
                            {
                                truncEmail = jQuery.trim( $jQ("#checkout-ship-email").val() ).substring(0, 19).trim(this) + "...";
                            }
                            // making the mbox call on successful step 1
                            mboxUpdate("verizonwireless_paymentpage_top", "loggedin="+mbLoggedIn);
                            // modified for sitecatlyst
                            typeof siteCatalyst == 'function' && siteCatalyst();
                            // Below two lines for showing billing address by default in the Billing Information Section. 
                            $jQ("#same-as-shipping").click().click();                            
                            //$jQ("#same-as-shipping").parent('span').addClass("checked");
                        }
                    );
                } // end step 1 postvalidate

                if (which == 'billing-info-complete'){ // STEP 2 postvalidate
                    MLS.ajax.postRequest(
                        MLS.ajax.endpoints.CHECKOUT_STEP_2,
                        $form.serialize(),
                        function (r) {
                            if (r.hasOwnProperty('error') && r.error.hasOwnProperty("responseHTML") && r.error.responseHTML != "")
                            {
                                return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true);
                            }

                            if (r.hasOwnProperty('error') && r.error.hasOwnProperty("inlineHTML")) {
                                $jQ(".error.success").removeClass("success");

                                validator.showErrors(r.error.inlineHTML);
                                MLS.ui.scrollPgTo($form.find(".error:not(.success)").eq(0), $jQ("#mls-nav").height() + 50);
                                return;
                            }

                            if (r.success.hasOwnProperty("redirectUrl") && r.success.redirectUrl != "")
                            {
                                document.location.href = r.success.redirectUrl;
                                return;
                            }

                            $jQ(".step-info-summary.billing-address").html(r.success.savedInfoSummaryHTML);
                            $jQ('#saved-info-edit').unbind('click', MLS.checkout.editBillingCallback).click(MLS.checkout.editBillingCallback);

                            $jQ(".step-info-summary.billing-complete").html(r.success.responseHTML);
                            $jQ("#confirm-order .step-info-block .instructions").empty();
                            $jQ("#confirm-order .step-info-block .instructions").html(r.success.shippingSignInfoHTML);
                            MLS.checkout.initEditStep();

                            completed = $jQ('#billing-info');

                            $jQ('.sidebar-finish').addClass('on'); // reveal red CTA in sidebar
                            $jQ('.checkout-accordion.sidebar').find('.acc-info').css('display', 'none'); // close side bar acc

                            completed.find('.hide-complete').addClass('hidden').hide();  //  hide/show/scroll ..............
                            completed.find('.step-info-summary').removeClass('hidden').show();
                            $jQ('#vzn-checkout-confirm .checkout-step .hide-complete').removeClass('hidden').show();
                            MLS.ui.scrollPgTo(completed, 7);

                            // var checkoutConfirm = $jQ('#vzn-checkout-confirm').position();
                            // $jQ('#checkout-sidebar').animate({top:"+" + checkoutConfirm.top},600); // align cart summary with step 3
                            MLS.checkout.update(r);

                            setTimeout(function() {
                                $jQ('.billing-complete').removeClass('blank');  // remove flag for first time through
                            }, 300);

                            MLS.checkout.toggleMobileCheckout();
                            
                            MLS.checkout.initDropdowns();
                            typeof siteCatalyst == 'function' && siteCatalyst();
                        }
                    );
                } // end step 2 postvalidate

            } else { // NOT VALID
                $jQ('select').each(function(){ // apply error style to select(s) if req
                    if ($jQ(this).hasClass('error')){
                        $jQ(this).parents('.selector').addClass('error-style');
                    }
                });

                MLS.ui.scrollPgTo($form.find("label.error:visible:not(.success)").eq(0), $jQ("#mls-nav").height() + 50);
            }

            return false;
        }); // end click
    },

    mainCheckoutValidation : function(forms) { // CHECKOUT
        MLS.checkout.validationRules = {
            checkoutFirstName: {
                required: true,
                alphaExtended: true,
                maxlength: 15,
                noPlaceholder: true
            },
            checkoutLastName: {
                required: true,
                alphaExtended: true,
                maxlength: 15,
                noPlaceholder: true
            },
            checkoutCompany: {
                required: true,
                maxlength: 30,
                noPlaceholder: true
            },
            checkoutCO: {
                required: true,
                noPlaceholder: true
            },
            checkoutAttention: {
                required: true,
                noPlaceholder: true
            },
            checkoutEmail: {
                required: true,
                noPlaceholder: true,
                maxlength: 80,
                email: true
            },
            checkoutPhone: {
                required: true,
                noPlaceholder: true,
                phoneUS: true
            },
            checkoutAddress: {
                required: true,
                address: true,
                maxlength: 30,
                noPlaceholder: true,
                noPOBox: true
            },
            checkoutAddress2: {
                required: false,
                address: true,
                maxlength: 30,
                noPlaceholder: false
            },
            checkoutCity: {
                required: true,
                alphanumericExtended: true,
                maxlength: 28,
                noPlaceholder: true
            },
            checkoutState: {
                required: true
            },
            checkoutZip: {
                required: true,
                zipcodeUS: true,
                minlength: 5,
                maxlength: 5,
                noPlaceholder: true
            },
            cardNumber: {
                required: true,
                noPlaceholder: true,
                rangelength: [15, 16],
                digits: true,
                ccRecognize: true
            },
            ccMonth: {
                required: true
            },
            ccYear: {
                required: true
            },
            ccCode: {
                required: true,
                noPlaceholder: true,
                minlength: 3,
                maxlength:  4,
                digits: true,
                validCCExpYear: true,
                validCCExpMonth: true
            },
            ccCodeSaved: {
                required: true,
                noPlaceholder: true,
                minlength: 3,
                maxlength:  4,
                digits: true
            },
            billingFirstName: {
                required: true,
                alphaExtended: true,
                maxlength: 15,
                noPlaceholder: true
            },
            billingLastName: {
                required: true,
                alphaExtended: true,
                maxlength: 15,
                noPlaceholder: true
            },
            billingPhone: {
                required: true,
                noPlaceholder: true,
                phoneUS: true
            },
            billingAddress: {
                required: true,
                address: true,
                maxlength: 30,
                noPlaceholder: true,
                noPOBox: true
            },
            billingAddress2: {
                required: false,
                address: true,
                maxlength: 30,
                noPlaceholder: false
            },
            billingCity: {
                required: true,
                alphanumericExtended: true,
                maxlength: 28,
                noPlaceholder: true
            },
            billingState: {
                required: true
            },
            billingZip: {
                required: true,
                zipcodeUS: true,
                minlength: 5,
                maxlength: 5,
                noPlaceholder: true
            },
            cardNumberGC: {
                required: false,
                noPlaceholder: true,
                rangelength: [15, 16],
                digits: true,
                ccRecognize: true
            },
            ccCodeGC: {
                required: false,
                noPlaceholder: true,
                minlength: 3,
                maxlength:  4,
                digits: true
            },
        };

        MLS.checkout.validationMessages = {
            checkoutFirstName: {
                required: "Please enter your first name",
                alphaExtended: "Please enter your first name",
                maxlength: "Please enter your first name",
                noPlaceholder: "Please enter your first name"
            },
            checkoutLastName: {
                required: "Please enter your last name",
                alphaExtended: "Please enter your last name",
                maxlength: "Please enter your last name",
                noPlaceholder: "Please enter your last name"
            },
            checkoutCO: {
                required: "Please enter your name",
                alphaExtended: "Please enter your name",
                maxlength: "Please enter your name",
                noPlaceholder: "Please enter your name"
            },
            checkoutCompany: {
                required: "Please enter your company name",
                alphaExtended: "Please enter your company name",
                maxlength: "Please enter your company name",
                noPlaceholder: "Please enter your company name"
            },
            checkoutAttention: {
                required: "Please enter your first and last name",
                noPlaceholder: "Please enter your first and last name"
            },
            checkoutEmail: {
                required: "Please enter your email address",
                noPlaceholder: "Please enter your email address",
                maxlength: "Please enter a valid email address",
                email: "Please enter a valid email address"
            },
            checkoutPhone: {
                required: "Please enter your phone number",
                noPlaceholder: "Please enter your phone number",
                phoneUS: "Please enter a valid phone number"
            },
            checkoutAddress: {
                required: "Please enter your shipping address",
                alphanumericExtended: "Please enter your shipping address",
                maxlength: "Please enter your shipping address",
                noPlaceholder: "Please enter your shipping address",
                noPOBox: "Sorry, we don't deliver to P.O. Boxes"
            },
            checkoutAddress2: {
                alphanumericExtended: "Please enter your shipping address",
                maxlength: "Please enter your shipping address",
            },
            checkoutCity: {
                required: "Please enter your city",
                alphanumericExtended: "Please enter your city",
                maxlength: "Please enter your city",
                noPlaceholder: "Please enter your city"
            },
            checkoutState: {
                required: "Please select your state"
            },
            checkoutZip: {
                required: "Please enter your zip code",
                noPlaceholder: "Please enter your zip code",
                digits: "Please enter your 5-digit zip code",
                minlength: "Please enter your 5-digit zip code",
                maxlength: "Please enter your 5-digit zip code",
                zipcodeUS: "Please enter your 5-digit zip code"
            },
            cardNumber: {
                required: "Please enter your card number",
                noPlaceholder: "Please enter your card number",
                rangelength: "Please enter a valid card number",
                digits : "Please enter a valid card number",
                ccRecognize : "Please enter a valid card number"
            },
            ccMonth: {
                required: "Please select month expiry"
            },
            ccYear: {
                required: "Please select year expiry"
            },
            ccCode: {
                required: "Please enter the security code",
                noPlaceholder: "Please enter the security code",
                minlength: "Please enter a valid security code",
                maxlength:  "Please enter a valid security code",
                digits: "Please enter a valid security code",
                validCCExpYear: "Please select year of expiration",
                validCCExpMonth: "Please select month of expiration"
            },
            ccCodeSaved: {
                required: "Please enter the security code",
                noPlaceholder: "Please enter the security code",
                minlength: "Please enter a valid security code",
                maxlength:  "Please enter a valid security code",
                digits: "Please enter a valid security code"
            },
            billingFirstName: {
                required: "Please enter your first name",
                noPlaceholder: "Please enter your first name"
            },
            billingLastName: {
                required: "Please enter your last name",
                noPlaceholder: "Please enter your last name"
            },
            billingPhone: {
                required: "Please enter your phone number",
                noPlaceholder: "Please enter your phone number",
                phoneUS: "Please enter a valid phone number"
            },

            billingAddress: "Please enter your street address",
            billingAddress2: "Please enter your street address",
            billingCity: "Please enter your city",
            billingState: "Please select your state",

            billingZip: {
                required: "Please enter your zip code",
                noPlaceholder: "Please enter your zip code",
                digits: "Please enter your 5-digit zip code",
                minlength: "Please enter your 5-digit zip code",
                maxlength: "Please enter your 5-digit zip code",
                zipcodeUS: "Please enter your 5-digit zip code"
            },
            cardNumberGC: {
                required: "Please enter your card number",
                noPlaceholder: "Please enter your card number",
                rangelength: "Please enter a valid card number",
                digits : "Please enter a valid card number",
                ccRecognize : "Please enter a valid card number"
            },
            ccCodeGC: {
                required: "Please enter the security code",
                noPlaceholder: "Please enter the security code",
                minlength: "Please enter a valid security code",
                maxlength:  "Please enter a valid security code",
                digits: "Please enter a valid security code"
            }
        };

        var i = 0,
            $discountCodes = $jQ("#vzn-checkout-code input[name*=discountCode]"),
            $giftCards = $jQ("#vzn-checkout-gift input[name*=giftCard]");

        $discountCodes.each(function() {
            var n = $jQ(this).attr("name");
            MLS.checkout.validationRules[n] = {
                required: false,
                noPlaceholder: true,
                alphanumeric: true,
                /* digits: true, */
                minlength: 1,
                maxlength: 17
            };

            MLS.checkout.validationMessages[n] = {
                required: "Please enter a valid discount code",
                noPlaceholder: "Please enter a valid discount code",
                alphanumeric: "Please enter a valid discount code",
                minlength: "Please enter a valid discount code",
                maxlength: "Please enter a valid discount code"
            };
        });

        $giftCards.each(function() {
            var n = $jQ(this).attr("name");
            if (n.substr(n.length-3).toLowerCase() == "pin")
            {
                MLS.checkout.validationRules[n] = {
                    required: false,
                    noPlaceholder: true,
                    alphanumeric: true,
                    /* digits: true, */
                    minlength: 1,
                    maxlength: 7
                };

                MLS.checkout.validationMessages[n] = {
                    required: "Please enter a PIN along with your Gift Card number",
                    noPlaceholder: "Please enter a PIN along with your Gift Card number",
                    alphanumeric: "Please enter a valid Gift Card PIN",
                    minlength: "Please enter a valid Gift Card PIN",
                    maxlength: "Please enter a valid Gift Card PIN"
                };
            } else {
                MLS.checkout.validationRules[n] = {
                    required: false,
                    noPlaceholder: true,
                    digits: true,
                    minlength: 1,
                    maxlength: 17
                };

                MLS.checkout.validationMessages[n] = {
                    required: "Please enter a Gift Card number along with your PIN",
                    noPlaceholder: "Please enter a Gift Card number along with your PIN",
                    digits: "Please enter a valid Gift Card number",
                    minlength: "Please enter a valid Gift Card number",
                    maxlength: "Please enter a valid Gift Card number"
                };
            }
        });

        // required formatting
        $jQ("[name=billingPhone],[name=checkoutPhone]").keyup(function() {
            if ( $jQ(this).val().length > 0)
            {
                var val = $jQ(this).val().replace(/\D/g,'');
                if (val.length == 10)
                {
                    $jQ(this).val("(" + val.substr(0,3) + ") " + val.substr(3,3) + "-" + val.substr(6));
                } else if (val.length > 10) {
                    $jQ(this).val(val.substr(0,1) + " (" + val.substr(1,3) + ") " + val.substr(4,3) + "-" + val.substr(7));
                }
            }
        });

        $jQ(forms || '#checkout-sequence form').each(function() {
            $jQ(this).validate({
                ignore: '.ignore, :hidden',
                success: function(label){
                    label.addClass('success').text('');
                    label.siblings(".error").removeClass("error");
                },
                highlight: function(element, errorClass, validClass) {
                    if ( element.type === "radio" ) {
                        this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                    } else {
                        $jQ(element).addClass(errorClass).removeClass(validClass);
                    }
                    $jQ(element).siblings(".error.success").removeClass('success');
                },
                focusCleanup: true,
                rules: MLS.checkout.validationRules,
                messages: MLS.checkout.validationMessages
            });
        });
    },

    sidebarOrderButton : function() {
        if ($jQ("#confirm-order .step-info-block").is(":visible"))
	{
	    $jQ('.sidebar-finish').addClass('on');
	}
    }

};
