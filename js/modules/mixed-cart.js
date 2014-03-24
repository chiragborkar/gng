MLS.mixedCart = {
    element: null,

    callbacks : 
    {
        scrollPrevious: function(e){
            e.preventDefault();
            var type = "prev";
            MLS.mixedCart.callbacks.scroll(type);
        },

        scrollNext: function(e){
            e.preventDefault();
            var type = "next";
            MLS.mixedCart.callbacks.scroll(type);
        },

        scroll: function(type) { // MINICART  scroll minicart items .............................................................
            var $e = MLS.mixedCart.element;
            if (type == "next") { // if scroll up, calculate max scroll up
                var inMini = $e.find('.minicart-item').length,
                    maxScrollPos = - (Math.ceil(inMini / 3) - 1) * 247,

                    // get current position
                    curPos = $e.find('.minicart-item').eq(0).attr('data-vpos'),

                    //calculate new offset before actually moving
                    newPos = curPos - 247;

                // check position, move and adjust options as required
                $e.find('.prev-items').addClass('on'); //turn on prev
                $e.find('.minicart-item').each(function(){ // move up
                    MLS.ui.vScroll(this, newPos);
                });

                if (newPos > maxScrollPos) { // if beginning/middle
                    $e.find('.next-items').removeClass('off'); //turn on next if needed
                } else { // if end
                    $e.find('.next-items').addClass('off'); //turn off next
                }

            } else { // if scroll down
                // get current position
                var curPos = $e.find('.minicart-item').eq(0).attr('data-vpos'),
                    curPosParse = Math.ceil(curPos),

                    //calculate new offset before actually moving
                    newPos = curPosParse + 247;

                // check position, move and adjust options as required
                $e.find('.minicart-item').each(function(){ //move down
                    MLS.ui.vScroll(this, newPos);
                });

                $e.find('.next-items').removeClass('off'); //turn on next
                if (newPos == 0) { // if beginning/middle
                    $e.find('.prev-items').removeClass('on'); //turn off prev
                }
            }
        },
    },

    init : function (d) 
    {
        this.element = $jQ(d).parent();

        var itemCount = this.element.find("#mixedcart-item-list > li").length,
            $e = this.element;

        if (itemCount > 3)
        {
            $e.find('.minicart-item').eq(0).attr('data-vpos', 0);
            $e.find('.minicart-item').each(function() {
                MLS.ui.vScroll(this, 0);
            });
            $e.find('.mixedcart-next').addClass('on');
        } else {
            $e.find('.next-items').addClass("off");
        }

        // next 3 items
        $e.find('.prev-items').unbind('click', this.callbacks.scrollPrevious).click(this.callbacks.scrollPrevious);
        $e.find('.next-items').unbind('click', this.callbacks.scrollNext).click(this.callbacks.scrollNext);
    }
};