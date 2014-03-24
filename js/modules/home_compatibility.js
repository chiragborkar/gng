MLS.homeCompatibility = (function() {
	var hashLoaded = false,
        options = {
            callback: function () {},
            container: null,
            results: null
        },

        pub = {
			init: function(o) {
				options = $jQ.extend(options, {
					endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW
				}, o);
				
				$jQ(options.container).find('#brand').unbind('click', pub.compatibilitySearch).on('click', pub.compatibilitySearch);
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
				console.log("home-compat currentNavState");
				passParam = queryString.split("&")[0];
				queryStringFinal = $e.val() + "&Ntt=" + $jQ.trim(keyVal) + "*";
				return queryStringFinal;
			},			

			lastRequest: null,

			compatibilitySearch: function (e) {
				if (!$jQ(this).data("stoptrigger")) {
        			
					var timeout = null;

					if (MLS.homeCompatibility.lastRequest != null)
					{
						MLS.homeCompatibility.lastRequest.error(function() {
							// do nothing, aborting.
						});
						MLS.homeCompatibility.lastRequest.abort();
						MLS.homeCompatibility.lastRequest = null;
					}

					console.log("endpoint := ",options.endpoint);

	                MLS.homeCompatibility.lastRequest = MLS.ajax.sendRequest(
			            options.endpoint,

			            pub.currentNavState($jQ(this)),

			            function (data) {
			            	MLS.homeCompatibility.lastRequest = null;

			            	if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
					    	    return MLS.modal.open(data.error ? data.error.responseHTML : null, false, true, true);
					        }

					        if (timeout != null)
					        {
					        	clearTimeout(timeout);
					        	timeout = null;
					        }

					        if (data.success.responseHTML == "") {

					        }

					        /*var error = $jQ("#device-not-found");
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
					        }*/
					        var $r = $jQ(options.results),
			            		v = null;
			            	$r.find('#device').html(data.success.responseHTML);
			            	$r.show();
							$jQ("#device").select2("open");
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