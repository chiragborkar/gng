MLS.cart = {
    options: {

    },

    initCartDetails: function() {
        // style form elements
        $jQ("#cart-data").find("input:checkbox, select.checkout-input").uniform();
		//$jQ("#save-cart-submit, .secondary-add-cart").uniform();

        MLS.ui.dropdownDisplay('.totals .cart-discount, #save-cart-modal .lightbox-fineprint, #cart-data .checkout-dropdown, #cart-data .special-offer-block');

        // Update product quantity
        $jQ('.cart-revise-qty').each(function() {
            $jQ(this).data('old-value', $jQ(this).val());
        }).customSelectMenu({
            menuClass: 'selector',
            openedClass: 'open',
            selectedClass: 'active',
            selectionMadeClass: 'selected'
        }).removeAttr("name").on('change', function(e) {
            if ($jQ(this).data('disabled'))
            {
                return false;

            }
            $selected = $jQ(this);

            if ( $selected.val() === '0' ) {
                $jQ(this).data('disabled', true);
                $jQ(this).parents('.qty').siblings('.remove').next('.confirm-remove').fadeIn(300);
            } else  {
                var temp = $jQ(this);

                MLS.miniCart.updateItem(
                    $jQ(this).parents("form").serialize(),
                    function(r) {
                        // really hacky fix, we need to figure out what sets up the code for those customSelectMenus
                        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                            var old = temp.data('old-value');
                            temp.val(old);
                            temp.parents(".detail-box").find(".selector .selected").html(old);
                            temp.parents(".detail-box").find(".selector input[type=hidden]").val(old);
                            temp.parents(".detail-box").find("ul[data-select-name=cartQty]").find("li").removeClass("active");
                            temp.parents(".detail-box").find("ul[data-select-name=cartQty]").find("li[data-option-value=" + old + "]").addClass("active");
                        }
                    }
                );
            }
        });


        // items table : remove item button
        $jQ('#cart-data .remove a').click(function(e) {
            e.preventDefault();

            $jQ(this).parents(".cart-qty-block").find('.cart-revise-qty').data('disabled', true);
            $jQ(this).parents('.remove').next('.confirm-remove').fadeIn(300);
        });

        // items table : confirm remove panel
        $jQ('#cart-data .cart-remove-links .cancel').click(function(e) { // panel : cancel
            e.preventDefault();

            var qty = $jQ(this).parents(".cart-qty-block").find('.cart-revise-qty');
            $jQ(this).parents(".cart-qty-block").find('[data-option-value=' + qty.data('old-value') + ']').click();
            qty.data('disabled', false);

            $jQ(this).parents('.confirm-remove').fadeOut(300);
        });

        // sidebar : banner dropdowns
        // MLS.ui.dropdownDisplay($jQ('#cart-data .cart-sidebar .special-offer-block'));

        /*
        $jQ('#cart-data .cart-sidebar').find('.special-offer-block').each(function(container){ // display rules for offer dropdowns
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
	                function () { $jQ(this).stop().show(); },
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

        MLS.ui.dropdownDisplay($jQ('.totals .cart-discount'));
        /*
       $jQ('.totals .cart-discount .dropdown-link').hover(
            function () {
                $jQ(this).parents('section').find('.dropdown-panel').fadeOut(25);
                $jQ(this).next('.dropdown-panel').fadeIn(200);
            },
            function () { $jQ(this).next('.dropdown-panel').delay(200).fadeOut(200); }
        );
        $jQ('.dropdown-panel').hover(
            function () { $jQ(this).stop().show(); },
            function () { $jQ(this).fadeOut(300); }
        );
        */
    },

    init : function() {

        //these arent select boxes so they shouldnt have this class.
        $jQ(".calc-tax-wrapper, .keep-shopping-box").removeClass("selector");
        // MLS
        this.options = {
            getCartEndpoint: MLS.ajax.endpoints.GET_CART,
            addToCartEndpoint: MLS.ajax.endpoints.ADD_TO_CART,
            updateCartEndpoint: MLS.ajax.endpoints.UPDATE_CART,
            removeFromCartEndpoint: MLS.ajax.endpoints.REMOVE_FROM_CART,
            successCallback: MLS.cart.update
        };

        $jQ("#also-bought-block").length > 0 && $jQ("#also-bought-block").flexslider({
            useCSS: false,
            animation: 'slide',
            selector: "ul > .also-bought-product",
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ("#also-bought-block li").width(),
            maxItems: 4,
            itemMargin: 0,
            start: function(container) {
                MLS.common.flexsliderTracking(container, "Others Also Bought");
            }
        });




        MLS.taxCalculator.init();

        // don't trigger the first minicart update
        MLS.miniCart.started = true;
        MLS.cart.cartDetailsModals();

        this.initCartDetails();
        this.initSaveToCart();
        
        
    },

    initSaveToCart : function() { // CART validate save cart email form...................................................
        // header : save cart link
        $jQ('.save-cart-link').click(function(){
            MLS.ui.lightbox(this);
            $jQ("#new_overlay").css('display','none');
            return false;
        });

        var $form = $jQ('#save-cart-form');

        $form.find('input[type=submit]').click(function(e) {
            e.preventDefault();

            if ($form.valid() && !$form.data('submitted'))
            {
                $jQ("#save-cart-modal").fadeOut(300);
                $form.data('submitted', true);

                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.SAVE_CART,
                    $form.serialize(),
                    function(d) {
                        $form.data('submitted', false);
                        if(d.hasOwnProperty('error') && d.error.responseHTML != "")
                        {
                            MLS.modal.open(d.error.responseHTML, false, true, true).addClass('save-thanks');
                            $jQ('#shopping-cart').find('.new-data').bind('click',MLS.cart.modalfunction);
                        }
                        else
                        {
                            MLS.modal.open(d.success.responseHTML, false, true, true).addClass('success');
                        }
                        // Below line is added for QC# 9706.
                        MLS.ui.dropdownDisplay('#replace-cart-form .lightbox-fineprint');
                    },

                    function(r) {
                        $form.data('submitted', false);
                        MLS.modal.open("Unable to process you request", false, true, true).addClass('save-thanks');
                        $jQ('#shopping-cart .save-thanks').find('.new-data').bind('click',MLS.cart.modalfunction);
                    }
                );
            }

            return false;
        });

        var saveCartToSavedEmail = $jQ("input[name=saveCartTo]").eq(0),
            saveCartToEmail = $jQ("#save-cart-to-email"),
            saveCartInput = $jQ("#save-cart-email");

        saveCartToSavedEmail.click(function() {
            $jQ(this).parent().removeClass("unselected");
            saveCartInput.addClass("ignore").val("").change();
            $form.valid();
        }).click();

        saveCartToEmail.click(function() {
            saveCartToSavedEmail.parent().addClass("unselected");
            saveCartInput.removeClass("ignore");
        });

        saveCartInput.focus(function() {
            saveCartToEmail.click();
        });

        $form.validate({
            ignore: '.ignore, :hidden',

            rules: {
                saveCartEmail: {
                    required: true,
                    email: true
                }
            },

            messages: {
                saveCartEmail: {
                    required: 'Please enter your email to save your cart',
                    email: 'Email address is invalid - please try again.'
                }
            }
        });
        
        $jQ('#shopping-cart .modal-overlay').find('.close-btn').bind('click',MLS.cart.closeFunction);
        //$jQ('#shopping-cart .modal-overlay').find('.close-btn-0').bind('click',MLS.cart.closeFunction);
    },

    cartDetailsModals: function() {
        $jQ('.detail-link-ship').unbind('click').click(function() {
            $jQ('#detailShip .lightbox-close').remove();
            MLS.modal.open($jQ('#detailShip .lightbox-info-block').html(), false, true, true);
        });
     
        $jQ('.detail-link-return').unbind('click').click(function() {
            $jQ('#detailReturn .lightbox-close').remove();
            MLS.modal.open($jQ('#detailReturn .lightbox-info-block').html(), false, true, true);
        });

    	$jQ('.free-cart-link-ship').unbind('click').click(function() {
    	    $jQ('#freeCartShip .lightbox-close').remove();
    	    MLS.modal.open($jQ('#freeCartShip .lightbox-info-block').html(), false, true, true);
    	});
    },

    update: function(r) {
        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
            return MLS.modal.open(r.error ? r.error.responseHTML : null, false, true, true, true);
        }

        $jQ("#cart-header-summary").html(r.success ? r.success.itemCount : "0");

        $jQ("#cart-data").html(r.success.responseHTML);
        setTimeout(function() {
            $jQ("#cart-data").find('.update-msg:visible').fadeOut(1000);
        }, 4000);
        
        MLS.cart.initCartDetails();
        MLS.miniCart.init("#cart-data", MLS.cart.options); // initialize remove buttons

        // added for fixing defect #9750
        $jQ('.save-cart-link').click(function(){
            MLS.ui.lightbox(this);
            return false;
        });
    },
    
    modalfunction:function(){
    	$jQ('#shopping-cart .save-thanks').fadeOut(300);
    	$jQ('#save-cart-email').val('');
    	$jQ("#save-cart-modal").fadeIn(300);
    },
    
     closeFunction:function(){
     	$jQ('#shopping-cart .modal-overlay').fadeOut(300); 
     	$jQ("#shopping-cart .modal-overlay-background").css('display','none');
     	$jQ(".save-thanks").css('display','none');
        $jQ("#new_overlay").css('display','none');
    } 

}; // end cartCheckout




