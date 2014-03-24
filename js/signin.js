MLS.signin = {
	init: function() {
        var $create = $jQ("#create-login");

		if ($create.length > 0) {
            $create.removeAttr("checked")[0].checked = false;
        }
        
		$jQ("#begin-checkout").find("input:checkbox").uniform(); 

        $jQ("#begin-checkout .form-title").click(function() {
            $jQ(this).parents(".form-box").toggleClass("on");
        });
        
		this.beginCheckoutEvents(); 
		this.beginCheckoutValidation();
	},

	beginCheckoutEvents : function() {
		// begin checkout : signin button
        $jQ('#checkout-sign-in').click(function(e) {
        	var form = $jQ(this).parents('form');
            form.validate();

            if (!form.valid()) {
        	    e.preventDefault();
		    	return false;
            } else {
            	form[0].submit();
            }
        });

		// begin checkout : create vzn login checkbox
        $jQ('.create-login-checkbox').change(function() {
            $jQ('.create-login-message').slideToggle(300);
        });
    },

    beginCheckoutValidation : function() {
    	// don't validate placeholder text
    	$jQ.validator.addMethod("noPlaceholder", function (value, element) {
            if (value == $jQ(element).attr('placeholder')) {
                return false;
            } else {
                return true;
            }
        });

        $jQ('#my-Verizon-login').validate({
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
            ignore : '.ignore, :hidden, .not, [name=remember-me], #checkout-sign-in',
            rules: {
                IDToken1: {
                    required: true,
                    // email: true, // requested to be removed by Chintan on 07/31 14:09hrs
                    maxlength: 80,
                    noPlaceholder: true
                },
                IDToken2: {
                    required: true,
                    noPlaceholder: true,
                    minlength: 4
                }
            },
            messages: {
                IDToken1: "Please enter your User ID",
                IDToken2: {
                    required: "Please enter your password",
                    noPlaceholder: "Please enter your password!",
                    minlength: "Your password must be at least 4 characters long"
                }
            }
        });
    }
}