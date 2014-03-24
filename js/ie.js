(function($) {
	var mediaqueries = [
		{
			max: 320
		},
		{
			max: 439,
			min: 320
		},
		 
		{
			max: 590
		},
		 
		{
			max: 639
		},
		 
		{
			max: 640
		},
		{
			max: 640,
			min: 320
		},
		{
			max: 640,
			min: 480
		},
		{
			max: 752,
			min: 640
		},
		{
			min: 767
		},
		{
			max: 767
		},
		{
			max: 767,
			min: 320
		},
		{
			max: 767,
			min: 321
		},
		{
			max: 767,
			min: 641
		},
		{
			max: 768
		},
		{
			max: 768,
			min: 640
		},
		{
			max: 990
		},
		{ 
			max: 959,
			min: 768
		},
		{ 
			max: 1023
		},
		{
			max: 1023,
			min: 768
		},
		{
			min: 1024
		},
		{
			max: 1024,
			min: 768
		},
		{
			min: 1095
		},
		{
			max: 1229
		},
		{
			min: 1132
		},
		{
			min: 1230
		},
		{
			max: 1279,
			min: 960
		},
		{
			max: 1280
		},
		{
			min: 1280
		},
		{
			max: 1280,
			min: 1024
		}
	],
	i = null, j = null, cls = [],
	apply = function() {
    	var i = 0, $html = $("html").addClass("ie"), mq = "";
		for (i=0; i<cls.length; i++)
		{
			$html.removeClass(cls[i]);
		}
		cls = [];

		for (i=0; i<mediaqueries.length; i++)
		{
			if (mediaqueries[i].min && !mediaqueries[i].max && Response.band(mediaqueries[i].min))
			{
				cls.push("min" + mediaqueries[i].min);
			} 
			else if (mediaqueries[i].max && !mediaqueries[i].min && Response.band(0, mediaqueries[i].max))
			{
				cls.push("max" + mediaqueries[i].max);
			} 
			else if (mediaqueries[i].max && mediaqueries[i].min && Response.band(mediaqueries[i].min, mediaqueries[i].max))
			{
				cls.push("min" + mediaqueries[i].min);
				cls.push("max" + mediaqueries[i].max);
			}
		}

		for (i=0; i<cls.length; i++)
		{
			$html.addClass(cls[i]);
		}
    };

    $(window).resize(apply);
    apply();
}($jQ));