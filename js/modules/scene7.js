MLS.scene7 = {
	// cannot use jquery's jsonp because the name of the variable is "handler" instead of "callback"
	counter: 0,
	callbacks: {},

	// an image set
	endpoints: {
		RETRIEVE: "http://s7.vzw.com/is/image/VerizonWireless/{PRODUCT_ID}?req=imageset,json",
			/*
			s7jsonResponse(
			{"IMAGE_SET":"VerizonWireless/lg%20lucid_001_close_spin,VerizonWireless/lg%20lucid_016_close_spin,VerizonWireless/lg%20lucid_015_close_spin,VerizonWireless/lg%20lucid_014_close_spin,VerizonWireless/lg%20lucid_013_close_spin,VerizonWireless/lg%20lucid_012_close_spin,VerizonWireless/lg%20lucid_011_close_spin,VerizonWireless/lg%20lucid_010_close_spin,VerizonWireless/lg%20lucid_009_close_spin,VerizonWireless/lg%20lucid_008_close_spin,VerizonWireless/lg%20lucid_007_close_spin,VerizonWireless/lg%20lucid_006_close_spin,VerizonWireless/lg%20lucid_005_close_spin,VerizonWireless/lg%20lucid_004_close_spin,VerizonWireless/lg%20lucid_003_close_spin,VerizonWireless/lg%20lucid_002_close_spin"},"");
			*/

		THUMBNAIL: "http://s7.vzw.com/is/image/{IMAGE}?$acc-lg$&wid=90&hei=90",
		MEDIUM: "http://s7.vzw.com/is/image/{IMAGE}?$acc-lg$&wid=565&hei=565&fmt=jpg&bgc=ebeeee&qlt=75",
        LARGE: "http://s7.vzw.com/is/image/{IMAGE}?$acc-lg$&wid=1080&hei=1440&fit=fit,1&fmt=jpg&bgc=ebeeee&qlt=75",
        HOTSPOTS: "http://s7.vzw.com/is/image/VerizonWireless/{PRODUCT_ID}?$acc-lg$&req=map,json",
        DEFAULT: "VerizonWireless/{IMAGE}"
	},

	thumbnailImage: function(elem) {
		return this.endpoints.THUMBNAIL.replace("{IMAGE}", elem);
	},

	mediumImage: function(elem) {
		return this.endpoints.MEDIUM.replace("{IMAGE}", elem);
	},

    largeImage: function(elem) {
        return this.endpoints.LARGE.replace("{IMAGE}", elem);
    },

    defaultImage: function(elem) {
        return this.endpoints.DEFAULT.replace("{IMAGE}", elem);
    },

	gallery: function(pid, success, error)
	{
		var s = this,
			c = s.counter++;

		window['scene7Callbacks' + c] = function(d) {
			if (d.hasOwnProperty("IMAGE_SET"))
			{
				var images = [];

				$jQ(d.IMAGE_SET.split(',')).each(function() {
					var _tmp = this.toString().split(";");
					_tmp[0] != "" && images.push(_tmp[0]); // what's _tmp[1] for???
				});

				success && success.apply(s, [images]);
				window['scene7Callbacks' + c] = null;
			} else {
				error && error.apply(s, arguments);
			}
		};

		/*
		function(d) {
			if (d.IMAGE_SET)
			{
				var $large = $jQ("#container .large"),
					$thumbs = $jQ("#container .small"),
					$zoomed = $jQ("#container .zoomed");

				$jQ(d.IMAGE_SET.split(',')).each(function() {
					var _tmp = this.toString().split(";");

					$jQ(new Image()).attr({
						src: MLS.Scene7.endpoints.LARGE.replace("{IMAGE}", _tmp[0])
					}).appendTo($large);

					$jQ(new Image()).attr({
						src: MLS.Scene7.endpoints.THUMBNAIL.replace("{IMAGE}", _tmp[0])
					}).appendTo($thumbs);
				});
			} else {
				alert("sorry, there was an error requesting Scene7 imageset");
			}
		};
		*/

		$jQ.ajax({
			type: 'GET',
			url: s.endpoints.RETRIEVE.replace("{PRODUCT_ID}", pid),
			data: "handler=scene7Callbacks" + c,
			async: false,
			dataType: "jsonp",
			contentType: "application/json"
		});
	},

	// zoom: function(pid, success, error) {
	// 	var s = this,
	// 		c = s.counter++;

	// 	window['scene7Callbacks' + c] = function(d) {
	// 		if (d.set)
	// 		{
	// 			success.apply(s, arguments);
	// 			window['scene7Callbacks' + c] = null;
	// 		} else {
	// 			error && error.apply(s, arguments);
	// 		}
	// 	};


	// 	window['s7jsonResponse'] = function(d) {
	// 		if (d.set)
	// 		{
	// 			var $zoomed = $jQ("#container .zoomed");
	// 			$jQ(new Image()).attr({
	// 				src: MLS.Scene7.endpoints.ZOOMED_LARGE.replace("{IMAGE}", d.set.item.i.n).replace("{ID}", d.set.item.iv)
	// 			}).appendTo($zoomed);

	// 			$jQ(new Image()).attr({
	// 				src: MLS.Scene7.endpoints.ZOOMED_THUMBNAIL.replace("{IMAGE}", d.set.item.i.n).replace("{ID}", d.set.item.iv)
	// 			}).appendTo($zoomed);
	// 		} else {
	// 			alert("error!");
	// 		}
	// 	};


	// 	$jQ.ajax({
	// 		type: 'GET',
	// 		url: s.endpoints.ZOOM_DETAILS.replace("{PRODUCT_ID}", pid),
	// 		data: "handler=scene7Callbacks" + c,
	// 		async: false,
	// 		dataType: "jsonp",
	// 		contentType: "application/json"
	// 	});
	// }


	hotspots: function(pid, success, error){
        var s = this,
            c = s.counter++;

        window['scene7Callbacks' + c] = function(d) {
            if (d.length > 0)
            {
                success && success.apply(s, arguments);
                window['scene7Callbacks' + c] = null;
            } else {
                error && error.apply(s, arguments);
            }
        };

        $jQ.ajax({
            type: 'GET',
            url: s.endpoints.HOTSPOTS.replace("{PRODUCT_ID}", pid),
            data: "handler=scene7Callbacks" + c,
            async: false,
            dataType: "jsonp",
            contentType: "application/json"
        });
    },


    loadGallery: function (params) {
        // console.log(params.$thumbsContainer.attr('id'));

        var initSliders = function() {

            // destroy flexslider
            params.$thumbsContainer.data("flexslider", null);
            params.$largeContainer.data("flexslider", null);

            var $items = params.$thumbsContainer.find('ul.slides').children(),
                itemsQty = $items.length > 4 ? 4 : $items.length,
                itemW = 45,
                itemM = 10;

            // params.$thumbsContainer.find('ul.slides').width( itemsQty * (itemW + itemM) );

            var $thumbsNav = params.$thumbsContainer.find('.flex-direction-nav'),
                $largeNav = params.$largeContainer.find('.flex-direction-nav');

            $thumbsNav.length > 1 && $thumbsNav.first().remove();
            $largeNav.length > 1 && $largeNav.first().remove();

			// new flexslider
            params.$thumbsContainer.length > 0 && params.$thumbsContainer.flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: false,
                slideshow: false,
                directionNav: $jQ("html").hasClass("no-touch"),
                itemWidth: itemW,
                itemMargin: itemM,
                minItems: $items.length,
                asNavFor: '#' + params.$largeContainer.attr('id')
            });

            params.$largeContainer.length > 0 && params.$largeContainer.flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: false,
                directionNav: $jQ("html").hasClass("no-touch"),
                slideshow: false,
                sync: '#' + params.$thumbsContainer.attr('id')
            });

            // remove empty flex viewports after ajax requests
            $jQ('.flex-viewport:empty, .flex-direction-nav:empty').remove();
        };

        if (!params.galleryID)
        {
			initSliders();

			params.center && params.$largeContainer.find("img").each(function() {
				if ($jQ(this).height() > 0)
				{
					$jQ(this).css({
						position: 'relative',
	            		top: -10 + ($jQ(this).parent().height() - $jQ(this).height()) / 2
	            	});
				}
			});

			if (params.callback)
            {
            	params.callback(images);
            }
        } else {
        	MLS.scene7.gallery( params.galleryID, function (images) {
	            var self = this,
	            	isltie8 = $jQ("html").hasClass("lt-ie9");

	            $large = params.$largeContainer.find('.slides'),
	            $thumbs = params.$thumbsContainer.find('.slides');

	            if (!images || images.length == 0)
	            {
	            	if ($jQ('#heroImageDefault').length > 0)
	            	{
	                	images = [$jQ('#heroImageDefault').val()];
	                } else {
	                	images = [MLS.scene7.defaultImage(params.galleryID)];
	                }
	            }

	            $jQ(images).each(function () {
	                var attr = {
						src: self.mediumImage(this.toString()),
						'data-zoom-medium': self.mediumImage(this.toString()),
                        'data-zoom-large': self.largeImage(this.toString())
                	};

                	if (isltie8)
                	{
                		attr.width = 687;
                		attr.height = 687;
                	}

	                $jQ('<li></li>').append(
	                	$jQ(new Image()).one('load',function() {
	                    	/*
	                    	var me = $jQ(this);

	                    	params.center && setTimeout(function() {
	                    		if (me.height() > 0)
	                    		{
		                    		me.css({
			                    		position: 'relative',
		            					top: -10 + (me.parent().height() - me.height()) / 2
			                    	});
		                    	}
							}, 200);
							*/
	                    }).attr(attr)
	                ).appendTo($large);

	                if (images.length > 1)
	                {
		                $jQ('<li></li>').append(
		                    $jQ(new Image()).attr({
		                        src: self.thumbnailImage(this.toString())
		                    })
		                ).append('<div class="vzn-active"></div>').appendTo($thumbs);
		            }
	            });

	            initSliders();

	            if (params.callback)
	            {
	            	params.callback(images);
	            }
	        });
        }
    },

    finalizeGallery: function (params) {
    	var fs = params.$largeContainer.data("flexslider"), i = 0;
        if (fs)
        {
        	for(i=fs.count; i>0; i--)
        	{
        		fs.removeSlide(i-1);
        	}
        }

        fs = params.$thumbsContainer.data("flexslider");
        
        if (fs)
        {
        	for(i=fs.count; i>0; i--)
        	{
        		fs.removeSlide(i-1);
        	}
        }

		// destroy flexslider
        params.$thumbsContainer.data("flexslider", null);
        params.$largeContainer.data("flexslider", null);

        // delete slides
        params.$thumbsContainer.find('.slides').empty().removeAttr("style");
        params.$largeContainer.find('.slides').empty().removeAttr("style");
        params.$largeContainer.find(".flex-direction-nav").empty().remove();
    },

    finalizeHotspots: function(el)
    {
    	$jQ(el).find("map").remove();
    },

    $icon: null,
    hotspotCounter: 0,

    loadingIconMove: function(e) {
    	if (MLS.scene7.$icon == null)
    	{
    		MLS.scene7.$icon = $jQ('<span id="loader-image" class="follower">loading...</span>').appendTo("body");
    	}

    	var ic = MLS.scene7.$icon;

    	ic.show().css({
    		top: e.pageY - 40,
    		left: e.pageX - 20
    	});
    },

    loadHotspotInfo: function() {
   		if (!$jQ(this).data('hotspot-info'))
   		{
   			var s = $jQ(this),
   				params = s.data('params'),
   				slide = s.data('slide'),
   				value = s.data('value'),
   				scaleX = s.data('scaleX'),
   				scaleY = s.data('scaleY'),
   				x = value.coords[0],
   				y = value.coords[1];

			if (value.coords.length == 8)
			{
				// rectangle, place in the middle
				x = (value.coords[4] + value.coords[0]) / 2;
				y = (value.coords[5] + value.coords[1]) / 2;
			}

			if (scaleX)
			{
				x = x * scaleX;
			}

			if (scaleY)
			{
				y = y * scaleY;
			}

			$jQ(document).mousemove(MLS.scene7.loadingIconMove).mousemove();
			MLS.ajax.showLoadingModal = false;

			MLS.ajax.sendRequest(
	            MLS.ajax.endpoints.HOTSPOTS_DETAILS,

	            {
	            	ProductId: s.data('ProductId')
	            },

	            function(r) {
	            	setTimeout(function() {
		            	MLS.ajax.showLoadingModal = true;
		            	MLS.scene7.$icon.hide();
		            	$jQ(document).unbind('mousemove', MLS.scene7.loadingIconMove);

		            	var $e = $jQ(r.success.responseHTML);
		            	//$e.find("input").uniform();
		            	$e.find(".add-cart").addClass("hotspot");
		            	$e.find("form").submit(function(e) {
		            		e.preventDefault();
		            		return false;
		            	});
		            	s.data('hotspot-info', $e);
		            	MLS.miniCart.init($e, MLS.miniCart.options);

						MLS.ui.gridHover(s, {
							topBar: $e.find('.color-picker'),
							element: $e,
							actions: $e.find('.content-details')
	                    }, 0, {
	                        width: 180,
	                        height: 310,
	                        left: function() {
	                        	return s.parent().offset().left + x - $jQ("#site-container").offset().left - 90
	                        },
	                        top: function() {
	                        	return slide.parent().offset().top + y
	                        },
	                        touch: isTouch,
	                        redirect: true
	                    });
	                    /*
	                    $e.find('.hotspot-item').find('.content-link').find('figure').click();
	                    if(isTouch) {
	                    	// s.trigger('touchstart');
                            $e.find('.hotspot-item').find('.content-link').find('figure').click(); // force click
	                    }
	                    */
	                }, 1000);
	            }
	        );
   		} else {
   			$jQ(this).unbind('mouseenter touchstart', MLS.scene7.loadHotspotInfo);
   		}
   	},

    loadHotspots: function(params) {
		$jQ(params.element).each(function() {
            var slide = $jQ(this),
            	val = slide.find("[name=ProductId]").val();

            MLS.scene7.finalizeHotspots(slide);

            if (val)
            {
	            MLS.scene7.hotspots(
	                val,

	                function(r) {
	                    // check for map tag
	                    if ( slide.find(params.figure).find("map").length > 0 ) {
	                        return;
	                    }

	                    //else create the map and bind it to the image
	                    else {
	                    	var c = MLS.scene7.hotspotCounter++;
	                        slide.find(params.figure).append("<map name='map" + c + "' />");
	                        slide.find(params.figure).find("img").attr('usemap', "#map" + c );
	                    }

	                    // adding  map area
	                    $jQ(r).each(function(key, value) {
	                        var area = $jQ("<area />").attr({
	                                shape: value.shape,
	                                coords: value.coords,
	                                href: value.href || value.onmouseover,
	                                alt: ""
	                            }),
	                            map = slide.find(params.figure).find("map"),
								productId = value.href ? area.attr("href").replace('"', "'").split("'")[1] : area.attr("href").split("(")[1].replace(")", ""),
								x = value.coords[0],
				   				y = value.coords[1],
				   				icon = $jQ("<span>+</span>").addClass('plus').appendTo(slide.find(params.figure)),
				   				img = slide.find(params.figure).find("img");

							if (value.coords.length == 8)
							{
								// rectangle, place in the middle
								x = (value.coords[4] + value.coords[0]) / 2;
								y = (value.coords[5] + value.coords[1]) / 2;
							}

							if (img.prop("naturalWidth"))
							{
								var sX = img.width() / img.prop("naturalWidth");
								icon.data('scaleX', sX);
								x = x * sX;
							}

							if (img.prop("naturalHeight"))
							{
								var sY = img.height() / img.prop("naturalHeight");
								icon.data('scaleY', sY);
								y = y * sY;
							}

							// add icon
							icon.css({
								position: 'absolute',
								top: y,
								left: x
							}).data('params', params).data('slide', slide).data('value', value);

							// map.append(area.data('params', params).data('slide', slide).data('value', value));

							// $jQ(area).data('ProductId', productId).mouseenter(MLS.scene7.loadHotspotInfo);
							$jQ(icon).data('ProductId', productId).bind('mouseenter touchstart',MLS.scene7.loadHotspotInfo);
	                    });
	                },

	                function() {
	                    console.log("error");
	                }
	            );
			}
        });
    }





};

