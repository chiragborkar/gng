MLS.hash = {
    init: function () {
        var hash = window.location.hash.split('#')[1];

        // read hash
        if (hash !== '') {
            return hash; // temporary
        }
    },

    update: function (key, value) {

        var hash = window.location.hash,
            existingKey = hash.match(new RegExp(key + '=([^&]*)')); // does the param exists?

        if (existingKey) { // update current parameter
            hash = hash.replace(existingKey[0], key + '=' + value);
        } else { // or add new param
            if (hash !== '') {
                hash += '&';
            }
            hash += key + '=' + value; // append new parameter
        }

        window.location.hash = hash;

    }
};
