MLS.contentFilter = (function () {

    var $cf = $jQ('#content-filter'),
        // hashLoaded = false,
        options = {
            endpoint: null,
            callback: function () {},
            container: null
        },
        typeAheadTimeout = null,

        pub = {
            /*============================
            =            Init            =
            ============================*/

            init: function (o) {
                // Select styles
                //if ($jQ('#phntbltwrapper').length > 0) {
                //    $jQ('select', '.content-filter').select2();
                //    $jQ('.populate').select2({allowClear:true});
                //} else {
                //    $jQ('select', '.content-filter').uniform();    
                //}
                $jQ('select', '#phntblselectors').select2();

                options = $jQ.extend(options, {
                    forceRedirect: false
                }, o);

                $cf = $jQ('.content-filter');
                var $collapsible = $cf.find('.collapsible'),
                    $facets = $cf.find('.facet');

                //Toggle Active class for first dimension and compatibility dimension
                $collapsible.first().find('.dimension-header').toggleClass('active');
                $jQ('#dimension-Category').find('.dimension-header').toggleClass('active');
                $jQ('#dimension-Category').find('.facet-list').slideToggle('slow');
                // collapse all but first dimension
                $collapsible.not(":eq(0)").find('.facet-list').slideToggle('slow');

                // load content on load (if hash)
                // !hashLoaded && pub.loadFromHash();
                // hashLoaded = true;

                /*==========  bind click events  ==========*/

                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').unbind('click', pub.dimensionClick).on('click', pub.dimensionClick);

                !options.forceRedirect && $facets.not('.not-ajax').unbind('click', pub.facetClick).on('click', pub.facetClick);
                !options.forceRedirect && $jQ('.filter-panels li').not('.not-ajax').unbind('click', pub.facetClick).on('click', pub.facetClick); /* mobile option */

                // remove filter
                $jQ('[id=filter-selections] a').unbind('click', pub.removeFilter).not(".not-ajax").on('click', pub.removeFilter);

                if (!isTouch || $jQ(window).width() >= 768) {
                    MLS.compatibility.init({
                        endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                        container: $jQ('#secondary-column'),
                        results: $jQ('#secondary-column #device'),
                        callback: options.forceRedirect ? null : pub.facetClick
                    });
                } else {
                    /* mobile compatibility filter */
                    MLS.compatibility.init({
                        endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                        container: $jQ('.compatibility', '.filter-panels'),
                        results: $jQ('.compatibility .compat-results', '.filter-panels'),
                        callback: options.forceRedirect ? null : pub.facetClick
                    });
                }
                // sort links
                $jQ('[id=sort-options] li').unbind('click', pub.sort).on('click', pub.sort);
                $jQ('[id=sort-options] select, select.sort-options').unbind('change', pub.sort).change(pub.sort);
                $jQ('[id=mobile-sort-filter] li.sort-option, .mobile-sort-filter li.sort-option').unbind('click', pub.sort).on('click', pub.sort);

                pub.mobileFilter.init();
            },
            /*-----  End of Init  ------*/



            /*================================================
            =            Finalize (unbind events)            =
            =================================================*/

            finalize: function () {
                $cf = $jQ('.content-filter');
                var $collapsible = $cf.find('.collapsible'),
                    $facets = $cf.find('.facet');

                 /*==========  bind click events  ==========*/


                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').unbind('click', pub.dimensionClick);


                $facets.not('.not-ajax').unbind('click', pub.facetClick);
                $jQ('.filter-panels li').not('.not-ajax').unbind('click', pub.facetClick); /* mobile option */

                // remove filter
                $jQ('[id=filter-selections] a').unbind('click', pub.removeFilter);

                MLS.compatibility.finalize();

                 // sort links
                $jQ('[id=sort-options] li').unbind('click', pub.sort);
                $jQ('[id=sort-options] select, select.sort-options').unbind('change', pub.sort);
                $jQ('[id=mobile-sort-filter] li.sort-option, .mobile-sort-filter li.sort-option').unbind('click', pub.sort);
            },

            /*-----  End of Finalize (unbind events)  ------*/




            /*============================================
            =            Reinit: on ajax load            =
            ============================================*/

            reInit: function () {
                MLS.contentFilter.finalize();
                MLS.contentFilter.init();
                MLS.miniCart.init($jQ(options.container), MLS.miniCart.options);
                MLS.homeCompatibility.init({
                //endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER,
                endpoint: MLS.ajax.endpoints.COMPATIBILITY_FILTER_NEW,
                container: $jQ('#phntbltwrapper'),
                results: $jQ('#phntbltwrapper'),
                callback: function(e){
                    e.preventDefault();
                    contentGrid.reInit();    
                }
            });
            },

            /*-----  End of Reinit: on ajax load  ------*/




            /*======================================
            =            Load from Hash            =
            ======================================*/
            // If the url contains paramaters in the hash when it
            // is first loaded then request content

            loadFromHash: function () {

                var hash = window.location.hash,
                params = {};

                if (hash !== '') { // we have a hash
                    params = MLS.util.getParamsFromUrl(hash);

                    if (!$jQ.isEmptyObject(params)) {
                        pub.processRequest(params);
                    }

                }

            },

            /*-----  End of Load from Hash  ------*/




            /*=======================================
            =            Listing sorting            =
            =======================================*/

            sort: function (e) {
                e.preventDefault();
                var $elem = $jQ(this),
                    href = $elem.find('a').attr('href') || $elem.val(),
                    params = MLS.util.getParamsFromUrl(href);

                MLS.util.updateUrl(href);
                pub.processRequest(params);

            },

            /*-----  End of Listing sorting  ------*/


            /*===================================
            =            Facet click            =
            ===================================*/

            facetClick: function (e) {
                e.preventDefault();
                var $elem = $jQ(this),
                href = ($elem.is("a") ? $elem : $elem.find('a')).attr('href'),
                params = MLS.util.getParamsFromUrl(href);

                MLS.util.updateUrl(href);
                pub.processRequest(params);

                // mobile requirement, close the overlay
                var $close = $jQ(this).parents(".filter-panels").find(".close");
                if ($close.length > 0)
                {
                    $close.click();
                }
            },

            /*-----  End of Facet click  ------*/





            /*=======================================
            =            dimension click            =
            =======================================*/

            dimensionClick: function (e) {
                e.preventDefault();
                $jQ(this).toggleClass('active').promise().done(function () {
                    $jQ(this).next().slideToggle('slow');
                    isTouch && setTimeout(function() { $jQ(window).scroll(); }, 500);
                });
            },

            /*-----  End of dimension click  ------*/

            /*=============================================
            =            Remove selected facet            =
            =============================================*/

            removeFilter: function (e) {
                e.preventDefault();
                var $elem = $jQ(this),
                    href = $elem.attr('href'),
                    params = MLS.util.getParamsFromUrl(href);
                MLS.util.updateUrl(href);
                pub.processRequest(params);
            },

            /*-----  End of remove facet  ------*/



            /*=======================================
            =            process request            =
            =======================================*/

            processRequest: function (params) {
                if (window.history.pushState) {
                   if(options.endpoint != null)
                   {
                        // make request
                        MLS.ajax.sendRequest(
                            options.endpoint,
                            params,
                            pub.updateResults
                        );
                   }
                }
            },

            /*-----  End of process request  ------*/



            /*===================================
            =            update grid            =
            ===================================*/

            updateResults : function (data) {
                var container = $jQ(options.container),
                    tab = $jQ("#main-column .tab-content-wrapper.active"),
                    $loadMore, $loadRemaining, $moreContainer;

                if (tab.length == 0)
                {
                    tab = $jQ('#main-column');
                };

                if (data.hasOwnProperty('success')) {
                    if ($jQ("html").hasClass("lt-ie9"))
                    {
                        // IE8 breaks on container.empty();
                        // it's likely the garbage collector failing
                        // so, we don't remove the new element, we just hide it
                        var ne = $jQ("<" + container[0].tagName + " />").attr({
                            'id': container.attr("id"),
                            'class': container.attr("class"),
                            'style': container.attr("style")
                        });

                        container.attr({
                            'id': 'old-' + container.attr('id'),
                            'class': ''
                        }).hide().before(ne);
                        container = ne;
                        options.container = ne;
                    }

                    // update results...
                    container.html(data.success.responseHTML);
                    
                    // ... and hero title ...
                    $jQ('.content-grid-heading .content-grid-category').html(data.success.heroTitle);

                    // ... and result count ...
                    $jQ('[id=content-filter-count] strong').text(data.success.count);

                    $loadMore = tab.find('#load-more, .load-more');
                    $loadRemaining = tab.find('#load-remaining, .load-remaining');
                    $moreContainer = tab.find('#load-actions, .load-actions');

                    // If there's more results to load 
                    if (typeof data.success.more !== 'undefined' && data.success.more.count !== '0') {
                        // update data-offset
                        $loadMore.attr('href', data.success.more.url)
                            .find('.product-count').text(data.success.more.count);

                        // update "load remaining %remainingCount products" link
                        $loadRemaining.attr('href', data.success.more.loadRemainingURL)
                            .find('.product-count').text(data.success.more.remainingCount);

                        $loadMore.show();
                        $loadRemaining.show();
                        $moreContainer.show();
                    } else { // hide buttons is there's no more
                        $loadMore.hide();
                        $loadRemaining.hide();
                        $moreContainer.hide();
                    }

                    // ... and filters
                    $cf.unbind().html(data.success.filtersHTML);

                    // ... and even the sort by
                    var val = $jQ('.wrapper.tab-content-wrapper:visible select#sort-options').val();
                    $jQ('.wrapper.tab-content-wrapper:visible .content-landing-header').html(data.success.sortByHTML).find("select#sort-options").val(val);
                    $jQ('#sort-options ul').replaceWith(data.success.sortByHTML);

                    if (data.success.mobileFiltersHTML)
                    {
                        var filter = $jQ("#content-grid-header .dropdown-menu .filter-options-list"),
                            sort = $jQ("#content-grid-header .dropdown-menu .sort-options-list"),
                            isFilterActive = filter.is(":visible"),
                            isSortyActive = sort.is(":visible")
                            newFilters = $jQ(data.success.mobileFiltersHTML);
                            newSortBy = $jQ(data.success.mobileSortByHTML);

                        filter.replaceWith(newFilters);
                        !isFilterActive && newFilters.hide();

                        sort.replaceWith(newSortBy);
                        !isSortyActive && newSortBy.hide();

                        $jQ("#content-grid-header .filter-panels").replaceWith(data.success.mobileFiltersOverlayHTML);
                    }

                    options.callback();
                    pub.reInit();

                    isTouch && setTimeout(function() { $jQ(window).scroll(); }, 500);
                } else {
                    container.html(data.error.responseHTML);
                }

            },

            /*-----  End of update grid  ------*/

            mobileFilter : {
                callbacks: {
                    sortFilter: function (e) {
                        e.preventDefault();

                        $jQ('#mobile-sort-filter .filter-options-list li').each(function (index) {                            
                            $jQ(this).removeClass("displayhide");   
                        });

                        $jQ('#mobile-sort-filter .sort-options-list li').each(function (index) {                            
                            $jQ(this).removeClass("displayhide");   
                        });


                        $jQ('#mobile-sort-filter .filter-options-list li').first().addClass("displayhide");
                        $jQ('#mobile-sort-filter .sort-options-list li').first().addClass("displayhide");                        

                        $jQ('#mobile-sort-filter .filter-options-list li').each(function (index) {
                            if(index > 3) {
                                $jQ(this).addClass("displayhide");   
                            }
                        }); 

                        $jQ('#mobile-sort-filter .sort-options-list li').each(function (index) {
                            if(index > 3) {
                                $jQ(this).addClass("displayhide");   
                            }
                        }); 

                        $jQ('#mobile-sort-filter .filter-options-list li').last().removeClass("displayhide");
                        $jQ('#mobile-sort-filter .sort-options-list li').last().removeClass("displayhide");


                        var $parent = $jQ(this).parents('#mobile-sort-filter,.mobile-sort-filter');
                        if ($jQ(this).hasClass('active')) {
                            $jQ(this).removeClass('active').css({height: '45px'});
                            $parent.find('.dropdown-menu').slideUp(200);
                        } else {
                            $parent.find('.dropdown-cta').not(this).removeClass('active').css({height: '45px'});
                            $jQ(this).addClass('active').css({height: '50px'});
                            $parent.find('.dropdown-menu').slideDown(200);
                            $parent.find('.submenu-list').hide();
                            $parent.find($jQ(this).hasClass('filter') ? '.filter-options-list' : '.sort-options-list').show();
                        }
                    },

                    filterOption: function () {
                        var dimension = $jQ(this).attr('data-type');
                        pub.mobileFilter.filterPanel(dimension);
                    },

                    listOption: function () {
                        $jQ(this).toggleClass('selected');
                    },

                    singleClick: function () {
                        $jQ(this).parent('ul').find('li').removeClass('selected');

                        if ($jQ(this).toggleClass('selected').hasClass('selected')) {
                            MLS.ajax.mastHead({
                                pName: $jQ(this).attr('list-name'),
                                pListId: $jQ(this).attr('listId'),
                                pDeviceVal: $jQ(this).find('a').attr('href')
                            });
                        }
                    }
                },

                init: function () {
                    //Event handler for clicks !!!D.R.Y:-(
                    $jQ('[id=mobile-sort-filter] a.filter, .mobile-sort-filter a.filter, [id=mobile-sort-filter] a.sort, .mobile-sort-filter a.sort').unbind('click', this.callbacks.sortFilter).on('click', this.callbacks.sortFilter);

                    // Mobile UI Enhancements.
                    if($jQ("html").hasClass("no-touch"))
                    {
                       $jQ('li.filter-option', '.filter-options-list').unbind('click', this.callbacks.filterOption).on('click', this.callbacks.filterOption);                       
                    }

                    //Toggle states for multi select
                    $jQ('.list-option', '.filter-panel .multi-select').unbind('click', this.callbacks.listOption).on('click', this.callbacks.listOption);

                    //Toggle states for single select
                    $jQ('.list-option', '.filter-panel .single-select').unbind('click', this.callbacks.singleClick).on('click', this.callbacks.singleClick);
                },

                filterPanel: function (dimension) {
                    var viewportHeight = Response.viewportH();
                    $jQ('.content-grid-section .filter-panels .filter-panel').hide();
                    $jQ('.content-grid-section .filter-panel.' + dimension).show();
                    $jQ('.content-grid-section .filter-panels').show(function () {
                        $jQ(this).animate({height: viewportHeight});
                    });
                    $jQ('.content-grid-section .filter-panels .close').one('click', function () {
                        $jQ('.content-grid-section .filter-panels').animate({height: 0}, function () {
                            $jQ(this).hide();
                        });
                    });
                },

                updateFilters: function () {

                },

                /*-----  Mobile UI Enhancements starts ------*/

                navFilters: function (arrow) {

                    $jQ('#mobile-sort-filter .filter-options-list li').each(function () {
                        if($jQ(this).hasClass("displayhide")) {
                            $jQ(this).removeClass("displayhide");
                        }
                        else {
                            $jQ(this).addClass("displayhide");   
                        }
                    });                    
                },

                navSorts: function(arrow) {

                    $jQ('#mobile-sort-filter .sort-options-list li').each(function () {
                        if($jQ(this).hasClass("displayhide")) {
                            $jQ(this).removeClass("displayhide");
                        }
                        else {
                            $jQ(this).addClass("displayhide");   
                        }
                    });                    
                }

                /*-----  Mobile UI Enhancements ends ------*/
            }

        };


    return pub;
}());


