//implement this code into bundle-builder.js later on

MLS.bundleBuilder.build =  {
	ep : [ "BUNDLE_BUILDER_STEP_1", "BUNDLE_BUILDER_STEP_2", "BUNDLE_BUILDER_STEP_3", "BUNDLE_BUILDER_STEP_4" ],
	step : 1 , // 0 will count as step one // the page starts on step one so we will set the next request to get the html for step 2
	maxStep: 3, 

	init : function () {
		this.gridFilter.init();
		var overlay = $jQ("#grid-pop-out");


        MLS.ajax.endpoints.PRODUCT_LOAD_MORE = MLS.ajax.endpoints.BUNDLE_BUILDER_LOAD_MORE;
        MLS.ajax.endpoints.PRODUCT_LOAD_ALL = MLS.ajax.endpoints.BUNDLE_BUILDER_LOAD_ALL;
      

		$jQ("#sort-options").hide();


		if($jQ(window).width() < 768) {
			$jQ(".slider-grid .add-cart-cta").off().on("click", function () {
					if(MLS.bundleBuilder.build.step > MLS.bundleBuilder.build.maxStep) {
						$jQ(".progress-bar").addClass("done");
						$jQ("#bb-item-module").toggleClass("step2").toggleClass("step3").toggleClass("done");
						return false;
					}

					MLS.ajax.sendRequest(
						MLS.ajax.endpoints[MLS.bundleBuilder.build.ep[MLS.bundleBuilder.build.step]],
						overlay.find("form").serialize(),
						function (data) {
							

							$jQ(".wrapper").html(data.success.responseHTML);

							var _d = data.success
								, $progress = $jQ(".progress-bar")
								, $step =  $progress.find(".step" + (_d.step));

							$progress.find("li").removeClass("active").removeClass("selected");
							$step.addClass("active");
							if(MLS.bundleBuilder.build.step < MLS.bundleBuilder.build.maxStep) {
								$step.find(".product-image").attr("src", _d.items[_d.step-1].stepImage);
							}
							

							for(var i = 0; i < _d.items.length; i++) {
								if(_d.items[i].chosen == true) {
									$progress.find(".step" + (i + 1)).addClass("selected");
									$progress.find(".step" + (i + 1)).find(".product-image").attr("src", _d.items[i].productImage);
								}
							}	
							

							$jQ("#bb-item-module").addClass("step" + (_d.step));

							//increment step counter
							MLS.bundleBuilder.build.step += 1;


							if(MLS.bundleBuilder.build.step > MLS.bundleBuilder.build.maxStep) {
								$jQ(".progress-bar").addClass("done");
								$jQ("#bb-item-module").toggleClass("step2").toggleClass("step3").toggleClass("done");
								MLS.bundleBuilder.build.add_bundle();
							}

							//reinitialize all the page elements
							//MLS['bundle-builder-page'].init()
							//hide the modal
							$jQ(".choose-case .upgrade").hide();

							if($jQ(window).width() < 768) {
					                $jQ('#premium .slider-grid').flexslider({
					                useCSS: false,
					                animation: 'slide',
					                animationLoop: true,
					                controlNav: false,
					                directionNav: false,
					                slideshow: false,
					                animationSpeed: 500,
					                itemWidth: MLS.categoryLanding.itemWidth()
					            }).find(".flex-viewport").width("100%");
					        }
				        	MLS['bundle-builder-page'].init();
						}
					);
			});
		}

		overlay.hover(function () {
				overlay.find(".add-cart-cta").off().click(function (e) {
					e.preventDefault();
					if(MLS.bundleBuilder.build.step > MLS.bundleBuilder.build.maxStep) {
						$jQ(".progress-bar").addClass("done");
						$jQ("#bb-item-module").toggleClass("step2").toggleClass("step3").toggleClass("done");
						return false;
					}

					MLS.ajax.sendRequest(
						MLS.ajax.endpoints[MLS.bundleBuilder.build.ep[MLS.bundleBuilder.build.step]],
						overlay.find("form").serialize(),
						function (data) {
							

							$jQ(".wrapper").html(data.success.responseHTML);

							var _d = data.success
								, $progress = $jQ(".progress-bar")
								, $step =  $progress.find(".step" + (_d.step));

							$progress.find("li").removeClass("active").removeClass("selected");
							$step.addClass("active");
							if(MLS.bundleBuilder.build.step < MLS.bundleBuilder.build.maxStep) {
								$step.find(".product-image").attr("src", _d.items[_d.step-1].stepImage);
							}
							

							for(var i = 0; i < _d.items.length; i++) {
								if(_d.items[i].chosen == true) {
									$progress.find(".step" + (i + 1)).addClass("selected");
									$progress.find(".step" + (i + 1)).find(".product-image").attr("src", _d.items[i].productImage); 
								}
							}	
							

							$jQ("#bb-item-module").addClass("step" + (_d.step));

							$jQ(".step" + (_d.step-1)).find(".upgrade.content-item").show(); 

							//increment step counter
							MLS.bundleBuilder.build.step += 1;


							if(MLS.bundleBuilder.build.step > MLS.bundleBuilder.build.maxStep) {
								$jQ(".progress-bar").addClass("done");
								$jQ("#bb-item-module").toggleClass("step2").toggleClass("step3").toggleClass("done");
								MLS.bundleBuilder.build.add_bundle();
							}

							//reinitialize all the page elements
							MLS['bundle-builder-page'].init()
							//hide the modal
							
						}
					);

					return false;

					
				});
			});

			$jQ(".progress-bar li").hover(function (e) {
				if($jQ(this).hasClass("selected")) {
					$jQ(this).find(".change").unbind("click").click(function () {
						var _step = null;
						
						if($jQ(this).parents("li").hasClass("step1"))
						{
							_step = 0;
						}
						else if($jQ(this).parents("li").hasClass("step2"))
						{
							_step = 1;
						}

						else if($jQ(this).parents("li").hasClass("step3"))
						{
							_step = 2;
						}

						if(_step == null) {
							return false;
						}
						MLS.ajax.sendRequest(
						MLS.ajax.endpoints[MLS.bundleBuilder.build.ep[_step]],
						$jQ(this).find("form").serialize(),
						function (data) {
							

							$jQ(".wrapper").html(data.success.responseHTML);

							var _d = data.success
								, $progress = $jQ(".progress-bar")
								, $step =  $progress.find(".step" + (_d.step));

							$progress.find("li").removeClass("active").removeClass("selected");
							$step.addClass("active");
							$step.find(".product-image").attr("src", _d.items[_d.step-1].stepImage);

							for(var i = 0; i < _d.items.length; i++) {
								if(_d.items[i].chosen == true) {
									$progress.find(".step" + (i + 1)).addClass("selected");
									$progress.find(".step" + (i + 1)).find(".product-image").attr("src", _d.items[i].productImage);
								}
							}	
							

							$jQ("#bb-item-module").addClass("step" + (_d.step));

							//increment step counter
							MLS.bundleBuilder.build.step = _step + 1; 


							if(MLS.bundleBuilder.build.step > MLS.bundleBuilder.build.maxStep) {
								$jQ(".progress-bar").addClass("done");
								$jQ("#bb-item-module").toggleClass("step2").toggleClass("step3").toggleClass("done");
								MLS.bundleBuilder.build.add_bundle();
							}

							//reinitialize all the page elements
							MLS['bundle-builder-page'].init()

							MLS.bundleBuilder.build.init()
							//hide the modal
							$jQ(".choose-case .upgrade").hide();
						}
					);
					});

					
				}
			});
	},

	add_bundle : function () {
		$jQ("#pdp-add-to-cart-submit").off().unbind().click(function () {
           MLS.ajax.sendRequest(
				MLS.ajax.endpoints[MLS.bundleBuilder.build.ep[MLS.bundleBuilder.build.step - 1]],
				$jQ(this).parents("form").serialize(),
				function (data) {

					$jQ(".wrapper").html(data.success.responseHTML);

					$jQ(".progress-bar").hide();
					$jQ("#bb-item-module").hide();

					$jQ("#additional-products-module").show(); 

					$jQ(".summary").show();

					//reinitialize all the page elements
					MLS['bundle-builder-page'].init();
					//hide the modal
					$jQ(".choose-case .upgrade").hide();
				}
			);

           return false;
		});
	},
	gridFilter : {

		init : function () {

			$jQ('.sort-options select, .filter-options select').unbind('change', MLS.bundleBuilder.build.gridFilter.sort).change(MLS.bundleBuilder.build.gridFilter.sort);
            $jQ('[id=mobile-sort-filter] li.sort-option, .mobile-sort-filter li.sort-option').unbind('click', MLS.bundleBuilder.build.gridFilter.sort).on('click', MLS.bundleBuilder.build.gridFilter.sort);
		},
		sort: function (e) {
			e.preventDefault();
            var $elem = $jQ(this),
                href = $elem.find('a').attr('href') || $elem.val(),
                params = MLS.util.getParamsFromUrl(href);

            MLS.util.updateUrl(href);
            MLS.bundleBuilder.build.gridFilter.processRequest(params);
		},
		processRequest: function (params) {

            // make request
            MLS.ajax.sendRequest(
                MLS.ajax.endpoints[MLS.bundleBuilder.build.ep[MLS.bundleBuilder.build.step]],
                params,
                MLS.bundleBuilder.build.gridFilter.updateResults
            );
        },

        updateResults : function (data) {
            if(data.success.sortedGrid) {
            	$jQ(".slider-grid").html(data.success.sortedGrid);
            	 contentGrid.init();
            }
        }
	}
}