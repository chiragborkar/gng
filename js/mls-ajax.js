MLS.ajax = {
    starded: false,

    showLoadingModal: true,
    loadingModal: null,

    showLoadingOverlay: function()
    {
        if (MLS.ajax.showLoadingModal && MLS.ajax.loadingModal === null)
        {
            MLS.ajax.loadingModal = MLS.modal.open(' ', true, true, true, true);
            MLS.ajax.loadingModal.find(".modal-overlay").remove();
            MLS.ajax.loadingModal.find(".modal-overlay-background").addClass("loader-background").after('<span id="loader-image">loading...</span>');
        }
    },

    hideLoadingOverlay: function()
    {
        $jQ('#grid-pop-out').mouseleave();

        if (MLS.ajax.loadingModal && MLS.ajax.loadingModal.is(":visible"))
        {
            MLS.modal.close(MLS.ajax.loadingModal);
            MLS.ajax.loadingModal = null;
        }
    },


    init: function () {
        if (!this.started)
        {
            $jQ(document)
                .ajaxStart(this.showLoadingOverlay)
                .ajaxStop(this.hideLoadingOverlay);

            this.started = true;
        }
    },

    mastHead: function (data, callback, error) {
        return this.sendRequest(
            MLS.ajax.endpoints.MASTHEAD,
            data,
            callback || function () {
                MLS.header.closeModal();
                $jQ('#m_vgn_rnav_info').html(data.pName);
                $jQ('#m_vgn_rnav_info').unbind('click', MLS.header.openModal).click(MLS.header.openModal);
            },
            error || function () {}, // empty error
            'html'
        );
    },

    errorModal: null,

    postRequest : function (url, data, success, error, type) {
        return this.sendRequest(url, data, success, error, type, 'POST');
    },

    sendRequest : function (url, data, success, error, type, verb) {
        this.init();

        type = type ? type : 'json';
        verb = verb ? verb : 'GET';

        return $jQ.ajax({
            type: verb,
            url: url,
            data: data,
            cache : false,
            success : success,

            error : error || function (xhr) {
                if (xhr.statusText != "abort") 
                {
                    if (MLS.ajax.errorModal && MLS.ajax.errorModal.is(":visible"))
                    {
                        // only show the latest error message.
                        MLS.modal.close(MLS.ajax.errorModal);
                    }

                    MLS.ajax.errorModal = MLS.modal.open('Server is not responding,<br />please refresh and try again.', false, true, true);
                }
            },
            dataType: type
        });
    },


    homepage : {
        init : function () {
            // homepage madlib
        }
    },

    pdpSearch : {
        init : function () {
            // pdp in-page search functionality
        }
    },

    colorPicker : {
        contentItem : null,
        init : function () {
            $jQ('.content-grid .content-item .colors .color a').on('click', MLS.ajax.colorPicker.updateContent);
        },
        updateContent : function (e) {
            e.preventDefault();
            MLS.ajax.colorPicker.contenItem = $jQ(this).parent().parent().parent(); // re-work this if possible...
            MLS.ajax.sendRequest(
                $jQ(this).href,
                { color : $jQ(this).data('color'), existingImageUrl: $jQ(this).src },
                MLS.ajax.colorPicker.updateContentSuccess
            );
        },
        updateContentSuccess : function (data) {
            MLS.ui.updateContent($jQ(MLS.ajax.colorPicker.contentItem).find('.content-fig'), data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
        }
    },


    quickView: {
        init: function (pid, el) {
            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.QUICKVIEW_DETAILS,
                pid,
                function(data) {
                    MLS.ajax.quickView.update(data, el);
                }

            );
        },

        update: function (data, el) {
            if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
                return MLS.modal.open(data.error ? data.error.responseHTML : null, false, true, true);
            }

            var error = MLS.errors.checkForInlineErrors(data);

            if (!error)
            {
                if ($jQ("#quick-view-overlay").length == 0)
                {
                    $jQ('<div id="quick-view-overlay" class="quick-view-overlay"><div class="wrapper"></div><div id="quick-view-modal" class="quick-view-modal"></div></div>').appendTo("body");
                }

                MLS.ui.updateContent($jQ('#quick-view-overlay .wrapper'), data.success.responseHTML);
                $jQ('#quick-view-overlay form').data('minicart-added', function() {
                    $jQ('#quick-view-overlay #close-quick-view').click();
                });

                $jQ.validator.addMethod("noEmptySelect", function (value, element) {
                    if (value == '0') {
                        return false;
                    } else {
                        return true;
                    }
                });

                $jQ('#quick-view-overlay form').validate({
                    rules: {
                        pdpColorSelect: {
                            required: true
                        },
                        pdpSizeSelect: {
                            required: true,
                            noEmptySelect: true
                        }
                    },
                    messages: {
                        pdpColorSelect: "Please choose a color",
                        pdpSizeSelect: {
                            required: "Please choose a size",
                            noEmptySelect: "Please choose a size"
                        }
                    }
                });

                //$jQ('#quick-view-overlay .wrapper').find("input:submit").uniform();
                MLS.miniCart.init($jQ('#quick-view-overlay .wrapper'));
                contentGrid.quickViewShow(el);
                MLS.cart.dd.init();
            }
        }
    }
};
