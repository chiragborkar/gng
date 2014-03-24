MLS.miniCart = {
    started : true, // set to false if an ajax call is needed on pageload to refresh the minicart
    autoHideFlyout: true,

	callbacks : 
	{
        formSuccessCallback: null,

		addItem: function(e) 
		{
            if ($jQ(this).hasClass("ignore") || $jQ(this).parents(".add-cart").hasClass("disabled"))
            {
                return false;
            }
            
            var $form = this.form ? $jQ(this.form) : $jQ(this).parents("form");
            MLS.miniCart.callbacks.formSuccessCallback = $form.data("minicart-added");

            try
            {
                if ($form.find(":input").length == 0 || $form.find(":input").filter(":visible").valid())
                {
                    MLS.miniCart.addItem($form.serialize(), $jQ(this), $form);
                }
            } catch(ex)
            {
                MLS.miniCart.addItem($form.serialize(), $jQ(this), $form);
            }

        	return false;
        },

        removeItem: function(e) 
		{
            if ($jQ(this).hasClass("data-confirm-removal"))
            {
                MLS.miniCart.confirmItemRemoval($jQ(this));
            }
			else 
            {
                MLS.miniCart.removeItem($jQ(this).is("a") ? $jQ(this).attr("href").split("?")[1] : $jQ(e.target).parents("form").serialize());
                
                //Update mini-cart quantity in mega menu
                var temp = $jQ("#nav-mobile-cart").find(".count").html();
                temp -= $jQ(this).parents(".cart-qty-block").find(".detail-box .selector .selected").html();
                if(temp < 0) 
                    temp = 0;
                $jQ("#nav-mobile-cart").find(".count").html(temp);
            }

            return false;
        },

        updateItemSuccess : function (data) {
            if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
	    	    // error, unable to add to cart
	            // display error response: .append(data.error.responseHTML);
	            return MLS.modal.open(data.error ? data.error.responseHTML : null, false, true, true);
	        }

            var $tabs = $jQ('#nav-cart, .mini-cart'),
                $form = $jQ('#minicart-form'),
                itemCount = 0;

            $tabs.removeClass("empty").addClass(((MLS.miniCart.started && $jQ("#nav-cart").is(":visible"))? 'active' : '') + ((data.success.itemCount == 0) ? " empty" : ""));

            MLS.miniCart.started = true;

            // response needs to contain both elements and updated total
            $jQ("#nav-cart .count, #nav-mobile-cart .count").html(data.success.itemCount);
            MLS.miniCart.init(
                $form.hide().html(data.success.responseHTML), 
                MLS.miniCart.options
            );
            
            itemCount = $jQ('#minicart-item-list > li').length;

            if (data.success.itemCount == 0)
            {
                $form.removeAttr('style');
            }

            // $form.find("input:submit").uniform();
            
            // initialize scroll buttons on the mini-cart
            if (itemCount > 0 && itemCount < 4 ) {
                $jQ('.minicart-next').removeClass('on');
            } else if (itemCount > 3) {
                $jQ('.minicart-item').eq(0).attr('data-vpos', 0);
                $jQ('.minicart-item').each(function() {
                    MLS.ui.vScroll(this, 0);
                });
                $jQ('.minicart-next').addClass('on');
            }

            if (MLS.miniCart.started && $jQ("#nav-cart").is(":visible") && data.success.itemCount > 0)
            {
                $form.fadeIn();
            }

            if (MLS.miniCart.autoHideFlyout)
            {
                setTimeout(function() {
                    $tabs.removeClass("active");
                }, 7000);
            }
	    },

        scrollPrevious: function(e){
            e.preventDefault();
            if ($jQ(this).hasClass('off')) 
            {
                return false;
            }
            MLS.miniCart.callbacks.scroll("prev");
        },

        scrollNext: function(e){
            e.preventDefault();
            if ($jQ(this).hasClass('off')) 
            {
                return false;
            }
            MLS.miniCart.callbacks.scroll("next");
        },

        scroll: function(type) { // MINICART  scroll minicart items .............................................................
            if (type == "next") { // if scroll up, calculate max scroll up
                var items = $jQ('#minicart-item-list > li'),
                    inMini = items.length,
                    maxScrollPos = - (Math.ceil(inMini / 3) - 1) * 247,

                    // get current position
                    curPos = items.eq(0).attr('data-vpos'),

                    //calculate new offset before actually moving
                    newPos = curPos - 247;

                // check position, move and adjust options as required
                $jQ('.prev-items-link').addClass('on'); //turn on prev
                items.each(function() { // move up
                    MLS.ui.vScroll(this, newPos);
                });

                if (newPos > maxScrollPos) { // if beginning/middle
                    $jQ('.next-items-link').removeClass('off'); //turn on next if needed
                } else { // if end
                    $jQ('.next-items-link').addClass('off'); //turn off next
                }
            } else { // if scroll down
                // get current position
                var items = $jQ('#minicart-item-list > li'),
                    curPos = items.eq(0).attr('data-vpos'),
                    curPosParse = Math.ceil(curPos),

                    //calculate new offset before actually moving
                    newPos = curPosParse + 247;

                // check position, move and adjust options as required
                items.each(function(){ //move down
                    MLS.ui.vScroll(this, newPos);
                });

                $jQ('.next-items-link').removeClass('off'); //turn on next

                if (newPos == 0) { // if beginning/middle
                    $jQ('.prev-items-link').removeClass('on'); //turn off prev
                }
            }
        },
	},

    options: {

    },

	init : function (d, opts) 
	{
        var $d = $jQ(d || document);
        
        this.options = $jQ.extend({
            getCartEndpoint: MLS.ajax.endpoints.GET_MINICART,
            addToCartEndpoint: MLS.ajax.endpoints.ADD_TO_MINICART,
            updateCartEndpoint: MLS.ajax.endpoints.UPDATE_CART,
            removeFromCartEndpoint: MLS.ajax.endpoints.REMOVE_FROM_MINICART,
            successCallback: MLS.miniCart.callbacks.updateItemSuccess
        }, opts);

        if (this.options.disableFlyout)
        {
            $jQ("#nav-tab4").remove();
            $jQ("#nav-cart").addClass("disabled");
            return;
        } else {
            $jQ('#nav-cart').on('mouseenter', function() {
                $jQ(this).removeClass('active');
                $jQ("#nav-tab4").removeClass('active');
            });
        }

		$d.find('.data-cart-add').unbind('click', this.callbacks.addItem).bind('click', this.callbacks.addItem);
        $d.find('.data-cart-add').parents("form").submit(function(e) { 
            e.preventDefault();
            return false; 
        });
        
        $d.find('.data-cart-remove').unbind('click', this.callbacks.removeItem).bind('click', this.callbacks.removeItem);

        // free shipping modal
        $d.find('.minicart-banner.ship').click(function() {
            /*
            $jQ('#minicart-shipping-modal').appendTo("body").fadeIn();
            $jQ('#minicart-shipping-modal .lightbox-close').unbind("click").bind("click", function() {
                $jQ('#minicart-shipping-modal').fadeOut();
            });
            */
            $jQ('#minicart-shipping-modal .lightbox-close').remove();
            MLS.modal.open($jQ('#minicart-shipping-modal .lightbox-info-block').html(), false, true, true);
        });

        //$jQ("#minicart-form input:submit").uniform();

        var itemCount = $jQ("#minicart-item-list").children("li").length;
        if (itemCount == 0)
        {
            $tabs = $jQ('#nav-cart, .mini-cart').addClass("empty");
        } else if (itemCount > 3)
        {
            $jQ('.minicart-item').eq(0).attr('data-vpos', 0);
            $jQ('.minicart-item').each(function() {
                MLS.ui.vScroll(this, 0);
            });
            $jQ('.minicart-next').addClass('on');
        } else {
            $d.find('.next-items-link').addClass("off");
        }

        // next 3 items
        $d.find('.prev-items-link').unbind('click', this.callbacks.scrollPrevious).click(this.callbacks.scrollPrevious);
        $d.find('.next-items-link').unbind('click', this.callbacks.scrollNext).click(this.callbacks.scrollNext);

        !this.started && this.update();
    },

    checkForComplexItem: function(r, s)
    {
        var error = MLS.errors.checkForInlineErrors(r, s);

        if (!error && r.success && MLS.miniCart.callbacks.formSuccessCallback && typeof MLS.miniCart.callbacks.formSuccessCallback == 'function')
        {
            MLS.miniCart.callbacks.formSuccessCallback();
            MLS.miniCart.callbacks.formSuccessCallback = null;
        }

        if (!error && r.success && r.success.relatedProduct)
        {
            var modal = MLS.modal.open(r.success.relatedProduct).addClass('complex-item-modal').css({ top: 0 }),
                mixed = modal.find("#mixedcart");
            MLS.miniCart.init(modal, MLS.options);

            if (mixed.length > 0)
            {
                MLS.mixedCart.init(mixed);
            }
        }
    },

    // previously called 'minicartEdit'
    confirmItemRemoval : function($btn) {
        var $block = $btn.parents('.minicart-item'),
            $editBox = $btn.parents('.minicart-edit'),
            removeCallback = function() {
                MLS.miniCart.removeItem($jQ(this).attr("href").split("?")[1]);
            },
            //PA added changes for miniCart Remove
            removeHtml = $editBox.find('.edit').html();

        $block.css('background-color' , '#d6d9d9');
        $editBox.css('width', '120px').find('.edit').html('<a href="#" class="minicart-cancel-remove">Cancel</a>');
        $jQ('<div class="remove-msg">Are you sure you want to remove this item?</div>').appendTo($block.find('.item-info-block'));
        $btn.addClass('yes-remove').click(removeCallback);

        $editBox.find('.minicart-cancel-remove').click(function(e) { // cancel remove
            e.preventDefault();
            $block.css({ backgroundColor: 'transparent' }).find('.remove-msg').remove();
            $editBox.css('width', '96px').find('.edit').html(removeHtml);
            $btn.removeClass('.yes-remove').removeClass('yes-remove').unbind('click', removeCallback);

            // prevent memory leak
            removeCallback = $block = $editBox = null;
            return false;
        });
    },

    finalize: function()
    {
    	$jQ('[data-cart-add]').unbind('click', this.callbacks.addItem);	
    	$jQ('[data-cart-remove]').unbind('click', this.callbacks.removeItem);	
        $jQ('.next-items-link').unbind('click', this.callbacks.scrollUp);
        $jQ('.prev-items-link').unbind('click', this.callbacks.scrollNext);
    },

    update : function (params) {
        MLS.ajax.sendRequest(
            this.options.getCartEndpoint,
            params,
            this.options.successCallback
        );
    },

    addItem : function (params, elem, form) {
        var self = this,
            additional = form.find("[name=SSO_URL]").val(),
            o = MLS.miniCart.autoHideFlyout;

        MLS.miniCart.autoHideFlyout = true;
        elem.addClass("ignore");
        
        if (additional)
        {
            MLS.ajax.sendRequest(
                additional,

                null,

                function() {
                    // do nothing
                },

                function() {
                    // do nothing
                },

                "html"
            );
        }
        
    	MLS.ajax.sendRequest(
            this.options.addToCartEndpoint,
            params,
            function(r) 
            {
                elem.removeClass("ignore");
                var s = self.options.successCallback(r);
                self.checkForComplexItem(r, s);
                siteCatalyst();
                MLS.miniCart.autoHideFlyout = o;
                
                if(isTouch && R.band(0, 767))
                {
                    document.location = $jQ("#nav-cart > a").attr("href");
                }
            },
            function() {
                elem.removeClass("ignore");
            }
        );

        //commenting this out. and moving it into the ajax call back. otherwise this gets called before the item actually gets added to the cart.
        // if(isTouch)
        //     document.location = $jQ("#nav-cart > a").attr("href");

    },

    updateItem : function (params, callback) {
        var self = this;
    	MLS.ajax.sendRequest(
            this.options.updateCartEndpoint,
            params,
            function(r) 
            {
                var s = self.options.successCallback(r);
                self.checkForComplexItem(r, s);
                typeof callback == 'function' && callback(r);
            },
            function() {
                return false;
            }
        );
    },

    removeItem : function (params) {
        var self = this;
    	MLS.ajax.sendRequest(
            this.options.removeFromCartEndpoint,
            params,
            function(r) 
            {
                var s = self.options.successCallback(r);
                self.checkForComplexItem(r, s);
            }
        );
    }
};
