MLS.compatibility = (function() {
	var $cf = $jQ('#content-filter'),
        hashLoaded = false,
        options = {
            callback: function () {},
            container: null,
            results: '.compat-results'
        },
        typeAheadTimeout = null,

        pub = {
			init: function(o) {
				options = $jQ.extend(options, {
					endpoint: MLS.ajax.endpoints.COMPATIBILITY_SEARCH
				}, o);
				//if ($jQ('#phntbltwrapper').length < 1) {
				//$jQ(options.container).find('#phntblselectors select').unbind('change', pub.compatibilitySearch).on('change', pub.compatibilitySearch).select2();//.uniform();
				//}
				$jQ(options.container).find('.compatibility-filter input.type-ahead').unbind('keyup', pub.typeAhead).bind('keyup', pub.typeAhead);
				//$jQ(options.results).tinyscrollbar({ sizethumb: 65 });

		        if ($jQ(options.results).find("ul.items > li").length == 0)
		        {
		        	$jQ(options.results).hide();
		        } else {
		        	$jQ(options.results).find('ul.items > li a').click(options.callback);
		        }
			},

			currentNavState: function ($e) {
				if ($e.is('select#device') || $e.is('select#brand')) {
					return MLS.util.getParamsFromUrl($e.val().split("?")[0]) + "&Ntt=*";
				}

				var keyVal = $jQ('#searchText').val() || "",
					servletPath = $jQ('#servletPath').val() || "",
					queryString = $jQ('#queryString').val() || "",
					slicePath = "",
					queryStringFinal = "";

				if (queryString == "") {
					slicePath = "/" + servletPath.split("/")[servletPath.split("/").length-1];
					queryString = slicePath;
				}
				console.log("compatibility.js currentNavState");
				passParam = queryString.split("&")[0];
				queryStringFinal = queryString.split("&")[0] + "&Ntt=" + $jQ.trim(keyVal) + "*";
				return queryStringFinal;
			},

			finalize: function() {
				$jQ(options.container).find('.compatibility-filter select').unbind('change', pub.compatibilitySearch);
				$jQ(options.container).find('.compatibility-filter input.type-ahead').unbind('keyup', pub.typeAhead);
			},

			typeAhead: function(e)
			{
				if (typeAheadTimeout != null)
                {
                    clearTimeout(typeAheadTimeout);
                    typeAheadTimeout = null;
                }
 
                var self = this;

                if ($jQ(self).val() == "")
                {
                	$jQ(options.results).hide().find('ul.items').empty();
                	return;
                }
 
                typeAheadTimeout = setTimeout(function() {
                    var $form = $jQ(self).parents('form');
                    // data = $form.serialize();
 
 					// do not submit form in enter
                    $form.unbind('submit').on('submit', function (e) { 
                    	e.preventDefault(); 
                    	return false; 
                    });
 
                    // set hash
                    // window.location.hash = data;
                    // MLS.util.updateUrl(data);
 
                    // make request
                    pub.compatibilitySearch.apply(self, [e]);
                }, 500);
			},

			lastRequest: null,

			compatibilitySearch: function (e) {
				if (!$jQ(this).data("stoptrigger")) 
        		{
        			//fix for 
        			$jQ(this).parents(".compatibility-filter").find("select, input").not(this).val('').each(function (index, elem) {
    					if($jQ(elem).is("select")) {
    						$jQ(elem).siblings("span").html($jQ(elem).find(":selected").text());
    					}
        			});

					var form = $jQ(this).parents("form"),
						brands = form.find("select[name=deviceBrand],select[name=brand]"),
						devices = form.find("select[name=deviceType],select[name=type],select[name=device-type]"),
						timeout = null;

					if (MLS.compatibility.lastRequest != null)
					{
						MLS.compatibility.lastRequest.error(function() {
							// do nothing, aborting.
						});
						MLS.compatibility.lastRequest.abort();
						MLS.compatibility.lastRequest = null;
					}

	                MLS.compatibility.lastRequest = MLS.ajax.sendRequest(
			            options.endpoint,

			            pub.currentNavState($jQ(this)),

			            function (data) {
			            	MLS.compatibility.lastRequest = null;

			            	if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
					    	    return MLS.modal.open(data.error ? data.error.responseHTML : null, false, true, true);
					        }

					        if (timeout != null)
					        {
					        	clearTimeout(timeout);
					        	timeout = null;
					        }

					        var error = $jQ("#device-not-found");
							if (data.success.responseHTML == "")
					        {
                                error.fadeIn().find(".tooltip-close").unbind('click').click(function() {
                                    error.fadeOut();
                                    if (timeout != null)
							        {
							        	clearTimeout(timeout);
							        	timeout = null;
							        }
                                    return false;
                                });

                                timeout = setTimeout(function() {
                                    error.fadeOut();
                                	timeout = null;
					            }, 4000);
					        } else {
					        	if (timeout != null)
						        {
						        	clearTimeout(timeout);
						        	timeout = null;
						        }
					        	error.hide();
					        }

			            	var $r = $jQ(options.results),
			            		v = null;
			            	$r.find('#device').html(data.success.responseHTML);
			            	$r.show();
			            	//$jQ("#device").select2("open");

			            	setTimeout(function() {
			            		//$r.tinyscrollbar_update();
			            	}, 300); 

			            	$r.find('ul.select2-results div').click(options.callback);

			            	if (data.success.hasOwnProperty('brands'))
			            	{
			            		v = brands.val();
			            		brands.data("stoptrigger", true).html(data.success.brands).val(v).change().data("stoptrigger", false);
			            	}

			            	if (data.success.hasOwnProperty('devices'))
			            	{
			            		v = devices.val();
			            		devices.data("stoptrigger", true).html(data.success.devices).val(v).change().data("stoptrigger", false);
			            	}
			            }
		        	);
				}
            },

            updateResults: function(r)
            {
				options.callback(r);
            }
		};

	return pub;
} ());