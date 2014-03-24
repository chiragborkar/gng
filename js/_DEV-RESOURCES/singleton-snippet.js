var simpleSingleton = {
    init : function() {
        // initialize event handlers and stuff related to module...
    },
    anotherMethod : function() {

    }
};

// More Complex Singleton (allows for private methods and variables)
var complexSinglton = (function() {
    // private variable(s)
    var someVar = 2,
    anotherPrivateVar = 'stuff';
    // private method(s)
    function privateMethod() {
        // private method code...
    }
    var pub = {
        init : function() {
            // initialize event handlers and stuff related to module...
        },
        anotherPublicMethod : function() {
            // do stuff...
        }
    };
    return pub;
}());