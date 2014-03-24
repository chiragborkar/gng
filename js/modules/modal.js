MLS.modal = {
	counter: 0,

	open: function(msg, noclose, noposition, fixed)
	{
		msg = msg ? msg : "[modules/modal.js] Generic Error Message";

		MLS.modal.counter++;
		var $overlay = $jQ('<div id="modal-' + MLS.modal.counter + '" class="lightbox-info-block modal-container"><div class="modal-overlay-background"></div><div class="modal-overlay"><a class="close-btn" href="#"></a><div class="modal-content"></div></div></div>').appendTo("body"),
			$container = $overlay.find(".modal-overlay"),
			$content = $overlay.find(".modal-content").html(msg);

		if (fixed)
		{
			$overlay.css({ position: 'fixed' });
		}

		if (!noposition)
		{
			$container.css({
				top: $jQ(window).scrollTop() + ($jQ(window).height() - $container.height()) / 2
			});
		}

		if (noclose)
		{
			$overlay.find(".close-btn").remove();
		}
		else
		{
			$overlay.find(".close-btn, .data-close-btn").click(function(e) {
                MLS.modal.close($overlay);
				return false;
			});
		}

		$overlay.hide().fadeIn();
		return $overlay;
	},

	close: function($overlay)
	{
		$overlay.fadeOut(function() {
			$overlay.remove();
		});
	}
};
