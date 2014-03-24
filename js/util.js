MLS.util = {
    getUrlParam : function (param, loc) {
        var results = new RegExp('[\\?&amp;]' + param + '=([^&amp;#]*)').exec(loc);
        return results[1] || 0;
    },

    getParamsFromUrl: function (href) {
        var contextPath = $jQ('#pageContextPath').val();
        href = href.replace('?','&');

        if (!contextPath || (href.length > contextPath.length && href.substr(0, contextPath.length) == contextPath))
        {
            href = href.substr(contextPath.length);
        }
        return href.replace('?','&');

        /*
        var queryParams = [],
            params = {},
            param,
            j = 0;

        // console.log(href);

        if (href.match(/\?/)) {
            // make params based on the url located in the a[href]
            queryParams = href.split('?')[1].split('&');
        } else if (href.match(/=/)) {
            queryParams = href.split('&');
        }

        for (j = 0; j < queryParams.length; j++) {
            param = queryParams[j].split('=');
            params[param[0]] = param[1];
        }

        return params;
        */
    },

    setHash: function (href) {
        return href.split('?').pop();
    },

    updateUrl: function(href) {
        var contextPath = $jQ('#pageContextPath').val();

        if (!contextPath || (href.length > contextPath.length && href.substr(0, contextPath.length) == contextPath))
        {
            contextPath = "";
        }

        if (!window.history.pushState) {
            window.location = contextPath + href;
        } else {
            window.history.pushState({}, 'Title', contextPath + href);
        }
    },

    getSectionHash: function(module)
    {
        if (document.location.hash != "" && document.location.hash.length > (module.length + 1) && document.location.hash.toString().substr(1, module.length) == module)
        {
            return document.location.hash.toString().substr(module.length + 2);
        } 

        return false;
    },

    updateSectionHash: function(module, href)
    {
        if (href == "")
        {
            document.location.hash = "";
            return;
        }
        
        document.location.hash = "#" + module + "-" + href;
    },

    setMaxLines: function(e, l)
    {
        // give some time for initializers to finish
        setTimeout(function() {
            $jQ(e).each(function() {
                try
                {
                    if ($jQ(this).height() > l * parseInt($jQ(this).css('line-height')))
                    {
                        $jQ(this).html($jQ(this).text().trim().replace(/\n/g, "").replace(/\u00a0/g, " ").replace(/ +/g, " "));

                        if ($jQ(this).height() > l * parseInt($jQ(this).css('line-height')))
                        {
                            $jQ(this).addClass("ellipsis");
                        }
                    }
                } catch(e)
                {
                    // nothing
                }
            });
        }, 1000);
    },

    setMaxLength: function(e, l)
    {
        $jQ(e).each(function() {
            try
            {
                var t = $jQ(this).text().trim().replace(/\n/g, "").replace(/\u00a0/g, " ").replace(/ +/g, " ");
                if (t.length > l) {
                    $jQ(this).html(t.substr(0,l-3) + "...");
                }
            } catch(e)
            {
                // nothing
            }
        });
    },

    setMaxLengthForGuides: function(e, fig, copy, pad)
    {
        // this is slow algorithm but I need to somehow consider that the title height might be larger
        setTimeout(function() {
            $jQ(e).each(function() {
                var fig = $jQ(this).siblings(fig),
                    p = $jQ(this).find(copy),
                    i = 0,
                    txt = p.text();

                if ($jQ(this).height() > fig.height())
                {
                    for (i = 0; i < txt.length-4; i++)
                    {
                        p.html(txt.substr(0, txt.length-i));
                        if ($jQ(this).height() + pad < fig.height())
                        {
                            break;
                        }
                    }

                    p.append("...");
                }
            });
        }, 1000);    
    },

    responsiveVideo: function($me, $container, callback) {
        return function(me,domObj) {
            var player = me.player || domObj.player, // me does not always have the player, strange.

                //Okay, so if we have an $MediaElement object, we use it!
                //Otherwise default to the mediaElement object passed into the function.
                meElem = ($me) ? $me[0] : me, //sometimes $me is undefined, strange.

                isNative = (player.media.pluginType == "native"), //Key to resizing plugin (flash or silverlight)

                width,
                height, 
                prevWidth, //used to determine if the size has actually changed
                rTimer,

                resize_video = function() {
                    width = $container.width();
                    height = Math.round(width * 0.5625); // 16:9

                    if ( prevWidth != width ) { // has the width changed from the previous width?
                        meElem.player.setPlayerSize(width,height); //call mejs.player.setPlayerSize to reset video width and height
                        meElem.player.setControlsSize(); // now let's reset the controls appropriate to the new width and height

                        if (!isNative) { // If this is a plugin (flash or silverlight) we have to do some more work
                            meElem.player.options.videoWidth = width; //I did this for safety measure, not sure if it's necessary
                            meElem.player.options.videoHeight = height; //I did this for safety measure, not sure it's necessary
                            me.setVideoSize(width,height);  //this function is always returned with the me object bassed by the success handler.
                        } // end if not:isNative
                    } //end width check
                
                    prevWidth = width; //used to detect whether or not we need to resize video
                };

            // Now we add the window.resize handler
            $jQ(window).resize(function() {
                clearTimeout(rTimer); //for some resize is executed twice, so we use this "hack" to avoid that.
                rTimer = setTimeout(resize_video,500); //keeps the event from being called twice
            });

            callback && callback(me,domObj);
        };
    }
};
