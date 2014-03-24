MLS.bazaarVoice = {
	options: {
		dev: false,
		version: "5.4",
		passkey: "l0ky0mc0oqx7sb9i2vwo3nvln",
		featuredOnly: true
	},
	
	init: function(d, opts) {
		Date.prototype.getMonthName = function(lang) {
		    lang = lang && (lang in Date.locale) ? lang : 'en';
		    return Date.locale[lang].month_names[this.getMonth()];
		};

		Date.prototype.getMonthNameShort = function(lang) {
		    lang = lang && (lang in Date.locale) ? lang : 'en';
		    return Date.locale[lang].month_names_short[this.getMonth()];
		};

		Date.locale = {
		    en: {
		       month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		       month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		    }
		};

		opts = $jQ.extend(MLS.bazaarVoice.options, opts);
		
		var $d = $jQ(d || document);
			url = BV_URL,
			params = "",
			items = $jQ(".data-bazaarvoice"),
			pids = ""; 

		items.each(function(i, item) {
			var v = $jQ(this).find("input[name=ProductId]").val();
			if (v.length > 0)
			{
				pids += (i > 0 ? "," : "") + v;
			}
		});

		// params.Filter = (opts.category ? "CategoryId:" + opts.category : "");
		if (pids.length == 0)
		{
			return;
		}

		params += 
			"ApiVersion=" + opts.version +
			"&passkey=" + BV_PASSKEY +
			(opts.featuredOnly ? "&Filter=IsFeatured:true" : "") +
			"&Filter=ProductId:" + pids +
			"&ExcludeFamily=true" +
			"&Stats=Reviews" +
			"&Include=Reviews,Categories" +
			"&Sort=LastModeratedTime:desc";

		$jQ.ajax({
            url: url,
            data: params,
            cache : false,
            
            success : function(r) {
				// show error messages
				/*
            	if (r.HasErrors)
	            {
		            var err = "";
		            $jQ(r.Errors).each(function() {
			            err += "&bull;" + this.Message + "\n";
			        });
			        
		            alert($jQ("<span></span>").html(err).html());
		        }
		        */

		        var resize = function(e) {
            		var rv = function() {
	            		var c = 999, t = e.data("review");
	            		if (R.band(0, 1023))
	            		{
							c = 30;
	            		} else if (R.band(1024, 1279)) {
							c = 60;
	            		} else {
	            			c = 90;
	            		}

	            		if (t.length > c)
		            	{
		            		t = t.substr(0, c) + "...";
		            	}

		            	e.html("&ldquo;" + t + "&rdquo;");
		            };

		            rv();
		            return rv;
            	};

				$jQ(r.Results).each(function(i, review) {
			        items.each(function(j, item) {
		        		item = $jQ(item);
			            var pid = item.find("input[name=ProductId]").val(),
			            	q = item.find(".data-bazaarvoice-quote"),
			            	u = item.find(".data-bazaarvoice-user"),
			            	d = item.find(".data-bazaarvoice-date"),
			            	dt = null;

		            	if (pid == review.ProductId)
			            {
		            		if (q.html() == "")
				            {
				            	dt = new Date(Date.parse(review.LastModificationTime));
				            	q.data("review", review.ReviewText);

				            	$jQ(window).resize(resize(q));
				            	// q.html("&ldquo;" + review.ReviewText + "&rdquo;");
					            u.html(review.UserNickname);
					            d.html(dt.getMonthName() + " " + dt.getFullYear());
					            item.find(".credit").show();
					        }
					        
				            return false; // once found, stop looking for the same product
				    	}
		            });
		        });
            },

            error : function () {
            	/*
            	alert("There was an error contacting Bazaar Voice API, please refresh to try again.");
            	*/
            },
            
            dataType: 'jsonp'
        });
	}
};