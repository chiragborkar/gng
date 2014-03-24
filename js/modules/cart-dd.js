MLS.cart.dd = {
    endpoint: null,

    init: function () {
        this.endpoint = MLS.ajax.endpoints.GET_CART_DD_ATTRIBUTES;

        // needs to be initialized before the form trigger otherwise it will not update the form
        MLS.cart.dd.triggers.ddColor();
        MLS.cart.dd.triggers.form();
        MLS.cart.dd.triggers.ddSizeClick();
    },

    triggers: {
        form: function (){
            $jQ(".data-product-attributes").change(function(){
                var p = $jQ('.pdp-size-color :input', this).serialize();

                // PA Requested update for IE8 (8/16 16:32)
                if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                    p = p.split("&_")[0];
                }

                if (p != MLS.cart.dd.params)
                {
                    MLS.cart.dd.params = p;
                    MLS.cart.dd.container = $jQ(this);

                    MLS.ajax.sendRequest(
                        MLS.cart.dd.endpoint,
                        MLS.cart.dd.params,
                        MLS.cart.dd.populate.init
                    );
                }
            });
        },

        ddColor: function(){
            // update the custom color dd
            $jQ(".color a").click(function () {
                var $dd = $jQ(this).parents('form').find("[name=pdpColorSelect], #colorSelect"),
                    // color = MLS.util.getUrlParam("color", $jQ(this).attr("href"));
                    color = $jQ(this).attr("href").split("=")[1];

                $dd.val(color);
                $jQ(".data-product-attributes").change(); // needs to triger the form change
            })
        },

        ddSizeClick: function(){
            $jQ("#pdp-size-select").change(function () {
                MLS.cart.dd.endpoint = MLS.ajax.endpoints.GET_PDP_SELECTSIZE_ATTRIBUTES;
            });
        }
    },

    populate : {
        init: function (data){
            if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
                return MLS.modal.open(data.error ? data.error.responseHTML : null, false, true, true);
            }

            var values = data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML;
            MLS.cart.dd.endpoint = MLS.ajax.endpoints.GET_CART_DD_ATTRIBUTES;

            if (values.hasOwnProperty('carouselID')) {
                MLS.cart.dd.populate.carousel(values.imageID, values.carouselID, values.view360ID);
            }

            if (values.hasOwnProperty('sku'))
            {
                $jQ("#product-sku-field").html("SKU #" + (values.sorSkuId ? values.sorSkuId : values.sku));
                $jQ("#pdp-hero input[name=sku], #pdp-hero .catalogRefIdValue, #quick-view-overlay .catalogRefIdValue").val(values.sku);
            }

            if (values.hasOwnProperty('productName'))
            {
                $jQ("#pdp-cart-header .product-title").html(values.productName);
                $jQ("#quick-view-overlay .quick-view-details .product-name").html("<span class='brand'>" + $jQ("#quick-view-overlay .quick-view-details .product-name span").html() + "</span> " + values.productName);
            }

            if (values.hasOwnProperty('price'))
            {
                $jQ("#pdp-hero .data-product-attributes .price-block").html(values.price);
            }

            if (values.hasOwnProperty('sizes'))
            {
                MLS.cart.dd.populate.ddSizes(values.sizes);
            }
            if(values.hasOwnProperty('inStock') == "true")
            {
                $jQ('.productStatus .outOfStock').hide();
            }
        },

        ddSizes: function(data){
            var $s = MLS.cart.dd.container.find("#pdp-size-select"),
                val = $s.val(),
                tx = $s.find("option:selected").html() || $s.find("option:eq(0)").html();

            $s.html(data).val(val);
            tx = $s.find("option:selected").html() || $s.find("option:eq(0)").html();
            $s.siblings("span").html(tx);
        },

        carousel : function (imageID, carouselID, view360ID) {
            var $large = $jQ('#quick-view-slider');
                $thumbs = $large.siblings("#thumbs");

            if (!$large.is(":visible"))
            {
                // $large = $jQ('[id=focus]');
                $large = $jQ('#focus');
                // $thumbs = $large.parent().find("#thumbs");
                $thumbs = $jQ("#thumbs");
            }

            // Update Hero slideshow
            $jQ('#heroImageSetID').val(carouselID);

             // Update 360 view
            $jQ('#imageSetID').val(view360ID);

            $jQ('#imageID').val(imageID);

            if (!view360ID)
            {
                $jQ(".view-360-box").hide();
            } else {
                $jQ(".view-360-box").show();
            }

            $large.each(function(i, item) {
                MLS.scene7.finalizeGallery({
                    $largeContainer: $jQ(item),
                    $thumbsContainer: $thumbs.eq(i)
                });

                MLS.scene7.loadGallery({
                    galleryID: $jQ('#heroImageSetID').val() || $jQ('#imageID').val(),
                    $largeContainer: $jQ(item),
                    $thumbsContainer: $thumbs.eq(i),
                    callback: function(images) {
                        $jQ("#btf-anchor .anchor-thumb img").attr("src", MLS.scene7.thumbnailImage(images[0]));
                        if ($jQ("#anchor-product-size").length > 0 && $jQ("#pdp-hero #pdp-size-select option:selected").length > 0)
                        {
                            $jQ("#anchor-product-size").html($jQ("#pdp-hero #pdp-size-select option:selected").html());
                        }
                        
                        if ($jQ("#anchor-product-color").length > 0 && $jQ("#pdp-hero #product-colors .color.active").length > 0) 
                        {
                            $jQ("#anchor-product-color").html($jQ("#pdp-hero #product-colors .color.active").data("color"));
                        }
                    }
                });
            });


            // reinitialize sliders (only the ones already created)
            // var $slides = $jQ("<div></div>").html(data),
            //     $thumbs = $jQ("<div></div>").html(thumb),
            //     sliders = "#quick-view-slider",
            //     controls = "#quick-view-overlay .slider-controls";

            // if (MLS.cart.dd.container.parents("#quick-view-overlay").length == 0)
            // {
            //     sliders = "#focus, #zoom-focus";
            //     controls = "#zoom-thumbs, #thumbs";
            // }

            // $jQ(sliders).each(function() {
            //     var s = $jQ(this).data("flexslider");
            //     if (!s) {
            //         return;
            //     }

            //     s.slides.each(function() {
            //         s.removeSlide(this);
            //     });

            //     $slides.children("li").each(function() {
            //         s.addSlide($jQ(this).clone());
            //     });

            //     $jQ(this).flexslider(0);
            // });

            // $jQ(controls).each(function() {
            //     var self = $jQ(this),
            //         s = self.data("flexslider"),
            //         first = null,
            //         slide = "";

            //     switch(this.id)
            //     {
            //         case "zoom-thumbs":
            //             slide = "#zoom-focus";
            //             break;
            //         case "thumbs":
            //             slide = "#focus";
            //             break;
            //         default:
            //             slide = "#quick-view-slider";
            //             break;
            //     }

            //     if (!s) {
            //         return;
            //     }

            //     s.slides.each(function() {
            //         s.removeSlide(this);
            //     });

            //     $thumbs.children("li").each(function(i) {
            //         var $e = $jQ(this).clone();

            //         if (i == 0) {
            //             $e.addClass("active flex-active-slide");
            //         }

            //         s.addSlide($e.click(function() {
            //             $jQ(slide).flexslider($e.index());
            //         }));
            //     });

            //     $jQ(this).flexslider(0);
            // });

            // $slides.remove();
            // $slides = null;
            // $thumbs.remove();
            // $thumbs = null;
            // return;




        }
    }
}


