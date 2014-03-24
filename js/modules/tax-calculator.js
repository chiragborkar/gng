MLS.taxCalculator = {
	init : function () {
		$jQ.validator.addMethod("zipcodeUS", function(value, element) {
			return this.optional(element) || /^\d{5}-\d{4}$|^\d{5}$/.test(value);
		}, "Please enter a valid zip code");

		$jQ.validator.addMethod("noPlaceholder", function (value, element) { // don't validate placeholder text
            if (value == $jQ(element).attr('placeholder')) {
                return false;
            } else {
                return true;
            }
        });

        $jQ(".tax-calculator form").submit(function(e) {
			e.preventDefault();

			$jQ(this).find("input").blur();
			if ($jQ(this).validate() && $jQ(this).valid())
			{
				MLS.ajax.sendRequest(
					MLS.ajax.endpoints.TAX_CALCULATOR,
					$jQ(this).serialize(),
					function( data ) {
						// if there's an error, show it.
						if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
				            return MLS.modal.open(data.error ? data.error.responseHTML : null, false, true, true);
				        }

						// if there aren't any errors, update the whole totals node
						$jQ(".cart-sidebar .totals").replaceWith(data.success.responseHTML);
					}

				);
			}

			return false;
		}).validate({
            ignore: '.ignore, :hidden',
            success: function(label){
                label.addClass('success').text('');
            },
            highlight: function(element, errorClass, validClass) {
                if ( element.type === "radio" ) {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $jQ(element).addClass(errorClass).removeClass(validClass);
                }
                $jQ(element).siblings(".error.success").removeClass('success');
            },
            focusCleanup: false,
            rules: {
                zip: {
                    required: true,
                    zipcodeUS: true,
                    minlength: 5,
                    noPlaceholder: true
                }
            },
            messages: {
                zip: {
                    required: "Please enter your zip code",
                    noPlaceholder: "Please enter your zip code",
                    zipcodeUS: "Please enter a valid zip code"
                }
            }
        });
	}
} 