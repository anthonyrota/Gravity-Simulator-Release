// Composited file - DO NOT EDIT
//----------------------------------------------------------------------
//
// ECMAScript 5 Polyfills
//
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// ES5 15.2 Object Objects
//----------------------------------------------------------------------

//
// ES5 15.2.3 Properties of the Object Constructor
//

// ES5 15.2.3.2 Object.getPrototypeOf ( O )
// From http://ejohn.org/blog/objectgetprototypeof/
// NOTE: won't work for typical function T() {}; T.prototype = {}; new T; case
// since the constructor property is destroyed.
if (!Object.getPrototypeOf) {
  Object.getPrototypeOf = function (o) {
    if (o !== Object(o)) { throw TypeError("Object.getPrototypeOf called on non-object"); }
    return o.__proto__ || o.constructor.prototype || Object.prototype;
  };
}

//    // ES5 15.2.3.3 Object.getOwnPropertyDescriptor ( O, P )
//    if (typeof Object.getOwnPropertyDescriptor !== "function") {
//        Object.getOwnPropertyDescriptor = function (o, name) {
//            if (o !== Object(o)) { throw TypeError(); }
//            if (o.hasOwnProperty(name)) {
//                return {
//                    value: o[name],
//                    enumerable: true,
//                    writable: true,
//                    configurable: true
//                };
//            }
//        };
//    }

// ES5 15.2.3.4 Object.getOwnPropertyNames ( O )
if (typeof Object.getOwnPropertyNames !== "function") {
  Object.getOwnPropertyNames = function (o) {
    if (o !== Object(o)) { throw TypeError("Object.getOwnPropertyNames called on non-object"); }
    var props = [], p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        props.push(p);
      }
    }
    return props;
  };
}

// ES5 15.2.3.5 Object.create ( O [, Properties] )
if (typeof Object.create !== "function") {
  Object.create = function (prototype, properties) {
    if (typeof prototype !== "object") { throw TypeError(); }
    function Ctor() {}
    Ctor.prototype = prototype;
    var o = new Ctor();
    if (prototype) { o.constructor = Ctor; }
    if (properties !== undefined) {
      if (properties !== Object(properties)) { throw TypeError(); }
      Object.defineProperties(o, properties);
    }
    return o;
  };
}

// ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
// Partial support for most common case - getters, setters, and values
(function() {
  if (!Object.defineProperty ||
      !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) { try { return orig(o, prop, desc); } catch (e) {} }

      if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
      if (Object.prototype.__defineGetter__ && ('get' in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ('set' in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ('value' in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }
}());

// ES 15.2.3.7 Object.defineProperties ( O, Properties )
if (typeof Object.defineProperties !== "function") {
  Object.defineProperties = function (o, properties) {
    if (o !== Object(o)) { throw TypeError("Object.defineProperties called on non-object"); }
    var name;
    for (name in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, name)) {
        Object.defineProperty(o, name, properties[name]);
      }
    }
    return o;
  };
}


// ES5 15.2.3.14 Object.keys ( O )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = function (o) {
    if (o !== Object(o)) { throw TypeError('Object.keys called on non-object'); }
    var ret = [], p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        ret.push(p);
      }
    }
    return ret;
  };
}

//----------------------------------------------------------------------
// ES5 15.3 Function Objects
//----------------------------------------------------------------------

//
// ES5 15.3.4 Properties of the Function Prototype Object
//

// ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (o) {
    if (typeof this !== 'function') { throw TypeError("Bind must be called on a function"); }

    var args = Array.prototype.slice.call(arguments, 1),
        self = this,
        nop = function() {},
        bound = function () {
          return self.apply(this instanceof nop ? this : o,
                            args.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype)
      nop.prototype = this.prototype;
    bound.prototype = new nop();
    return bound;
  };
}


//----------------------------------------------------------------------
// ES5 15.4 Array Objects
//----------------------------------------------------------------------

//
// ES5 15.4.3 Properties of the Array Constructor
//


// ES5 15.4.3.2 Array.isArray ( arg )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
Array.isArray = Array.isArray || function (o) { return Boolean(o && Object.prototype.toString.call(Object(o)) === '[object Array]'); };


//
// ES5 15.4.4 Properties of the Array Prototype Object
//

// ES5 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }

    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (isNaN(n)) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    if (n >= len) { return -1; }

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ES5 15.4.4.15 Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }

    var n = len;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n !== n) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);

    for (; k >= 0; k--) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ES5 15.4.4.16 Array.prototype.every ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
  Array.prototype.every = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t && !fun.call(thisp, t[i], i, t)) {
        return false;
      }
    }

    return true;
  };
}

// ES5 15.4.4.17 Array.prototype.some ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
  Array.prototype.some = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t && fun.call(thisp, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        fun.call(thisp, t[i], i, t);
      }
    }
  };
}


// ES5 15.4.4.19 Array.prototype.map ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Map
if (!Array.prototype.map) {
  Array.prototype.map = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var res = []; res.length = len;
    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fun.call(thisp, t[i], i, t);
      }
    }

    return res;
  };
}

// ES5 15.4.4.20 Array.prototype.filter ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var res = [];
    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


// ES5 15.4.4.21 Array.prototype.reduce ( callbackfn [ , initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (fun /*, initialValue */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1) { throw TypeError(); }

    var k = 0;
    var accumulator;
    if (arguments.length >= 2) {
      accumulator = arguments[1];
    } else {
      do {
        if (k in t) {
          accumulator = t[k++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++k >= len) { throw TypeError(); }
      }
      while (true);
    }

    while (k < len) {
      if (k in t) {
        accumulator = fun.call(undefined, accumulator, t[k], k, t);
      }
      k++;
    }

    return accumulator;
  };
}


// ES5 15.4.4.22 Array.prototype.reduceRight ( callbackfn [, initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight
if (!Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function (callbackfn /*, initialValue */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof callbackfn !== "function") { throw TypeError(); }

    // no value to return if no initial value, empty array
    if (len === 0 && arguments.length === 1) { throw TypeError(); }

    var k = len - 1;
    var accumulator;
    if (arguments.length >= 2) {
      accumulator = arguments[1];
    } else {
      do {
        if (k in this) {
          accumulator = this[k--];
          break;
        }

        // if array contains no values, no initial value to return
        if (--k < 0) { throw TypeError(); }
      }
      while (true);
    }

    while (k >= 0) {
      if (k in t) {
        accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
      }
      k--;
    }

    return accumulator;
  };
}


//----------------------------------------------------------------------
// ES5 15.5 String Objects
//----------------------------------------------------------------------

//
// ES5 15.5.4 Properties of the String Prototype Object
//


// ES5 15.5.4.20 String.prototype.trim()
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+/, '').replace(/\s+$/, '');
  };
}



//----------------------------------------------------------------------
// ES5 15.9 Date Objects
//----------------------------------------------------------------------


//
// ES 15.9.4 Properties of the Date Constructor
//

// ES5 15.9.4.4 Date.now ( )
// From https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Date/now
if (!Date.now) {
  Date.now = function now() {
    return Number(new Date());
  };
}


//
// ES5 15.9.5 Properties of the Date Prototype Object
//

// ES5 15.9.4.43 Date.prototype.toISOString ( )
// Inspired by http://www.json.org/json2.js
if (!Date.prototype.toISOString) {
  Date.prototype.toISOString = function () {
    function pad2(n) { return ('00' + n).slice(-2); }
    function pad3(n) { return ('000' + n).slice(-3); }

    return this.getUTCFullYear() + '-' +
      pad2(this.getUTCMonth() + 1) + '-' +
      pad2(this.getUTCDate()) + 'T' +
      pad2(this.getUTCHours()) + ':' +
      pad2(this.getUTCMinutes()) + ':' +
      pad2(this.getUTCSeconds()) + '.' +
      pad3(this.getUTCMilliseconds()) + 'Z';
  };
}
//----------------------------------------------------------------------
//
// ECMAScript 2015 Polyfills
//
//----------------------------------------------------------------------

(function (global) {
  "use strict";

  // Set this to always override native implementations, for testing
  // the polyfill in browsers with partial/full ES2015 support.
  var OVERRIDE_NATIVE_FOR_TESTING = false;

  var undefined = (void 0); // Paranoia

  // Helpers

  function strict(o) {
    return o === global ? undefined : o;
  }

  function hook(o, p, f) {
    var op = o[p];
    console.assert(typeof op === 'function', 'Hooking a non-function');
    o[p] = function() {
      var o = strict(this);
      var r = f.apply(o, arguments);
      return r !== undefined ? r : op.apply(o, arguments);
    };
  }

  function isSymbol(s) {
    return (typeof s === 'symbol') || ('Symbol' in global && s instanceof global.Symbol);
  }

  function getPropertyDescriptor(target, name) {
    var desc = Object.getOwnPropertyDescriptor(target, name);
    var proto = Object.getPrototypeOf(target);
    while (!desc && proto) {
      desc = Object.getOwnPropertyDescriptor(proto, name);
      proto = Object.getPrototypeOf(proto);
    }
    return desc;
  }

  var enqueue = (function(nativePromise, nativeSetImmediate) {
    if (nativePromise)
      return function(job) { nativePromise.resolve().then(function() { job(); }); };
    if (nativeSetImmediate)
      return function(job) { nativeSetImmediate(job); };
    return function(job) { setTimeout(job, 0); };
  }(global['Promise'], global['setImmediate']));

  function define(o, p, v, override) {
    if (p in o && !override && !OVERRIDE_NATIVE_FOR_TESTING)
      return;

    if (typeof v === 'function') {
      // Sanity check that functions are appropriately named (where possible)
      console.assert(isSymbol(p) || !('name' in v) || v.name === p || v.name === p + '_', 'Expected function name "' + p.toString() + '", was "' + v.name + '"');
      Object.defineProperty(o, p, {
        value: v,
        configurable: true,
        enumerable: false,
        writable: true
      });
    } else {
      Object.defineProperty(o, p, {
        value: v,
        configurable: false,
        enumerable: false,
        writable: false
      });
    }
  }

  function set_internal(o, p, v) {
    Object.defineProperty(o, p, {
      value: v,
      configurable: false,
      enumerable: false,
      writable: true
    });
  }

  // Snapshot intrinsic functions
  var $isNaN = global.isNaN,
      $parseInt = global.parseInt,
      $parseFloat = global.parseFloat;

  var E = Math.E,
      LOG10E = Math.LOG10E,
      LOG2E = Math.LOG2E,
      abs = Math.abs,
      ceil = Math.ceil,
      exp = Math.exp,
      floor = Math.floor,
      log = Math.log,
      max = Math.max,
      min = Math.min,
      pow = Math.pow,
      random = Math.random,
      sqrt = Math.sqrt;

  var orig_match = String.prototype.match,
      orig_replace = String.prototype.replace,
      orig_search = String.prototype.search,
      orig_split = String.prototype.split;

  // These are used for implementing the polyfills, but not exported.

  // Inspired by https://gist.github.com/1638059
  /** @constructor */
  function EphemeronTable() {
    var secretKey = ObjectCreate(null);

    function conceal(o) {
      var oValueOf = o.valueOf, secrets = ObjectCreate(null);
      Object.defineProperty(o, 'valueOf', {
          value: (function(secretKey) {
            return function (k) {
              return (k === secretKey) ? secrets : oValueOf.apply(o, arguments);
            };
          }(secretKey)),
        configurable: true,
        writeable: true,
        enumerable: false
        });
      return secrets;
    }

    function reveal(o) {
      var v = typeof o.valueOf === 'function' && o.valueOf(secretKey);
      return v === o ? null : v;
    }

    return {
      clear: function() {
        secretKey = ObjectCreate(null);
      },
      remove: function(key) {
        var secrets = reveal(key);
        if (secrets && HasOwnProperty(secrets, 'value')) {
          delete secrets.value;
          return true;
        }
        return false;
      },
      get: function(key, defaultValue) {
        var secrets = reveal(key);
        return (secrets && HasOwnProperty(secrets, 'value')) ? secrets.value : defaultValue;
      },
      has: function(key) {
        var secrets = reveal(key);
        return Boolean(secrets && HasOwnProperty(secrets, 'value'));
      },
      set: function(key, value) {
        var secrets = reveal(key) || conceal(key);
        secrets.value = value;
      }
    };
  }

  var empty = Object.create(null);

  //----------------------------------------------------------------------
  //
  // ECMAScript 2015
  // http://www.ecma-international.org/ecma-262/6.0/
  //
  //----------------------------------------------------------------------

  // ---------------------------------------
  // 19.4 Symbol Objects
  // ---------------------------------------

  // NOTE: Symbols are defined here - out of spec order - since we need the
  // properties and prototype to be populated for other polyfills.

  // NOTE: Not secure, nor is obj[$$symbol] hidden from Object.keys()

  var symbolForKey;
  (function() {
    var secret = Object.create(null);
    var symbolMap = {};
    symbolForKey = function(k) {
      return symbolMap[k];
    };

    var GlobalSymbolRegistry = [];

    function unique(bits) {
      return Array(bits + 1).join('x').replace(/x/g, function() {
        return random() < 0.5 ? '\u200C' : '\u200D'; // JWNJ / ZWJ
      });
    }

    // 19.4.1 The Symbol Constructor
    // 19.4.1.1 Symbol ( description=undefined )
    function Symbol(description) {
      if (!(this instanceof Symbol)) return new Symbol(description, secret);
      if (this instanceof Symbol && arguments[1] !== secret) throw TypeError();

      var descString = description === undefined ? undefined : String(description);

      set_internal(this, '[[SymbolData]]', unique(128));
      set_internal(this, '[[Description]]', descString);

      symbolMap[this] = this;
      return this;
    }

    if (!('Symbol' in global) || OVERRIDE_NATIVE_FOR_TESTING)
      global.Symbol = Symbol;

    // 19.4.2 Properties of the Symbol Constructor

    // 19.4.2.1 Symbol.for (key)
    define(Symbol, 'for', function for_(key) {
      var stringKey = String(key);
      for (var i = 0; i < GlobalSymbolRegistry.length; ++i) {
        var e = GlobalSymbolRegistry[i];
        if (SameValue(e['[[key]]'], stringKey)) return e['[[symbol]]'];
      }
      var newSymbol = Symbol(key);
      GlobalSymbolRegistry.push({'[[key]]': stringKey, '[[symbol]]': newSymbol});
      return newSymbol;
    });

    // 19.4.2.2 Symbol.hasInstance
    // 19.4.2.3 Symbol.isConcatSpreadable

    // 19.4.2.4 Symbol.iterator
    define(global.Symbol, 'iterator', global.Symbol('Symbol.iterator'));

    // 19.4.2.5 Symbol.keyFor (sym)
    define(Symbol, 'keyFor', function keyFor(sym) {
      if (!(sym instanceof Symbol)) throw TypeError();
      for (var i = 0; i < GlobalSymbolRegistry.length; ++i) {
        var e = GlobalSymbolRegistry[i];
        if (SameValue(e['[[symbol]]'], sym)) return e['[[key]]'];
      }
      return undefined;
    });

    // 19.4.2.6 Symbol.match
    define(global.Symbol, 'match', global.Symbol('Symbol.match'));

    // 19.4.2.7 Symbol.prototype

    // 19.4.2.8 Symbol.replace
    define(global.Symbol, 'replace', global.Symbol('Symbol.replace'));

    // 19.4.2.9 Symbol.search
    define(global.Symbol, 'search', global.Symbol('Symbol.search'));

    // 19.4.2.10 Symbol.species

    // 19.4.2.11 Symbol.search
    define(global.Symbol, 'split', global.Symbol('Symbol.split'));

    // 19.4.2.12 Symbol.toPrimitive

    // 19.4.2.13 Symbol.toStringTag
    define(global.Symbol, 'toStringTag', global.Symbol('Symbol.toStringTag'));

    // 19.4.2.14 Symbol.unscopables

    // 19.4.3 Properties of the Symbol Prototype Object
    // 19.4.3.1 Symbol.prototype.constructor

    // 19.4.3.2 Symbol.prototype.toString ( )
    Object.defineProperty(Symbol.prototype, 'toString', {
      value: function toString() {
        var s = strict(this);
        var desc = s['[[Description]]'];
        return 'Symbol(' + (desc === undefined ? '' : desc) + s['[[SymbolData]]'] + ')';
      },
      configurable: true, writeable: true, enumerable: false });

    // 19.4.3.3 Symbol.prototype.valueOf ( )
    Object.defineProperty(Symbol.prototype, 'valueOf', {
      value: function valueOf() {
        // To prevent automatic string conversion:
        throw TypeError();

        // Spec has approximately the following:
        //var s = strict(this);
        //if (Type(s) === 'symbol') return s;
        //if (Type(s) !== 'object') throw TypeError();
        //if (!('[[SymbolData]]' in s)) throw TypeError();
        //return s['[[SymbolData]]'];
      },
      configurable: true, writeable: true, enumerable: false });

    // 19.4.3.4 Symbol.prototype [ @@toStringTag ]
    // (Done later to polyfill partial implementations)

    // 19.4.4 Properties of Symbol Instances
  }());

  console.assert(typeof global.Symbol() === 'symbol' || symbolForKey(String(global.Symbol('x'))));

  // Defined here so that other prototypes can reference it
  // 25.1.2 The %IteratorPrototype% Object
  var $IteratorPrototype$ = {};

  //----------------------------------------
  // 6 ECMAScript Data Types and Values
  //----------------------------------------

  // 6.1 ECMAScript Language Types

  // "Type(x)" is used as shorthand for "the type of x"...
  function Type(v) {
    switch (typeof v) {
    case 'undefined': return 'undefined';
    case 'boolean': return 'boolean';
    case 'number': return 'number';
    case 'string': return 'string';
    case 'symbol': return 'symbol';
    default:
      if (v === null) return 'null';
      if (v instanceof global.Symbol) return 'symbol';
      return 'object';
    }
  }

  // 6.1.5.1 Well-Known Symbols
  var $$iterator = global.Symbol.iterator,
      $$match = global.Symbol.match,
      $$replace = global.Symbol.replace,
      $$search = global.Symbol.search,
      $$split = global.Symbol.split,
      $$toStringTag = global.Symbol.toStringTag;

  //----------------------------------------
  // 7 Abstract Operations
  //----------------------------------------

  //----------------------------------------
  // 7.1 Type Conversion
  //----------------------------------------

  // 7.1.1 ToPrimitive ( input [, PreferredType] )
  // just use valueOf()

  // 7.1.2 ToBoolean ( argument )
  // just use Boolean()

  // 7.1.3 ToNumber ( argument )
  // just use Number()

  // 7.1.4 ToInteger ( argument )
  function ToInteger(n) {
    n = Number(n);
    if ($isNaN(n)) return 0;
    if (n === 0 || n === Infinity || n === -Infinity) return n;
    return ((n < 0) ? -1 : 1) * floor(abs(n));
  }

  // 7.1.5 ToInt32 ( argument )
  function ToInt32(v) { return v >> 0; }

  // 7.1.6 ToUint32 ( argument )
  function ToUint32(v) { return v >>> 0; }

  // 7.1.7 ToInt16 ( argument )
  function ToInt16(v) { return (v << 16) >> 16; }

  // 7.1.8 ToUint16 ( argument )
  function ToUint16(v) { return v & 0xFFFF; }

  // 7.1.9 ToInt8 ( argument )
  function ToInt8(v) { return (v << 24) >> 24; }

  // 7.1.10 ToUint8 ( argument )
  function ToUint8(v) { return v & 0xFF; }

  // 7.1.11 ToUint8Clamp ( argument )
  function ToUint8Clamp(argument) {
    var number = Number(argument);
    if ($isNaN(number)) return 0;
    if (number <= 0) return 0;
    if (number >= 255) return 255;
    var f = floor(number);
    if ((f + 0.5) < number) return f + 1;
    if (number < (f + 0.5)) return f;
    if (f % 2) return f + 1;
    return f;
  }

  // 7.1.12 ToString ( argument )
  // just use String()

  // 7.1.13 ToObject ( argument )
  function ToObject(v) {
    if (v === null || v === undefined) throw TypeError();
    return Object(v);
  }

  // 7.1.14 ToPropertyKey ( argument )
  function ToPropertyKey(v) {
    return String(v);
  }

  // 7.1.15 ToLength ( argument )
  function ToLength(v) {
    var len = ToInteger(v);
    if (len <= 0) return 0;
    if (len === Infinity) return 0x20000000000000 - 1; // 2^53-1
    return min(len, 0x20000000000000 - 1); // 2^53-1
  }

  // 7.1.16 CanonicalNumericIndexString ( argument )

  //----------------------------------------
  // 7.2 Testing and Comparison Operations
  //----------------------------------------

  // 7.2.1 RequireObjectCoercible ( argument )
  // 7.2.2 IsArray ( argument )

  // 7.2.3 IsCallable ( argument )
  function IsCallable(o) { return typeof o === 'function'; }

  // 7.2.4 IsConstructor ( argument )
  function IsConstructor(o) {
    // Hacks for Safari 7 TypedArray XXXConstructor objects
    if (/Constructor/.test(Object.prototype.toString.call(o))) return true;
    if (/Function/.test(Object.prototype.toString.call(o))) return true;
    // TODO: Can this be improved on?
    return typeof o === 'function';
  }

  // 7.2.5 IsExtensible (O)
  // 7.2.6 IsInteger ( argument )

  // 7.2.7 IsPropertyKey ( argument )
  function IsPropertyKey(argument) {
    if (Type(argument) === 'string') return true;
    if (Type(argument) === 'symbol') return true;
    return false;
  }

  // 7.2.8 IsRegExp ( argument )
  // 7.2.5 IsConstructor ( argument )

  // 7.2.9 SameValue(x, y)
  function SameValue(x, y) {
    if (typeof x !== typeof y) return false;
    switch (typeof x) {
    case 'undefined':
      return true;
    case 'number':
      if (x !== x && y !== y) return true;
      if (x === 0 && y === 0) return 1/x === 1/y;
      return x === y;
    case 'boolean':
    case 'string':
    case 'object':
    default:
      return x === y;
    }
  }

  // 7.2.10 SameValueZero(x, y)
  function SameValueZero(x, y) {
    if (typeof x !== typeof y) return false;
    switch (typeof x) {
    case 'undefined':
      return true;
    case 'number':
      if (x !== x && y !== y) return true;
      return x === y;
    case 'boolean':
    case 'string':
    case 'object':
    default:
      return x === y;
    }
  }

  //----------------------------------------
  // 7.3 Operations on Objects
  //----------------------------------------

  // 7.3.1 Get (O, P)
  // - just use o.p or o[p]

  // 7.3.2 GetV (V, P)
  function GetV(v, p) {
    var o = ToObject(v);
    return o[p];
  }

  // 7.3.3 Set (O, P, V, Throw)
  // - just use o.p = v or o[p] = v




  // 7.3.9 GetMethod (O, P)
  function GetMethod(o, p) {
    var func = GetV(o, p);
    if (func === undefined || func === null) return undefined;
    if (!IsCallable(func)) throw TypeError();
    return func;
  }

  // 7.3.10 HasProperty (O, P)
  function HasProperty(o, p) {
    while (o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) return true;
      if (Type(o) !== 'object') return false;
      o = Object.getPrototypeOf(o);
    }
    return false;
  }

  // 7.3.11 HasOwnProperty (O, P)
  function HasOwnProperty(o, p) {
    return Object.prototype.hasOwnProperty.call(o, p);
  }

  //----------------------------------------
  // 7.4 Operations on Iterator Objects
  //----------------------------------------

  // 7.4.1 GetIterator ( obj, method )
  function GetIterator(obj, method) {
    if (arguments.length < 2)
      method = GetMethod(obj, $$iterator);
    var iterator = method.call(obj);
    if (Type(iterator) !== 'object') throw TypeError();
    return iterator;
  }

  // 7.4.2 IteratorNext ( iterator, value )
  function IteratorNext(iterator, value) {
    if (arguments.length < 2)
      var result = iterator.next();
    else
      result = iterator.next(value);
    if (Type(result) !== 'object') throw TypeError();
    return result;
  }

  // 7.4.3 IteratorComplete ( iterResult )
  function IteratorComplete(iterResult) {
    console.assert(Type(iterResult) === 'object');
    return Boolean(iterResult.done);
  }

  // 7.4.4 IteratorValue ( iterResult )
  function IteratorValue(iterResult) {
    console.assert(Type(iterResult) === 'object');
    return iterResult.value;
  }

  // 7.4.5 IteratorStep ( iterator )
  function IteratorStep( iterator, value ) {
    var result = IteratorNext(iterator, value);
    var done = result['done'];
    if (Boolean(done) === true) return false;
    return result;
  }

  // 7.4.6 IteratorClose( iterator, completion )
  function IteratorClose( iterator, completion ) {
    console.assert(Type(iterator) === 'object');
    var _return = GetMethod(iterator, 'return');
    if (_return === undefined) return completion;
    try {
      var innerResult = _return[iterator]();
    } catch (result) {
      // TODO: If completion.[[type]] is throw, return completion
      return result;
    }
    if (Type(innerResult) !== 'object') throw TypeError();
    return completion;
  }

  // 7.4.7 CreateIterResultObject (value, done)
  function CreateIterResultObject(value, done) {
    console.assert(Type(done) === 'boolean');
    var obj = {};
    obj["value"] = value;
    obj["done"] = done;
    return obj;
  }

  // 7.4.8 CreateListIterator (list)
  // 7.4.8.1 ListIterator next( )
  // 7.4.9 CreateCompoundIterator ( iterator1, iterator2 )
  // 7.4.9.1 CompoundIterator next( )

  //----------------------------------------
  // 8 Executable Code and Execution Contexts
  //----------------------------------------

  //----------------------------------------
  // 8.4 Jobs and Job Queues
  //----------------------------------------

  // 8.4.1 EnqueueJob ( queueName, job, arguments)
  function EnqueueJob(queueName, job, args) {
    var fn = function() { job.apply(undefined, args); };
    enqueue(fn);
  }

  // 8.4.2 NextJob result
  function NextJob(result) {
    // no-op
  }

  //----------------------------------------
  // 9 Ordinary and Exotic Objects Behaviors
  //----------------------------------------

  // 9.1.11 [[Enumerate]] ()
  function Enumerate(obj) {
    var e = [];
    if (Object(obj) !== obj) return e;
    var visited = new Set;
    while (obj !== null) {
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        if (!visited.has(name)) {
          var desc = Object.getOwnPropertyDescriptor(obj, name);
          if (desc) {
            visited.add(name);
            if (desc.enumerable) e.push(name);
          }
        }
      });
      obj = Object.getPrototypeOf(obj);
    }
    return e[$$iterator]();
  }

  // 9.1.12 [[OwnPropertyKeys]] ( )
  function OwnPropertyKeys(o) {
    return Object.getOwnPropertyNames(o);
  }

  // 9.1.13 ObjectCreate(proto, internalSlotsList)
  function ObjectCreate(proto, internalSlotsList) {
    return Object.create(proto, internalSlotsList);
  }

  // ---------------------------------------
  // 19 Fundamental Objects
  // ---------------------------------------

  // ---------------------------------------
  // 19.1 Object Objects
  // ---------------------------------------

  // 19.1.1 The Object Constructor
  // 19.1.1.1 Object ( [ value ] )
  // 19.1.2 Properties of the Object Constructor
  // 19.1.2.1 Object.assign ( target, ...sources )
  define(
    Object, 'assign',
    function assign(target, /*...*/sources) {
      var to = ToObject(target);
      if (arguments.length < 2) return to;

      var sourcesIndex = 1;
      while (sourcesIndex < arguments.length) {
        var nextSource = arguments[sourcesIndex++];
        if (nextSource === undefined || nextSource === null) {
          var keys = [];
        } else {
          var from = ToObject(nextSource);
          keys = OwnPropertyKeys(from);
        }
        for (var keysIndex = 0; keysIndex < keys.length; ++keysIndex) {
          var nextKey = keys[keysIndex];
          var desc = Object.getOwnPropertyDescriptor(from, nextKey);
          if (desc !== undefined && desc.enumerable) {
            var propValue = from[nextKey];
            to[nextKey] = propValue;
          }
        }
      }
      return to;
    });

  // 19.1.2.2 Object.create ( O [ , Properties ] )
  // 19.1.2.3 Object.defineProperties ( O, Properties )
  // 19.1.2.4 Object.defineProperty ( O, P, Attributes )
  // 19.1.2.5 Object.freeze ( O )
  // 19.1.2.6 Object.getOwnPropertyDescriptor ( O, P )

  (function() {
    var nativeSymbols = (typeof global.Symbol() === 'symbol'),
        $getOwnPropertyNames = Object.getOwnPropertyNames,
        $keys = Object.keys,
        $window_names = (typeof window === 'object' ? $getOwnPropertyNames(window) : []);

    function isStringKey(k) { return !symbolForKey(k); }

    // 19.1.2.7 Object.getOwnPropertyNames ( O )
    define(
      Object, 'getOwnPropertyNames',
      function getOwnPropertyNames(o) {
        if (Object.prototype.toString.call(o) === '[object Window]') {
          // Workaround for cross-realm calling by IE itself.
          // https://github.com/inexorabletash/polyfill/issues/96
          try {
            return $getOwnPropertyNames(o).filter(isStringKey);
          } catch (_) {
            return $window_names.slice();
          }
        }
        return $getOwnPropertyNames(o).filter(isStringKey);
      }, !nativeSymbols);

    // 19.1.2.8 Object.getOwnPropertySymbols ( O )
    define(
      Object, 'getOwnPropertySymbols',
      function getOwnPropertySymbols(o) {
        return $getOwnPropertyNames(o).filter(symbolForKey).map(symbolForKey);
      }, !nativeSymbols);

    // 19.1.2.14 Object.keys ( O )
    define(
      Object, 'keys',
      function keys(o) {
        return $keys(o).filter(isStringKey);
      }, !nativeSymbols);
  }());

  // 19.1.2.9 Object.getPrototypeOf ( O )
  // 19.1.2.10 Object.is ( value1, value2 )
  define(
    Object, 'is',
    function is(value1, value2) {
      return SameValue(value1, value2);
    });

  // 19.1.2.11 Object.isExtensible ( O )
  // 19.1.2.12 Object.isFrozen ( O )
  // 19.1.2.13 Object.isSealed ( O )

  // 19.1.2.14 Object.keys ( O )
  // see above

  // 19.1.2.15 Object.preventExtensions ( O )
  // 19.1.2.16 Object.prototype
  // 19.1.2.17 Object.seal ( O )

  // 19.1.2.18 Object.setPrototypeOf ( O, proto )
  define(
    Object, 'setPrototypeOf',
    function setPrototypeOf(o, proto) {
      if (Type(o) !== 'object') throw TypeError();
      if (Type(proto) !== 'object' && Type(proto) !== 'null') throw TypeError();
      o.__proto__ = proto;
      return o;
    }
  );

  // 19.1.3 Properties of the Object Prototype Object
  // 19.1.3.1 Object.prototype.constructor
  // 19.1.3.2 Object.prototype.hasOwnProperty ( V )
  // 19.1.3.3 Object.prototype.isPrototypeOf ( V )
  // 19.1.3.4 Object.prototype.propertyIsEnumerable ( V )
  // 19.1.3.5 Object.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )
  // 19.1.3.6 Object.prototype.toString ( )
  hook(Object.prototype, 'toString',
       function() {
         var o = strict(this);
         if (o === Object(o) && $$toStringTag in o) {
           return '[object ' + o[$$toStringTag] + ']';
         }
         return undefined;
       });

  // 19.1.3.7 Object.prototype.valueOf ( )
  // 19.1.4 Properties of Object Instances

  // ---------------------------------------
  // 19.2 Function Objects
  // ---------------------------------------

  // 19.2.1 The Function Constructor
  // 19.2.1.1 Function ( p1, p2, … , pn, body )
  // 19.2.2 Properties of the Function Constructor
  // 19.2.2.1 Function.length
  // 19.2.2.2 Function.prototype
  // 19.2.3 Properties of the Function Prototype Object
  // 19.2.3.1 Function.prototype.apply ( thisArg, argArray )
  // 19.2.3.2 Function.prototype.bind ( thisArg , ...args)
  // 19.2.3.3 Function.prototype.call (thisArg , ...args)
  // 19.2.3.4 Function.prototype.constructor
  // 19.2.3.5 Function.prototype.toString ( )
  // 19.2.3.6 Function.prototype[@@hasInstance] ( V )
  // 19.2.4 Function Instances
  // 19.2.4.1 length
  // 19.2.4.2 name
  // 19.2.4.3 prototype

  // (No polyfillable changes from ES5)

  // ---------------------------------------
  // 19.3 Boolean Objects
  // ---------------------------------------

  // 19.3.1 The Boolean Constructor
  // 19.3.1.1 Boolean ( value )
  // 19.3.2 Properties of the Boolean Constructor
  // 19.3.2.1 Boolean.prototype
  // 19.3.3 Properties of the Boolean Prototype Object
  // 19.3.3.1 Boolean.prototype.constructor
  // 19.3.3.2 Boolean.prototype.toString ( )
  // 19.3.3.3 Boolean.prototype.valueOf ( )
  // 19.3.4 Properties of Boolean Instances

  // (No polyfillable changes from ES5)

  // ---------------------------------------
  // 19.4 Symbol Objects
  // ---------------------------------------

  // Moved earlier in this script, so that other polyfills can depend on them.

  // 19.4.3.4 Symbol.prototype [ @@toStringTag ]
  define(global.Symbol.prototype, global.Symbol.toStringTag, 'Symbol');

  // ---------------------------------------
  // 19.5 Error Objects
  // ---------------------------------------

  // 19.5.1 The Error Constructor
  // 19.5.1.1 Error ( message )
  // 19.5.1.2 new Error( ...argumentsList )
  // 19.5.2 Properties of the Error Constructor
  // 19.5.2.1 Error.prototype
  // 19.5.3 Properties of the Error Prototype Object
  // 19.5.3.1 Error.prototype.constructor
  // 19.5.3.2 Error.prototype.message
  // 19.5.3.3 Error.prototype.name
  // 19.5.3.4 Error.prototype.toString ( )
  // 19.5.4 Properties of Error Instances
  // 19.5.5 Native Error Types Used in This Standard
  // 19.5.5.1 EvalError
  // 19.5.5.2 RangeError
  // 19.5.5.3 ReferenceError
  // 19.5.5.4 SyntaxError
  // 19.5.5.5 TypeError
  // 19.5.5.6 URIError
  // 19.5.6 NativeError Object Structure
  // 19.5.6.1 NativeError Constructors
  // 19.5.6.1.1 NativeError ( message )
  // 19.5.6.1.2 new NativeError ( ...argumentsList )
  // 19.5.6.2 Properties of the NativeError Constructors
  // 19.5.6.2.1 NativeError.prototype
  // 19.5.6.3 Properties of the NativeError Prototype Objects
  // 19.5.6.4 Properties of NativeError Instances

  // (No polyfillable changes from ES5)

  // ---------------------------------------
  // 20 Numbers and Dates
  // ---------------------------------------

  // ---------------------------------------
  // 20.1 Number Objects
  // ---------------------------------------

  // 20.1.1 The Number Constructor
  // 20.1.1.1 Number ( [ value ] )
  // 20.1.1.2 new Number ( ...argumentsList )
  // 20.1.2 Properties of the Number Constructor

  // 20.1.2.1 Number.EPSILON
  define(
    Number, 'EPSILON',
    (function () {
      var next, result;
      for (next = 1; 1 + next !== 1; next = next / 2)
        result = next;
      return result;
    }()));

  // 20.1.2.2 Number.isFinite ( number )
  define(
    Number, 'isFinite',
    function isFinite(number) {
      if (Type(number) !== 'number') return false;
      if (number !== number || number === +Infinity || number === -Infinity) return false;
      return true;
    });

  // 20.1.2.3 Number.isInteger ( number )
  define(
    Number, 'isInteger',
    function isInteger(number) {
      if (Type(number) !== 'number') return false;
      if (number !== number || number === +Infinity || number === -Infinity) return false;
      var integer = ToInteger(number);
      if (integer !== number) return false;
      return true;
    });

  // 20.1.2.4 Number.isNaN ( number )
  define(
    Number, 'isNaN',
    function isNaN(number) {
      if (Type(number) !== 'number') return false;
      if (number !== number) return true;
      return false;
    });

  // 20.1.2.5 Number.isSafeInteger ( number )
  define(
    Number, 'isSafeInteger',
    function isSafeInteger(number) {
      if (Type(number) !== 'number') return false;
      if (number !== number || number === +Infinity || number === -Infinity) return false;
      var integer = ToInteger(number);
      if (integer !== number) return false;
      if (abs(integer) <= (0x20000000000000 - 1)) // 2^53-1
        return true;
      return false;
    });

  // 20.1.2.6 Number.MAX_SAFE_INTEGER
  define(
    Number, 'MAX_SAFE_INTEGER',
    9007199254740991); // 2^53-1

  // 20.1.2.7 Number.MAX_VALUE

  // 20.1.2.8 Number.MIN_SAFE_INTEGER
  define(
    Number, 'MIN_SAFE_INTEGER',
    -9007199254740991); // -2^53+1

  // 20.1.2.9 Number.MIN_VALUE
  // 20.1.2.10 Number.NaN
  // 20.1.2.11 Number.NEGATIVE_INFINITY

  // 20.1.2.12 Number.parseFloat ( string )
  define(Number, 'parseFloat', $parseFloat);

  // 20.1.2.13 Number.parseInt ( string, radix )
  define(Number, 'parseInt', $parseInt);

  // 20.1.2.14 Number.POSITIVE_INFINITY
  // 20.1.2.15 Number.prototype

  // 20.1.3 Properties of the Number Prototype Object
  // 20.1.3.1 Number.prototype.constructor
  // 20.1.3.2 Number.prototype.toExponential ( fractionDigits )
  // 20.1.3.3 Number.prototype.toFixed ( fractionDigits )
  // 20.1.3.4 Number.prototype.toLocaleString( [ reserved1 [ , reserved2 ] ])
  // 20.1.3.5 Number.prototype.toPrecision ( precision )
  // 20.1.3.6 Number.prototype.toString ( [ radix ] )
  // 20.1.3.7 Number.prototype.valueOf ( )
  // 20.1.4 Properties of Number Instances

  // ---------------------------------------
  // 20.2 The Math Object
  // ---------------------------------------

  // 20.2.1 Value Properties of the Math Object
  // 20.2.1.1 Math.E
  // 20.2.1.2 Math.LN10
  // 20.2.1.3 Math.LN2
  // 20.2.1.4 Math.LOG10E
  // 20.2.1.5 Math.LOG2E
  // 20.2.1.6 Math.PI
  // 20.2.1.7 Math.SQRT1_2
  // 20.2.1.8 Math.SQRT2

  // 20.2.1.9 Math [ @@toStringTag ]
  define(Math, $$toStringTag, 'Math');

  // 20.2.2 Function Properties of the Math Object
  // 20.2.2.1 Math.abs ( x )
  // 20.2.2.2 Math.acos ( x )

  // 20.2.2.3 Math.acosh(x)
  define(
    Math, 'acosh',
    function acosh(x) {
      x = Number(x);
      return log(x + sqrt(x * x - 1));
    });

  // 20.2.2.4 Math.asin ( x )

  // 20.2.2.5 Math.asinh( x )
  define(
    Math, 'asinh',
    function asinh(x) {
      x = Number(x);
      if (SameValue(x, -0)) {
        return x;
      }
      var s = sqrt(x * x + 1);
      return (s === -x) ? log(0) : log(x + s);
    });

  // 20.2.2.6 Math.atan ( x )

  // 20.2.2.7 Math.atanh( x )
  define(
    Math, 'atanh',
    function atanh(x) {
      x = Number(x);
      return (x === 0) ? x : log((1 + x) / (1 - x)) / 2;
    });

  // 20.2.2.8 Math.atan2 ( y, x )

  // 20.2.2.9 Math.cbrt ( x )
  define(
    Math, 'cbrt',
    function cbrt(x) {
      x = Number(x);
      if ($isNaN(x/x)) {
        return x;
      }
      var r = pow(abs(x), 1/3);
      var t = x/r/r;
      return r + (r * (t-r) / (2*r + t));
    });

  // 20.2.2.10 Math.ceil ( x )

  // 20.2.2.11 Math.clz32 ( x )
  define(
    Math, 'clz32',
    function clz32(x) {
      function clz8(x) {
        return (x & 0xf0) ? (x & 0x80 ? 0 : x & 0x40 ? 1 : x & 0x20 ? 2 : 3) :
        (x & 0x08 ? 4 : x & 0x04 ? 5 : x & 0x02 ? 6 : x & 0x01 ? 7 : 8);
      }
      x = ToUint32(x);
      return x & 0xff000000 ? clz8(x >> 24) :
        x & 0xff0000 ? clz8(x >> 16) + 8 :
        x & 0xff00 ? clz8(x >> 8) + 16 : clz8(x) + 24;
    });



  // 20.2.2.12 Math.cos ( x )

  // 20.2.2.13 Math.cosh ( x )
  define(
    Math, 'cosh',
    function cosh(x) {
      x = Number(x);
      return (pow(E, x) + pow(E, -x)) / 2;
    });

  // 20.2.2.14 Math.exp ( x )

  // 20.2.2.15 Math.expm1 ( x )
  define(
    Math, 'expm1',
    function expm1(x) {
      x = Number(x);
      // from: http://www.johndcook.com/cpp_log1p.html
      if (SameValue(x, -0)) {
        return -0;
      } else if (abs(x) < 1e-5) {
        return x + 0.5 * x * x; // two terms of Taylor expansion
      } else {
        return exp(x) - 1;
      }
    });

  // 20.2.2.16 Math.floor ( x )

  // 20.2.2.17 Math.fround ( x )
  define(
    Math, 'fround',
    function fround(x) {
      if ($isNaN(x)) {
        return NaN;
      }
      if (1/x === +Infinity || 1/x === -Infinity || x === +Infinity || x === -Infinity) {
        return x;
      }
      return (new Float32Array([x]))[0];
    });

  // 20.2.2.18 Math.hypot ( value1 [, value2 [ ... ] ] )
  define(
    Math, 'hypot',
    function hypot() {
      var values = [];
      var m = 0, sawNaN = false;
      for (var i = 0; i < arguments.length; ++i) {
        var n = abs(Number(arguments[i]));
        if (n === Infinity) return n;
        if (n !== n) sawNaN = true;
        if (n > m) m = n;
        values[i] = n;
      }
      if (sawNaN) return NaN;
      if (m === 0) return +0;
      var sum = +0;
      for (i = 0; i < values.length; ++i) {
        var r = values[i] / m;
        sum = sum + r * r;
      }
      return m * sqrt(sum);
    });

  // 20.2.2.19 Math.imul ( x, y )
  define(
    Math, 'imul',
    function imul(x, y) {
      var a = ToUint32(x);
      var b = ToUint32(y);
      // (slow but accurate)
      var ah  = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh  = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }, ('imul' in Math && Math.imul(1, 0x80000000) === 0) // Safari 7 bug
  );

  // 20.2.2.20 Math.log ( x )

  // 20.2.2.21 Math.log1p ( x )
  define(
    Math, 'log1p',
    function log1p(x) {
      x = Number(x);
      // from: http://www.johndcook.com/cpp_expm1.html
      if (x < -1) {
        return NaN;
      } else if (SameValue(x, -0)) {
        return -0;
      } else if (abs(x) > 1e-4) {
        return log(1 + x);
      } else {
        return (-0.5 * x + 1) * x;
      }
    });

  // 20.2.2.22 Math.log10 ( x )
  define(
    Math, 'log10',
    function log10(x) {
      x = Number(x);
      return log(x) * LOG10E;
    });

  // 20.2.2.23 Math.log2 ( x )
  define(
    Math, 'log2',
    function log2(x) {
      x = Number(x);
      return log(x) * LOG2E;
    });

  // 20.2.2.24 Math.max ( value1, value2 , ...values )
  // 20.2.2.25 Math.min ( value1, value2 , ...values )
  // 20.2.2.26 Math.pow ( x, y )
  // 20.2.2.27 Math.random ( )
  // 20.2.2.28 Math.round ( x )

  // 20.2.2.29 Math.sign(x)
  define(
    Math, 'sign',
    function sign(x) {
      x = Number(x);
      return x < 0 ? -1 : x > 0 ? 1 : x;
    });

  // 20.2.2.30 Math.sin ( x )

  // 20.2.2.31 Math.sinh( x )
  define(
    Math, 'sinh',
    function sinh(x) {
      x = Number(x);
      return SameValue(x, -0) ? x : (pow(E, x) - pow(E, -x)) / 2;
    });

  // 20.2.2.32 Math.sqrt ( x )
  // 20.2.2.33 Math.tan ( x )

  // 20.2.2.34 Math.tanh ( x )
  define(
    Math, 'tanh',
    function tanh(x) {
      x = Number(x);
      var n = pow(E, 2 * x) - 1,
          d = pow(E, 2 * x) + 1;
      if (SameValue(x, -0))
        return x;
      return (n === d) ? 1 : n / d; // Handle Infinity/Infinity
    });

  // 20.2.2.35 Math.trunc ( x )
  define(
    Math, 'trunc',
    function trunc(x) {
      x = Number(x);
      return $isNaN(x) ? NaN :
        x < 0 ? ceil(x) : floor(x);
    });

  // ---------------------------------------
  // 20.3 Date Objects
  // ---------------------------------------

  // 20.3.1 Overview of Date Objects and Definitions of Abstract Operations
  // 20.3.1.1 Time Values and Time Range
  // 20.3.1.2 Day Number and Time within Day
  // 20.3.1.3 Year Number
  // 20.3.1.4 Month Number
  // 20.3.1.5 Date Number
  // 20.3.1.6 Week Day
  // 20.3.1.7 Local Time Zone Adjustment
  // 20.3.1.8 Daylight Saving Time Adjustment
  // 20.3.1.9 Local Time
  // 20.3.1.10 Hours, Minutes, Second, and Milliseconds
  // 20.3.1.11 MakeTime (hour, min, sec, ms)
  // 20.3.1.12 MakeDay (year, month, date)
  // 20.3.1.13 MakeDate (day, time)
  // 20.3.1.14 TimeClip (time)
  // 20.3.1.15 Date Time String Format
  // 20.3.1.15.1 Extended years
  // 20.3.2 The Date Constructor
  // 20.3.2.1 Date ( year, month [, date [ , hours [ , minutes [ , seconds [ , ms ] ] ] ] ] )
  // 20.3.2.2 Date ( value )
  // 20.3.2.3 Date ( )
  // 20.3.3 Properties of the Date Constructor
  // 20.3.3.1 Date.now ( )
  // 20.3.3.2 Date.parse (string)
  // 20.3.3.3 Date.prototype
  // 20.3.3.4 Date.UTC ( year, month [ , date [ , hours [ , minutes [ , seconds [ , ms ] ] ] ] ] )
  // 20.3.4 Properties of the Date Prototype Object
  // 20.3.4.1 Date.prototype.constructor
  // 20.3.4.2 Date.prototype.getDate ( )
  // 20.3.4.3 Date.prototype.getDay ( )
  // 20.3.4.4 Date.prototype.getFullYear ( )
  // 20.3.4.5 Date.prototype.getHours ( )
  // 20.3.4.6 Date.prototype.getMilliseconds ( )
  // 20.3.4.7 Date.prototype.getMinutes ( )
  // 20.3.4.8 Date.prototype.getMonth ( )
  // 20.3.4.9 Date.prototype.getSeconds ( )
  // 20.3.4.10 Date.prototype.getTime ( )
  // 20.3.4.11 Date.prototype.getTimezoneOffset ( )
  // 20.3.4.12 Date.prototype.getUTCDate ( )
  // 20.3.4.13 Date.prototype.getUTCDay ( )
  // 20.3.4.14 Date.prototype.getUTCFullYear ( )
  // 20.3.4.15 Date.prototype.getUTCHours ( )
  // 20.3.4.16 Date.prototype.getUTCMilliseconds ( )
  // 20.3.4.17 Date.prototype.getUTCMinutes ( )
  // 20.3.4.18 Date.prototype.getUTCMonth ( )
  // 20.3.4.19 Date.prototype.getUTCSeconds ( )
  // 20.3.4.20 Date.prototype.setDate ( date )
  // 20.3.4.21 Date.prototype.setFullYear ( year [ , month [ , date ] ] )
  // 20.3.4.22 Date.prototype.setHours ( hour [ , min [ , sec [ , ms ] ] ] )
  // 20.3.4.23 Date.prototype.setMilliseconds ( ms )
  // 20.3.4.24 Date.prototype.setMinutes ( min [ , sec [ , ms ] ] )
  // 20.3.4.25 Date.prototype.setMonth ( month [ , date ] )
  // 20.3.4.26 Date.prototype.setSeconds ( sec [ , ms ] )
  // 20.3.4.27 Date.prototype.setTime ( time )
  // 20.3.4.28 Date.prototype.setUTCDate ( date )
  // 20.3.4.29 Date.prototype.setUTCFullYear ( year [ , month [ , date ] ] )
  // 20.3.4.30 Date.prototype.setUTCHours ( hour [ , min [ , sec [ , ms ] ] ] )
  // 20.3.4.31 Date.prototype.setUTCMilliseconds ( ms )
  // 20.3.4.32 Date.prototype.setUTCMinutes ( min [ , sec [, ms ] ] )
  // 20.3.4.33 Date.prototype.setUTCMonth ( month [ , date ] )
  // 20.3.4.34 Date.prototype.setUTCSeconds ( sec [ , ms ] )
  // 20.3.4.35 Date.prototype.toDateString ( )
  // 20.3.4.36 Date.prototype.toISOString ( )
  // 20.3.4.37 Date.prototype.toJSON ( key )
  // 20.3.4.38 Date.prototype.toLocaleDateString ( [ reserved1 [ , reserved2 ] ] )
  // 20.3.4.39 Date.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )
  // 20.3.4.40 Date.prototype.toLocaleTimeString ( [ reserved1 [ , reserved2 ] ] )
  // 20.3.4.41 Date.prototype.toString ( )
  // 20.3.4.42 Date.prototype.toTimeString ( )
  // 20.3.4.43 Date.prototype.toUTCString ( )
  // 20.3.4.44 Date.prototype.valueOf ( )
  // 20.3.4.45 Date.prototype [ @@toPrimitive ] ( hint )
  // 20.3.5 Properties of Date Instances

  // (No polyfillable changes from ES5)

  // ---------------------------------------
  // 21 Text Processing
  // ---------------------------------------

  var string_regexp_dispatch = (function() {
    var faux = {}, secret = Symbol();
    faux[Symbol.match] = function() { return secret; };
    return ("").match(faux) === secret;
  }());

  // 21.1 String Objects
  // 21.1.1 The String Constructor
  // 21.1.1.1 String ( value )
  // 21.1.2 Properties of the String Constructor
  // 21.1.2.1 String.fromCharCode ( ...codeUnits )

  // 21.1.2.2 String.fromCodePoint ( ...codePoints )
  define(
    String, 'fromCodePoint',
    function fromCodePoint(/*...codePoints*/) {
      var codePoints = arguments,
          length = codePoints.length,
          elements = [],
          nextIndex = 0;
      while (nextIndex < length) {
        var next = codePoints[nextIndex];
        var nextCP = Number(next);
        if (!SameValue(nextCP, ToInteger(nextCP)) ||
            nextCP < 0 || nextCP > 0x10FFFF) {
          throw RangeError('Invalid code point ' + nextCP);
        }
        if (nextCP < 0x10000) {
          elements.push(String.fromCharCode(nextCP));
        } else {
          nextCP -= 0x10000;
          elements.push(String.fromCharCode((nextCP >> 10) + 0xD800));
          elements.push(String.fromCharCode((nextCP % 0x400) + 0xDC00));
        }
        nextIndex += 1;
      }
      return elements.join('');
    });

  // 21.1.2.3 String.prototype

  // 21.1.2.4 String.raw ( template , ...substitutions )
  define(
    String, 'raw',
    function raw(template /*, ...substitutions*/) {
      var substitutions = [].slice.call(arguments, 1);

      var cooked = Object(template);
      var rawValue = cooked['raw'];
      var raw = Object(rawValue);
      var len = raw['length'];
      var literalSegments = ToLength(len);
      if (literalSegments <= 0) return '';
      var stringElements = [];
      var nextIndex = 0;
      while (true) {
        var next = raw[nextIndex];
        var nextSeg = String(next);
        stringElements.push(nextSeg);
        if (nextIndex + 1 === literalSegments)
          return stringElements.join('');
        next = substitutions[nextIndex];
        var nextSub = String(next);
        stringElements.push(nextSub);
        nextIndex = nextIndex + 1;
      }
    });

  // See https://githib.com/inexorabletash/uate for a more useful version.

  // 21.1.3 Properties of the String Prototype Object
  // 21.1.3.1 String.prototype.charAt ( pos )
  // 21.1.3.2 String.prototype.charCodeAt ( pos )

  // 21.1.3.3 String.prototype.codePointAt ( pos )
  define(
    String.prototype, 'codePointAt',
    function codePointAt(pos) {
      var o = strict(this);
      var s = String(o);
      var position = ToInteger(pos);
      var size = s.length;
      if (position < 0 || position >= size) return undefined;
      var first = s.charCodeAt(position);
      if (first < 0xD800 || first > 0xDBFF || position + 1 === size) return first;
      var second = s.charCodeAt(position + 1);
      if (second < 0xDC00 || second > 0xDFFF) return first;
      return ((first - 0xD800) * 1024) + (second - 0xDC00) + 0x10000;
    });

  // 21.1.3.4 String.prototype.concat ( ...args )
  // 21.1.3.5 String.prototype.constructor

  // 21.1.3.6 String.prototype.endsWith ( searchString [ , endPosition] )
  define(
    String.prototype, 'endsWith',
    function endsWith(searchString) {
      var endPosition = arguments[1];

      var o = strict(this);
      var s = String(o);
      var searchStr = String(searchString);
      var len = s.length;
      var pos = (endPosition === undefined) ? len : ToInteger(endPosition);
      var end = min(max(pos, 0), len);
      var searchLength = searchStr.length;
      var start = end - searchLength;
      if (start < 0) return false;
      if (s.substring(start, start + searchLength) === searchStr) return true;
      return false;
    });

  // 21.1.3.7 String.prototype.includes ( searchString [ , position ] )
  define(
    String.prototype, 'includes',
    function includes(searchString) {
      var position = arguments[1];

      var o = strict(this);
      var s = String(o);
      var searchStr = String(searchString);
      var pos = ToInteger(position);
      var len = s.length;
      var start = min(max(pos, 0), len);
      return s.indexOf(searchStr, start) !== -1;
    });

  // 21.1.3.8 String.prototype.indexOf ( searchString [ , position ] )
  // 21.1.3.9 String.prototype.lastIndexOf ( searchString [ , position ] )
  // 21.1.3.10 String.prototype.localeCompare ( that [, reserved1 [ , reserved2 ] ] )
  // 21.1.3.11 String.prototype.match ( regexp )
  define(
    String.prototype, 'match',
    function match(regexp) {
      var o = strict(this);
      var s = String(o);
      if (HasProperty(regexp, $$match)) var rx = regexp;
      else rx = new RegExp(regexp);
      return rx[$$match](s);
    }, !string_regexp_dispatch);

  // 21.1.3.12 String.prototype.normalize ( [ form ] )

  // Not practical due to table sizes; if needed, pull in:
  // https://github.com/walling/unorm/

  // 21.1.3.13 String.prototype.repeat ( count )
  define(
    String.prototype, 'repeat',
    function repeat(count) {
      var o = strict(this);
      var s = String(o);
      var n = ToInteger(count);
      if (n < 0) throw RangeError();
      if (n === Infinity) throw RangeError();
      var t = new Array(n + 1).join(s);
      return t;
    });

  // 21.1.3.14 String.prototype.replace (searchValue, replaceValue )
  define(
    String.prototype, 'replace',
    function replace(searchValue, replaceValue) {
      var o = strict(this);
      if (HasProperty(searchValue, $$replace))
        return searchValue[$$replace](o, replaceValue);
      return orig_replace.call(o, searchValue, replaceValue);
    }, !string_regexp_dispatch);

  // 21.1.3.15 String.prototype.search ( regexp )
  define(
    String.prototype, 'search',
    function search(regexp) {
      var o = strict(this);
      var string = String(o);
      if (HasProperty(regexp, $$search)) var rx = regexp;
      else rx = new RegExp(regexp);
      return rx[$$search](string);
    }, !string_regexp_dispatch);

  // 21.1.3.16 String.prototype.slice ( start, end )
  // 21.1.3.17 String.prototype.split ( separator, limit )
  define(
    String.prototype, 'split',
    function split(separator, limit) {
      var o = strict(this);
      if (HasProperty(separator, $$split))
        return separator[$$split](o, limit);
      return orig_split.call(o, separator, limit);
    }, !string_regexp_dispatch);

  // 21.1.3.18 String.prototype.startsWith ( searchString [, position ] )
  define(
    String.prototype, 'startsWith',
    function startsWith(searchString) {
      var position = arguments[1];

      var o = strict(this);
      var s = String(o);
      var searchStr = String(searchString);
      var pos = ToInteger(position);
      var len = s.length;
      var start = min(max(pos, 0), len);
      var searchLength = searchStr.length;
      if (searchLength + start > len) return false;
      if (s.substring(start, start + searchLength) === searchStr) return true;
      return false;
    });

  // 21.1.3.19 String.prototype.substring ( start, end )
  // 21.1.3.20 String.prototype.toLocaleLowerCase ( [ reserved1 [ , reserved2 ] ] )
  // 21.1.3.21 String.prototype.toLocaleUpperCase ([ reserved1 [ , reserved2 ] ] )
  // 21.1.3.22 String.prototype.toLowerCase ( )
  // 21.1.3.23 String.prototype.toString ( )
  // 21.1.3.24 String.prototype.toUpperCase ( )
  // 21.1.3.25 String.prototype.trim ( )
  // 21.1.3.26 String.prototype.valueOf ( )

  // 21.1.3.27 String.prototype [ @@iterator ]( )
  define(
    String.prototype, $$iterator,
    function entries() {
      return CreateStringIterator(this, 'value');
    });

  // 21.1.4 Properties of String Instances
  // 21.1.4.1 length

  // 21.1.5 String Iterator Objects
  /** @constructor */
  function StringIterator() {}

  // 21.1.5.1 CreateStringIterator Abstract Operation
  function CreateStringIterator(string, kind) {
    var s = String(string);
    var iterator = new StringIterator;
    set_internal(iterator, '[[IteratedString]]', s);
    set_internal(iterator, '[[StringIteratorNextIndex]]', 0);
    set_internal(iterator, '[[StringIterationKind]]', kind);
    return iterator;
  }

  // 21.1.5.2 The %StringIteratorPrototype% Object
  var $StringIteratorPrototype$ = Object.create($IteratorPrototype$);
  StringIterator.prototype = $StringIteratorPrototype$;

  // 21.1.5.2.1 %StringIteratorPrototype%.next ( )
  define(
    $StringIteratorPrototype$, 'next',
    function next() {
      var o = ToObject(this);
      var s = String(o['[[IteratedString]]']),
          index = o['[[StringIteratorNextIndex]]'],
          len = s.length;
      if (index >= len) {
        set_internal(o, '[[StringIteratorNextIndex]]', Infinity);
        return CreateIterResultObject(undefined, true);
      }
      var cp = s.codePointAt(index);
      set_internal(o, '[[StringIteratorNextIndex]]', index + (cp > 0xFFFF ? 2 : 1));
      return CreateIterResultObject(String.fromCodePoint(cp), false);
    });

  // 21.1.5.2.2 %StringIteratorPrototype% [ @@toStringTag ]
  define($StringIteratorPrototype$, $$toStringTag, 'String Iterator');

  // 21.1.5.3 Properties of String Iterator Instances

  // ---------------------------------------
  // 21.2 RegExp (Regular Expression) Objects
  // ---------------------------------------

  // 21.2.1 Patterns
  // 21.2.2 Pattern Semantics
  // 21.2.2.1 Notation
  // 21.2.2.2 Pattern
  // 21.2.2.3 Disjunction
  // 21.2.2.4 Alternative
  // 21.2.2.5 Term
  // 21.2.2.6 Assertion
  // 21.2.2.7 Quantifier
  // 21.2.2.8 Atom
  // 21.2.2.9 AtomEscape
  // 21.2.2.10 CharacterEscape
  // 21.2.2.11 DecimalEscape
  // 21.2.2.12 CharacterClassEscape
  // 21.2.2.13 CharacterClass
  // 21.2.2.14 ClassRanges
  // 21.2.2.15 NonemptyClassRanges
  // 21.2.2.16 NonemptyClassRangesNoDash
  // 21.2.2.17 ClassAtom
  // 21.2.2.18 ClassAtomNoDash
  // 21.2.2.19 ClassEscape
  // 21.2.3 The RegExp Constructor
  // 21.2.3.1 RegExp ( pattern, flags )
  // 21.2.3.2 new RegExp( ...argumentsList )
  // 21.2.3.3 Abstract Operations for the RegExp Constructor
  // 21.2.4 Properties of the RegExp Constructor
  // 21.2.4.1 RegExp.prototype
  // 21.2.5 Properties of the RegExp Prototype Object
  // 21.2.5.1 RegExp.prototype.constructor
  // 21.2.5.2 RegExp.prototype.exec ( string )

  // 21.2.5.3 get RegExp.prototype.flags
  if (!('flags' in RegExp.prototype)) {
    Object.defineProperty(
      RegExp.prototype, 'flags', {
        get: function() {
          var s = String(this);
          return s.substring(s.lastIndexOf('/') + 1);
        }
      });
  }

  // 21.2.5.4 get RegExp.prototype.global
  // 21.2.5.5 get RegExp.prototype.ignoreCase

  // 21.2.5.6 RegExp.prototype [ @@match ] ( string )
  define(RegExp.prototype, $$match, function(string) {
    var o = strict(this);
    return orig_match.call(string, o);
  });

  // 21.2.5.7 get RegExp.prototype.multiline

  // 21.2.5.8 RegExp.prototype [ @@replace ] ( string, replaceValue )
  define(RegExp.prototype, $$replace, function(string, replaceValue) {
    var o = strict(this);
    return orig_replace.call(string, o, replaceValue);
  });

  // 21.2.5.9 RegExp.prototype [ @@search ] ( string )
  define(RegExp.prototype, $$search, function(string) {
    var o = strict(this);
    return orig_search.call(string, o);
  });

  // 21.2.5.10 get RegExp.prototype.source

  // 21.2.5.11 RegExp.prototype [ @@split ] ( string, limit )
  define(RegExp.prototype, $$split, function(string, limit) {
    var o = strict(this);
    return orig_split.call(string, o, limit);
  });

  // 21.2.5.12 get RegExp.prototype.sticky
  // 21.2.5.13 RegExp.prototype.test( S )
  // 21.2.5.14 RegExp.prototype.toString ( )
  // 21.2.5.15 get RegExp.prototype.unicode

  // 21.2.6 Properties of RegExp Instances
  // 21.2.6.1 lastIndex

  // (No polyfillable changes from ES5)

  // ---------------------------------------
  // 22 Indexed Collections
  // ---------------------------------------

  // ---------------------------------------
  // 22.1 Array Objects
  // ---------------------------------------

  // 22.1.1 The Array Constructor
  // 22.1.1.1 Array ( )
  // 22.1.1.2 Array (len)
  // 22.1.1.3 Array (...items )

  // 22.1.2 Properties of the Array Constructor

  // 22.1.2.1 Array.from ( items [ , mapfn [ , thisArg ] ] )
  define(
    Array, 'from',
    function from(items) {
      var mapfn = arguments[1];
      var thisArg = arguments[2];

      var c = strict(this);
      if (mapfn === undefined) {
        var mapping = false;
      } else {
        if (!IsCallable(mapfn)) throw TypeError();
        var t = thisArg;
        mapping = true;
      }
      var usingIterator = GetMethod(items, $$iterator);
      if (usingIterator !== undefined) {
         if (IsConstructor(c)) {
          var a = new c();
        } else {
          a = new Array(0);
        }
        var iterator = GetIterator(items, usingIterator);
        var k = 0;
        while (true) {
          var next = IteratorStep(iterator);
          if (next === false) {
            a.length = k;
            return a;
          }
          var nextValue = IteratorValue(next);
          if (mapping)
            var mappedValue = mapfn.call(t, nextValue);
          else
            mappedValue = nextValue;
          a[k] = mappedValue;
          k += 1;
        }
      }
      var arrayLike = ToObject(items);
      var lenValue = arrayLike.length;
      var len = ToLength(lenValue);
      if (IsConstructor(c)) {
        a = new c(len);
      } else {
        a = new Array(len);
      }
      k = 0;
      while (k < len) {
        var kValue = arrayLike[k];
        if (mapping)
          mappedValue = mapfn.call(t, kValue, k);
        else
          mappedValue = kValue;
        a[k] = mappedValue;
        k += 1;
      }
      a.length = len;
      return a;
    });

  // 22.1.2.2 Array.isArray ( arg )

  // 22.1.2.3 Array.of ( ...items )
  define(
    Array, 'of',
    function of() {
      var items = arguments;

      var lenValue = items.length;
      var len = ToUint32(lenValue);
      var c = strict(this), a;
      if (IsConstructor(c)) {
        a = new c(len);
        a = ToObject(a);
      } else {
        a = new Array(len);
      }
      var k = 0;
      while (k < len) {
        a[k] = items[k];
        k += 1;
      }
      a.length = len;
      return a;
    });

  // 22.1.2.4 Array.prototype
  // 22.1.2.5 get Array [ @@species ]
  // 22.1.3 Properties of the Array Prototype Object
  // 22.1.3.1 Array.prototype.concat ( ...arguments )
  // 22.1.3.1.1 Runtime Semantics: IsConcatSpreadable ( O )
  // 22.1.3.2 Array.prototype.constructor
  // 22.1.3.3 Array.prototype.copyWithin (target, start [ , end ] )
  define(
    Array.prototype, 'copyWithin',
    function copyWithin(target, start/*, end*/) {
      var end = arguments[2];

      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToLength(lenVal);
      len = max(len, 0);
      var relativeTarget = ToInteger(target);
      var to;
      if (relativeTarget < 0)
        to = max(len + relativeTarget, 0);
      else
        to = min(relativeTarget, len);
      var relativeStart = ToInteger(start);
      var from;
      if (relativeStart < 0)
        from = max(len + relativeStart, 0);
      else
        from = min(relativeStart, len);
      var relativeEnd;
      if (end === undefined)
        relativeEnd = len;
      else
        relativeEnd = ToInteger(end);
      var final;
      if (relativeEnd < 0)
        final = max(len + relativeEnd, 0);
      else
        final = min(relativeEnd, len);
      var count = min(final - from, len - to);
      var direction;
      if (from < to && to < from + count) {
        direction = -1;
        from = from + count - 1;
        to = to + count - 1;
      } else {
        direction = 1;
      }
      while (count > 0) {
        var fromKey = String(from);
        var toKey = String(to);
        var fromPresent = HasProperty(o, fromKey);
        if (fromPresent) {
          var fromVal = o[fromKey];
          o[toKey] = fromVal;
        } else {
          delete o[toKey];
        }
        from = from + direction;
        to = to + direction;
        count = count - 1;
      }
      return o;
    });

  // 22.1.3.4 Array.prototype.entries ( )
  var nativeArrayIteratorMethods =
        ('entries' in Array.prototype && 'next' in [].entries());

  define(
    Array.prototype, 'entries',
    function entries() {
      return CreateArrayIterator(this, 'key+value');
    }, !nativeArrayIteratorMethods);

  // 22.1.3.5 Array.prototype.every ( callbackfn [ , thisArg] )

  // 22.1.3.6 Array.prototype.fill (value [ , start [ , end ] ] )
  define(
    Array.prototype, 'fill',
    function fill(value/*, start, end*/) {
      var start = arguments[1],
          end = arguments[2];

      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToLength(lenVal);
      len = max(len, 0);
      var relativeStart = ToInteger(start);
      var k;
      if (relativeStart < 0)
        k = max((len + relativeStart), 0);
      else
        k = min(relativeStart, len);
      var relativeEnd;
      if (end === undefined)
        relativeEnd = len;
      else
        relativeEnd = ToInteger(end);
      var final;
      if (relativeEnd < 0)
        final = max((len + relativeEnd), 0);
      else
        final = min(relativeEnd, len);
      while (k < final) {
        var pk = String(k);
        o[pk] = value;
        k += 1;
      }
      return o;
    });

  // 22.1.3.7 Array.prototype.filter ( callbackfn [ , thisArg ] )

  // 22.1.3.8 Array.prototype.find ( predicate [ , thisArg ] )
  define(
    Array.prototype, 'find',
    function find(predicate) {
      var o = ToObject(this);
      var lenValue = o.length;
      var len = ToInteger(lenValue);
      if (!IsCallable(predicate)) throw TypeError();
      var t = arguments.length > 1 ? arguments[1] : undefined;
      var k = 0;
      while (k < len) {
        var pk = String(k);
        var kPresent = HasProperty(o, pk);
        if (kPresent) {
          var kValue = o[pk];
          var testResult = predicate.call(t, kValue, k, o);
          if (Boolean(testResult)) {
            return kValue;
          }
        }
        ++k;
      }
      return undefined;
    });

  // 22.1.3.9 Array.prototype.findIndex ( predicate [ , thisArg ] )
  define(
    Array.prototype, 'findIndex',
    function findIndex(predicate) {
      var o = ToObject(this);
      var lenValue = o.length;
      var len = ToLength(lenValue);
      if (!IsCallable(predicate)) throw TypeError();
      var t = arguments.length > 1 ? arguments[1] : undefined;
      var k = 0;
      while (k < len) {
        var pk = String(k);
        var kPresent = HasProperty(o, pk);
        if (kPresent) {
          var kValue = o[pk];
          var testResult = predicate.call(t, kValue, k, o);
          if (Boolean(testResult)) {
            return k;
          }
        }
        ++k;
      }
      return -1;
    });

  // 22.1.3.10 Array.prototype.forEach ( callbackfn [ , thisArg ] )
  // 22.1.3.11 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
  // 22.1.3.12 Array.prototype.join (separator)

  // 22.1.3.13 Array.prototype.keys ( )
  define(
    Array.prototype, 'keys',
    function keys() {
      return CreateArrayIterator(this, 'key');
    }, !nativeArrayIteratorMethods);

  // 22.1.3.14 Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )
  // 22.1.3.15 Array.prototype.map ( callbackfn [ , thisArg ] )
  // 22.1.3.16 Array.prototype.pop ( )
  // 22.1.3.17 Array.prototype.push ( ...items )
  // 22.1.3.18 Array.prototype.reduce ( callbackfn [ , initialValue ] )
  // 22.1.3.19 Array.prototype.reduceRight ( callbackfn [ , initialValue ] )
  // 22.1.3.20 Array.prototype.reverse ( )
  // 22.1.3.21 Array.prototype.shift ( )
  // 22.1.3.22 Array.prototype.slice (start, end)
  // 22.1.3.23 Array.prototype.some ( callbackfn [ , thisArg ] )
  // 22.1.3.24 Array.prototype.sort (comparefn)
  // 22.1.3.25 Array.prototype.splice (start, deleteCount , ...items )
  // 22.1.3.26 Array.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )
  // 22.1.3.27 Array.prototype.toString ( )
  // 22.1.3.28 Array.prototype.unshift ( ...items )

  // 22.1.3.29 Array.prototype.values ( )
  define(
    Array.prototype, 'values',
    function values() {
      return CreateArrayIterator(this, 'value');
    }, !nativeArrayIteratorMethods);

  // 22.1.3.30 Array.prototype [ @@iterator ] ( )
  define(
    Array.prototype, $$iterator,
    Array.prototype.values
    );

  // 22.1.3.31 Array.prototype [ @@unscopables ]
  // 22.1.4 Properties of Array Instances
  // 22.1.4.1 length

  // 22.1.5 Array Iterator Objects
  function ArrayIterator() {}

  // 22.1.5.1 CreateArrayIterator Abstract Operation
  function CreateArrayIterator(array, kind) {
    var o = ToObject(array);
    var iterator = new ArrayIterator;
    set_internal(iterator, '[[IteratedObject]]', o);
    set_internal(iterator, '[[ArrayIteratorNextIndex]]', 0);
    set_internal(iterator, '[[ArrayIterationKind]]', kind);
    return iterator;
  }

  // 22.1.5.2 The %ArrayIteratorPrototype% Object
  var $ArrayIteratorPrototype$ = Object.create($IteratorPrototype$);
  ArrayIterator.prototype = $ArrayIteratorPrototype$;

  // 22.1.5.2.1 %ArrayIteratorPrototype%. next( )
  define(
    $ArrayIteratorPrototype$, 'next',
    function next() {
      var o = strict(this);
      if (Type(o) !== 'object') throw TypeError();
      var a = o['[[IteratedObject]]'],
          index = o['[[ArrayIteratorNextIndex]]'],
          itemKind = o['[[ArrayIterationKind]]'],
          lenValue = a.length,
          len = ToUint32(lenValue),
          elementKey,
          elementValue;
      if (itemKind.indexOf('sparse') !== -1) {
        var found = false;
        while (!found && index < len) {
          elementKey = String(index);
          found = HasProperty(a, elementKey);
          if (!found) {
            index += 1;
          }
        }
      }
      if (index >= len) {
        set_internal(o, '[[ArrayIteratorNextIndex]]', Infinity);
        return CreateIterResultObject(undefined, true);
      }
      elementKey = index;
      set_internal(o, '[[ArrayIteratorNextIndex]]', index + 1);
      if (itemKind.indexOf('value') !== -1)
        elementValue = a[elementKey];
      if (itemKind.indexOf('key+value') !== -1)
        return CreateIterResultObject([elementKey, elementValue], false);
      if (itemKind.indexOf('key') !== -1)
        return CreateIterResultObject(elementKey, false);
      if (itemKind === 'value')
        return CreateIterResultObject(elementValue, false);
      throw Error('Internal error');
    });

  // 22.1.5.2.2 %ArrayIteratorPrototype% [ @@toStringTag ]
  define($ArrayIteratorPrototype$, $$toStringTag, 'Array Iterator');

  // 22.1.5.3 Properties of Array Iterator Instances


  // ---------------------------------------
  // 22.2 TypedArray Objects
  // ---------------------------------------

  // See typedarray.js for TypedArray polyfill

  ['Int8Array', 'Uint8Array', 'Uint8ClampedArray',
   'Int16Array', 'Uint16Array',
   'Int32Array', 'Uint32Array',
   'Float32Array', 'Float64Array'].forEach(function ($TypedArrayName$) {
     if (!($TypedArrayName$ in global))
       return;
     var $TypedArray$ = global[$TypedArrayName$];

     // 22.2.1 The %TypedArray% Intrinsic Object
     // 22.2.1.1 %TypedArray% ( length )
     // 22.2.1.2 %TypedArray% ( typedArray )
     // 22.2.1.3 %TypedArray% ( object )
     // 22.2.1.4 %TypedArray% ( buffer [ , byteOffset [ , length ] ] )
     // 22.2.1.5 %TypedArray% ( all other argument combinations )
     // 22.2.2 Properties of the %TypedArray% Intrinsic Object

     // 22.2.2.1 %TypedArray%.from ( source [ , mapfn [ , thisArg ] ] )
     define(
       $TypedArray$, 'from',
       function from(source) {
         var mapfn = arguments[1];
         var thisArg = arguments[2];

         var c = strict(this);
         if (!IsConstructor(c)) throw TypeError();
         if (mapfn === undefined) {
           var mapping = false;
         } else {
           if (IsCallable(mapfn)) throw TypeError();
           var t = thisArg;
           mapping = true;
         }
         var usingIterator = GetMethod(source, $$iterator);
         if (usingIterator !== undefined) {
           var iterator = GetIterator(source, usingIterator);
           var values = [];
           var next = true;
           while (next !== false) {
             next = IteratorStep(iterator);
             if (next !== false) {
               var nextValue = IteratorValue(next);
               values.push(nextValue);
             }
           }
           var len = values.length;
           var newObj = new c(len);
           var k = 0;
           while (k < len) {
             var kValue = values.shift();
             if (mapping) {
               var mappedValue = mapfn.call(t, kValue);
             } else {
               mappedValue = kValue;
             }
             newObj[k] = mappedValue;
             ++k;
           }
           console.assert(values.length === 0);
           return newObj;
         }
         var arrayLike = ToObject(source);
         var lenValue = arrayLike.length;
         len = ToLength(lenValue);
         newObj = new c(len);
         k = 0;
         while (k < len) {
           kValue = arrayLike[k];
           if (mapping) {
             mappedValue = mapfn.call(t, kValue, k);
           } else {
             mappedValue = kValue;
           }
           newObj[k] = mappedValue;
           ++k;
         }
         return newObj;
       });

     // 22.2.2.2 %TypedArray%.of ( ...items )
     define(
       $TypedArray$, 'of',
       function of() {
         var items = arguments;

         var len = items.length;
         var c = strict(this);
         var newObj = new c(len);
         var k = 0;
         while (k < len) {
           newObj[k] = items[k];
           ++k;
         }
         return newObj;
       });

     // 22.2.2.3 %TypedArray%.prototype
     // 22.2.2.4 get %TypedArray% [ @@species ]
     // 22.2.3 Properties of the %TypedArrayPrototype% Object
     // 22.2.3.1 get %TypedArray%.prototype.buffer
     // 22.2.3.2 get %TypedArray%.prototype.byteLength
     // 22.2.3.3 get %TypedArray%.prototype.byteOffset
     // 22.2.3.4 %TypedArray%.prototype.constructor

     // 22.2.3.5 %TypedArray%.prototype.copyWithin (target, start [, end ] )
     define($TypedArray$.prototype, 'copyWithin', Array.prototype.copyWithin);

     // 22.2.3.6 %TypedArray%.prototype.entries ( )
     define($TypedArray$.prototype, 'entries', Array.prototype.entries);

     // 22.2.3.7 %TypedArray%.prototype.every ( callbackfn [ , thisArg ] )
     define($TypedArray$.prototype, 'every', Array.prototype.every);

     // 22.2.3.8 %TypedArray%.prototype.fill (value [ , start [ , end ] ] )
     define(
       $TypedArray$.prototype, 'fill',
       //Array.prototype.fill // Doesn't work in Safari 7
       function fill(value/*, start, end*/) {
         var start = arguments[1],
             end = arguments[2];

         var o = ToObject(this);
         var lenVal = o.length;
         var len = ToLength(lenVal);
         len = max(len, 0);
         var relativeStart = ToInteger(start);
         var k;
         if (relativeStart < 0) k = max((len + relativeStart), 0);
         else k = min(relativeStart, len);
         var relativeEnd;
         if (end === undefined) relativeEnd = len;
         else relativeEnd = ToInteger(end);
         var final;
         if (relativeEnd < 0) final = max((len + relativeEnd), 0);
         else final = min(relativeEnd, len);
         while (k < final) {
           var pk = String(k);
           o[pk] = value;
           k += 1;
         }
         return o;
       });

     // 22.2.3.9 %TypedArray%.prototype.filter ( callbackfn [ , thisArg ] )
     define(
       $TypedArray$.prototype, 'filter',
       function filter(callbackfn) {
         var thisArg = arguments[1];

         var o = ToObject(this);
         var lenVal = o.length;
         var len = ToLength(lenVal);
         if (!IsCallable(callbackfn)) throw TypeError();
         var t = thisArg;
         var c = o.constructor;
         var kept = [];
         var k = 0;
         var captured = 0;
         while (k < len) {
           var kValue = o[k];
           var selected = callbackfn.call(t, kValue, k, o);
           if (selected) {
             kept.push(kValue);
             ++captured;
           }
           ++k;
         }
         var a = new c(captured);
         var n = 0;
         for (var i = 0; i < kept.length; ++i) {
           var e = kept[i];
           a[n] = e;
           ++n;
         }
         return a;
       });

     // 22.2.3.10 %TypedArray%.prototype.find (predicate [ , thisArg ] )
     define($TypedArray$.prototype, 'find', Array.prototype.find);

     // 22.2.3.11 %TypedArray%.prototype.findIndex ( predicate [ , thisArg ] )
     define($TypedArray$.prototype, 'findIndex', Array.prototype.findIndex);

     // 22.2.3.12 %TypedArray%.prototype.forEach ( callbackfn [ , thisArg ] )
     define($TypedArray$.prototype, 'forEach', Array.prototype.forEach);

     // 22.2.3.13 %TypedArray%.prototype.indexOf (searchElement [ , fromIndex ] )
     define($TypedArray$.prototype, 'indexOf', Array.prototype.indexOf);

     // 22.2.3.14 %TypedArray%.prototype.join ( separator )
     define($TypedArray$.prototype, 'join', Array.prototype.join);

     // 22.2.3.15 %TypedArray%.prototype.keys ( )
     define($TypedArray$.prototype, 'keys', Array.prototype.keys);

     // 22.2.3.16 %TypedArray%.prototype.lastIndexOf ( searchElement [ , fromIndex ] )
     define($TypedArray$.prototype, 'lastIndexOf', Array.prototype.lastIndexOf);

     // 22.2.3.17 get %TypedArray%.prototype.length

     // 22.2.3.18 %TypedArray%.prototype.map ( callbackfn [ , thisArg ] )
     define(
       $TypedArray$.prototype, 'map',
       function map(callbackfn) {
         var thisArg = arguments[1];

         var o = ToObject(this);
         var lenValue = o.length;
         var len = ToLength(lenValue);
         if (!IsCallable(callbackfn)) throw TypeError();
         var t = thisArg;
         var a = undefined;
         var c = o.constructor;
         if (IsConstructor(c))
           a = new c(len);
         if (a === undefined)
           a = new Array(len);
         var k = 0;
         while (k < len) {
           var kPresent = HasProperty(o, k);
           if (kPresent) {
             var kValue = o[k];
             var mappedValue = callbackfn.call(t, kValue, k, o);
             a[k] = mappedValue;
           }
           ++k;
         }
         return a;
       });

     // 22.2.3.19 %TypedArray%.prototype.reduce ( callbackfn [, initialValue] )
     define($TypedArray$.prototype, 'reduce', Array.prototype.reduce);

     // 22.2.3.20 %TypedArray%.prototype.reduceRight ( callbackfn [, initialValue] )
     define($TypedArray$.prototype, 'reduceRight', Array.prototype.reduceRight);

     // 22.2.3.21 %TypedArray%.prototype.reverse ( )
     define($TypedArray$.prototype, 'reverse', Array.prototype.reverse);

     // 22.2.3.22 %TypedArray%.prototype.set ( overloaded [ , offset ])
     // 22.2.3.22.1 %TypedArray%.prototype.set (array [ , offset ] )
     // 22.2.3.22.2 %TypedArray%.prototype.set(typedArray [, offset ] )

     // 22.2.3.23 %TypedArray%.prototype.slice ( start, end )
     define(
       $TypedArray$.prototype, 'slice',
       function slice(start, end) {
         var o = ToObject(this);
         var lenVal = o.length;
         var len = ToLength(lenVal);
         var relativeStart = ToInteger(start);
         var k = (relativeStart < 0) ? max(len + relativeStart, 0) : min(relativeStart, len);
         var relativeEnd = (end === undefined) ? len : ToInteger(end);
         var final = (relativeEnd < 0) ? max(len + relativeEnd, 0) : min(relativeEnd, len);
         var count = final - k;
         var c = o.constructor;
         if (IsConstructor(c)) {
           var a = new c(count);
         } else {
           throw TypeError();
         }
         var n = 0;
         while (k < final) {
           var kValue = o[k];
           a[n] = kValue;
           ++k;
           ++n;
         }
         return a;
       });

     // 22.2.3.24 %TypedArray%.prototype.some ( callbackfn [ , thisArg ] )
     define($TypedArray$.prototype, 'some', Array.prototype.some);

     // 22.2.3.25 %TypedArray%.prototype.sort ( comparefn )
     define(
       $TypedArray$.prototype, 'sort',
       function sort() {
         var comparefn = arguments[0];

         function sortCompare(x, y) {
           console.assert(Type(x) === 'number' && Type(y) === 'number');
           if (x !== x && y !== y) return +0;
           if (x !== x) return 1;
           if (y !== y) return -1;
           if (comparefn !== undefined) {
             return comparefn(x, y);
           }
           if (x < y) return -1;
           if (x > y) return 1;
           return +0;
         }
         return Array.prototype.sort.call(this, sortCompare);
       });

     // 22.2.3.26 %TypedArray%.prototype.subarray( [ begin [ , end ] ] )
     // 22.2.3.27 %TypedArray%.prototype.toLocaleString ([ reserved1 [ , reserved2 ] ])
     // 22.2.3.28 %TypedArray%.prototype.toString ( )

     // 22.2.3.29 %TypedArray%.prototype.values ( )
     define($TypedArray$.prototype, 'values', Array.prototype.values);

     // 22.2.3.30 %TypedArray%.prototype [ @@iterator ] ( )
     define(
       $TypedArray$.prototype, $$iterator,
       $TypedArray$.prototype.values
     );

     // 22.2.3.31 get %TypedArray%.prototype [ @@toStringTag ]
     define($TypedArray$.prototype, $$toStringTag, $TypedArrayName$);

     // 22.2.4 The TypedArray Constructors
     // 22.2.4.1TypedArray( ... argumentsList)
     // 22.2.5 Properties of the TypedArray Constructors
     // 22.2.5.1 TypedArray.BYTES_PER_ELEMENT
     // 22.2.5.2 TypedArray.prototype
     // 22.2.6 Properties of TypedArray Prototype Objects
     // 22.2.6.1 TypedArray.prototype.BYTES_PER_ELEMENT
     // 22.2.6.2 TypedArray.prototype.constructor
     // 22.2.7 Properties of TypedArray Instances
   });

  // ---------------------------------------
  // 23 Keyed Collection
  // ---------------------------------------

  // ---------------------------------------
  // 23.1 Map Objects
  // ---------------------------------------

  (function() {
    // 23.1.1 The Map Constructor

    // 23.1.1.1 Map ( [ iterable ] )
    /** @constructor */
    function Map(/*iterable*/) {
      var map = strict(this);
      var iterable = arguments[0];

      if (Type(map) !== 'object') throw TypeError();
      if ('[[MapData]]' in map) throw TypeError();

      if (iterable !== undefined) {
        var adder = map['set'];
        if (!IsCallable(adder)) throw TypeError();
        var iter = GetIterator(ToObject(iterable));
      }
      set_internal(map, '[[MapData]]', { keys: [], values: [] });
      if (iter === undefined) return map;
      while (true) {
        var next = IteratorStep(iter);
        if (next === false)
          return map;
        var nextItem = IteratorValue(next);
        if (Type(nextItem) !== 'object') throw TypeError();
        var k = nextItem[0];
        var v = nextItem[1];
        adder.call(map, k, v);
      }

      return map;
    }

    if (!('Map' in global) || OVERRIDE_NATIVE_FOR_TESTING ||
        (function() { try { new global.Map([]); return false; } catch (_) { return true; } }()) ||
        (function() { try { return !new global.Map().entries().next; } catch (_) { return true; } }()) ||
        (new global.Map([['a', 1]]).size !== 1))
      global.Map = Map;


    function MapDataIndexOf(mapData, key) {
      var i;
      if (key === key) return mapData.keys.indexOf(key);
      // Slow case for NaN
      for (i = 0; i < mapData.keys.length; i += 1)
        if (SameValueZero(mapData.keys[i], key)) return i;
      return -1;
    }

    // 23.1.1.2 new Map ( ... argumentsList )
    // 23.1.2 Properties of the Map Constructor
    // 23.1.2.1 Map.prototype
    var $MapPrototype$ = {};
    Map.prototype = $MapPrototype$;

    // 23.1.2.2 get Map [ @@species ]

    // 23.1.3 Properties of the Map Prototype Object
    // 23.1.3.1 Map.prototype.clear ()
    define(
      Map.prototype, 'clear',
      function clear() {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        if (!('[[MapData]]' in m)) throw TypeError();
        if (m['[[MapData]]'] === undefined) throw TypeError();
        var entries = m['[[MapData]]'];
        entries.keys.length = 0;
        entries.values.length = 0;
        return undefined;
      });

    // 23.1.3.2 Map.prototype.constructor

    // 23.1.3.3 Map.prototype.delete ( key )
    define(
      Map.prototype, 'delete',
      function delete_(key) {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        if (!('[[MapData]]' in m)) throw TypeError();
        if (m['[[MapData]]'] === undefined) throw TypeError();
        var entries = m['[[MapData]]'];
        var i = MapDataIndexOf(entries, key);
        if (i < 0) return false;
        entries.keys[i] = empty;
        entries.values[i] = empty;
        return true;
      });

    // 23.1.3.4 Map.prototype.entries ( )
    define(
      Map.prototype, 'entries',
      function entries() {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        return CreateMapIterator(m, 'key+value');
      });

    // 23.1.3.5 Map.prototype.forEach ( callbackfn [ , thisArg ] )
    define(
      Map.prototype, 'forEach',
      function forEach(callbackfn /*, thisArg*/) {
        var thisArg = arguments[1];

        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        if (!('[[MapData]]' in m)) throw TypeError();
        if (m['[[MapData]]'] === undefined) throw TypeError();
        var entries = m['[[MapData]]'];

        if (!IsCallable(callbackfn)) {
          throw TypeError('First argument to forEach is not callable.');
        }
        for (var i = 0; i < entries.keys.length; ++i) {
          if (entries.keys[i] !== empty) {
            callbackfn.call(thisArg, entries.values[i], entries.keys[i], m);
          }
        }
        return undefined;
      });

    // 23.1.3.6 Map.prototype.get ( key )
    define(
      Map.prototype, 'get',
      function get(key) {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        if (!('[[MapData]]' in m)) throw TypeError();
        if (m['[[MapData]]'] === undefined) throw TypeError();
        var entries = m['[[MapData]]'];
        var i = MapDataIndexOf(entries, key);
        if (i >= 0) return entries.values[i];
        return undefined;
      });

    // 23.1.3.7 Map.prototype.has ( key )
    define(
      Map.prototype, 'has',
      function has(key) {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        if (!('[[MapData]]' in m)) throw TypeError();
        if (m['[[MapData]]'] === undefined) throw TypeError();
        var entries = m['[[MapData]]'];
        if (MapDataIndexOf(entries, key) >= 0) return true;
        return false;
      });

    // 23.1.3.8 Map.prototype.keys ( )
    define(
      Map.prototype, 'keys',
      function keys() {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        return CreateMapIterator(m, 'key');
      });

    // 23.1.3.9 Map.prototype.set ( key , value )
    define(
      Map.prototype, 'set',
      function set(key, value) {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        if (!('[[MapData]]' in m)) throw TypeError();
        if (m['[[MapData]]'] === undefined) throw TypeError();
        var entries = m['[[MapData]]'];
        var i = MapDataIndexOf(entries, key);
        if (i < 0) i = entries.keys.length;
        if (SameValue(key, -0)) key = 0;
        entries.keys[i] = key;
        entries.values[i] = value;
        return m;
      });

    // 23.1.3.10 get Map.prototype.size
    Object.defineProperty(
      Map.prototype, 'size', {
        get: function() {
          var m = strict(this);
          if (Type(m) !== 'object') throw TypeError();
          if (!('[[MapData]]' in m)) throw TypeError();
          if (m['[[MapData]]'] === undefined) throw TypeError();
          var entries = m['[[MapData]]'];
          var count = 0;
          for (var i = 0; i < entries.keys.length; ++i) {
            if (entries.keys[i] !== empty)
              count = count + 1;
          }
          return count;
        }
      });

    // 23.1.3.11 Map.prototype.values ( )
    define(
      Map.prototype, 'values',
      function values() {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        return CreateMapIterator(m, 'value');
      });

    // 23.1.3.12 Map.prototype [ @@iterator ]( )
    define(
      Map.prototype, $$iterator,
      function() {
        var m = strict(this);
        if (Type(m) !== 'object') throw TypeError();
        return CreateMapIterator(m, 'key+value');
      });

    // 23.1.3.13 Map.prototype [ @@toStringTag ]
    define(global.Map.prototype, $$toStringTag, 'Map');

    // 23.1.4 Properties of Map Instances
    // 23.1.5 Map Iterator Objects

    /** @constructor */
    function MapIterator() {}

    // 23.1.5.1 CreateMapIterator Abstract Operation
    function CreateMapIterator(map, kind) {
      if (Type(map) !== 'object') throw TypeError();
      if (!('[[MapData]]' in map)) throw TypeError();
      if (map['[[MapData]]'] === undefined) throw TypeError();
      var iterator = new MapIterator;
      set_internal(iterator, '[[Map]]', map);
      set_internal(iterator, '[[MapNextIndex]]', 0);
      set_internal(iterator, '[[MapIterationKind]]', kind);
      return iterator;
    }

    // 23.1.5.2 The %MapIteratorPrototype% Object
    var $MapIteratorPrototype$ = Object.create($IteratorPrototype$);
    MapIterator.prototype = $MapIteratorPrototype$;

    // 23.1.5.2.1 %MapIteratorPrototype%.next ( )
    define(
      $MapIteratorPrototype$, 'next',
      function next() {
        var o = strict(this);
        if (Type(o) !== 'object') throw TypeError();
        var m = o['[[Map]]'],
            index = o['[[MapNextIndex]]'],
            itemKind = o['[[MapIterationKind]]'],
            entries = m['[[MapData]]'];
        while (index < entries.keys.length) {
          var e = {key: entries.keys[index], value: entries.values[index]};
          index = index += 1;
          set_internal(o, '[[MapNextIndex]]', index);
          if (e.key !== empty) {
            if (itemKind === 'key') {
              return CreateIterResultObject(e.key, false);
            } else if (itemKind === 'value') {
              return CreateIterResultObject(e.value, false);
            } else {
              return CreateIterResultObject([e.key, e.value], false);
            }
          }
        }
        return CreateIterResultObject(undefined, true);
      });

    // 23.1.5.2.2 %MapIteratorPrototype% [ @@toStringTag ]
    define($MapIteratorPrototype$, $$toStringTag, 'Map Iterator');

    // 23.1.5.3 Properties of Map Iterator Instances
  }());

  // ---------------------------------------
  // 23.2 Set Objects
  // ---------------------------------------

  (function() {
    // 23.2.1 The Set Constructor
    // 23.2.1.1 Set ( [ iterable ] )

    /** @constructor */
    function Set(/*iterable*/) {
      var set = strict(this);
      var iterable = arguments[0];

      if (Type(set) !== 'object') throw TypeError();
      if ('[[SetData]]' in set) throw TypeError();

      if (iterable !== undefined) {
        var adder = set['add'];
        if (!IsCallable(adder)) throw TypeError();
        var iter = GetIterator(ToObject(iterable));
      }
      set_internal(set, '[[SetData]]', []);
      if (iter === undefined) return set;
      while (true) {
        var next = IteratorStep(iter);
        if (next === false)
          return set;
        var nextValue = IteratorValue(next);
        adder.call(set, nextValue);
      }

      return set;
    }

    if (!('Set' in global) || OVERRIDE_NATIVE_FOR_TESTING ||
        (function() { try { return !new global.Set().entries().next; } catch (_) { return true; } }()) ||
        (new global.Set([1]).size !== 1))
      global.Set = Set;

    function SetDataIndexOf(setData, key) {
      var i;
      if (key === key)
        return setData.indexOf(key);
      // Slow case for NaN
      for (i = 0; i < setData.length; i += 1)
        if (SameValueZero(setData[i], key)) return i;
      return -1;
    }

    // 23.2.1.2 new Set ( ...argumentsList )
    // 23.2.2 Properties of the Set Constructor

    // 23.2.2.1 Set.prototype
    var $SetPrototype$ =  {};
    Set.prototype = $SetPrototype$;

    // 23.2.2.2 get Set [ @@species ]
    // 23.2.3 Properties of the Set Prototype Object

    // 23.2.3.1 Set.prototype.add (value )
    define(
      Set.prototype, 'add',
      function add(value) {
        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        if (!('[[SetData]]' in s)) throw TypeError();
        if (s['[[SetData]]'] === undefined) throw TypeError();
        if (SameValue(value, -0)) value = 0;
        var entries = s['[[SetData]]'];
        var i = SetDataIndexOf(entries, value);
        if (i < 0) i = s['[[SetData]]'].length;
        s['[[SetData]]'][i] = value;

        return s;
      });

    // 23.2.3.2 Set.prototype.clear ()
    define(
      Set.prototype, 'clear',
      function clear() {
        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        if (!('[[SetData]]' in s)) throw TypeError();
        if (s['[[SetData]]'] === undefined) throw TypeError();
        var entries = s['[[SetData]]'];
        entries.length = 0;
        return undefined;
      });

    // 23.2.3.3 Set.prototype.constructor
    // 23.2.3.4 Set.prototype.delete ( value )
    define(
      Set.prototype, 'delete',
      function delete_(value) {
        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        if (!('[[SetData]]' in s)) throw TypeError();
        if (s['[[SetData]]'] === undefined) throw TypeError();
        var entries = s['[[SetData]]'];
        var i = SetDataIndexOf(entries, value);
        if (i < 0) return false;
        entries[i] = empty;
        return true;
      });

    // 23.2.3.5 Set.prototype.entries ( )
    define(
      Set.prototype, 'entries',
      function entries() {
        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        return CreateSetIterator(s, 'key+value');
      });

    // 23.2.3.6 Set.prototype.forEach ( callbackfn [ , thisArg ] )
    define(
      Set.prototype, 'forEach',
      function forEach(callbackfn/*, thisArg*/) {
        var thisArg = arguments[1];

        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        if (!('[[SetData]]' in s)) throw TypeError();
        if (s['[[SetData]]'] === undefined) throw TypeError();
        var entries = s['[[SetData]]'];

        if (!IsCallable(callbackfn)) {
          throw TypeError('First argument to forEach is not callable.');
        }
        for (var i = 0; i < entries.length; ++i) {
          if (entries[i] !== empty) {
            callbackfn.call(thisArg, entries[i], entries[i], s);
          }
        }
      });

    // 23.2.3.7 Set.prototype.has ( value )
    define(
      Set.prototype, 'has',
      function has(key) {
        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        if (!('[[SetData]]' in s)) throw TypeError();
        if (s['[[SetData]]'] === undefined) throw TypeError();
        var entries = s['[[SetData]]'];
        return SetDataIndexOf(entries, key) !== -1;
      });

    // 23.2.3.8 Set.prototype.keys ( )
    // See Set.prototype.values

    // 23.2.3.9 get Set.prototype.size
    Object.defineProperty(
      Set.prototype, 'size', {
        get: function() {
          var s = strict(this);
          if (Type(s) !== 'object') throw TypeError();
          if (!('[[SetData]]' in s)) throw TypeError();
          if (s['[[SetData]]'] === undefined) throw TypeError();
          var entries = s['[[SetData]]'];
          var count = 0;
          for (var i = 0; i < entries.length; ++i) {
            if (entries[i] !== empty)
              count = count + 1;
          }
          return count;
        }
      });

    // 23.2.3.10 Set.prototype.values ( )
    define(
      Set.prototype, 'values',
      function values() {
        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        return CreateSetIterator(s, 'value');
      });
    // NOTE: function name is still 'values':
    Set.prototype.keys = Set.prototype.values;

    // 23.2.3.11 Set.prototype [@@iterator ] ( )
    define(
      Set.prototype, $$iterator,
      function() {
        var s = strict(this);
        if (Type(s) !== 'object') throw TypeError();
        return CreateSetIterator(s);
      });

    // 23.2.3.12 Set.prototype [ @@toStringTag ]
    define(global.Set.prototype, $$toStringTag, 'Set');

    // 23.2.4 Properties of Set Instances
    // 23.2.5 Set Iterator Objects
    /** @constructor */
    function SetIterator() {}

    // 23.2.5.1 CreateSetIterator Abstract Operation
    function CreateSetIterator(set, kind) {
      if (Type(set) !== 'object') throw TypeError();
      if (!('[[SetData]]' in set)) throw TypeError();
      if (set['[[SetData]]'] === undefined) throw TypeError();
      var iterator = new SetIterator;
      set_internal(iterator, '[[IteratedSet]]', set);
      set_internal(iterator, '[[SetNextIndex]]', 0);
      set_internal(iterator, '[[SetIterationKind]]', kind);
      return iterator;
    }

    // 23.2.5.2 The %SetIteratorPrototype% Object
    var $SetIteratorPrototype$ = Object.create($IteratorPrototype$);
    SetIterator.prototype = $SetIteratorPrototype$;

    // 23.2.5.2.1 %SetIteratorPrototype%.next( )
    define(
      $SetIteratorPrototype$, 'next',
      function next() {
        var o = strict(this);
        if (Type(o) !== 'object') throw TypeError();
        var s = o['[[IteratedSet]]'],
            index = o['[[SetNextIndex]]'],
            itemKind = o['[[SetIterationKind]]'],
            entries = s['[[SetData]]'];
        while (index < entries.length) {
          var e = entries[index];
          index = index += 1;
          set_internal(o, '[[SetNextIndex]]', index);
          if (e !== empty) {
            if (itemKind === 'key+value')
              return CreateIterResultObject([e, e], false);
            return CreateIterResultObject(e, false);
          }
        }
        return CreateIterResultObject(undefined, true);
      });

    // 23.2.5.2.2 %SetIteratorPrototype% [ @@toStringTag ]
    define($SetIteratorPrototype$, $$toStringTag, 'Set Iterator');

    // 23.2.5.3 Properties of Set Iterator Instances

  }());

  // ---------------------------------------
  // 23.3 WeakMap Objects
  // ---------------------------------------

  (function() {
    // 23.3.1 The WeakMap Constructor
    // 23.3.1.1 WeakMap ( [ iterable ] )
    /** @constructor */
    function WeakMap(/*iterable*/) {
      var map = strict(this);
      var iterable = arguments[0];

      if (Type(map) !== 'object') throw TypeError();
      if ('[[WeakMapData]]' in map) throw TypeError();

      if (iterable !== undefined) {
        var adder = map['set'];
        if (!IsCallable(adder)) throw TypeError();
        var iter = GetIterator(ToObject(iterable));
      }
      set_internal(map, '[[WeakMapData]]', new EphemeronTable);
      if (iter === undefined) return map;
      while (true) {
        var next = IteratorStep(iter);
        if (next === false)
          return map;
        var nextValue = IteratorValue(next);
        if (Type(nextValue) !== 'object') throw TypeError();
        var k = nextValue[0];
        var v = nextValue[1];
        adder.call(map, k, v);
      }

      return map;
    }

    if (!('WeakMap' in global) || OVERRIDE_NATIVE_FOR_TESTING)
      global.WeakMap = WeakMap;

    // 23.3.2 Properties of the WeakMap Constructor
    // 23.3.2.1 WeakMap.prototype
    var $WeakMapPrototype$ = {};
    WeakMap.prototype = $WeakMapPrototype$;



   // 23.3.2.2 WeakMap[ @@create ] ( )
    // 23.3.3 Properties of the WeakMap Prototype Object

    // 23.3.3.1 WeakMap.prototype.constructor

    // 23.3.3.2 WeakMap.prototype.delete ( key )
    define(
      WeakMap.prototype, 'delete',
      function delete_(key) {
        var M = strict(this);
        if (Type(M) !== 'object') throw TypeError();
        if (M['[[WeakMapData]]'] === undefined) throw TypeError();
        if (Type(key) !== 'object') throw TypeError('Expected object');
        return M['[[WeakMapData]]'].remove(key);
      });

    // 23.3.3.3 WeakMap.prototype.get ( key )
    define(
      WeakMap.prototype, 'get',
      function get(key, defaultValue) {
        var M = strict(this);
        if (Type(M) !== 'object') throw TypeError();
        if (M['[[WeakMapData]]'] === undefined) throw TypeError();
        if (Type(key) !== 'object') throw TypeError('Expected object');
        return M['[[WeakMapData]]'].get(key, defaultValue);
      });

    // 23.3.3.4 WeakMap.prototype.has ( key )
    define(
      WeakMap.prototype, 'has',
      function has(key) {
        var M = strict(this);
        if (Type(M) !== 'object') throw TypeError();
        if (M['[[WeakMapData]]'] === undefined) throw TypeError();
        if (Type(key) !== 'object') throw TypeError('Expected object');
        return M['[[WeakMapData]]'].has(key);
      });

    // 23.3.3.5 WeakMap.prototype.set ( key , value )
    define(
      WeakMap.prototype, 'set',
      function set(key, value) {
        var M = strict(this);
        if (Type(M) !== 'object') throw TypeError();
        if (M['[[WeakMapData]]'] === undefined) throw TypeError();
        if (Type(key) !== 'object') throw TypeError('Expected object');
        M['[[WeakMapData]]'].set(key, value);
        return M;
      });

    // 23.3.3.6 WeakMap.prototype [ @@toStringTag ]
    define(global.WeakMap.prototype, $$toStringTag, 'WeakMap');

    // 23.3.4 Properties of WeakMap Instances

    // Polyfills for incomplete native implementations:
    (function() {
      var wm = new global.WeakMap();
      var orig = global.WeakMap.prototype.set;
      define(global.WeakMap.prototype, 'set', function set() {
        orig.apply(this, arguments);
        return this;
      }, wm.set({}, 0) !== wm);
    }());
  }());

  // ---------------------------------------
  // 23.4 WeakSet Objects
  // ---------------------------------------

  (function() {
    // 23.4.1 The WeakSet Constructor
    // 23.4.1.1 WeakSet ( [ iterable ] )
    /** @constructor */
    function WeakSet(/*iterable*/) {
      var set = strict(this);
      var iterable = arguments[0];

      if (Type(set) !== 'object') throw TypeError();
      if ('[[WeakSetData]]' in set) throw TypeError();

      if (iterable !== undefined) {
        var adder = set['add'];
        if (!IsCallable(adder)) throw TypeError();
        var iter = GetIterator(ToObject(iterable));
      }
      set_internal(set, '[[WeakSetData]]', new EphemeronTable);
      if (iter === undefined) return set;
      while (true) {
        var next = IteratorStep(iter);
        if (next === false)
          return set;
        var nextValue = IteratorValue(next);
        adder.call(set, nextValue);
      }

      return set;
    }

    if (!('WeakSet' in global) || OVERRIDE_NATIVE_FOR_TESTING)
      global.WeakSet = WeakSet;

    // 23.4.2 Properties of the WeakSet Constructor
    // 23.4.2.1 WeakSet.prototype
    var $WeakSetPrototype$ = {};
    WeakSet.prototype = $WeakSetPrototype$;

    // 23.4.3 Properties of the WeakSet Prototype Object
    // 23.4.3.1 WeakSet.prototype.add (value )
    define(
      WeakSet.prototype, 'add',
      function add(value) {
        var S = strict(this);
        if (Type(S) !== 'object') throw TypeError();
        if (S['[[WeakSetData]]'] === undefined) throw TypeError();
        if (Type(value) !== 'object') throw TypeError('Expected object');
        S['[[WeakSetData]]'].set(value, true);
        return S;
      });

    // 23.4.3.2 WeakSet.prototype.constructor
    // 23.4.3.3 WeakSet.prototype.delete ( value )
    define(
      WeakSet.prototype, 'delete',
      function delete_(value) {
        var S = strict(this);
        if (Type(S) !== 'object') throw TypeError();
        if (S['[[WeakSetData]]'] === undefined) throw TypeError();
        if (Type(value) !== 'object') throw TypeError('Expected object');
        return S['[[WeakSetData]]'].remove(value);
      });

    // 23.4.3.4 WeakSet.prototype.has ( value )
    define(
      WeakSet.prototype, 'has',
      function has(key) {
        var S = strict(this);
        if (Type(S) !== 'object') throw TypeError();
        if (S['[[WeakSetData]]'] === undefined) throw TypeError();
        if (Type(key) !== 'object') throw TypeError('Expected object');
        return S['[[WeakSetData]]'].has(key);
      });

    // 23.4.3.5 WeakSet.prototype [ @@toStringTag ]
    define(global.WeakSet.prototype, $$toStringTag, 'WeakSet');

    // 23.4.4 Properties of WeakSet Instances

    // Polyfills for incomplete native implementations:
    (function() {
      var ws = new global.WeakSet();
      var orig = global.WeakSet.prototype.add;
      define(global.WeakSet.prototype, 'add', function add() {
        orig.apply(this, arguments);
        return this;
      }, ws.add({}) !== ws);
    }());
  }());

  // ---------------------------------------
  // 24 Structured Data
  // ---------------------------------------

  // ---------------------------------------
  // 24.1 ArrayBuffer Objects
  // ---------------------------------------

  // See typedarray.js for TypedArray polyfill

  (function() {
    if (!('ArrayBuffer' in global))
      return;

    // 24.1.1 Abstract Operations For ArrayBuffer Objects
    // 24.1.1.1 AllocateArrayBuffer( constructor, byteLength )
    // 24.1.1.2 IsDetachedBuffer( arrayBuffer )
    // 24.1.1.3 DetachArrayBuffer( arrayBuffer )
    // 24.1.1.4 CloneArrayBuffer( srcBuffer, srcByteOffset [, cloneConstructor] )
    // 24.1.1.5 GetValueFromBuffer ( arrayBuffer, byteIndex, type, isLittleEndian )
    // 24.1.1.6 SetValueInBuffer ( arrayBuffer, byteIndex, type, value, isLittleEndian )
    // 24.1.2 The ArrayBuffer Constructor
    // 24.1.2.1 ArrayBuffer( length )
    // 24.1.3 Properties of the ArrayBuffer Constructor

    // 24.1.3.1 ArrayBuffer.isView ( arg )
    define(
      ArrayBuffer, 'isView',
      function isView(arg) {
        if (Type(arg) !== 'object') return false;
        if ('buffer' in arg && arg.buffer instanceof ArrayBuffer) return true;
        return false;
      });

    // 24.1.3.2 ArrayBuffer.prototype
    // 24.1.3.3 get ArrayBuffer [ @@species ]
    // 24.1.4 Properties of the ArrayBuffer Prototype Object
    // 24.1.4.1 get ArrayBuffer.prototype.byteLength
    // 24.1.4.2 ArrayBuffer.prototype.constructor
    // 24.1.4.3 ArrayBuffer.prototype.slice ( start , end)

    // 24.1.4.4 ArrayBuffer.prototype [ @@toStringTag ]
    define(ArrayBuffer.prototype, $$toStringTag, 'ArrayBuffer');

    // 24.1.5 Properties of the ArrayBuffer Instances
  }());

  // ---------------------------------------
  // 24.2 DataView Objects
  // ---------------------------------------

  // See typedarray.js for TypedArray polyfill

  (function() {
    if (!('DataView' in global))
      return;

    // 24.2.1 Abstract Operations For DataView Objects
    // 24.2.1.1 GetViewValue(view, requestIndex, isLittleEndian, type)
    // 24.2.1.2 SetViewValue(view, requestIndex, isLittleEndian, type, value)
    // 24.2.2 The DataView Constructor
    // 24.2.2.1 DataView (buffer [ , byteOffset [ , byteLength ] ] )
    // 24.2.3 Properties of the DataView Constructor
    // 24.2.3.1 DataView.prototype
    // 24.2.4 Properties of the DataView Prototype Object
    // 24.2.4.1 get DataView.prototype.buffer
    // 24.2.4.2 get DataView.prototype.byteLength
    // 24.2.4.3 get DataView.prototype.byteOffset
    // 24.2.4.4 DataView.prototype.constructor
    // 24.2.4.5 DataView.prototype.getFloat32 ( byteOffset [ , littleEndian ] )
    // 24.2.4.6 DataView.prototype.getFloat64 ( byteOffset [ , littleEndian ] )
    // 24.2.4.7 DataView.prototype.getInt8 ( byteOffset )
    // 24.2.4.8 DataView.prototype.getInt16 ( byteOffset [ , littleEndian ] )
    // 24.2.4.9 DataView.prototype.getInt32 ( byteOffset [ , littleEndian ] )
    // 24.2.4.10 DataView.prototype.getUint8 ( byteOffset )
    // 24.2.4.11 DataView.prototype.getUint16 ( byteOffset [ , littleEndian ] )
    // 24.2.4.12 DataView.prototype.getUint32 ( byteOffset [ , littleEndian ] )
    // 24.2.4.13 DataView.prototype.setFloat32 ( byteOffset, value [ , littleEndian ] )
    // 24.2.4.14 DataView.prototype.setFloat64 ( byteOffset, value [ , littleEndian ] )
    // 24.2.4.15 DataView.prototype.setInt8 ( byteOffset, value )
    // 24.2.4.16 DataView.prototype.setInt16 ( byteOffset, value [ , littleEndian ] )
    // 24.2.4.17 DataView.prototype.setInt32 ( byteOffset, value [ , littleEndian ] )
    // 24.2.4.18 DataView.prototype.setUint8 ( byteOffset, value )
    // 24.2.4.19 DataView.prototype.setUint16 ( byteOffset, value [ , littleEndian ] )
    // 24.2.4.20 DataView.prototype.setUint32 ( byteOffset, value [ , littleEndian ] )

    // 24.2.4.21 DataView.prototype[ @@toStringTag ]
    define(DataView.prototype, $$toStringTag, 'DataView');

    // 24.2.5 Properties of DataView Instances
  }());

  // ---------------------------------------
  // 24.3 The JSON Object
  // ---------------------------------------

  // 24.3.1 JSON.parse ( text [ , reviver ] )
  // 24.3.2 JSON.stringify ( value [ , replacer [ , space ] ] )
  // 24.3.3 JSON [ @@toStringTag ]
  define(JSON, $$toStringTag, 'JSON');

  // ---------------------------------------
  // 25.1 Iteration
  // ---------------------------------------

  // 25.1.1 Common Iteration Interfaces
  // 25.1.1.1 The Iterable Interface
  // 25.1.1.2 The Iterator Interface
  // 25.1.1.3 The IteratorResult Interface

  // 25.1.2 The %IteratorPrototype% Object
  // Defined earlier, so other prototypes can reference it.
  // 25.1.2.1 %IteratorPrototype% [ @@iterator ] ( )
  define($IteratorPrototype$, $$iterator, function() {
    return this;
  });


  // ---------------------------------------
  // 25.4 Promise Objects
  // ---------------------------------------

  (function() {
    // 25.4 Promise Objects

    // 25.4.1 Promise Abstract Operations

    // 25.4.1.1 PromiseCapability Records
    // 25.4.1.1.1 IfAbruptRejectPromise ( value, capability )

    function IfAbruptRejectPromise(value, capability) {
      var rejectResult = capability['[[Reject]]'].call(undefined, value);
      return capability['[[Promise]]'];
    }

    // 25.4.1.2 PromiseReaction Records

    // 25.4.1.3 CreateResolvingFunctions ( promise )

    function CreateResolvingFunctions(promise) {
      var alreadyResolved = {'[[value]]': false};
      var resolve = PromiseResolveFunction();
      set_internal(resolve, '[[Promise]]',  promise);
      set_internal(resolve, '[[AlreadyResolved]]', alreadyResolved);
      var reject = PromiseRejectFunction();
      set_internal(reject, '[[Promise]]', promise);
      set_internal(reject, '[[AlreadyResolved]]', alreadyResolved);
      return { '[[Resolve]]': resolve, '[[Reject]]': reject};
    }

    // 25.4.1.3.1 Promise Reject Functions

    function PromiseRejectFunction() {
      var F = function(reason) {
        console.assert(Type(F['[[Promise]]']) === 'object');
        var promise = F['[[Promise]]'];
        var alreadyResolved = F['[[AlreadyResolved]]'];
        if (alreadyResolved['[[value]]']) return undefined;
        set_internal(alreadyResolved, '[[value]]', true);
        return RejectPromise(promise, reason);
      };
      return F;
    }

    // 25.4.1.3.2 Promise Resolve Functions

    function PromiseResolveFunction() {
      var F = function(resolution) {
        console.assert(Type(F['[[Promise]]']) === 'object');
        var promise = F['[[Promise]]'];
        var alreadyResolved = F['[[AlreadyResolved]]'];
        if (alreadyResolved['[[value]]']) return undefined;
        set_internal(alreadyResolved, '[[value]]', true);

        if (SameValue(resolution, promise))  {
          var selfResolutionError = TypeError();
          return RejectPromise(promise, selfResolutionError);
        }
        if (Type(resolution) !== 'object')
          return FulfillPromise(promise, resolution);
        try {
          var then = resolution['then'];
        } catch(then) {
          return RejectPromise(promise, then);
        }
        if (!IsCallable(then))
          return FulfillPromise(promise, resolution);
        EnqueueJob('PromiseJobs', PromiseResolveThenableJob, [promise, resolution, then]);
        return undefined;
      };
      return F;
    }

    // 25.4.1.4 FulfillPromise ( promise, value )

    function FulfillPromise(promise, value) {
      console.assert(promise['[[PromiseState]]'] === 'pending');
      var reactions = promise['[[PromiseFulfillReactions]]'];
      set_internal(promise, '[[PromiseResult]]', value);
      set_internal(promise, '[[PromiseFulfillReactions]]', undefined);
      set_internal(promise, '[[PromiseRejectReactions]]', undefined);
      set_internal(promise, '[[PromiseState]]', 'fulfilled');
      return TriggerPromiseReactions(reactions, value);
    }

    // 25.4.1.5 NewPromiseCapability ( C )

    function NewPromiseCapability(c) {
      // To keep Promise hermetic, this doesn't look much like the spec.
      return CreatePromiseCapabilityRecord(undefined, c);
    }

    // 25.4.1.5.1 CreatePromiseCapabilityRecord ( promise, constructor )

    function CreatePromiseCapabilityRecord(promise, constructor) {
      // To keep Promise hermetic, this doesn't look much like the spec.
      console.assert(IsConstructor(constructor));
      var promiseCapability = {};
      set_internal(promiseCapability, '[[Promise]]', promise);
      set_internal(promiseCapability, '[[Resolve]]', undefined);
      set_internal(promiseCapability, '[[Reject]]', undefined);
      var executor = GetCapabilitiesExecutor();
      set_internal(executor, '[[Capability]]', promiseCapability);

      // NOTE: Differs from spec; object is constructed here
      var constructorResult = promise = new constructor(executor);
      set_internal(promiseCapability, '[[Promise]]', promise);

      if (!IsCallable(promiseCapability['[[Resolve]]'])) throw TypeError();
      if (!IsCallable(promiseCapability['[[Reject]]'])) throw TypeError();
      if (Type(constructorResult) === 'object' && !SameValue(promise, constructorResult)) throw TypeError();
      return promiseCapability;
    }

    // 25.4.1.5.2 GetCapabilitiesExecutor Functions

    function GetCapabilitiesExecutor() {
      var F = function(resolve, reject) {
        console.assert(F['[[Capability]]']);
        var promiseCapability = F['[[Capability]]'];
        if (promiseCapability['[[Resolve]]'] !== undefined) throw TypeError();
        if (promiseCapability['[[Reject]]'] !== undefined) throw TypeError();
        set_internal(promiseCapability, '[[Resolve]]', resolve);
        set_internal(promiseCapability, '[[Reject]]', reject);
        return undefined;
      };
      return F;
    }

    // 25.4.1.6 IsPromise ( x )

    function IsPromise(x) {
      if (Type(x) !== 'object') return false;
      if (!('[[PromiseState]]' in x)) return false;
      if (x['[[PromiseState]]'] === undefined) return false;
      return true;
    }

    // 25.4.1.7 RejectPromise ( promise, reason )

    function RejectPromise(promise, reason) {
      console.assert(promise['[[PromiseState]]'] === 'pending');
      var reactions = promise['[[PromiseRejectReactions]]'];
      set_internal(promise, '[[PromiseResult]]', reason);
      set_internal(promise, '[[PromiseFulfillReactions]]', undefined);
      set_internal(promise, '[[PromiseRejectReactions]]', undefined);
      set_internal(promise, '[[PromiseState]]', 'rejected');
      return TriggerPromiseReactions(reactions, reason);
    }

    // 25.4.1.8 TriggerPromiseReactions ( reactions, argument )

    function TriggerPromiseReactions(reactions, argument) {
      for (var i = 0, len = reactions.length; i < len; ++i)
        EnqueueJob('PromiseJobs', PromiseReactionJob, [reactions[i], argument]);
      return undefined;
    }

    // 25.4.2 Promise Jobs

    // 25.4.2.1 PromiseReactionJob ( reaction, argument )

    function PromiseReactionJob(reaction, argument) {
      var promiseCapability = reaction['[[Capabilities]]'];
      var handler = reaction['[[Handler]]'];
      var handlerResult, status;
      try {
        if (handler === 'Identity') handlerResult = argument;
        else if (handler === 'Thrower') throw argument;
        else handlerResult = handler.call(undefined, argument);
      } catch (handlerResult) {
        status = promiseCapability['[[Reject]]'].call(undefined, handlerResult);
        NextJob(status); return;
      }
      status = promiseCapability['[[Resolve]]'].call(undefined, handlerResult);
      NextJob(status);
    }

    // 25.4.2.2 PromiseResolveThenableJob ( promiseToResolve, thenable, then)

    function PromiseResolveThenableJob(promiseToResolve, thenable, then) {
      // SPEC BUG: promise vs. promiseToResolve
      var resolvingFunctions = CreateResolvingFunctions(promiseToResolve);
      try {
        var thenCallResult = then.call(thenable, resolvingFunctions['[[Resolve]]'],
                                       resolvingFunctions['[[Reject]]']);
      } catch (thenCallResult) {
        var status = resolvingFunctions['[[Reject]]'].call(undefined, thenCallResult);
        NextJob(status); return;
      }
      NextJob(thenCallResult);
    }

    // 25.4.3 The Promise Constructor

    // 25.4.3.1 Promise ( executor )

    function Promise(executor) {
      var config = { configurable: false, enumerable: false, writable: true, value: undefined };
      Object.defineProperty(this, '[[PromiseState]]', config);
      Object.defineProperty(this, '[[PromiseConstructor]]', config);
      Object.defineProperty(this, '[[PromiseResult]]', config);
      Object.defineProperty(this, '[[PromiseFulfillReactions]]', config);
      Object.defineProperty(this, '[[PromiseRejectReactions]]', config);

      var promise = this;
      if (Type(promise) !== 'object') throw new TypeError();
      if (!('[[PromiseState]]' in promise)) throw TypeError();
      if (promise['[[PromiseState]]'] !== undefined) throw TypeError();
      if (!IsCallable(executor)) throw TypeError();

      set_internal(promise, '[[PromiseConstructor]]', Promise);

      return InitializePromise(promise, executor);
    }

    // 25.4.3.1.1 InitializePromise ( promise, executor )

    function InitializePromise(promise, executor) {
      console.assert('[[PromiseState]]' in promise);
      console.assert(IsCallable(executor));
      set_internal(promise, '[[PromiseState]]', 'pending');
      set_internal(promise, '[[PromiseFulfillReactions]]', []);
      set_internal(promise, '[[PromiseRejectReactions]]', []);
      var resolvingFunctions = CreateResolvingFunctions(promise);
      try {
        var completion = executor.call(undefined, resolvingFunctions['[[Resolve]]'],
                                       resolvingFunctions['[[Reject]]']);
      } catch (completion) {
        var status = resolvingFunctions['[[Reject]]'].call(undefined, completion);
      }
      return promise;
    }

    // 25.4.4 Properties of the Promise Constructor
    // 25.4.4.1 Promise.all ( iterable )

    define(Promise, 'all', function all(iterable) {
      var c = strict(this);
      var promiseCapability = NewPromiseCapability(c);
      try {
        var iterator = GetIterator(iterable);
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value);
        return promiseCapability['[[Promise]]'];
      }
      var values = [];
      var remainingElementsCount = { value: 1 };
      var index = 0;
      while (true) {
        try {
          var next = IteratorStep(iterator);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
        if (!next) {
          remainingElementsCount.value -= 1;
          if (remainingElementsCount.value === 0) {
            var resolveResult = promiseCapability['[[Resolve]]'].apply(undefined, values);


          }
          return promiseCapability['[[Promise]]'];
        }
        try {
          var nextValue = IteratorValue(next);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
        try {
          var nextPromise = c.resolve(nextValue);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
        var resolveElement = PromiseAllResolveElementFunction();
        set_internal(resolveElement, '[[AlreadyCalled]]', { value: false });
        set_internal(resolveElement, '[[Index]]', index);
        set_internal(resolveElement, '[[Values]]', values);
        set_internal(resolveElement, '[[Capabilities]]', promiseCapability);
        set_internal(resolveElement, '[[RemainingElements]]', remainingElementsCount);
        remainingElementsCount.value += 1;
        try {
          var result = nextPromise.then(resolveElement, promiseCapability['[[Reject]]']);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
        index += 1;
      }
    });

    // 25.4.4.1.1 Promise.all Resolve Element Functions

    function PromiseAllResolveElementFunction() {
      var F = function(x) {
        var alreadyCalled = F['[[AlreadyCalled]]'];
        if (alreadyCalled.value) return undefined;
        alreadyCalled.value = true;
        var index = F['[[Index]]'];
        var values = F['[[Values]]'];
        var promiseCapability = F['[[Capabilities]]'];
        var remainingElementsCount = F['[[RemainingElements]]'];
        try {
          values[index] = x;
        } catch (result) {
          promiseCapability['[[Reject]]'].call(undefined, result);
          return promiseCapability['[[Promise]]'];
        }
        remainingElementsCount.value -= 1;
        if (remainingElementsCount.value === 0)
          return promiseCapability['[[Resolve]]'].call(undefined, values);
        return undefined;
      };
      return F;
    }

    // 25.4.4.2 Promise.prototype

    Promise.prototype = {};

    // 25.4.4.3 Promise.race ( iterable )

    define(Promise, 'race', function race(iterable) {
      var c = strict(this);
      var promiseCapability = NewPromiseCapability(c);
      try {
        var iterator = GetIterator(iterable);
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value);
        return promiseCapability['[[Promise]]'];
      }
      while (true) {
        try {
          var next = IteratorStep(iterator);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
        if (!next) return promiseCapability['[[Promise]]'];
        try {
          var nextValue = IteratorValue(next);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
        try {
          var nextPromise = c.resolve(nextValue);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
        try {
          nextPromise.then(promiseCapability['[[Resolve]]'], promiseCapability['[[Reject]]']);
        } catch (value) {
          promiseCapability['[[Reject]]'].call(undefined, value);
          return promiseCapability['[[Promise]]'];
        }
      }
    });

    // 25.4.4.4 Promise.reject ( r )

    define(Promise, 'reject', function reject(r) {
      var c = strict(this);
      var promiseCapability = NewPromiseCapability(c);
      var rejectResult = promiseCapability['[[Reject]]'].call(undefined, r);
      return promiseCapability['[[Promise]]'];
    });

    // 25.4.4.5 Promise.resolve ( x )

    define(Promise, 'resolve', function resolve(x) {
      var c = strict(this);
      if (IsPromise(x)) {
        var constructor = x['[[PromiseConstructor]]'];
        if (SameValue(constructor, c)) return x;
      }
      var promiseCapability = NewPromiseCapability(c);
      var resolveResult = promiseCapability['[[Resolve]]'].call(undefined, x);
      return promiseCapability['[[Promise]]'];
    });

    // 25.4.4.6 Promise [ @@create ] ( )
    // 25.4.4.6.1 AllocatePromise ( constructor )
    // 25.4.5 Properties of the Promise Prototype Object
    // 25.4.5.1 Promise.prototype.catch ( onRejected )

    define(Promise.prototype, 'catch', function catch_(onRejected) {
      var promise = this;
      return promise.then(undefined, onRejected);
    });

    // 25.4.5.2 Promise.prototype.constructor

    Promise.prototype.constructor = Promise;

    // 25.4.5.3 Promise.prototype.then ( onFulfilled , onRejected )

    define(Promise.prototype, 'then', function then(onFulfilled, onRejected) {
      var promise = this;
      if (!IsPromise(promise)) throw TypeError();
      if (!IsCallable(onFulfilled)) onFulfilled = 'Identity';
      if (!IsCallable(onRejected)) onRejected = 'Thrower';
      var c = promise.constructor;
      var promiseCapability = NewPromiseCapability(c);
      var fulfillReaction = { '[[Capabilities]]': promiseCapability,
                              '[[Handler]]': onFulfilled };
      var rejectReaction = { '[[Capabilities]]': promiseCapability,
                             '[[Handler]]': onRejected };
      if (promise['[[PromiseState]]'] === 'pending') {
        promise['[[PromiseFulfillReactions]]'].push(fulfillReaction);
        promise['[[PromiseRejectReactions]]'].push(rejectReaction);
      } else if (promise['[[PromiseState]]'] === 'fulfilled') {
        var value = promise['[[PromiseResult]]'];
        EnqueueJob('PromiseJobs', PromiseReactionJob, [fulfillReaction, value]);
      } else if (promise['[[PromiseState]]'] === 'rejected') {
        var reason = promise['[[PromiseResult]]'];
        EnqueueJob('PromiseJobs', PromiseReactionJob, [rejectReaction, reason]);
      }
      return promiseCapability['[[Promise]]'];
    });

    // 25.4.6 Properties of Promise Instances

    if (!('Promise' in global) || OVERRIDE_NATIVE_FOR_TESTING)
      global.Promise = Promise;

    // Patch early Promise.cast vs. Promise.resolve implementations
    if ('cast' in global.Promise) global.Promise.resolve = global.Promise.cast;
  }());

  // 25.4.5.1 Promise.prototype [ @@toStringTag ]
  define(Promise.prototype, $$toStringTag, 'Promise');

  // ---------------------------------------
  // 26 Reflection
  // ---------------------------------------

  (function() {
    // 26.1 The Reflect Object
    if (!('Reflect' in global) || OVERRIDE_NATIVE_FOR_TESTING)
      global.Reflect = {};

    // 26.1.1 Reflect.apply ( target, thisArgument, argumentsList )
    define(
      Reflect, 'apply',
      function apply(target, thisArgument, argumentsList) {
        if (!IsCallable(target)) throw TypeError();
        return Function.prototype.apply.call(target, thisArgument, argumentsList);
      });

    // 26.1.2 Reflect.construct ( target, argumentsList [, newTarget] )
    define(
      Reflect, 'construct',
      function construct(target, argumentsList) {
        return __cons(target, argumentsList);
      });

    // 26.1.3 Reflect.defineProperty ( target, propertyKey, attributes )
    define(
      Reflect, 'defineProperty',
      function defineProperty(target, propertyKey, attributes) {
        try {
          Object.defineProperty(target, propertyKey, attributes);
          return true;
        } catch (_) {
          return false;
        }
      });

    // 26.1.4 Reflect.deleteProperty ( target, propertyKey )
    define(
      Reflect, 'deleteProperty',
      function deleteProperty(target,name) {
        try {
          delete target[name];
          return !HasOwnProperty(target, name);
        } catch (_) {
          return false;
        }
      });

    // 26.1.5 Reflect.enumerate ( target )
    define(
      Reflect, 'enumerate',
      function enumerate(target) {
        target = ToObject(target);
        var iterator = Enumerate(target);
        return iterator;
      });

    // 26.1.6 Reflect.get ( target, propertyKey [ , receiver ])
    define(
      Reflect, 'get',
      function get(target, name, receiver) {
        target = ToObject(target);
        name = String(name);
        receiver = (receiver === undefined) ? target : ToObject(receiver);
        var desc = getPropertyDescriptor(target, name);
        if (desc && 'get' in desc)
          return Function.prototype.call.call(desc['get'], receiver);
        return target[name];
      });

    // 26.1.7 Reflect.getOwnPropertyDescriptor ( target, propertyKey )
    define(
      Reflect, 'getOwnPropertyDescriptor',
      Object.getOwnPropertyDescriptor);

    // 26.1.8 Reflect.getPrototypeOf ( target )
    define(
      Reflect, 'getPrototypeOf',
      Object.getPrototypeOf);

    // 26.1.9 Reflect.has ( target, propertyKey )
    define(
      Reflect, 'has',
      function has(target,name) {
        return String(name) in ToObject(target);
      });

    // 26.1.10 Reflect.isExtensible (target)
    define(
      Reflect, 'isExtensible',
      Object.isExtensible);

    // 26.1.11 Reflect.ownKeys ( target )
    define(
      Reflect, 'ownKeys',
      function ownKeys(target) {
        var obj = ToObject(target);
        return Object.getOwnPropertyNames(obj);
      });

    // 26.1.12 Reflect.preventExtensions ( target )
    define(
      Reflect, 'preventExtensions',
      function preventExtensions(target) {
        try { Object.preventExtensions(target); return true; } catch (_) { return false; }
      });

    // 26.1.13 Reflect.set ( target, propertyKey, V [ , receiver ] )
    define(
      Reflect, 'set',
      function set(target, name, value, receiver) {
        target = ToObject(target);
        name = String(name);
        receiver = (receiver === undefined) ? target : ToObject(receiver);
        var desc = getPropertyDescriptor(target, name);
        try {
          if (desc && 'set' in desc)
            Function.prototype.call.call(desc['set'], receiver, value);
          else
            target[name] = value;
          return true;
        } catch (_) {
          return false;
        }
      });

    // 26.1.14 Reflect.setPrototypeOf ( target, proto )
    define(
      Reflect, 'setPrototypeOf',
      function setPrototypeOf(target, proto) {
        try {
          target.__proto__ = proto;
          return Reflect.getPrototypeOf(target) === proto;
        } catch(_) {
          return false;
        }
      });

  }());

  // ---------------------------------------
  // 26.2 Proxy Objects
  // ---------------------------------------

  // Not polyfillable.

}(self));

// This helper is defined outside the main scope so that the use of
// 'eval' does not taint the scope for minifiers.
function __cons(t, a) {
  return eval('new t(' + a.map(function(_, i) { return 'a[' + i + ']'; }).join(',') + ')');
}
//----------------------------------------------------------------------
//
// ECMAScript 2016 Polyfills
//
//----------------------------------------------------------------------

(function (global) {
  "use strict";
  var undefined = (void 0); // Paranoia

  // Helpers

  function isSymbol(s) {
    return (typeof s === 'symbol') || ('Symbol' in global && s instanceof global.Symbol);
  }

  function define(o, p, v, override) {
    if (p in o && !override)
      return;

    if (typeof v === 'function') {
      // Sanity check that functions are appropriately named (where possible)
      console.assert(isSymbol(p) || !('name' in v) || v.name === p || v.name === p + '_', 'Expected function name "' + p.toString() + '", was "' + v.name + '"');
      Object.defineProperty(o, p, {
        value: v,
        configurable: true,
        enumerable: false,
        writable: true
      });
    } else {
      Object.defineProperty(o, p, {
        value: v,
        configurable: false,
        enumerable: false,
        writable: false
      });
    }
  }


  // Snapshot intrinsic functions
  var $isNaN = global.isNaN;

  var abs = Math.abs,
      floor = Math.floor,
      max = Math.max,
      min = Math.min;

  //----------------------------------------
  // 7 Abstract Operations
  //----------------------------------------

  // 7.1.4
  function ToInteger(n) {
    n = Number(n);
    if ($isNaN(n)) return 0;
    if (n === 0 || n === Infinity || n === -Infinity) return n;
    return ((n < 0) ? -1 : 1) * floor(abs(n));
  }

  // 7.1.13 ToObject
  function ToObject(v) {
    if (v === null || v === undefined) throw TypeError();
    return Object(v);
  }

  // 7.1.15 ToLength ( argument )
  function ToLength(v) {
    var len = ToInteger(v);
    if (len <= 0) {
      return 0;
    }
    return min(len, 0x20000000000000 - 1); // 2^53-1
  }

  //----------------------------------------
  // 7.2 Testing and Comparison Operations
  //----------------------------------------

  // 7.2.10 SameValueZero(x, y)
  function SameValueZero(x, y) {
    if (typeof x !== typeof y) return false;
    switch (typeof x) {
    case 'undefined':
      return true;
    case 'number':
      if (x !== x && y !== y) return true;
      return x === y;
    case 'boolean':
    case 'string':
    case 'object':
    default:
      return x === y;
    }
  }

  //----------------------------------------------------------------------
  //
  // ECMAScript 2016
  //
  //----------------------------------------------------------------------

  // https://github.com/tc39/Array.prototype.includes/
  define(
    Array.prototype, 'includes',
    function includes(target) {
      var fromIndex = arguments[1];

      var o = ToObject(this);
      var len = ToLength(o["length"]);
      if (len === 0) return false;
      var n = ToInteger(fromIndex);
      if (n >= 0) {
        var k = n;
      } else {
        k = len + n;
        if (k < 0) k = 0;
      }
      while (k < len) {
        var elementK = o[k];
        if (SameValueZero(o[k], target))
          return true;
        k += 1;
      }
      return false;
    });

}(this));
(function(global) {
  'use strict';

  if (!('window' in global && 'document' in global))
    return;

  //----------------------------------------------------------------------
  //
  // HTML
  // https://html.spec.whatwg.org
  //
  //----------------------------------------------------------------------

  // document.head attribute
  // Needed for: IE8-
  if (!('head' in document))
    document.head = document.getElementsByTagName('head')[0];

  // Ensure correct parsing of newish elements ("shiv")
  // Needed for: IE8-
  [
    'abbr', 'article', 'aside', 'audio', 'bdi', 'canvas', 'data', 'datalist',
    'details', 'dialog', 'figcaption', 'figure', 'footer', 'header', 'hgroup',
    'main', 'mark', 'meter', 'nav', 'output', 'picture', 'progress', 'section',
    'summary', 'template', 'time', 'video'].forEach(function(tag) {
     document.createElement(tag);
   });

  // HTMLElement.dataset
  // Needed for: IE10-
  if (!('dataset' in document.createElement('span')) &&
      'Element' in global && Element.prototype && Object.defineProperty) {
    Object.defineProperty(Element.prototype, 'dataset', { get: function() {
      var result = Object.create(null);
      for (var i = 0; i < this.attributes.length; ++i) {
        var attr = this.attributes[i];
        if (attr.specified && attr.name.substring(0, 5) === 'data-') {
          (function(element, name) {
            var prop = name.replace(/-([a-z])/g, function(m, p) {
              return p.toUpperCase();
            });
            result[prop] = element.getAttribute('data-' + name); // Read-only, for IE8-
            Object.defineProperty(result, prop, {
              get: function() {
                return element.getAttribute('data-' + name);
              },
              set: function(value) {
                element.setAttribute('data-' + name, value);
              }});
          }(this, attr.name.substring(5)));
        }
      }
      return result;
    }});
  }

  // Base64 utility methods
  // Needed for: IE9-
  (function() {
    if ('atob' in global && 'btoa' in global)
      return;

    var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function atob(input) {
      input = String(input);
      var position = 0,
          output = [],
          buffer = 0, bits = 0, n;

      input = input.replace(/\s/g, '');
      if ((input.length % 4) === 0) { input = input.replace(/=+$/, ''); }
      if ((input.length % 4) === 1) { throw Error("InvalidCharacterError"); }
      if (/[^+/0-9A-Za-z]/.test(input)) { throw Error("InvalidCharacterError"); }

      while (position < input.length) {
        n = B64_ALPHABET.indexOf(input.charAt(position));
        buffer = (buffer << 6) | n;
        bits += 6;

        if (bits === 24) {
          output.push(String.fromCharCode((buffer >> 16) & 0xFF));
          output.push(String.fromCharCode((buffer >>  8) & 0xFF));
          output.push(String.fromCharCode(buffer & 0xFF));
          bits = 0;
          buffer = 0;
        }
        position += 1;
      }

      if (bits === 12) {
        buffer = buffer >> 4;
        output.push(String.fromCharCode(buffer & 0xFF));
      } else if (bits === 18) {
        buffer = buffer >> 2;
        output.push(String.fromCharCode((buffer >> 8) & 0xFF));
        output.push(String.fromCharCode(buffer & 0xFF));
      }

      return output.join('');
    };

    function btoa(input) {
      input = String(input);
      var position = 0,
          out = [],
          o1, o2, o3,
          e1, e2, e3, e4;

      if (/[^\x00-\xFF]/.test(input)) { throw Error("InvalidCharacterError"); }

      while (position < input.length) {
        o1 = input.charCodeAt(position++);
        o2 = input.charCodeAt(position++);
        o3 = input.charCodeAt(position++);

        // 111111 112222 222233 333333
        e1 = o1 >> 2;
        e2 = ((o1 & 0x3) << 4) | (o2 >> 4);
        e3 = ((o2 & 0xf) << 2) | (o3 >> 6);
        e4 = o3 & 0x3f;

        if (position === input.length + 2) {
          e3 = 64;
          e4 = 64;
        }
        else if (position === input.length + 1) {
          e4 = 64;
        }

        out.push(B64_ALPHABET.charAt(e1),
                 B64_ALPHABET.charAt(e2),
                 B64_ALPHABET.charAt(e3),
                 B64_ALPHABET.charAt(e4));
      }

      return out.join('');
    };

    global.atob = atob;
    global.btoa = btoa;
  }());

  // requestAnimationFrame - needed for IE9-
  (function() {
    if ('requestAnimationFrame' in global)
      return;

    var TARGET_FPS = 60,
        requests = Object.create(null),
        raf_handle = 0,
        timeout_handle = -1;

    function isVisible(element) {
      return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    function onFrameTimer() {
      var cur_requests = requests;
      requests = Object.create(null);
      timeout_handle = -1;
      Object.keys(cur_requests).forEach(function(id) {
        var request = cur_requests[id];
        if (!request.element || isVisible(request.element))
          request.callback(Date.now());
      });
    }

    function requestAnimationFrame(callback, element) {
      var cb_handle = ++raf_handle;
      requests[cb_handle] = {callback: callback, element: element};
      if (timeout_handle === -1)
        timeout_handle = global.setTimeout(onFrameTimer, 1000 / TARGET_FPS);
      return cb_handle;
    }

    function cancelAnimationFrame(handle) {
      delete requests[handle];
      if (Object.keys(requests).length === 0) {
        global.clearTimeout(timeout_handle);
        timeout_handle = -1;
      }
    }

    global.requestAnimationFrame = requestAnimationFrame;
    global.cancelAnimationFrame = cancelAnimationFrame;
  }());

}(self));
(function(global) {
  'use strict';
  if (!('window' in global && 'document' in global))
    return;

  //----------------------------------------------------------------------
  //
  // DOM
  // https://dom.spec.whatwg.org/
  //
  //----------------------------------------------------------------------

  // Document.querySelectorAll method
  // http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
  // Needed for: IE7-
  if (!document.querySelectorAll) {
    document.querySelectorAll = function(selectors) {
      var style = document.createElement('style'), elements = [], element;
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];

      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      window.scrollBy(0, 0);
      style.parentNode.removeChild(style);

      while (document._qsa.length) {
        element = document._qsa.shift();
        element.style.removeAttribute('x-qsa');
        elements.push(element);
      }
      document._qsa = null;
      return elements;
    };
  }

  // Document.querySelector method
  // Needed for: IE7-
  if (!document.querySelector) {
    document.querySelector = function(selectors) {
      var elements = document.querySelectorAll(selectors);
      return (elements.length) ? elements[0] : null;
    };
  }

  // Document.getElementsByClassName method
  // Needed for: IE8-
  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(classNames) {
      classNames = String(classNames).replace(/^|\s+/g, '.');
      return document.querySelectorAll(classNames);
    };
  }

  // Node interface constants
  // Needed for: IE8-
  global.Node = global.Node || function() { throw TypeError("Illegal constructor"); };
  [
    ['ELEMENT_NODE', 1],
    ['ATTRIBUTE_NODE', 2],
    ['TEXT_NODE', 3],
    ['CDATA_SECTION_NODE', 4],
    ['ENTITY_REFERENCE_NODE', 5],
    ['ENTITY_NODE', 6],
    ['PROCESSING_INSTRUCTION_NODE', 7],
    ['COMMENT_NODE', 8],
    ['DOCUMENT_NODE', 9],
    ['DOCUMENT_TYPE_NODE', 10],
    ['DOCUMENT_FRAGMENT_NODE', 11],
    ['NOTATION_NODE', 12]
  ].forEach(function(p) { if (!(p[0] in global.Node)) global.Node[p[0]] = p[1]; });

  // DOMException constants
  // Needed for: IE8-
  global.DOMException = global.DOMException || function() { throw TypeError("Illegal constructor"); };
  [
    ['INDEX_SIZE_ERR', 1],
    ['DOMSTRING_SIZE_ERR', 2],
    ['HIERARCHY_REQUEST_ERR', 3],
    ['WRONG_DOCUMENT_ERR', 4],
    ['INVALID_CHARACTER_ERR', 5],
    ['NO_DATA_ALLOWED_ERR', 6],
    ['NO_MODIFICATION_ALLOWED_ERR', 7],
    ['NOT_FOUND_ERR', 8],
    ['NOT_SUPPORTED_ERR', 9],
    ['INUSE_ATTRIBUTE_ERR', 10],
    ['INVALID_STATE_ERR', 11],
    ['SYNTAX_ERR', 12],
    ['INVALID_MODIFICATION_ERR', 13],
    ['NAMESPACE_ERR', 14],
    ['INVALID_ACCESS_ERR', 15]
  ].forEach(function(p) { if (!(p[0] in global.DOMException)) global.DOMException[p[0]] = p[1]; });

  // Event and EventTargets interfaces
  // Needed for: IE8
  (function(){
    if (!('Element' in global) || Element.prototype.addEventListener || !Object.defineProperty)
      return;

    // interface Event

    // PhaseType (const unsigned short)
    Event.CAPTURING_PHASE = 1;
    Event.AT_TARGET       = 2;
    Event.BUBBLING_PHASE  = 3;

    Object.defineProperties(Event.prototype, {
      CAPTURING_PHASE: { get: function() { return 1; } },
      AT_TARGET:       { get: function() { return 2; } },
      BUBBLING_PHASE:   { get: function() { return 3; } },
      target: {
        get: function() {
          return this.srcElement;
        }},
      currentTarget: {
        get: function() {
          return this._currentTarget;
        }},
      eventPhase: {
        get: function() {
          return (this.srcElement === this.currentTarget) ? Event.AT_TARGET : Event.BUBBLING_PHASE;
        }},
      bubbles: {
        get: function() {
          switch (this.type) {
            // Mouse
          case 'click':
          case 'dblclick':
          case 'mousedown':
          case 'mouseup':
          case 'mouseover':
          case 'mousemove':
          case 'mouseout':
          case 'mousewheel':
            // Keyboard
          case 'keydown':
          case 'keypress':
          case 'keyup':
            // Frame/Object
          case 'resize':
          case 'scroll':
            // Form
          case 'select':
          case 'change':
          case 'submit':
          case 'reset':
            return true;
          }
          return false;
        }},
      cancelable: {
        get: function() {
          switch (this.type) {
            // Mouse
          case 'click':
          case 'dblclick':
          case 'mousedown':
          case 'mouseup':
          case 'mouseover':
          case 'mouseout':
          case 'mousewheel':
            // Keyboard
          case 'keydown':
          case 'keypress':
          case 'keyup':
            // Form
          case 'submit':
            return true;
          }
          return false;
        }},
      timeStamp: {
        get: function() {
          return this._timeStamp;
        }},
      stopPropagation: {
        value: function() {
          this.cancelBubble = true;
        }},
      preventDefault: {
        value: function() {
          this.returnValue = false;
        }},
      defaultPrevented: {
        get: function() {
          return this.returnValue === false;
        }}
    });

    // interface EventTarget

    function addEventListener(type, listener, useCapture) {
      if (typeof listener !== 'function') return;
      if (type === 'DOMContentLoaded') type = 'load';
      var target = this;
      var f = function(e) {
        e._timeStamp = Date.now();
        e._currentTarget = target;
        listener.call(this, e);
        e._currentTarget = null;
      };
      this['_' + type + listener] = f;
      this.attachEvent('on' + type, f);
    }

    function removeEventListener(type, listener, useCapture) {
      if (typeof listener !== 'function') return;
      if (type === 'DOMContentLoaded') type = 'load';
      var f = this['_' + type + listener];
      if (f) {
        this.detachEvent('on' + type, f);
        this['_' + type + listener] = null;
      }
    }

    [Window, HTMLDocument, Element].forEach(function(o) {
      o.prototype.addEventListener = addEventListener;
      o.prototype.removeEventListener = removeEventListener;
    });
  }());

  // CustomEvent
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
  // Needed for: IE
  (function () {
    if ('CustomEvent' in global && typeof global.CustomEvent === "function")
      return;
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }
    CustomEvent.prototype = global.Event.prototype;
    global.CustomEvent = CustomEvent;
  })();

  // Shim for DOM Events for IE7-
  // http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
  // Use addEvent(object, event, handler) instead of object.addEventListener(event, handler)
  window.addEvent = function(obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
      obj["e" + type + fn] = fn;
      obj[type + fn] = function() {
        var e = window.event;
        e.currentTarget = obj;
        e.preventDefault = function() { e.returnValue = false; };
        e.stopPropagation = function() { e.cancelBubble = true; };
        e.target = e.srcElement;
        e.timeStamp = Date.now();
        obj["e" + type + fn].call(this, e);
      };
      obj.attachEvent("on" + type, obj[type + fn]);
    }
  };

  window.removeEvent = function(obj, type, fn) {
    if (obj.removeEventListener) {
      obj.removeEventListener(type, fn, false);
    } else if (obj.detachEvent) {
      obj.detachEvent("on" + type, obj[type + fn]);
      obj[type + fn] = null;
      obj["e" + type + fn] = null;
    }
  };

  // DOMTokenList interface and Element.classList / Element.relList
  // Needed for: IE9-
  // Use getClassList(elem) instead of elem.classList() if IE7- support is needed
  // Use getRelList(elem) instead of elem.relList() if IE7- support is needed
  (function() {
    function DOMTokenListShim(o, p) {
      function split(s) { return s.length ? s.split(/\s+/g) : []; }

      // NOTE: This does not exactly match the spec.
      function removeTokenFromString(token, string) {
        var tokens = split(string),
            index = tokens.indexOf(token);
        if (index !== -1) {
          tokens.splice(index, 1);
        }
        return tokens.join(' ');
      }

      Object.defineProperties(
        this,
        {
          length: {
            get: function() { return split(o[p]).length; }
          },

          item: {
            value: function(idx) {
              var tokens = split(o[p]);
              return 0 <= idx && idx < tokens.length ? tokens[idx] : null;
            }
          },

          contains: {
            value: function(token) {
              token = String(token);
              if (token.length === 0) { throw SyntaxError(); }
              if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
              var tokens = split(o[p]);

              return tokens.indexOf(token) !== -1;
            }
          },

          add: {
            value: function(/*tokens...*/) {
              var tokens = Array.prototype.slice.call(arguments).map(String);
              if (tokens.some(function(token) { return token.length === 0; })) {
                throw SyntaxError();
              }
              if (tokens.some(function(token) { return (/\s/).test(token); })) {
                throw Error("InvalidCharacterError");
              }

              try {
                var underlying_string = o[p];
                var token_list = split(underlying_string);
                tokens = tokens.filter(function(token) { return token_list.indexOf(token) === -1; });
                if (tokens.length === 0) {
                  return;
                }
                if (underlying_string.length !== 0 && !(/\s$/).test(underlying_string)) {
                  underlying_string += ' ';
                }
                underlying_string += tokens.join(' ');
                o[p] = underlying_string;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          remove: {
            value: function(/*tokens...*/) {
              var tokens = Array.prototype.slice.call(arguments).map(String);
              if (tokens.some(function(token) { return token.length === 0; })) {
                throw SyntaxError();
              }
              if (tokens.some(function(token) { return (/\s/).test(token); })) {
                throw Error("InvalidCharacterError");
              }

              try {
                var underlying_string = o[p];
                tokens.forEach(function(token) {
                  underlying_string = removeTokenFromString(token, underlying_string);
                });
                o[p] = underlying_string;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          toggle: {
            value: function(token/*, force*/) {
              var force = arguments[1];
              try {
                token = String(token);
                if (token.length === 0) { throw SyntaxError(); }
                if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
                var tokens = split(o[p]),
                    index = tokens.indexOf(token);

                if (index !== -1 && (!force || force === (void 0))) {
                  o[p] = removeTokenFromString(token, o[p]);
                  return false;
                }
                if (index !== -1 && force) {
                  return true;
                }
                var underlying_string = o[p];
                if (underlying_string.length !== 0 && !/\s$/.test(underlying_string)) {
                  underlying_string += ' ';
                }
                underlying_string += token;
                o[p] = underlying_string;
                return true;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          toString: {
            value: function() {
              return o[p];
            }
          }
        });
      if (!('length' in this)) {
        // In case getters are not supported
        this.length = split(o[p]).length;
      } else {
        // If they are, shim in index getters (up to 100)
        for (var i = 0; i < 100; ++i) {
          Object.defineProperty(this, String(i), {
            get: (function(n) { return function() { return this.item(n); }; }(i))
          });
        }
      }
    }

    function addToElementPrototype(p, f) {
      if ('Element' in global && Element.prototype && Object.defineProperty) {
        Object.defineProperty(Element.prototype, p, { get: f });
      }
    }

    // HTML - https://html.spec.whatwg.org
    // Element.classList
    if ('classList' in document.createElement('span')) {
      window.getClassList = function(elem) { return elem.classList; };
    } else {
      window.getClassList = function(elem) { return new DOMTokenListShim(elem, 'className'); };
      addToElementPrototype('classList', function() { return new DOMTokenListShim(this, 'className'); } );
    }

    // HTML - https://html.spec.whatwg.org
    // HTMLAnchorElement.relList
    // HTMLLinkElement.relList
    if ('relList' in document.createElement('link')) {
      window.getRelList = function(elem) { return elem.relList; };
    } else {
      window.getRelList = function(elem) { return new DOMTokenListShim(elem, 'rel'); };
      addToElementPrototype('relList', function() { return new DOMTokenListShim(this, 'rel'); } );
    }

    // Add second argument to native DOMTokenList.toggle() if necessary
    (function() {
      if (!('DOMTokenList' in global)) return;
      var e = document.createElement('span');
      if (!('classList' in e)) return;
      e.classList.toggle('x', false);
      if (!e.classList.contains('x')) return;
      global.DOMTokenList.prototype.toggle = function toggle(token/*, force*/) {
        var force = arguments[1];
        if (force === undefined) {
          var add = !this.contains(token);
          this[add ? 'add' : 'remove'](token);
          return add;
        }
        force = !!force;
        this[force ? 'add' : 'remove'](token);
        return force;
      };
    }());


    // DOM - Interface NonDocumentTypeChildNode
    // Interface NonDocumentTypeChildNode
    // previousElementSibling / nextElementSibling - for IE8

    if (!('previousElementSibling' in document.documentElement)) {
      addToElementPrototype('previousElementSibling', function() {
        var n = this.previousSibling;
        while (n && n.nodeType !== Node.ELEMENT_NODE)
          n = n.previousSibling;
        return n;
      });
    }

    if (!('nextElementSibling' in document.documentElement)) {
      addToElementPrototype('nextElementSibling', function() {
        var n = this.nextSibling;
        while (n && n.nodeType !== Node.ELEMENT_NODE)
          n = n.nextSibling;
        return n;
      });
    }
  }());

  // Element.matches
  // https://developer.mozilla.org/en/docs/Web/API/Element/matches
  // Needed for: IE, Firefox 3.6, early Webkit and Opera 15.0
  // Use msMatchesSelector(selector) for IE
  // Use oMatchesSelector(selector) for Opera 15.0
  // Use mozMatchesSelector(selector) for Firefox 3.6
  // Use webkitMatchesSelector(selector) for early Webkit
  // Use polyfill if no matches() support, but querySelectorAll() support
  if ('Element' in global && !Element.prototype.matches) {
    if (Element.prototype.msMatchesSelector) {
      Element.prototype.matches = Element.prototype.msMatchesSelector;
    } else if (Element.prototype.oMatchesSelector) {
      Element.prototype.matches = Element.prototype.oMatchesSelector;
    } else if (Element.prototype.mozMatchesSelector) {
      Element.prototype.matches = Element.prototype.mozMatchesSelector;
    } else if (Element.prototype.webkitMatchesSelector) {
      Element.prototype.matches = Element.prototype.webkitMatchesSelector;
    } else if (document.querySelectorAll) {
      Element.prototype.matches = function matches(selector) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(selector),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
    }
  }

  // Element.closest
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {};
      } while ((i < 0) && (el = el.parentElement)); 
      return el;
    };
  }

  function mixin(o, ps) {
    if (!o) return;
    Object.keys(ps).forEach(function(p) {
      if ((p in o) || (p in o.prototype)) return;
      try {
        Object.defineProperty(
          o.prototype,
          p,
          Object.getOwnPropertyDescriptor(ps, p)
        );
      } catch (ex) {
        // Throws in IE8; just copy it
        o[p] = ps[p];
      }
    });
  }

  // Mixin ParentNode
  // https://dom.spec.whatwg.org/#interface-parentnode

  function convertNodesIntoANode(nodes) {
    var node = null;
    nodes = nodes.map(function(node) {
      return !(node instanceof Node) ? document.createTextNode(node) : node;
    });
    if (nodes.length === 1) {
      node = nodes[0];
    } else {
      node = document.createDocumentFragment();
      nodes.forEach(function(n) { node.appendChild(n); });
    }
    return node;
  }

  var ParentNode = {
    prepend: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      nodes = convertNodesIntoANode(nodes);
      this.insertBefore(nodes, this.firstChild);
    },
    append: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      nodes = convertNodesIntoANode(nodes);
      this.appendChild(nodes);
    }
  };

  mixin(global.Document || global.HTMLDocument, ParentNode); // HTMLDocument for IE8
  mixin(global.DocumentFragment, ParentNode);
  mixin(global.Element, ParentNode);

  // Mixin ChildNode
  // https://dom.spec.whatwg.org/#interface-childnode

  var ChildNode = {
    before: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      var parent = this.parentNode;
      if (!parent) return;
      var viablePreviousSibling = this.previousSibling;
      while (nodes.indexOf(viablePreviousSibling) !== -1)
        viablePreviousSibling = viablePreviousSibling.previousSibling;
      var node = convertNodesIntoANode(nodes);
      parent.insertBefore(node, viablePreviousSibling ?
                          viablePreviousSibling.nextSibling : parent.firstChild);
    },
    after: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      var parent = this.parentNode;
      if (!parent) return;
      var viableNextSibling = this.nextSibling;
      while (nodes.indexOf(viableNextSibling) !== -1)
        viableNextSibling = viableNextSibling.nextSibling;
      var node = convertNodesIntoANode(nodes);
      parent.insertBefore(node, viableNextSibling);
    },
    replaceWith: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      var parent = this.parentNode;
      if (!parent) return;
      var viableNextSibling = this.nextSibling;
      while (nodes.indexOf(viableNextSibling) !== -1)
        viableNextSibling = viableNextSibling.nextSibling;
      var node = convertNodesIntoANode(nodes);

      if (this.parentNode === parent)
        parent.replaceChild(node, this);
      else
        parent.insertBefore(node, viableNextSibling);
    },
    remove: function() {
      if (!this.parentNode) return;
      this.parentNode.removeChild(this);
    }
  };

  mixin(global.DocumentType, ChildNode);
  mixin(global.Element, ChildNode);
  mixin(global.CharacterData, ChildNode);

}(self));
(function(global) {
  'use strict';

  if (!('window' in global && 'document' in global))
    return;

  //----------------------------------------------------------------------
  //
  // XMLHttpRequest
  // https://xhr.spec.whatwg.org
  //
  //----------------------------------------------------------------------

  // XMLHttpRequest interface
  // Needed for: IE7-
  global.XMLHttpRequest = global.XMLHttpRequest || function() {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (_) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (_) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (_) { }
    throw Error("This browser does not support XMLHttpRequest.");
  };

  // XMLHttpRequest interface constants
  // Needed for IE8-
  [
    ['UNSENT', 0],
    ['OPENED', 1],
    ['HEADERS_RECEIVED', 2],
    ['LOADING', 3],
    ['DONE', 4],
  ].forEach(function(p) { if (!(p[0] in global.XMLHttpRequest)) global.XMLHttpRequest[p[0]] = p[1]; });

  // FormData interface
  // Needed for: IE9-
  (function() {
    if ('FormData' in global)
      return;

    function FormData(form) {
      this._data = [];
      if (!form) return;
      for (var i = 0; i < form.elements.length; ++i) {
        var element = form.elements[i];
        if (element.name !== '')
          this.append(element.name, element.value);
      }
    }

    FormData.prototype = {
      append: function(name, value /*, filename */) {
        if ('Blob' in global && value instanceof global.Blob)
          throw TypeError("Blob not supported");
        name = String(name);
        this._data.push([name, value]);
      },

      toString: function() {
        return this._data.map(function(pair) {
          return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]);
        }).join('&');
      }
    };

    global.FormData = FormData;
    var send = global.XMLHttpRequest.prototype.send;
    global.XMLHttpRequest.prototype.send = function(body) {
      if (body instanceof FormData) {
        this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        arguments[0] = body.toString();
      }
      return send.apply(this, arguments);
    };
  }());

}(self));
(function(global) {
  'use strict';

  if (!('window' in global && 'document' in global))
    return;

  //----------------------------------------------------------------------
  //
  // CSSOM View Module
  // https://dev.w3.org/csswg/cssom-view/
  //
  //----------------------------------------------------------------------

  // Fix for IE8-'s Element.getBoundingClientRect()
  if ('TextRectangle' in global && !('width' in global.TextRectangle.prototype)) {
    Object.defineProperties(global.TextRectangle.prototype, {
      width: { get: function() { return this.right - this.left; } },
      height: { get: function() { return this.bottom - this.top; } }
    });
  }
}(self));
// URL Polyfill
// Draft specification: https://url.spec.whatwg.org

// Notes:
// - Primarily useful for parsing URLs and modifying query parameters
// - Should work in IE8+ and everything more modern, with es5.js polyfills

(function (global) {
  'use strict';

  function isSequence(o) {
    if (!o) return false;
    if ('Symbol' in global && 'iterator' in global.Symbol &&
        typeof o[Symbol.iterator] === 'function') return true;
    if (Array.isArray(o)) return true;
    return false;
  }

  function toArray(iter) {
    return ('from' in Array) ? Array.from(iter) : Array.prototype.slice.call(iter);
  }

  (function() {

    // Browsers may have:
    // * No global URL object
    // * URL with static methods only - may have a dummy constructor
    // * URL with members except searchParams
    // * Full URL API support
    var origURL = global.URL;
    var nativeURL;
    try {
      if (origURL) {
        nativeURL = new global.URL('http://example.com');
        if ('searchParams' in nativeURL)
          return;
        if (!('href' in nativeURL))
          nativeURL = undefined;
      }
    } catch (_) {}

    // NOTE: Doesn't do the encoding/decoding dance
    function urlencoded_serialize(pairs) {
      var output = '', first = true;
      pairs.forEach(function (pair) {
        var name = encodeURIComponent(pair.name);
        var value = encodeURIComponent(pair.value);
        if (!first) output += '&';
        output += name + '=' + value;
        first = false;
      });
      return output.replace(/%20/g, '+');
    }

    // NOTE: Doesn't do the encoding/decoding dance
    function urlencoded_parse(input, isindex) {
      var sequences = input.split('&');
      if (isindex && sequences[0].indexOf('=') === -1)
        sequences[0] = '=' + sequences[0];
      var pairs = [];
      sequences.forEach(function (bytes) {
        if (bytes.length === 0) return;
        var index = bytes.indexOf('=');
        if (index !== -1) {
          var name = bytes.substring(0, index);
          var value = bytes.substring(index + 1);
        } else {
          name = bytes;
          value = '';
        }
        name = name.replace(/\+/g, ' ');
        value = value.replace(/\+/g, ' ');
        pairs.push({ name: name, value: value });
      });
      var output = [];
      pairs.forEach(function (pair) {
        output.push({
          name: decodeURIComponent(pair.name),
          value: decodeURIComponent(pair.value)
        });
      });
      return output;
    }

    function URLUtils(url) {
      if (nativeURL)
        return new origURL(url);
      var anchor = document.createElement('a');
      anchor.href = url;
      return anchor;
    }

    function URLSearchParams(init) {
      var $this = this;
      this._list = [];

      if (init === undefined || init === null) {
        // no-op
      } else if (init instanceof URLSearchParams) {
        // In ES6 init would be a sequence, but special case for ES5.
        this._list = urlencoded_parse(String(init));
      } else if (typeof init === 'object' && isSequence(init)) {
        toArray(init).forEach(function(e) {
          if (!isSequence(e)) throw TypeError();
          var nv = toArray(e);
          if (nv.length !== 2) throw TypeError();
          $this._list.push({name: String(nv[0]), value: String(nv[1])});
        });
      } else if (typeof init === 'object' && init) {
        Object.keys(init).forEach(function(key) {
          $this._list.push({name: String(key), value: String(init[key])});
        });
      } else {
        init = String(init);
        if (init.substring(0, 1) === '?')
          init = init.substring(1);
        this._list = urlencoded_parse(init);
      }

      this._url_object = null;
      this._setList = function (list) { if (!updating) $this._list = list; };

      var updating = false;
      this._update_steps = function() {
        if (updating) return;
        updating = true;

        if (!$this._url_object) return;

        // Partial workaround for IE issue with 'about:'
        if ($this._url_object.protocol === 'about:' &&
            $this._url_object.pathname.indexOf('?') !== -1) {
          $this._url_object.pathname = $this._url_object.pathname.split('?')[0];
        }

        $this._url_object.search = urlencoded_serialize($this._list);

        updating = false;
      };
    }


    Object.defineProperties(URLSearchParams.prototype, {
      append: {
        value: function (name, value) {
          this._list.push({ name: name, value: value });
          this._update_steps();
        }, writable: true, enumerable: true, configurable: true
      },

      'delete': {
        value: function (name) {
          for (var i = 0; i < this._list.length;) {
            if (this._list[i].name === name)
              this._list.splice(i, 1);
            else
              ++i;
          }
          this._update_steps();
        }, writable: true, enumerable: true, configurable: true
      },

      get: {
        value: function (name) {
          for (var i = 0; i < this._list.length; ++i) {
            if (this._list[i].name === name)
              return this._list[i].value;
          }
          return null;
        }, writable: true, enumerable: true, configurable: true
      },

      getAll: {
        value: function (name) {
          var result = [];
          for (var i = 0; i < this._list.length; ++i) {
            if (this._list[i].name === name)
              result.push(this._list[i].value);
          }
          return result;
        }, writable: true, enumerable: true, configurable: true
      },

      has: {
        value: function (name) {
          for (var i = 0; i < this._list.length; ++i) {
            if (this._list[i].name === name)
              return true;
          }
          return false;
        }, writable: true, enumerable: true, configurable: true
      },

      set: {
        value: function (name, value) {
          var found = false;
          for (var i = 0; i < this._list.length;) {
            if (this._list[i].name === name) {
              if (!found) {
                this._list[i].value = value;
                found = true;
                ++i;
              } else {
                this._list.splice(i, 1);
              }
            } else {
              ++i;
            }
          }

          if (!found)
            this._list.push({ name: name, value: value });

          this._update_steps();
        }, writable: true, enumerable: true, configurable: true
      },

      entries: {
        value: function() { return new Iterator(this._list, 'key+value'); },
        writable: true, enumerable: true, configurable: true
      },

      keys: {
        value: function() { return new Iterator(this._list, 'key'); },
        writable: true, enumerable: true, configurable: true
      },

      values: {
        value: function() { return new Iterator(this._list, 'value'); },
        writable: true, enumerable: true, configurable: true
      },

      forEach: {
        value: function(callback) {
          var thisArg = (arguments.length > 1) ? arguments[1] : undefined;
          this._list.forEach(function(pair, index) {
            callback.call(thisArg, pair.value, pair.name);
          });

        }, writable: true, enumerable: true, configurable: true
      },

      toString: {
        value: function () {
          return urlencoded_serialize(this._list);
        }, writable: true, enumerable: false, configurable: true
      }
    });

    function Iterator(source, kind) {
      var index = 0;
      this['next'] = function() {
        if (index >= source.length)
          return {done: true, value: undefined};
        var pair = source[index++];
        return {done: false, value:
                kind === 'key' ? pair.name :
                kind === 'value' ? pair.value :
                [pair.name, pair.value]};
      };
    }

    if ('Symbol' in global && 'iterator' in global.Symbol) {
      Object.defineProperty(URLSearchParams.prototype, global.Symbol.iterator, {
        value: URLSearchParams.prototype.entries,
        writable: true, enumerable: true, configurable: true});
      Object.defineProperty(Iterator.prototype, global.Symbol.iterator, {
        value: function() { return this; },
        writable: true, enumerable: true, configurable: true});
    }

    function URL(url, base) {
      if (!(this instanceof global.URL))
        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator.");

      if (base) {
        url = (function () {
          if (nativeURL) return new origURL(url, base).href;

          var doc;
          // Use another document/base tag/anchor for relative URL resolution, if possible
          if (document.implementation && document.implementation.createHTMLDocument) {
            doc = document.implementation.createHTMLDocument('');
          } else if (document.implementation && document.implementation.createDocument) {
            doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            doc.documentElement.appendChild(doc.createElement('head'));
            doc.documentElement.appendChild(doc.createElement('body'));
          } else if (window.ActiveXObject) {
            doc = new window.ActiveXObject('htmlfile');
            doc.write('<head><\/head><body><\/body>');
            doc.close();
          }

          if (!doc) throw Error('base not supported');

          var baseTag = doc.createElement('base');
          baseTag.href = base;
          doc.getElementsByTagName('head')[0].appendChild(baseTag);
          var anchor = doc.createElement('a');
          anchor.href = url;
          return anchor.href;
        }());
      }

      // An inner object implementing URLUtils (either a native URL
      // object or an HTMLAnchorElement instance) is used to perform the
      // URL algorithms. With full ES5 getter/setter support, return a
      // regular object For IE8's limited getter/setter support, a
      // different HTMLAnchorElement is returned with properties
      // overridden

      var instance = URLUtils(url || '');

      // Detect for ES5 getter/setter support
      // (an Object.defineProperties polyfill that doesn't support getters/setters may throw)
      var ES5_GET_SET = (function() {
        if (!('defineProperties' in Object)) return false;
        try {
          var obj = {};
          Object.defineProperties(obj, { prop: { 'get': function () { return true; } } });
          return obj.prop;
        } catch (_) {
          return false;
        }
      })();

      var self = ES5_GET_SET ? this : document.createElement('a');



      var query_object = new URLSearchParams(
        instance.search ? instance.search.substring(1) : null);
      query_object._url_object = self;

      Object.defineProperties(self, {
        href: {
          get: function () { return instance.href; },
          set: function (v) { instance.href = v; tidy_instance(); update_steps(); },
          enumerable: true, configurable: true
        },
        origin: {
          get: function () {
            if ('origin' in instance) return instance.origin;
            return this.protocol + '//' + this.host;
          },
          enumerable: true, configurable: true
        },
        protocol: {
          get: function () { return instance.protocol; },
          set: function (v) { instance.protocol = v; },
          enumerable: true, configurable: true
        },
        username: {
          get: function () { return instance.username; },
          set: function (v) { instance.username = v; },
          enumerable: true, configurable: true
        },
        password: {
          get: function () { return instance.password; },
          set: function (v) { instance.password = v; },
          enumerable: true, configurable: true
        },
        host: {
          get: function () {
            // IE returns default port in |host|
            var re = {'http:': /:80$/, 'https:': /:443$/, 'ftp:': /:21$/}[instance.protocol];
            return re ? instance.host.replace(re, '') : instance.host;
          },
          set: function (v) { instance.host = v; },
          enumerable: true, configurable: true
        },
        hostname: {
          get: function () { return instance.hostname; },
          set: function (v) { instance.hostname = v; },
          enumerable: true, configurable: true
        },
        port: {
          get: function () { return instance.port; },
          set: function (v) { instance.port = v; },
          enumerable: true, configurable: true
        },
        pathname: {
          get: function () {
            // IE does not include leading '/' in |pathname|
            if (instance.pathname.charAt(0) !== '/') return '/' + instance.pathname;
            return instance.pathname;
          },
          set: function (v) { instance.pathname = v; },
          enumerable: true, configurable: true
        },
        search: {
          get: function () { return instance.search; },
          set: function (v) {
            if (instance.search === v) return;
            instance.search = v; tidy_instance(); update_steps();
          },
          enumerable: true, configurable: true
        },
        searchParams: {
          get: function () { return query_object; },
          enumerable: true, configurable: true
        },
        hash: {
          get: function () { return instance.hash; },
          set: function (v) { instance.hash = v; tidy_instance(); },
          enumerable: true, configurable: true
        },
        toString: {
          value: function() { return instance.toString(); },
          enumerable: false, configurable: true
        },
        valueOf: {
          value: function() { return instance.valueOf(); },
          enumerable: false, configurable: true
        }
      });

      function tidy_instance() {
        var href = instance.href.replace(/#$|\?$|\?(?=#)/g, '');
        if (instance.href !== href)
          instance.href = href;
      }

      function update_steps() {
        query_object._setList(instance.search ? urlencoded_parse(instance.search.substring(1)) : []);
        query_object._update_steps();
      };

      return self;
    }

    if (origURL) {
      for (var i in origURL) {
        if (origURL.hasOwnProperty(i) && typeof origURL[i] === 'function')
          URL[i] = origURL[i];
      }
    }

    global.URL = URL;
    global.URLSearchParams = URLSearchParams;
  }());

  // Patch native URLSearchParams constructor to handle sequences/records
  // if necessary.
  (function() {
    if (new global.URLSearchParams([['a', 1]]).get('a') === '1' &&
        new global.URLSearchParams({a: 1}).get('a') === '1')
      return;
    var orig = global.URLSearchParams;
    global.URLSearchParams = function(init) {
      if (init && typeof init === 'object' && isSequence(init)) {
        var o = new orig();
        toArray(init).forEach(function(e) {
          if (!isSequence(e)) throw TypeError();
          var nv = toArray(e);
          if (nv.length !== 2) throw TypeError();
          o.append(nv[0], nv[1]);
        });
        return o;
      } else if (init && typeof init === 'object') {
        o = new orig();
        Object.keys(init).forEach(function(key) {
          o.set(key, init[key]);
        });
        return o;
      } else {
        return new orig(init);
      }
    };
  }());

}(self));
// Work-In-Progress 'prollyfill' for Fetch API
// Standard: https://fetch.spec.whatwg.org/#fetch-api
//
// As usual, the intent is to produce a forward-compatible
// subset so that code can be written using future standard
// functionality; not every case is considered or supported.

// Requires ES2015: Promise, Symbol.iterator (or polyfill)
// Requires: URL (or polyfill)

// Example:
//   fetch('README.md')
//     .then(function(response) { return response.text(); })
//     .then(function(text) { alert(text); });

(function(global) {
  'use strict';

  // Web IDL concepts

  // https://heycam.github.io/webidl/#idl-ByteString
  function ByteString(value) {
    value = String(value);
    if (value.match(/[^\x00-\xFF]/)) throw TypeError('Not a valid ByteString');
    return value;
  }

  // https://heycam.github.io/webidl/#idl-USVString
  function USVString(value) {
    value = String(value);
    return value.replace(
        /([\u0000-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF])/g,
      function (c) {
        if (/^[\uD800-\uDFFF]$/.test(c)) return '\uFFFD';
        return c;
      });
  }

  function ushort(x) { return x & 0xFFFF; }

  // 2 Terminology

  function byteLowerCase(s) {
    return String(s).replace(/[A-Z]/g, function(c) { return c.toLowerCase(); });
  }

  function byteUpperCase(s) {
    return String(s).replace(/[a-z]/g, function(c) { return c.toUpperCase(); });
  }

  function byteCaseInsensitiveMatch(a, b) {
    return byteLowerCase(a) === byteLowerCase(b);
  }

  // 2.1 HTTP

  // 2.1.1 Methods

  function isForbiddenMethod(m) {
    m = byteUpperCase(m);
    return m === 'CONNECT' || m === 'TRACE' || m === 'TRACK';
  }

  function normalizeMethod(m) {
    var u = byteUpperCase(m);
    if (u === 'DELETE' || u === 'GET' || u === 'HEAD' || u === 'OPTIONS' ||
        u === 'POST' || u === 'PUT') return u;
    return m;
  }

  function isName(s) {
    return /^[!#$%&'*+\-.09A-Z^_`a-z|~]+$/.test(s);
  }
  function isValue(s) {
    // TODO: Implement me
    return true;
  }
  function isForbiddenHeaderName(n) {
    n = String(n).toLowerCase();
    var forbidden = {
      'accept-charset': true,
      'accept-encoding': true,
      'access-control-request-headers': true,
      'access-control-request-method': true,
      'connection': true,
      'content-length': true,
      'cookie': true,
      'cookie2': true,
      'date': true,
      'dnt': true,
      'expect': true,
      'host': true,
      'keep-alive': true,
      'origin': true,
      'referer': true,
      'te': true,
      'trailer': true,
      'transfer-encoding': true,
      'upgrade': true,
      'user-agent': true,
      'via': true
    };
    return forbidden[n] || n.substring(0, 6) === 'proxy-' || n.substring(0, 4) === 'sec-';
  }

  function isForbiddenResponseHeaderName(n) {
    n = String(n).toLowerCase();
    var forbidden = {
      'set-cookie': true,
      'set-cookie2': true
    };
    return forbidden[n];
  }

  function isSimpleHeader(name, value) {
    name = String(name).toLowerCase();
    return name === 'accept' || name === 'accept-language' || name === 'content-language' ||
      (name === 'content-type' &&
       ['application/x-www-form-encoded', 'multipart/form-data', 'text/plain'].indexOf(value) !== -1);
  }

  //
  // 5.1 Headers class
  //

  // typedef (Headers or sequence<sequence<ByteString>> or OpenEndedDictionary<ByteString>) HeadersInit;

  // Constructor(optional HeadersInit init)
  function Headers(init) {
    this._guard = 'none';
    this._headerList = [];
    if (init) fill(this, init);
  }

  function fill(headers, init) {
    if (init instanceof Headers) {
      init._headerList.forEach(function(header) {
        headers.append(header[0], header[1]);
      });
    } else if (Array.isArray(init)) {
      init.forEach(function(header) {
        if (!Array.isArray(header) || header.length !== 2) throw TypeError();
        headers.append(header[0], header[1]);
      });
    } else {
      init = Object(init);
      Object.keys(init).forEach(function(key) {
        headers.append(key, init[key]);
      });
    }
  }

  // interface Headers
  Headers.prototype = {
    // void append(ByteString name, ByteString value);
    append: function append(name, value) {
      name = ByteString(name);
      if (!isName(name) || !isValue(value)) throw TypeError();
      if (this._guard === 'immutable') throw TypeError();
      else if (this._guard === 'request' && isForbiddenHeaderName(name)) return;
      else if (this._guard === 'request-no-CORS' && !isSimpleHeader(name, value)) return;
      else if (this._guard === 'response' && isForbiddenResponseHeaderName(name)) return;

      name = name.toLowerCase();
      this._headerList.push([name, value]);
    },

    // void delete(ByteString name);
    'delete': function delete_(name) {
      name = ByteString(name);
      if (!isName(name)) throw TypeError();
      if (this._guard === 'immutable') throw TypeError();
      else if (this._guard === 'request' && isForbiddenHeaderName(name)) return;
      else if (this._guard === 'request-no-CORS' && !isSimpleHeader(name, 'invalid')) return;
      else if (this._guard === 'response' && isForbiddenResponseHeaderName(name)) return;

      name = name.toLowerCase();
      var index = 0;
      while (index < this._headerList.length) {
        if (this._headerList[index][0] === name)
          this._headerList.splice(index, 1);
        else
          ++index;
      }
    },

    // ByteString? get(ByteString name);
    get: function get(name) {
      name = ByteString(name);
      if (!isName(name)) throw TypeError();
      name = name.toLowerCase();
      for (var index = 0; index < this._headerList.length; ++index) {
        if (this._headerList[index][0] === name)
          return this._headerList[index][1];
      }
      return null;
    },

    // sequence<ByteString> getAll(ByteString name);
    getAll: function getAll(name) {
      name = ByteString(name);
      if (!isName(name)) throw TypeError();
      name = name.toLowerCase();
      var sequence = [];
      for (var index = 0; index < this._headerList.length; ++index) {
        if (this._headerList[index][0] === name)
          sequence.push(this._headerList[index][1]);
      }
      return sequence;
    },

    // boolean has(ByteString name);
    has: function has(name) {
      name = ByteString(name);
      if (!isName(name)) throw TypeError();
      name = name.toLowerCase();
      for (var index = 0; index < this._headerList.length; ++index) {
        if (this._headerList[index][0] === name)
          return true;
      }
      return false;
    },

    // void set(ByteString name, ByteString value);
    set: function set(name, value) {
      name = ByteString(name);
      if (!isName(name) || !isValue(value)) throw TypeError();
      if (this._guard === 'immutable') throw TypeError();
      else if (this._guard === 'request' && isForbiddenHeaderName(name)) return;
      else if (this._guard === 'request-no-CORS' && !isSimpleHeader(name, value)) return;
      else if (this._guard === 'response' && isForbiddenResponseHeaderName(name)) return;

      name = name.toLowerCase();
      for (var index = 0; index < this._headerList.length; ++index) {
        if (this._headerList[index][0] === name) {
          this._headerList[index++][1] = value;
          while (index < this._headerList.length) {
            if (this._headerList[index][0] === name)
              this._headerList.splice(index, 1);
            else
              ++index;
          }
          return;
        }
      }
      this._headerList.push([name, value]);
    }
  };
  Headers.prototype[Symbol.iterator] = function() {
    return new HeadersIterator(this);
  };

  function HeadersIterator(headers) {
    this._headers = headers;
    this._index = 0;
  }
  HeadersIterator.prototype = {};
  HeadersIterator.prototype.next = function() {
    if (this._index >= this._headers._headerList.length)
      return { value: undefined, done: true };
    return { value: this._headers._headerList[this._index++], done: false };
  };
  HeadersIterator.prototype[Symbol.iterator] = function() { return this; };


  //
  // 5.2 Body mixin
  //

  function Body(_stream) {
    // TODO: Handle initialization from other types
    this._stream = _stream;
    this.bodyUsed = false;
  }

  // interface FetchBodyStream
  Body.prototype = {
    // Promise<ArrayBuffer> arrayBuffer();
    arrayBuffer: function() {
      if (this.bodyUsed) return Promise.reject(TypeError());
      this.bodyUsed = true;
      if (this._stream instanceof ArrayBuffer) return Promise.resolve(this._stream);
      var value = this._stream;
      return new Promise(function(resolve, reject) {
        var octets = unescape(encodeURIComponent(value)).split('').map(function(c) {
          return c.charCodeAt(0);
        });
        resolve(new Uint8Array(octets).buffer);
      });
    },
    // Promise<Blob> blob();
    blob: function() {
      if (this.bodyUsed) return Promise.reject(TypeError());
      this.bodyUsed = true;
      if (this._stream instanceof Blob) return Promise.resolve(this._stream);
      return Promise.resolve(new Blob([this._stream]));
    },
    // Promise<FormData> formData();
    formData: function() {
      if (this.bodyUsed) return Promise.reject(TypeError());
      this.bodyUsed = true;
      if (this._stream instanceof FormData) return Promise.resolve(this._stream);
      return Promise.reject(Error('Not yet implemented'));
    },
    // Promise<JSON> json();
    json: function() {
      if (this.bodyUsed) return Promise.reject(TypeError());
      this.bodyUsed = true;
      var that = this;
      return new Promise(function(resolve, reject) {
        resolve(JSON.parse(that._stream));
      });
    },
    // Promise<USVString> text();
    text: function() {
      if (this.bodyUsed) return Promise.reject(TypeError());
      this.bodyUsed = true;
      return Promise.resolve(String(this._stream));
    }
  };

  //
  // 5.3 Request class
  //

  // typedef (Request or USVString) RequestInfo;

  // Constructor(RequestInfo input, optional RequestInit init)
  function Request(input, init) {
    if (arguments.length < 1) throw TypeError('Not enough arguments');

    Body.call(this, null);

    // readonly attribute ByteString method;
    this.method = 'GET';

    // readonly attribute USVString url;
    this.url = '';

    // readonly attribute Headers headers;
    this.headers = new Headers();
    this.headers._guard = 'request';

    // readonly attribute DOMString referrer;
    this.referrer = null; // TODO: Implement.

    // readonly attribute RequestMode mode;
    this.mode = null; // TODO: Implement.

    // readonly attribute RequestCredentials credentials;
    this.credentials = 'omit';

    if (input instanceof Request) {
      if (input.bodyUsed) throw TypeError();
      input.bodyUsed = true;
      this.method = input.method;
      this.url = input.url;
      this.headers = new Headers(input.headers);
      this.headers._guard = input.headers._guard;
      this.credentials = input.credentials;
      this._stream = input._stream;
    } else {
      input = USVString(input);
      this.url = String(new URL(input, self.location));
    }

    init = Object(init);

    if ('method' in init) {
      var method = ByteString(init.method);
      if (isForbiddenMethod(method)) throw TypeError();
      this.method = normalizeMethod(method);
    }

    if ('headers' in init) {
      this.headers = new Headers();
      fill(this.headers, init.headers);
    }

    if ('body' in init)
      this._stream = init.body;

    if ('credentials' in init &&
        (['omit', 'same-origin', 'include'].indexOf(init.credentials) !== -1))
      this.credentials = init.credentials;
  }

  // interface Request
  Request.prototype = Body.prototype;

  //
  // 5.4 Response class
  //

  // Constructor(optional FetchBodyInit body, optional ResponseInit init)
  function Response(body, init) {
    if (arguments.length < 1)
      body = '';

    this.headers = new Headers();
    this.headers._guard = 'response';

    // Internal
    if (body instanceof XMLHttpRequest && '_url' in body) {
      var xhr = body;
      this.type = 'basic'; // TODO: ResponseType
      this.url = USVString(xhr._url);
      this.status = xhr.status;
      this.ok = 200 <= this.status && this.status <= 299;
      this.statusText = xhr.statusText;
      xhr.getAllResponseHeaders()
        .split(/\r?\n/)
        .filter(function(header) { return header.length; })
        .forEach(function(header) {
          var i = header.indexOf(':');
          this.headers.append(header.substring(0, i), header.substring(i + 2));
        }, this);
      Body.call(this, xhr.responseText);
      return;
    }

    Body.call(this, body);

    init = Object(init) || {};

    // readonly attribute USVString url;
    this.url = '';

    // readonly attribute unsigned short status;
    var status = 'status' in init ? ushort(init.status) : 200;
    if (status < 200 || status > 599) throw RangeError();
    this.status = status;

    // readonly attribute boolean ok;
    this.ok = 200 <= this.status && this.status <= 299;

    // readonly attribute ByteString statusText;
    var statusText = 'statusText' in init ? String(init.statusText) : 'OK';
    if (/[^\x00-\xFF]/.test(statusText)) throw TypeError();
    this.statusText = statusText;

    // readonly attribute Headers headers;
    if ('headers' in init) fill(this.headers, init);

    // TODO: Implement these
    // readonly attribute ResponseType type;
    this.type = 'basic'; // TODO: ResponseType
  }

  // interface Response
  Response.prototype = Body.prototype;

  Response.redirect = function() {
    // TODO: Implement?
    throw Error('Not supported');
  };

  //
  // 5.5 Structured cloning of Headers, FetchBodyStream, Request, Response
  //

  //
  // 5.6 Fetch method
  //

  // Promise<Response> fetch(RequestInfo input, optional RequestInit init);
  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var r = new Request(input, init);

      var xhr = new XMLHttpRequest(), async = true;
      xhr._url = r.url;

      try { xhr.open(r.method, r.url, async); } catch (e) { throw TypeError(e.message); }

      for (var iter = r.headers[Symbol.iterator](), step = iter.next();
           !step.done; step = iter.next())
        xhr.setRequestHeader(step.value[0], step.value[1]);

      if (r.credentials === 'include')
        xhr.withCredentials = true;

      xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 0)
          reject(new TypeError('Network error'));
        else
          resolve(new Response(xhr));
      };

      xhr.send(r._stream);
    });
  }

  // Exported
  if (!('fetch' in global)) {
    global.Headers = Headers;
    global.Request = Request;
    global.Response = Response;
    global.fetch = fetch;
  }

}(self));

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.options = {
  sound: true,

  toggle: function toggle(prop) {
    this[prop] = !this[prop];
    return this[prop];
  }
};

var Text = function () {
  function Text(element) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Text);

    this.element = element;
    this.text(value);
  }

  _createClass(Text, [{
    key: 'text',
    value: function text(val) {
      var element = this.element;


      var child = element.firstChild;
      var node = document.createTextNode(val);

      if (child) element.removeChild(child);

      element.appendChild(node);
    }
  }]);

  return Text;
}();

String.prototype.get = function () {
  return this;
};
String.prototype.copy = function () {
  return this;
};
String.prototype.fade = function () {
  return this;
};

var RGBA = function () {
  function RGBA() {
    var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, RGBA);

    this.r = Math.round(r);
    this.g = Math.round(g);
    this.b = Math.round(b);
    this.a = Math.round(a);
  }

  _createClass(RGBA, [{
    key: 'get',
    value: function get() {
      var r = this.r,
          g = this.g,
          b = this.b,
          a = this.a;

      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
  }, {
    key: 'fade',
    value: function fade() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.95;

      this.a *= strength;
      return this;
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.a > 0.01;
    }
  }, {
    key: 'copy',
    value: function copy() {
      var r = this.r,
          g = this.g,
          b = this.b,
          a = this.a;

      return new RGBA(r, g, b, a);
    }
  }], [{
    key: 'random',
    value: function random() {
      var alpha = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _random(0, 1);

      return new RGBA(_random(0, 255), _random(0, 255), _random(0, 255), alpha);
    }
  }]);

  return RGBA;
}();

var calculateAttraction = function calculateAttraction(a, b) {
  var force = a.pos.clone().sub(b.pos).normalize();

  var dist = force.len2();
  dist = constrain(dist, 0.01, 1000);

  var strength = AG * a.mass * b.mass / dist;

  force.scale(strength);
  return force;
};

var constrain = function constrain(a, min, max) {
  if (a < min) return min;
  if (a > max) return max;
  return a;
};

var cloneVectorArray = function cloneVectorArray(a) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : a.length;

  var copy = [];
  for (var i = 0; i < len; i++) {
    copy[i] = a[i].clone();
  }
  return copy;
};

var copyVectorArray = function copyVectorArray(a, output) {
  var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : a.length;

  for (var i = 0; i < len; i++) {
    output[i].copy(a[i]);
  }
  return output.slice(0, len);
};

var formatString = function formatString(string, value, amount) {
  var padding = value.repeat(amount);
  var str = padding.concat(string);

  return str.slice(-amount);
};

var firstCharUpperCase = function firstCharUpperCase(string) {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
};

var _random = function _random(min) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.random() * (max - min) + min;
};

var randomInt = function randomInt(min, max) {
  return Math.floor(_random(min, max + 1));
};
var AUDIO_STORAGE = {};

var LoadSound = function LoadSound(name, src) {
  AUDIO_STORAGE[name] = new Audio(src);
};

var PlaySound = function PlaySound(name) {
  if (window.options.sound) {
    var src = AUDIO_STORAGE[name].src;
    var audio = new Audio(src);

    audio.play();
    return audio;
  }

  return false;
};

LoadSound('shootCannon', 'assets/shoot_cannon_sound.mp3');
LoadSound('hitTarget', 'assets/hit_target_sound.mp3');

var CanvasRatioManager = function () {
  function CanvasRatioManager(canvas, element, ratio) {
    _classCallCheck(this, CanvasRatioManager);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.element = element || false;
    this.elementSizing = {
      width: 0,
      height: 0
    };

    this.borderLeft = 0;
    this.borderTop = 0;
    this.left = 0;
    this.right = 0;

    this.setRatio(ratio);
    this.calcSize();
  }

  _createClass(CanvasRatioManager, [{
    key: 'clearScreen',
    value: function clearScreen() {
      var ctx = this.ctx;
      var canvas = this.canvas;
      var width = canvas.width;
      var height = canvas.height;

      ctx.clearRect(0, 0, width, height);
    }
  }, {
    key: 'resize',
    value: function resize(w, h) {
      var width = w - this.borderLeft * 2;
      var height = h - this.borderTop * 2;

      this.canvas.width = width;
      this.width = width;

      this.canvas.height = height;
      this.height = height;

      this.area = width * height;
    }
  }, {
    key: 'setRatio',
    value: function setRatio(ratio) {
      this.ratio = ratio;
      this.inv_ratio = 1 / ratio;
    }
  }, {
    key: 'getBestFit',
    value: function getBestFit() {
      var elementSizing = this.elementSizing;


      var width = elementSizing.width;
      var height = elementSizing.height;

      var elementArea = width * height;

      var ratio = this.ratio;
      var invRatio = this.inv_ratio;

      var fullWidth = {
        width: width,
        height: width * invRatio
      };

      var fullHeight = {
        width: height * ratio,
        height: height
      };

      var area1 = fullWidth.width * fullWidth.height;
      var area2 = fullHeight.width * fullHeight.height;

      if (area1 > elementArea) {
        return fullHeight;
      }

      if (area2 > elementArea) {
        return fullWidth;
      }

      if (area1 > area2) {
        return fullWidth;
      }

      return fullHeight;
    }
  }, {
    key: 'calcSize',
    value: function calcSize() {
      var element = this.element,
          elementSizing = this.elementSizing;


      if (element) {
        elementSizing.width = element.clientWidth;
        elementSizing.height = element.clientHeight;
      } else {
        elementSizing.width = window.innerWidth;
        elementSizing.height = window.innerHeight;
      }

      var size = this.getBestFit();

      this.resize(size.width, size.height);
    }
  }, {
    key: 'border',
    value: function border(height) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#000';

      var style = this.canvas.style;
      var width = height * this.ratio;

      style.borderStyle = 'solid';
      style.borderColor = color;

      style.borderLeftWidth = width + 'px';
      style.borderRightWidth = width + 'px';

      style.borderTopWidth = height + 'px';
      style.borderBottomWidth = height + 'px';

      this.borderLeft = width;
      this.borderTop = height;

      this.calcSize();
      this.center();
    }
  }, {
    key: 'setPos',
    value: function setPos(x, y) {
      var style = this.canvas.style;

      style.position = 'relative';

      if (x) {
        var left = x - this.borderLeft;

        style.left = left + 'px';
        this.left = left;
      }

      if (y) {
        var top = y - this.borderTop;

        style.top = top + 'px';
        this.top = top;
      }
    }
  }, {
    key: 'center',
    value: function center() {
      var elementSizing = this.elementSizing,
          canvas = this.canvas;


      var x = elementSizing.width - canvas.width;
      var y = elementSizing.height - canvas.height;

      x *= 0.5;
      y *= 0.53;

      this.setPos(x, y);
    }
  }], [{
    key: 'create',
    value: function create(canvas, element, ratio) {
      return new CanvasRatioManager(canvas, element, ratio);
    }
  }]);

  return CanvasRatioManager;
}();

var Renderer = function () {
  function Renderer(ctx) {
    _classCallCheck(this, Renderer);

    this.ctx = ctx;
  }

  _createClass(Renderer, [{
    key: 'gradient',
    value: function gradient(x, y, inner, outer, stops, amount) {
      var gradient = this.ctx.createRadialGradient(x, y, inner, x, y, outer);

      for (var i = 0; i < amount; i++) {
        var stop = stops[i].get();
        gradient.addColorStop(i, stop);
      }

      return gradient;
    }
  }, {
    key: 'polygon',
    value: function polygon(points, pos, r, fillColor, strokeColor, strokeWidth) {
      var colorStops = [fillColor, strokeColor];
      var gradient = this.gradient(pos.x, pos.y, r * 0.1, r * 1.5, colorStops, 2);
      var ctx = this.ctx;

      ctx.fillStyle = gradient;
      ctx.strokeStyle = strokeColor.get();
      ctx.lineWidth = strokeWidth * 2;

      var point = points[0];

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);

      for (var i = 0; i < points.length; i++) {
        var _point = points[i];
        ctx.lineTo(_point.x, _point.y);
      }

      ctx.closePath();

      ctx.save();
      ctx.clip();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: 'circle',
    value: function circle(pos, r, fillColor, strokeColor, strokeWidth) {
      var colorStops = [fillColor, strokeColor];
      var gradient = this.gradient(pos.x, pos.y, r * 0.1, r * 2, colorStops, 2);
      var ctx = this.ctx;

      ctx.fillStyle = gradient;
      ctx.strokeStyle = strokeColor.get();
      ctx.lineWidth = strokeWidth;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r - strokeWidth * 0.25, 0, TWO_PI);
      ctx.closePath();

      ctx.stroke();
      ctx.fill();
    }
  }, {
    key: 'box',
    value: function box(pos, w, h, angle, fillColor) {
      var ctx = this.ctx;
      var begin = -w * 0.5;

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle - HALF_PI);

      ctx.fillStyle = fillColor.get();
      ctx.fillRect(begin, 0, w, h);

      ctx.restore();
    }
  }, {
    key: 'point',
    value: function point(pos, fillColor) {
      var ctx = this.ctx;

      ctx.fillStyle = fillColor.get();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2, 0, TWO_PI);
      ctx.closePath();
      ctx.fill();
    }
  }], [{
    key: 'create',
    value: function create(ctx) {
      return new Renderer(ctx);
    }
  }]);

  return Renderer;
}();

var RenderRatio = function () {
  function RenderRatio(ctx, ratio) {
    _classCallCheck(this, RenderRatio);

    this.ctx = ctx;

    this.ratio = ratio;
    this.inv_ratio = 1 / ratio;

    this.widthAdjust = ratio * 0.036;

    this.render = Renderer.create(ctx);

    this.TVECS = [];
    for (var i = 0; i < 50; i++) {
      this.TVECS.push(Vector.create());
    }
  }

  _createClass(RenderRatio, [{
    key: 'polygon',
    value: function polygon(points, pos, r, fillColor, strokeColor, strokeWidth) {
      var offset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : { x: 0, y: 0 };

      var len = points.length;
      var ratio = this.ratio;
      var adjust = this.widthAdjust;

      var list = copyVectorArray(points, this.TVECS, len);

      for (var i = 0; i < len; i++) {
        list[i].add(offset).scale(ratio);
      }

      var position = this.TVECS.pop().copy(pos).add(offset).scale(ratio);

      this.render.polygon(list, position, r * ratio, fillColor, strokeColor, adjust * strokeWidth);
      this.TVECS.push(position);
    }
  }, {
    key: 'circle',
    value: function circle(pos, r, fillColor, strokeColor, strokeWidth) {
      var offset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : { x: 0, y: 0 };

      var ratio = this.ratio;
      var adjust = this.widthAdjust;
      var position = this.TVECS.pop().copy(pos).add(offset).scale(ratio);
      var radius = r * ratio;

      this.render.circle(position, radius, fillColor, strokeColor, adjust * strokeWidth);
      this.TVECS.push(position);
    }
  }, {
    key: 'box',
    value: function box(pos, w, h, angle, fillColor, strokeColor, strokeWidth) {
      var offset = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : { x: 0, y: 0 };

      var ratio = this.ratio;
      var adjust = this.widthAdjust;
      var position = this.TVECS.pop().copy(pos).add(offset).scale(ratio);
      var width = w * ratio;
      var height = h * ratio;

      this.render.box(position, width, height, angle, fillColor, strokeColor, adjust * strokeWidth);
      this.TVECS.push(position);
    }
  }, {
    key: 'point',
    value: function point(pos, fillColor) {
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { x: 0, y: 0 };

      var position = this.TVECS.pop().copy(pos).add(offset).scale(this.ratio);

      this.render.point(position, fillColor);
      this.TVECS.push(position);
    }
  }], [{
    key: 'create',
    value: function create(ctx, ratio) {
      return new RenderRatio(ctx, ratio);
    }
  }]);

  return RenderRatio;
}();

var InputManager = function () {
  function InputManager(element) {
    var _this = this;

    _classCallCheck(this, InputManager);

    this.element = element;

    this.mouse = Vector.create();
    this.drag = false;
    this.keystates = {};

    this.add('document-keydown', function (e) {
      _this.keystates[e.keyCode] = true;
    });

    this.add('document-keyup', function (e) {
      delete _this.keystates[e.keyCode];
    });

    this.add('mousedown', function (e) {
      e.preventDefault();
      var rect = _this.element.getBoundingClientRect();
      _this.drag = _this.contains(rect, e.clientX, e.clientY);
    });

    this.add('mouseup touchend', function (e) {
      e.preventDefault();
      _this.drag = false;
    });

    this.add('mousemove', function (e) {
      e.preventDefault();

      var rect = _this.element.getBoundingClientRect();
      _this.mouse.x = e.clientX - rect.left;
      _this.mouse.y = e.clientY - rect.top;

      if (_this.drag && !_this.contains(rect, e.clientX, e.clientY)) {
        _this.drag = false;
      }
    });

    this.add('touchstart', function (e) {
      var rect = _this.element.getBoundingClientRect();
      var touch = e.touches[0];
      _this.mouse.x = touch.clientX - rect.left;
      _this.mouse.y = touch.clientY - rect.top;
      _this.drag = _this.contains(rect, touch.clientX, touch.clientY);
    });

    this.add('touchmove', function (e) {
      var rect = _this.element.getBoundingClientRect();
      var touch = e.touches[0];
      _this.mouse.x = touch.clientX - rect.left;
      _this.mouse.y = touch.clientY - rect.top;
      _this.drag = _this.contains(rect, touch.clientX, touch.clientY);
    });
  }

  _createClass(InputManager, [{
    key: 'contains',
    value: function contains(rect, x, y) {
      var mouse = this.mouse;

      return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
    }
  }, {
    key: 'add',
    value: function add(events, callback) {
      var array = events.split(' ');

      for (var i = 0; i < array.length; i++) {
        var event = array[i];

        if (event.includes('window-')) {
          var name = event.slice(7);

          window.addEventListener(name, callback);
          continue;
        }

        if (event.includes('document-')) {
          var _name = event.slice(9);

          window.addEventListener(_name, callback);
        }

        window.addEventListener(event, callback);
      }
    }
  }], [{
    key: 'create',
    value: function create(element) {
      return new InputManager(element);
    }
  }]);

  return InputManager;
}();

var World = function () {
  function World(canvas, ratio, size, element) {
    _classCallCheck(this, World);

    this.inGame = false;
    this.element = element;

    this.ratio = ratio;
    this.inv_ratio = 1 / ratio;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.canvasRatio = CanvasRatioManager.create(canvas, element, ratio);
    this.canvasRatio.center();

    this.inputManager = InputManager.create(canvas);

    this.size = size;
    this.referenceFrame = 0;
    this.moversHit = 0;
    this.scoreQueue = 0;

    this.saveDimensions();
    this.calcSize();

    this.render = RenderRatio.create(this.ctx, this.scale);
    this.SAT = SAT.create();
    this.manifold = Manifold.create();

    this.reset();

    this.cannon = Cannon.create(this);
    this.target = Target.create(this);
  }

  _createClass(World, [{
    key: 'resize',
    value: function resize() {
      var canvasRatio = this.canvasRatio,
          ctx = this.ctx,
          scale = this.scale,
          cannon = this.cannon;


      canvasRatio.calcSize();
      canvasRatio.center();

      this.saveDimensions();
      this.calcSize();

      this.render = RenderRatio.create(ctx, scale);

      if ('cannon' in this) cannon.resize();
      if (this.inGame) this.setBorders();
    }
  }, {
    key: 'calcSize',
    value: function calcSize() {
      var width = this.size;
      var invRatio = this.inv_ratio;
      var renderWidth = this.renderWidth;

      this.width = width;
      this.height = width * invRatio;
      this.scale = renderWidth / width;
    }
  }, {
    key: 'saveDimensions',
    value: function saveDimensions() {
      var canvas = this.canvasRatio;

      this.renderWidth = canvas.width;
      this.renderheight = canvas.height;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.inGame = false;

      this.movers = [1];
      this.statics = [1];
      this.gravities = [1];
      this.borders = [1];

      this.resize();

      this.shaking = false;
      this.shakeStrength = 0;
      this.shakeCount = 0;
      this.shakePeriod = 0;

      this.offset = Vector.create();

      this.referenceFrame = 0;
      this.score = 0;
      this.scoreQueue = 0;
      this.scoreInc = 0;
      this.moversHit = 0;

      this.setBorders();
    }
  }, {
    key: 'init',
    value: function init() {
      this.reset();
      this.setBorders();

      this.inGame = true;
    }
  }, {
    key: 'setCannon',
    value: function setCannon(firstColor, strokeColor, secondColor, percentX, percentY, baseRadius, barrelWidth, barrelHeight, projectile) {
      var base = Cannon.base.create(this, percentX, percentY, baseRadius, barrelWidth, barrelHeight);
      var cannon = Cannon.create(this, firstColor, strokeColor, secondColor, base, projectile);

      this.cannon = cannon;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(size, pos, width, color) {
      var target = Target.create(this, size, pos, width, color);

      this.target = target;
    }
  }, {
    key: 'setBorders',
    value: function setBorders() {
      this.borders = [1];

      var width = this.width,
          height = this.height;

      var THREE_WIDTH = 3 * width;
      var THREE_HEIGHT = 3 * height;

      var points = [Vector.create(), Vector.create(THREE_WIDTH), Vector.create(THREE_WIDTH, THREE_HEIGHT), Vector.create(0, THREE_HEIGHT)];

      var type = 'border';

      var pos1 = Vector.create(width * 0.5, -height * 1.5);
      var pos2 = Vector.create(width * 2.5, height * 0.5);
      var pos3 = Vector.create(width * 0.5, height * 2.5);
      var pos4 = Vector.create(-width * 1.5, height * 0.5);

      var poly1 = Polygon.create(pos1, cloneVectorArray(points), 1, 1);
      var poly2 = Polygon.create(pos2, cloneVectorArray(points), 1, 1);
      var poly3 = Polygon.create(pos3, cloneVectorArray(points), 1, 1);
      var poly4 = Polygon.create(pos4, cloneVectorArray(points), 1, 1);

      var borders = [[type, Body.create(poly1)], [type, Body.create(poly2)], [type, Body.create(poly3)], [type, Body.create(poly4)]];

      this.add(borders);
    }
  }, {
    key: 'add',
    value: function add(bodies) {
      for (var i = 0; i < bodies.length; i++) {
        var arr = bodies[i];

        var type = arr[0];
        var body = arr[1];
        var def = arr[2];

        var name = firstCharUpperCase(type);
        var func = 'add'.concat(name);

        this[func](body, def);
      }
    }
  }, {
    key: 'addMover',
    value: function addMover(body, def) {
      body.applyDef(def);

      var movers = this.movers;


      movers.push(body);
      movers[0] = movers.length;
    }
  }, {
    key: 'addStatic',
    value: function addStatic(body, def) {
      body.applyDef(def);

      var statics = this.statics;


      statics.push(body);
      statics[0] = statics.length;
    }
  }, {
    key: 'addGravity',
    value: function addGravity(body, def) {
      body.applyDef(def);

      var gravities = this.gravities;


      gravities.push(body);
      gravities[0] = gravities.length;
    }
  }, {
    key: 'addBorder',
    value: function addBorder(body, def) {
      body.applyDef(def);

      var borders = this.borders;


      borders.push(body);
      borders[0] = borders.length;
    }
  }, {
    key: 'remove',
    value: function remove(indexes) {
      for (var i = 0; i < indexes.length; i++) {
        var arr = indexes[i];

        var type = arr[0];
        var index = arr[1];

        var name = firstCharUpperCase(type);
        var func = 'remove'.concat(name);

        this[func](index);
      }
    }
  }, {
    key: 'removeMover',
    value: function removeMover(index) {
      var movers = this.movers;


      movers.splice(index, 1);
      movers[0] = movers.length;
    }
  }, {
    key: 'removeStatic',
    value: function removeStatic(index) {
      var statics = this.statics;


      statics.splice(index, 1);
      statics[0] = statics.length;
    }
  }, {
    key: 'removeGravity',
    value: function removeGravity(index) {
      var gravities = this.gravities;


      gravities.splice(index, 1);
      gravities[0] = gravities.length;
    }
  }, {
    key: 'removeBorder',
    value: function removeBorder(index) {
      var borders = this.borders;


      borders.splice(index, 1);
      borders[0] = borders.length;
    }
  }, {
    key: 'shake',
    value: function shake() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.3;
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var period = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

      this.shaking = true;
      this.shakeStrength = strength;
      this.shakeCount = count;
      this.shakePeriod = period;

      this.offset.reset();
    }
  }, {
    key: 'stopShaking',
    value: function stopShaking() {
      this.shaking = false;
      this.shakeStrength = 0;
      this.shakeCount = 0;
      this.shakePeriod = 0;

      this.offset.reset();
    }
  }, {
    key: 'updateShaking',
    value: function updateShaking() {
      if (this.shaking) {
        var doShake = randomInt(0, this.shakePeriod) === 0;

        if (doShake) {
          var strength = this.shakeStrength;
          var offset = Vector.randomFromBox(strength);

          this.offset = offset;
        }

        this.shakeCount--;

        if (this.shakeCount <= 0) this.stopShaking();
      }
    }
  }, {
    key: 'update',
    value: function update() {
      this.referenceFrame++;

      this.updateShaking();

      var movers = this.movers,
          gravities = this.gravities,
          statics = this.statics,
          borders = this.borders,
          manifold = this.manifold,
          cannon = this.cannon,
          target = this.target,
          SAT = this.SAT;


      manifold.reset();

      var i = void 0;
      var j = void 0;
      var len = void 0;

      len = movers[0];

      for (i = 1; i < len; i++) {
        var mover = movers[i];
        var shape = mover.shape;
        var notHitTargetYet = !movers[i].hitTarget;

        mover.update();

        var result = SAT.collision(shape, target.hitbox, manifold);
        if (result && notHitTargetYet) {
          this.addScore(582, 5);
          PlaySound('hitTarget');

          mover.shrink();
          mover.hitTarget = true;
          mover.vel.scale(0.5);

          this.moversHit++;
        }

        var _len = void 0;

        if (notHitTargetYet) {
          _len = gravities[0];
          for (j = 1; j < _len; j++) {
            var gravity = gravities[j];
            var attraction = calculateAttraction(gravity.shape, shape);

            mover.applyForce(attraction);
          }

          _len = statics[0];
          for (j = 1; j < _len; j++) {
            result = SAT.solveCollision(mover, statics[j], manifold);
            if (result) break;
          }

          _len = borders[0];
          for (j = 1; j < _len; j++) {
            result = SAT.solveCollision(mover, borders[j], manifold);
            if (result) break;
          }
        }
      }

      var len2 = borders[0];

      len = statics[0];
      for (i = 1; i < len; i++) {
        var Static = statics[i];
        Static.update(true);

        for (j = 1; j < len2; j++) {
          var border = borders[j];

          SAT.solveCollision(Static, border, manifold, true);
        }
      }

      len = gravities[0];
      for (i = 1; i < len; i++) {
        var _gravity = gravities[i];
        _gravity.update(true);

        for (j = 1; j < len2; j++) {
          var _border = borders[j];

          SAT.solveCollision(_gravity, _border, manifold, true);
        }
      }

      var list = [];
      var exists = void 0;

      len2 = movers[0];
      for (i = 1; i < len2; i++) {
        exists = movers[i].exists();

        if (!exists) {
          this.addScore(-10);
          list.push(['mover', i]);
        }
      }

      len2 = statics[0];
      for (i = 1; i < len2; i++) {
        exists = statics[i].exists();

        if (!exists) {
          list.push(['static', i]);
        }
      }

      len2 = gravities[0];
      for (i = 1; i < len2; i++) {
        exists = gravities[i].exists();

        if (!exists) {
          list.push(['gravity', i]);
        }
      }

      this.remove(list);

      cannon.update();
      target.oscilate(0.04, 0.2);

      this.addScore(-1);
      this.updateScore();
    }
  }, {
    key: 'updateScore',
    value: function updateScore() {
      var scoreInc = this.scoreInc,
          scoreQueue = this.scoreQueue;


      this.addScore(scoreInc);
      this.scoreQueue--;

      if (this.scoreQueue <= 0) {
        this.scoreQueue = 0;
        this.scoreInc = 0;
      }
    }
  }, {
    key: 'addScore',
    value: function addScore(amount, period) {
      if (period) {
        this.scoreInc = Math.floor(amount / period);
        this.scoreQueue = period;
      } else {
        var score = this.score + amount;

        this.score = constrain(score, 0, Number.MAX_VALUE);
      }
    }
  }, {
    key: 'renderScene',
    value: function renderScene() {
      var cannon = this.cannon,
          target = this.target,
          statics = this.statics,
          gravities = this.gravities,
          movers = this.movers,
          offset = this.offset,
          canvasRatio = this.canvasRatio;


      canvasRatio.clearScreen();

      var i = void 0;
      var len = void 0;

      len = statics[0];
      for (i = 1; i < len; i++) {
        this.renderBody(statics[i]);
      }

      len = gravities[0];
      for (i = 1; i < len; i++) {
        this.renderBody(gravities[i]);
      }

      len = movers[0];
      for (i = 1; i < len; i++) {
        this.renderBody(movers[i]);
      }

      cannon.render({
        x: offset.x,
        y: offset.y * 0.2
      });

      target.render();
    }
  }, {
    key: 'renderBody',
    value: function renderBody(body, noOffset) {
      var offset = noOffset ? false : this.offset;

      var shape = body.shape,
          fillColor = body.fillColor,
          strokeColor = body.strokeColor,
          strokeWidth = body.strokeWidth;
      var type = shape.type,
          pos = shape.pos,
          r = shape.r;


      if (type === TYPE_POLYGON) {
        var points = shape.calcPoints;

        this.render.polygon(points, pos, r, fillColor, strokeColor, strokeWidth, offset);
        return;
      }

      this.render.circle(pos, r, fillColor, strokeColor, strokeWidth, offset);
    }
  }, {
    key: 'border',
    value: function border(width, color) {
      this.canvasRatio.border(width, color);

      this.resize();
    }
  }], [{
    key: 'create',
    value: function create(canvas, ratio, size, element) {
      return new World(canvas, ratio, size, element);
    }
  }]);

  return World;
}();

var Def = function () {
  function Def() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Def);

    this.set(options);
  }

  _createClass(Def, [{
    key: 'set',
    value: function set(options) {
      var defaults = {
        vel: Vector.create(),
        angle: 0,
        rotate: 0,
        fillColor: '#000',
        strokeColor: RGBA.random(1),
        strokeWidth: 8,
        oscilate: false,
        oscilationStrength: 0,
        minOscilatonSize: 0,
        oscilationSpeed: 0,
        restitution: 0.9,
        shrinkSpeed: 0.95,
        enemy: false,
        lifespan: false
      };

      for (var value in defaults) {
        if (value in options) {
          this[value] = options[value];
        } else {
          this[value] = defaults[value];
        }
      }

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      var clone = {};

      for (var value in this) {
        clone[value] = function (v) {
          if (v instanceof Vector) return v.clone();
          if (v instanceof RGBA) return v.copy();
          return v;
        }(this[value]);
      }

      return clone;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.set({});
      return this;
    }
  }], [{
    key: 'create',
    value: function create(options) {
      return new Def(options);
    }
  }]);

  return Def;
}();

// const Def = class {
//     constructor(options = {}) {
//         this.set(options);
//     }
//
//     static create(options) {
//         return new Def(options);
//     }
// };

var Cannon = function () {
  function Cannon(world) {
    var fillColor1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#111';
    var strokeColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#464646';
    var fillColor2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#111';
    var base = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Cannon.base.create(world);
    var proj = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

    _classCallCheck(this, Cannon);

    this.world = world;

    this.inputManager = world.inputManager;
    this.ctx = world.ctx;
    this.mouse = world.inputManager.mouse;
    this.w = world.width;

    this.projectile = {};
    this.set(proj);

    this.base = base;
    this.fireVec = Vector.create();

    this.fillColor1 = fillColor1;
    this.fillColor2 = fillColor2;
    this.strokeColor = strokeColor;
  }

  _createClass(Cannon, [{
    key: 'set',
    value: function set(definition) {
      var projectile = this.projectile;


      var defaults = {};

      defaults.speed = this.w * 0.007;

      defaults.def = Def.create({
        oscilate: true,
        oscilationStrength: 0.03,
        minOscilationSize: 0.5,
        oscilationSpeed: 10,
        restitution: 0.6,
        shrinkSpeed: 0.8,
        lifespan: 100,
        fillColor: '#111',
        strokeColor: '#111'
      });

      defaults.points = [Vector.create(0.72, 0.32), Vector.create(1.50, 0.68), Vector.create(0.72, 1.04), Vector.create(0.50, 0.68)];

      defaults.size = 1;
      defaults.firerate = 5;
      defaults.density = 1;

      for (var name in defaults) {
        if (name in definition) {
          this.projectile[name] = definition[name];
        } else {
          this.projectile[name] = defaults[name];
        }
      }
    }
  }, {
    key: 'assign',
    value: function assign(propName, value) {
      this.projectile[propName] = value;
    }
  }, {
    key: 'update',
    value: function update() {
      var world = this.world,
          mouse = this.mouse,
          projectile = this.projectile;


      var outline = world.canvasRatio;
      var frame = world.referenceFrame;

      var speed = projectile.speed,
          firerate = projectile.firerate;


      var x = mouse.x - outline.borderLeft;
      var y = mouse.y - outline.borderTop;

      var pos = Vector.create(x, y);

      this.base.head(pos, projectile.speed);

      if (this.inputManager.drag) {
        this.base.extend();

        if (frame % firerate === 0) {
          this.fire();
        }
      } else {
        this.base.unextend();
      }
    }
  }, {
    key: 'createBody',
    value: function createBody(pos) {
      var projectile = this.projectile;
      var points = projectile.points,
          density = projectile.density,
          size = projectile.size;


      var vertices = cloneVectorArray(points);

      var shape = Polygon.create(pos, vertices, density, size);

      return Body.create(shape);
    }
  }, {
    key: 'fire',
    value: function fire() {
      PlaySound('shootCannon');

      var def = this.projectile.def.clone();
      var vel = this.base.fireVec.clone();
      var pos = this.base.firePos.clone();

      var body = this.createBody(pos);

      def.vel = vel;

      this.world.addMover(body, def);
    }
  }, {
    key: 'render',
    value: function render(offset) {
      this.base.render(this.fillColor1, this.strokeColor, this.fillColor2, offset);
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.base.resize();
    }
  }], [{
    key: 'create',
    value: function create(world, f1c, s1c, f2c, base, proj) {
      return new Cannon(world, f1c, s1c, f2c, base, proj);
    }
  }]);

  return Cannon;
}();

Cannon.base = function () {
  function _class(world) {
    var percentX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
    var percentY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 99.6;
    var baseRadius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var barrelWidth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.8;
    var barrelHeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;

    _classCallCheck(this, _class);

    this.percentX = percentX * 0.01;
    this.percentY = percentY * 0.01;

    this.baseRadius = baseRadius;
    this.barrelWidth = barrelWidth;
    this.barrelHeight = barrelHeight;

    this.world = world;
    this.minSize = this.barrelHeight;
    this.maxSize = this.barrelHeight * 1.3;
    this.incSize = this.barrelHeight * 0.04;

    this.angle = -HALF_PI;
    this.prevAngle = 0;
    this.tempAngle = 0;
    this.easing = 0;
    this.easingCount = 0;
    this.prevState = 0;

    this.pos = Vector.create();
    this.firePos = Vector.create();
    this.fireVec = Vector.create();

    this.resize();
  }

  _createClass(_class, [{
    key: 'resize',
    value: function resize() {
      this.scale = this.world.render.inv_ratio;

      var x = this.percentX * this.world.width;
      var y = this.percentY * this.world.height;

      this.pos.set(x, y);
      this.firePos.reset();
      this.fireVec.reset();
    }
  }, {
    key: 'extend',
    value: function extend() {
      if (this.barrelHeight < this.maxSize) {
        this.barrelHeight += this.incSize;
      } else {
        this.barrelHeight = this.maxSize;
      }
    }
  }, {
    key: 'unextend',
    value: function unextend() {
      if (this.barrelHeight > this.minSize) {
        this.barrelHeight -= this.incSize;
      } else {
        this.barrelHeight = this.minSize;
      }
    }
  }, {
    key: 'head',
    value: function head(pos, speed) {
      this.fireVec.copy(pos).scale(this.scale);
      this.fireVec.sub(this.pos).setMag(speed);

      var angle = this.fireVec.getAngle();
      if (angle < 0) angle += TWO_PI;

      // check if mouse crossed the bottom
      if (angle < HALF_PI) {
        if (this.prevState === 2) {
          // mouse did cross so ease the transition
          this.easingCount = 12;
          this.easing = PI / 12;
        }

        angle = 0;

        // update the previous state so the angle
        // does not get updated more than once
        this.prevState = 1;
      } else if (angle < PI && angle > HALF_PI) {
        if (this.prevState === 1) {
          // mouse did cross so ease the transition
          this.easingCount = 12;
          this.easing = -PI / 12;
        }

        angle = PI;

        // update the previous state so the angle
        // does not get updated more than once
        this.prevState = 2;
      } else {
        // mouse didn't cross so reset the state
        this.prevState = 0;
      }

      this.prevAngle = this.angle;
      this.tempAngle = angle;

      this.smooth();
    }
  }, {
    key: 'smooth',
    value: function smooth() {
      var diff = this.tempAngle - this.prevAngle;
      var absDiff = abs(diff);

      if (this.easingCount) {
        this.easingCount--;
        this.angle += this.easing;

        if (this.easingCount < 1) {
          this.easingCount = 0;
        }
      } else if (VERSION_PHONE && absDiff > 0.01 && !this.prevState) {
        this.easing = diff * 0.2;
        this.easingCount = 5;
      } else {
        this.angle = this.tempAngle;
      }

      this.firePos.set(this.barrelHeight);
      this.firePos.rotate(this.angle).add(this.pos);
    }
  }, {
    key: 'render',
    value: function render(fillColor1, strokeColor, fillColor2, offset) {
      var pos = this.pos,
          baseRadius = this.baseRadius,
          barrelWidth = this.barrelWidth,
          barrelHeight = this.barrelHeight,
          angle = this.angle,
          world = this.world;


      world.render.box(pos, barrelWidth, barrelHeight, angle, fillColor1, 'rgba(0, 0, 0, 0)', 1, offset);
      world.render.circle(pos, baseRadius, fillColor2, strokeColor, 0.1, offset);
    }
  }], [{
    key: 'create',
    value: function create(w, px, py, br, bw, bh) {
      return new Cannon.base(w, px, py, br, bw, bh);
    }
  }]);

  return _class;
}();

var Target = function () {
  function Target(world) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SIDE_TOP;
    var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : world.width * 0.5;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : world.width * 0.3;
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : RGBA.random(1);

    _classCallCheck(this, Target);

    this.world = world;

    this.set(side, pos, width);

    this.color = color;
    this.oscilationCount = 0;

    this.TVECS = [Vector.create(), Vector.create(), Vector.create(), Vector.create()];
  }

  _createClass(Target, [{
    key: 'set',
    value: function set(side, pos, width) {
      this.side = side;
      this.pos = pos;

      this.width = width;
      this.originalWidth = width;

      this.hitbox = null;
      this.calc();
    }
  }, {
    key: 'calc',
    value: function calc() {
      var points = [Vector.create(0, 0), Vector.create(1, 0), Vector.create(1, 1), Vector.create(0, 1)];

      var world = this.world,
          pos = this.pos,
          width = this.width,
          side = this.side;


      var halfWidth = width * 0.47;

      var position = function () {
        switch (side) {
          case SIDE_LEFT:
            return Vector.create(-halfWidth, pos);

          case SIDE_TOP:
            return Vector.create(pos, -halfWidth);

          case SIDE_RIGHT:
            return Vector.create(world.width + halfWidth, pos);

          case SIDE_BOTTOM:
            return Vector.create(pos, world.height + halfWidth);
        }
      }();

      this.hitbox = Polygon.create(position, points, 1, width);
    }
  }, {
    key: 'change',
    value: function change(prop, value) {
      this[prop] = value;
      this.calc();
    }
  }, {
    key: 'oscilate',
    value: function oscilate(speed) {
      var strength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.oscilationCount += speed;

      var count = this.oscilationCount;
      var width = this.originalWidth;
      var theta = count + width;
      var cos = Math.cos(theta);

      var size = abs(cos * strength + width);
      this.change('width', size);
    }
  }, {
    key: 'move',
    value: function move(amount) {
      var pos = this.pos + amount;
      this.change('pos', pos);
    }
  }, {
    key: 'render',
    value: function render() {
      var calcPoints = this.hitbox.calcPoints;
      var points = copyVectorArray(calcPoints, this.TVECS, 4);
      var ctx = this.world.ctx;
      var color = this.color.get();
      var world = this.world;
      var scale = world.scale;

      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 100 * world.ratio;

      for (var i = 0; i < 4; i++) {
        points[i].scale(scale);
      }

      var point = points[0];

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);

      for (var _i = 0; _i < 4; _i++) {
        point = points[_i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }], [{
    key: 'create',
    value: function create(w, s, p, W, c) {
      return new Target(w, s, p, W, c);
    }
  }]);

  return Target;
}();

var Timer = function () {
  function Timer() {
    _classCallCheck(this, Timer);

    this.restart();
  }

  _createClass(Timer, [{
    key: 'restart',
    value: function restart() {
      this.startTime = Date.now();
      this.savedTime = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }
  }, {
    key: 'timePassed',
    value: function timePassed() {
      var time = Date.now();
      var diff = time - this.startTime;

      return diff;
    }
  }, {
    key: 'update',
    value: function update() {
      var diff = this.timePassed();

      var seconds = diff * 0.001;
      var minutes = seconds / 60;
      var hours = minutes / 60;

      seconds = Math.floor(seconds % 60);
      minutes = Math.floor(minutes % 60);
      hours = Math.floor(hours % 100);

      this.seconds = formatString(seconds, '0', 2);
      this.minutes = formatString(minutes, '0', 2);
      this.hours = formatString(hours, '0', 2);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.savedTime = this.timePassed();
    }
  }, {
    key: 'start',
    value: function start() {
      this.startTime += this.timePassed() - this.savedTime;
    }
  }, {
    key: 'hasHours',
    value: function hasHours() {
      return this.hours !== '00';
    }
  }, {
    key: 'get',
    value: function get() {
      this.update();

      var hours = this.hours,
          minutes = this.minutes,
          seconds = this.seconds;


      if (this.hasHours()) {
        return hours + ':' + minutes + ':' + seconds;
      }

      return minutes + ':' + seconds;
    }
  }], [{
    key: 'create',
    value: function create() {
      return new Timer();
    }
  }]);

  return Timer;
}();

var GameManager = function () {
  function GameManager() {
    var _this2 = this;

    _classCallCheck(this, GameManager);

    this.ratio = 12 / 17;
    this.size = 26;

    this.canvas = document.getElementById('game-canvas');
    this.info = document.getElementById('info');
    this.stats = document.getElementById('stats');
    this.screen = document.getElementById('game-screen');
    this.pause = document.getElementById('pause');
    this.coinImage = document.getElementById('coins-svg');
    this.closePause = document.getElementById('close-pause');
    this.continueBtn = document.getElementById('pause-button--continue');
    this.restartBtn = document.getElementById('pause-button--restart');

    var main = document.getElementById('simulation-container');
    var score = document.getElementById('score');
    var coinImage = document.getElementById('coins-image');
    var stats = document.getElementById('stats');
    var pause = document.getElementById('pause-screen');

    this.container = { main: main, score: score, coinImage: coinImage, stats: stats, pause: pause };

    var scoreText = document.getElementById('score-value');
    var coinsText = document.getElementById('coins-value');
    var timerText = document.getElementById('timer-value');
    var hitTargetText = document.getElementById('targets-hit-value');

    this.text = {
      score: new Text(scoreText, '0'),
      coins: new Text(coinsText, '10'),
      timer: new Text(timerText, '00:00'),
      hitTarget: new Text(hitTargetText, '70 | 500')
    };

    this.paused = false;

    var handlePauseClick = function handlePauseClick(e) {
      return window.setTimeout(function () {
        _this2.paused = true;
        _this2.timer.stop();
      }, 120);
    };

    this.pause.addEventListener('mousedown', handlePauseClick);
    this.pause.addEventListener('touchstart', handlePauseClick);

    var handleClosePause = function handleClosePause(e) {
      return window.setTimeout(function () {
        _this2.paused = false;
        _this2.timer.start();
      }, 80);
    };

    this.closePause.addEventListener('mousedown', handleClosePause);
    this.closePause.addEventListener('touchstart', handleClosePause);
    this.continueBtn.addEventListener('mousedown', handleClosePause);
    this.continueBtn.addEventListener('touchstart', handleClosePause);

    var handleRestartGame = function handleRestartGame(e) {
      return window.setTimeout(function () {
        handleClosePause();
        _this2.restart();
      }, 90);
    };

    this.restartBtn.addEventListener('mousedown', handleRestartGame);
    this.restartBtn.addEventListener('touchstart', handleRestartGame);

    var canvas = this.canvas,
        ratio = this.ratio,
        size = this.size,
        screen = this.screen;


    this.world = World.create(canvas, ratio, size, screen);
    this.world.init();

    this.timer = Timer.create();
    this.timer.restart();
  }

  _createClass(GameManager, [{
    key: 'restart',
    value: function restart() {
      this.world.reset();
      this.timer.restart();

      this.world.init();

      var world = this.world;
      var width = world.width,
          height = world.height;

      var halfWidth = width * 0.5;
      var halfHeight = height * 0.5;

      {
        var pos = Vector.create(halfWidth, halfHeight);
        var circle = Circle.create(pos, 1.5, 0.5);
        var body = Body.create(circle);
        var def = Def.create({
          oscilate: true,
          oscilationStrength: 0.05,
          minOscilationSize: 0.5,
          oscilationSpeed: 10,
          rotate: 1,
          vel: Vector.create(_random(-0.1, 0.1), _random(-0.2, 0.2))
        });

        world.addGravity(body, def);
      }

      {
        var amount = 10;

        for (var i = 0; i < amount; i++) {
          var _pos = Vector.randomFromBox(width / 3, height / 3).add(Vector.create(halfWidth, halfHeight));

          var _def = Def.create({
            oscilate: true,
            oscilationStrength: 0.05,
            minOscilationSize: 0.5,
            oscilationSpeed: 10,
            angle: _random(0, TWO_PI),
            rotate: _random(-0.05, 0.05),
            vel: Vector.create(_random(-0.1, 0.1), _random(-0.1, 0.1))
          });
          var sides = randomInt(3, 8);

          var poly = RegularPolygon.create(_pos, sides, 1, 2);
          var _body = Body.create(poly);

          world.addStatic(_body, _def);
        }
      }

      world.shake(0.7, 105);

      this.resize();
    }
  }, {
    key: 'resize',
    value: function resize() {
      var canvas = this.canvas,
          container = this.container,
          world = this.world,
          info = this.info,
          pause = this.pause,
          coinImage = this.coinImage;


      world.resize();

      var canvasBounds = canvas.getBoundingClientRect();
      var containerBounds = container.main.getBoundingClientRect();

      var ratio = world.canvasRatio;

      var height = canvasBounds.top - containerBounds.top;
      var width = canvasBounds.right - containerBounds.left;
      var screenHeight = containerBounds.bottom - containerBounds.top;

      height = constrain(height, 0, screenHeight * 0.13);

      var fullWidth = containerBounds.right - containerBounds.left;
      var infoLeft = (fullWidth - width) / 2;

      info.style.left = infoLeft + 'px';
      info.style.height = height + 'px';
      info.style.width = width + 'px';

      var pauseHeight = height * 0.7;

      pause.style.height = pauseHeight + 'px';
      pause.style.width = pauseHeight + 'px';

      var score = container.score;
      var scoreLeft = width * 0.04 + pauseHeight;

      score.style.left = scoreLeft + 'px';

      var coin = container.coinImage;
      var radius = height * 0.1;
      var radiusWidth = radius * 0.25;
      var coinLeft = width - 3 * radius;

      coinImage.setAttribute('r', radius);
      coinImage.setAttribute('stroke-width', radiusWidth);

      coin.style.marginLeft = coinLeft + 'px';

      var coinText = this.text.coins.element;
      var coinTextRight = radius * 4.7;

      coinText.style.right = coinTextRight + 'px';

      var stats = container.stats;

      height = containerBounds.bottom - canvasBounds.bottom;

      stats.style.left = infoLeft + 'px';
      stats.style.width = width + 'px';
      stats.style.height = height + 'px';
    }
  }, {
    key: 'update',
    value: function update() {
      var container = this.container,
          canvas = this.canvas;
      var pause = container.pause;

      var ctx = this.world.ctx;

      if (this.paused) {
        canvas.style.opacity = '0.2';

        window.setTimeout(function () {
          pause.style.opacity = '.7';
        }, 80);

        pause.style.display = 'block';

        return;
      }

      this.world.renderScene();

      if (canvas.style.opacity !== '1' || pause.style.opacity !== '0' || pause.style.display !== 'none') {
        pause.style.opacity = '0';

        window.setTimeout(function () {
          canvas.style.opacity = '1';
        }, 80);

        window.setTimeout(function () {
          pause.style.display = 'none';
        }, 200);
      }

      this.world.update();

      var _text = this.text,
          score = _text.score,
          timer = _text.timer,
          hitTarget = _text.hitTarget;


      var targetToHit = 500;
      var moversHit = constrain(this.world.moversHit, 0, targetToHit);

      var hitText = '' + moversHit;
      if (hitText.length === 1) {
        hitText = _SPACE.concat(hitText);
      }

      score.text('' + this.world.score);
      timer.text('' + this.timer.get());
      hitTarget.text(hitText + ' / ' + targetToHit);
    }
  }]);

  return GameManager;
}();

var Caption = function () {
  function Caption(ctx, text, pos, size) {
    _classCallCheck(this, Caption);

    this.ctx = ctx;
    this.text = text;
    this.pos = pos;
    this.size = size;
    this.vel = Vector.create();
    this.color = new RGBA(255, 255, 255);
  }

  _createClass(Caption, [{
    key: 'update',
    value: function update() {
      this.pos.add(this.vel);
      this.render();
      this.fade(0.85);
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.color.exists();
    }
  }, {
    key: 'float',
    value: function float(vel) {
      this.vel = vel;
    }
  }, {
    key: 'fade',
    value: function fade(n) {
      this.color.fade(n);
    }
  }, {
    key: 'render',
    value: function render() {
      var ctx = this.ctx,
          color = this.color,
          pos = this.pos,
          text = this.text,
          size = this.size;


      ctx.save();
      ctx.font = size + 'px \'Function Regular\'';
      ctx.fillStyle = color.get();
      ctx.fillText(text, pos.x, pos.y);
      ctx.restore();
    }
  }]);

  return Caption;
}();

var PI = Math.PI;
var TWO_PI = 2 * PI;
var HALF_PI = PI * 0.5;

var abs = Math.abs;
var AG = 0.00367408;

var TYPE_BOX = 0;
var TYPE_CIRCLE = 1;
var TYPE_POLYGON = 2;

var SIDE_LEFT = 0;
var SIDE_TOP = 1;
var SIDE_RIGHT = 2;
var SIDE_BOTTOM = 3;

var _SPACE = '\xA0';

var VERSION_PHONE = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}();
/**
 * Class representing a point in the cartesian plane
 * @class Vector
 * @classdesc Creates a new Vector Object
 */

var Vector = function () {
  /**
   * Creates a new Vector
   * @param {x=} x The x coordinate
   * @param {y=} y The y coordinate
   */
  function Vector() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector);

    /**
     * The x coordinate of the Vector
     * @name Vector#x
     * @type {number}
     * @default 0
     * @instance
     */
    this.x = x;
    /**
     * The y coordinate of the Vector
     * @name Vector#y
     * @type {number}
     * @default 0
     * @instance
     */
    this.y = y;
  }

  /**
   * Sets the position of the Vector
   * @param {number=} x The x coordinate
   * @param {number=} y The y coordinate
   * @returns {Vector} This is for chaining
   */


  _createClass(Vector, [{
    key: 'set',
    value: function set() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      this.x = x;
      this.y = y;
      return this;
    }

    /**
     * Resets the Vectors x and y values
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.x = 0;
      this.y = 0;
      return this;
    }

    /**
     * Gets the angle of the Vector
     * @returns {number} The calculated angle
     */

  }, {
    key: 'getAngle',
    value: function getAngle() {
      return Math.atan2(this.y, this.x);
    }

    /**
     * Adds the values of the Vector to another
     * @param {Vector} other The other Vector to add too
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'add',
    value: function add(other) {
      this.x += other.x;
      this.y += other.y;
      return this;
    }

    /**
     * Subtracts the values of the Vector from another
     * @param {Vector} other The other Vector to subtract from
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'sub',
    value: function sub(other) {
      this.x -= other.x;
      this.y -= other.y;
      return this;
    }

    /**
     * Scales the vector by a given amount
     * @param {number} x The x amount to scale by
     * @param {number=} y The y amount to scale by
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'scale',
    value: function scale(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

      this.x *= x;
      this.y *= y;
      return this;
    }

    /**
     * Copies the values of another Vector into this one
     * @param {Vector} other The Vector to copy
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'copy',
    value: function copy(other) {
      this.x = other.x;
      this.y = other.y;
      return this;
    }

    /**
     * Gives a new Vector with the same properties
     * Used to avoid Object references and allows for deep clones
     * @returns {Vector} The clones Vector
     */

  }, {
    key: 'clone',
    value: function clone() {
      return Vector.create(this.x, this.y);
    }

    /**
     * Turns the Vector 90 degrees clockwise
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'perp',
    value: function perp() {
      var x = this.x;
      this.x = this.y;
      this.y = -x;
      return this;
    }

    /**
     * Rotates the Vector by a given amount
     * @param {number} angle The angle to rotate by in radians
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'rotate',
    value: function rotate(angle) {
      // clone values of this Vector
      var x = this.x;
      var y = this.y;

      // get sin and cosin of angle
      var c = Math.cos(angle);
      var s = Math.sin(angle);

      // use rotational transform to rotate
      this.x = x * c - y * s;
      this.y = x * s + y * c;

      return this;
    }

    /**
     * Flips the Vector 180 degrees
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reverse',
    value: function reverse() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }

    /**
     * Sets the Vectors magnitude to one
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'normalize',
    value: function normalize() {
      // Get magnitude
      var dist = this.len();

      if (dist > 0) {
        // Divide by magnitude to get length equal to one
        this.x /= dist;
        this.y /= dist;
      }

      return this;
    }

    /**
     * Projects the Vector onto another
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'project',
    value: function project(other) {
      var a = this.dot(other) / other.len2();

      this.x = a * other.x;
      this.y = a * other.y;
      return this;
    }

    /**
     * Projects the Vector onto a normalized Vector
     * A bit more efficient
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'projectN',
    value: function projectN(other) {
      var a = this.dot(other);

      this.x = a * other.x;
      this.y = a * other.y;
      return this;
    }

    /**
     * Reflects the Vector along a given axis
     * @param {Vector} axis The axis to reflect on
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reflect',
    value: function reflect(axis) {
      var x = this.x;
      var y = this.y;

      this.project(axis).scale(2);
      this.x -= x;
      this.y -= y;
      return this;
    }

    /**
     * Reflects the Vector along a normalized axis
     * @param {Vector} axis The axis to reflect on
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reflectN',
    value: function reflectN(axis) {
      var x = this.x;
      var y = this.y;

      this.projectN(axis).scale(2);
      this.x -= x;
      this.y -= y;
      return this;
    }

    /**
     * Returns the distance multiplied by the other Vectors
     * Length when projected onto another Vector
     * @param {Vector} other The Vector to dot against
     * @returns {number} The dot product
     */

  }, {
    key: 'dot',
    value: function dot(other) {
      return this.x * other.x + this.y * other.y;
    }

    /**
     * Gets the length squared of the Vector
     * @returns {number} The length Squared
     */

  }, {
    key: 'len2',
    value: function len2() {
      return this.dot(this);
    }

    /**
     * Gets the magnitude of the Vector
     * @returns {number} The magnitude of the Vector
     */

  }, {
    key: 'len',
    value: function len() {
      return Math.sqrt(this.len2());
    }

    /**
     * Crosses the Vector onto another
     * Can be visualized as the area of the Parrallelogram formed
     * By the two Vectors combined around coordinate (0, 0)
     * @param {Vector} other The other Vector to be crossed against
     * @returns {number} The cross product
     */

  }, {
    key: 'cross',
    value: function cross(other) {
      return this.x * other.y - this.y * other.x;
    }

    /**
     * Sets the magnitude of the Vector to the given value
     * @param {number} mag The resulting magnitude
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'setMag',
    value: function setMag(mag) {
      // get the magnitude
      var dist = this.len();

      // only if magnitude is non zero
      if (dist > 0) {
        // get the scalar
        var s = mag / dist;

        // scale coordinates
        this.x *= s;
        this.y *= s;
      }
      return this;
    }

    /**
     * Creates a new Vector without having to use the 'new' keyword
     * @param {number} x The x coordinate
     * @param {number} y The y coordinate
     * @static
     */

  }], [{
    key: 'create',
    value: function create(x, y) {
      return new Vector(x, y);
    }

    /**
     * Creates a random Vector uniform withing the unit circle
     * @returns {Vector} The random Vector
     * @static
     */

  }, {
    key: 'random',
    value: function random() {
      // get a random angle
      var angle = _random(0, TWO_PI);

      // convert to cartesian
      var x = Math.cos(angle);
      var y = Math.sin(angle);

      // return calculated Vector
      return Vector.create(x, y);
    }

    /**
     * Creates a new Vector randomly given two angular bounds
     * @param {number} startAngle The minimum angle
     * @param {number} endAngle The maximum angle
     * @returns {Vector} The random Vector
     * @static
     */

  }, {
    key: 'randomFromAngles',
    value: function randomFromAngles(startAngle, endAngle) {
      // get the random angle
      var angle = _random(startAngle, endAngle);

      // convert to cartesian coordinates
      var x = Math.cos(angle);
      var y = Math.sin(angle);

      // return the calculated Vector
      return Vector.create(x, y);
    }

    /**
     * Creates a new Vector sampled uniformly from the given box
     * @param {number} w The width of the box to be sampled from
     * @param {number=} h The height of the box to be sampled from
     * @returns {Vector} The random Vector
     * @static
     */

  }, {
    key: 'randomFromBox',
    value: function randomFromBox(w) {
      var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;

      // get random coordinates
      var x = _random(-w, w);
      var y = _random(-h, h);

      // return calculated Vector
      return Vector.create(x, y);
    }
  }]);

  return Vector;
}();
/**
 * Class representing the bounding box, AABB of a Polygon, Circle or Body
 * @class Box
 * @classdesc Used for efficient collision detection
 */


var Box = function () {
  /**
   * Creates a Box
   * @param {Vector} min The upper left constraint
   * @param {Vector} max The lower right constraint
   */
  function Box(min, max) {
    _classCallCheck(this, Box);

    /**
     * The minimum bound
     * @name Box#min
     * @type {Vector}
     * @instance
     */
    this.min = min;
    /**
     * The maximum bound
     * @name Box#max
     * @type {Vector}
     * @instance
     */
    this.max = max;
  }

  /**
   * Converts the Box to a polygon
   * @param {number=} density The resulting density of the returned polygon
   * @return {Polygon} The resulting calculated polygon
   */


  _createClass(Box, [{
    key: 'toPolygon',
    value: function toPolygon() {
      var density = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      // The difference between the maximum
      // and minimum bounds of the object
      var diff = this.max.clone().sub(this.min);

      // The size of the resulting polygon
      // Given as the x value of the difference So that the
      // Resulting polygon will have a dynamic size
      var size = diff.x;

      // Scale the difference down so that the points
      // Can be made with the propper size
      diff.scale(1 / size);

      // Set the points of the resulting polygon
      // Order is (Upper left, Upper right, Down right, Down left)
      var points = [Vector.create(), Vector.create(diff.x), Vector.create(diff.x, diff.y), Vector.create(0, diff.y)];

      // Clone the minimum which will be the center of the new Polygon
      // Avoids having a read-only value that changes the original minimum
      var min = this.min.clone();

      // Return the new Polygon with all the properties
      return Polygon.create(min, points, density, size);
    }

    /**
     * Creates a new Box without having to use the 'new' keyword
     * @param {Vector} min - The upper left constraint
     * @param {Vector} max - The lower right constraint
     * @returns {Box} The new instanceof Box
     * @static
     */

  }], [{
    key: 'create',
    value: function create(min, max) {
      return new Box(min, max);
    }
  }]);

  return Box;
}();
/**
 * Class representing the Circle object, used in the game
 * @class Circle
 * @classdesc Creates a new circle with dynamic properties
 */


var Circle = function () {
  /**
   * Creates a new Circle
   * @param {Vector} pos The position of the circle
   * @param {number} r The radius of the circle
   * @param {number=} density The density of the circle
   */
  function Circle(pos, r) {
    var density = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, Circle);

    /**
     * The center of the Circle
     * @name Circle#pos
     * @type {Vector}
     * @instance
     */
    this.pos = pos;
    /**
     * The radius of the circle
     * @name Circle#r
     * @type {number}
     * @instance
     */
    this.r = r;
    /**
     * The density of the Circle
     * @name Circle#density
     * @type {number}
     * @instance
     */
    this.density = density;

    /**
     * States that the Object is a Circle, used instead of 'instanceof'
     * @name Circle#type
     * @type {number}
     * @default 1
     * @instance
     */
    this.type = TYPE_CIRCLE;

    // Recalc all of the properties
    this.recalc();
  }

  /**
   * Recalcs the Circle
   */


  _createClass(Circle, [{
    key: 'recalc',
    value: function recalc() {
      // Recalc mass and AABB
      this.calcMass();
      this.calcAABB();
    }

    /**
     * Calculates the mass of the Circle
     */

  }, {
    key: 'calcMass',
    value: function calcMass() {
      var r = this.r;

      // get radius squared
      var rSq = Math.pow(r, 2);

      // get mass by PI r^2 multiplied by density
      var mass = PI * rSq * this.density;

      /**
       * The mass of the circle
       * @name Circle#mass
       * @type {number}
       * @instance
       */
      this.mass = mass;
      /**
       * The inverse mass of the circle, stored so less calculations take place
       * @name Circle#invMass
       * @type {number}
       * @instance
       */
      this.invMass = 1 / mass;
    }

    /**
     * Calculates the density of the Circle
     * @param {number} density The density of the Circle
     */

  }, {
    key: 'setDensity',
    value: function setDensity(density) {
      // set the new density
      this.density = density;

      // recalc the mass
      this.calcMass();
    }

    /**
     * Adds to the radius of the Circle
     * @param {number} amount The amount to add to the radius
     */

  }, {
    key: 'addSize',
    value: function addSize(amount) {
      // increase the radius then recalc
      this.r += amount;
      this.recalc();
    }

    /**
     * Sets the size of the Circle
     * @param {number} r The new radius of the circle
     */

  }, {
    key: 'setSize',
    value: function setSize(r) {
      // set the new radius then recalc
      this.r = r;
      this.recalc();
    }

    /**
     * Scales the radius of the Circle
     * @param {number} sc The scalar to scale up by
     */

  }, {
    key: 'scale',
    value: function scale(sc) {
      // scale the radius then recalc
      this.r *= sc;
      this.recalc();
    }

    /**
     * Sets the position of the circle
     * @param {Vector} pos The new position of the Circle
     */

  }, {
    key: 'setPosition',
    value: function setPosition(pos) {
      // set the position then recalc the AABB
      this.pos = pos;
      this.calcAABB();
    }

    /**
     * Moves the Circle by a certain amount
     * @param {Vector} vec The vector to move by
     */

  }, {
    key: 'move',
    value: function move(vec) {
      // add the vel/vec to the position then recalc AABB
      this.pos.add(vec);
      this.calcAABB();
    }

    /**
     * Recalcs the AABB of the Circle
     */

  }, {
    key: 'calcAABB',
    value: function calcAABB() {
      // Shorthand properties
      var pos = this.pos;
      var r = this.r;

      // calculate min and max of new AABB
      var min = pos.clone().sub(r, r);
      var max = pos.clone().add(r, r);

      /**
       * The AABB of the Circle
       * @name Circle#AABB
       * @type {Box}
       * @instance
       */
      this.AABB = Box.create(min, max);
    }

    /**
     * Creates a new Circle without having to use the 'new' keyword
     * @param {Vector} pos The position of the circle
     * @param {number} r The radius of the circle
     * @param {number} density The density of the circle
     * @returns {Circle} The new Circle
     * @static
     */

  }], [{
    key: 'create',
    value: function create(pos, r, density) {
      return new Circle(pos, r, density);
    }
  }]);

  return Circle;
}();
/**
 * Class representing the Polygon object, used in the game
 * @class Polygon
 * @classdesc Creates a new polygon with dynamic properties
 */


var Polygon = function () {
  /**
   * Creates a new Polygon
   * @param {Vector} pos The position of the Polygon
   * @param {Vector[]} points The points for the polygon
   * @param {number=} density The density of the circle
   * @param {number=} size The size of the Polygon
   * @param {number=} angle The initial angle of the Polygon
   */
  function Polygon(pos, points) {
    var density = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var angle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    _classCallCheck(this, Polygon);

    /**
     * The center of the Polygon, initialized as the position
     * @name Polygon#pos
     * @type {Vector}
     * @instance
     */
    this.pos = pos;
    /**
     * The angle of the Polygon measured in radians
     * @name Polygon#angle
     * @type {number}
     * @default 0
     * @instance
     */
    this.angle = 0;
    /**
     * The size of the Polygon / How big it is
     * @name Polygon#size
     * @type {number}
     * @default 1
     * @instance
     */
    this.size = size;
    /**
     * The density of the Polygon
     * @name Polygon#density
     * @type {number}
     * @default 1
     * @instance
     */
    this.density = density;
    /**
     * The type of the Polygon, always equals to the constant
     * @name Polygon#type
     * @type {number}
     * @instance
     * @final
     */
    this.type = TYPE_POLYGON;

    // set the points
    this.setPoints(points);

    // if an angle was inputted then rotate
    if (angle) this.rotate(angle);
  }

  /**
   * Calculates the mass of the Polygon
   */


  _createClass(Polygon, [{
    key: 'calcMass',
    value: function calcMass() {
      // set shorthand variables
      var density = this.density;
      var points = this.calcPoints;
      var len = points.length;

      // Set temporary variables
      var area = 0;
      var point = void 0;
      var next = void 0;
      var sum = void 0;

      // loop through all the points
      for (var i = 0; i < len; i++) {
        point = points[i];
        next = i === len - 1 ? points[0] : points[i + 1];

        // get the area of the region and add it to the total
        sum = point.cross(next);
        area += sum;
      }

      area *= 0.5;
      this.area = area;

      // get mass
      var mass = area * density;

      // set mass properties

      /**
       * The mass of the Polygon
       * @name Polygon#mass
       * @type {number}
       * @instance
       */
      this.mass = mass;
      /**
       * The inverse mass of the Polygon (1 / mass)
       * @name Polygon#invMass
       * @type {number}
       * @instance
       */
      this.invMass = 1 / mass;
    }

    /**
     * Gets the center of the polygon
     * @param {number} area The current area of the Polygon
     * @returns {Vector} the center of the Polygon
     */

  }, {
    key: 'getCenter',
    value: function getCenter(area) {
      // set the scalar which will scale each point
      var scalar = 1 / (6 * area);

      var points = this.calcPoints;
      var len = points.length;

      var center = Vector.create();
      var point = void 0;
      var next = void 0;
      var scal = void 0;

      // loop through all the points
      for (var i = 0; i < len; i++) {
        point = points[i];
        next = i === len - 1 ? points[0] : points[i + 1];

        // get the scalar
        scal = point.cross(next);

        // move the center
        center.x += (point.x + next.x) * scal;
        center.y += (point.y + next.y) * scal;
      }

      center.scale(scalar);

      // return the calculated center
      return center;
    }

    /**
     * Sets the density of the Polygon
     * @param {number} density The density of the Polygon
     */

  }, {
    key: 'setDensity',
    value: function setDensity(density) {
      // set the new density and recalc mass
      this.density = density;
      this.calcMass();
    }

    /**
     * Sets the points of the Polygon
     * @param {Vector[]} points The new points of the Polygon
     */

  }, {
    key: 'setPoints',
    value: function setPoints(points) {
      var len = points.length;

      // reset arrays
      var calcPoints = [];
      var edges = [];
      var normals = [];

      // loop through length
      for (var i = 0; i < len; i++) {
        // add a Vector to each array
        calcPoints.push(Vector.create());
        edges.push(Vector.create());
        normals.push(Vector.create());
      }

      // set points and other properties

      /**
       * The points of the Polygon
       * @name Polygon#points
       * @type {Vector[]}
       * @instance
       */
      this.points = points;
      /**
       * The calculated collision points for the Polygon
       * @name Polygon#calcPoints
       * @type {Vector[]}
       * @instance
       */
      this.calcPoints = calcPoints;
      /**
       * The edges of the Polygon
       * @name Polygon#edges
       * @type {Vector[]}
       * @instance
       */
      this.edges = edges;
      /**
       * The normals of the Polygon
       * @name Polygon#normals
       * @type {Vector[]}
       * @instance
       */
      this.normals = normals;

      // recalculate normals and mass
      this.recalc();
      this.calcMass();

      // get center

      /**
       * The center of the polygon, equivalent to the position, only temporary
       * @name Polygon#center
       * @type {Vector}
       * @instance
       */
      this.center = this.getCenter(this.area);

      // offset points to have the position be the center
      var diff = this.pos.clone().sub(this.center).scale(1 / this.size);
      this.translate(diff.x, diff.y);
    }

    /**
     * Sets the angle of the Polygon
     * @param {number} angle The new angle measured in radians
     */

  }, {
    key: 'setAngle',
    value: function setAngle(angle) {
      // set the angle and recalc
      this.angle = angle;
      this.recalc();
    }

    /**
     * Rotates the Polygon by a given angle
     * @param {number} angle The angle to rotate by measured in radians
     */

  }, {
    key: 'rotate',
    value: function rotate(angle) {
      // increase the angle then recalc
      this.angle += angle;
      this.recalc();
    }

    /**
     * Translates the Polygons original points by an x and y value
     * @param {number} x The x value to translate by
     * @param {number} y The y value to translate by
     */

  }, {
    key: 'translate',
    value: function translate(x, y) {
      // get points
      var points = this.points;

      // loop through points
      for (var i = 0; i < points.length; i++) {
        // translate each point
        points[i].x += x;
        points[i].y += y;
      }

      // recalc normals, etc
      this.recalc();
    }

    /**
     * Handles a change in size
     */

  }, {
    key: 'handleChange',
    value: function handleChange() {
      // recalc mass and normals, etc
      this.calcMass();
      this.recalc();
    }

    /**
     * Scales the polygon by a scalar
     * @param {number} sc The scalar to scale by
     */

  }, {
    key: 'scale',
    value: function scale(sc) {
      // scale the size and recalc everything
      this.size *= sc;
      this.handleChange();
    }

    /**
     * Sets the size of the Polygon
     * @param {number} size The new size
     */

  }, {
    key: 'setSize',
    value: function setSize(size) {
      // change the size and recalc everthing
      this.size = size;
      this.handleChange();
    }

    /**
     * Increases the size of the Polygon
     * @param {number} amount The amount to increase the size by
     */

  }, {
    key: 'addSize',
    value: function addSize(amount) {
      // increase the size and recalc everything
      this.size += amount;
      this.handleChange();
    }

    /**
     * Sets the new Position of the Polygon
     * @param {Vector} pos The new position
     */

  }, {
    key: 'setPosition',
    value: function setPosition(pos) {
      // set the new position and recalc
      this.pos = pos;
      this.recalc();
    }

    /**
     * Moves the Polygon by a certain amount
     * @param {Vector} vec The amount to move by
     */

  }, {
    key: 'move',
    value: function move(vec) {
      this.pos.add(vec);
      this.recalc();
    }

    /**
     * Recalculates the polygons normals and other properties
     */

  }, {
    key: 'recalc',
    value: function recalc() {
      // The points of the Polygon, given in a Vector array
      // Are the original points that will remain unchanged
      // And are only to reference off of and copy into other Vectors
      var points = this.points;

      // The calculated points of the Polygon which are to be used
      // In collision testing and rendering, they include the given
      // angle and size etc. in the calculation
      var calcPoints = this.calcPoints;

      // The angle of the polygon in which the calcPoints will be rotated by
      var angle = this.angle;

      // The edges of the polygon which each are a Vector that represents
      // a single edge which is calculated by subtracting one of the points
      // by another
      var edges = this.edges;

      // The normals of the polygon to be used in collision detection
      // Is a normalized edge of the Polygon
      var normals = this.normals;

      // The size of the polygon which the calcPoints will be scaled by
      var size = this.size;

      // How many points there are
      var len = points.length;

      // set the temp variables
      var tempVector = Vector.create();
      var distance = 0;
      var bestDistance = 0;

      // loop through all the points
      for (var i = 0; i < len; i++) {
        var point = this.points[i];

        // initially set the calcPoint
        var calcPoint = calcPoints[i].copy(point).scale(size);

        // if there is an angle than rotate the point
        if (angle !== 0) calcPoint.rotate(angle);

        // calculate squared distance to center then store it
        // if it is the furthest distance
        distance = tempVector.copy(calcPoint).len2();
        if (distance > bestDistance) bestDistance = distance;

        calcPoint.add(this.pos);
      }

      // set the radius of the polygon as the furthest distance from the center
      this.r = Math.sqrt(bestDistance);

      // loop through all the points
      for (var _i2 = 0; _i2 < len; _i2++) {
        var point1 = calcPoints[_i2];
        var point2 = _i2 < len - 1 ? calcPoints[_i2 + 1] : calcPoints[0];

        // get the edge as the points subtracted from eachother
        var edge = edges[_i2].copy(point2).sub(point1);

        // finally calculate the normal
        normals[_i2].copy(edge).perp().normalize();
      }

      // calculate the AABB of the Polygon
      this.AABB = this.getAABB();
    }

    /**
     * Calculates the AABB of the Polygon
     * @returns {Box} The calculated AABB
     */

  }, {
    key: 'getAABB',
    value: function getAABB() {
      var points = this.calcPoints;

      // initialize the min and max vars
      var xMin = points[0].x;
      var yMin = points[0].y;
      var xMax = points[0].x;
      var yMax = points[0].y;

      // loop through all the points
      for (var i = 0; i < points.length; i++) {
        var point = points[i];

        // if it is less or larger set the x value as min / max
        if (point.x < xMin) {
          xMin = point.x;
        } else if (point.x > xMax) {
          xMax = point.x;
        }

        // if it is less or larger set the y value as min / max
        if (point.y < yMin) {
          yMin = point.y;
        } else if (point.y > yMax) {
          yMax = point.y;
        }
      }

      // get the min and max as a combination of the individual variables
      var min = Vector.create(xMin, yMin);
      var max = Vector.create(xMax, yMax);

      // return the new Box
      return Box.create(min, max);
    }

    /**
     * Creates a new Polygon without having to use the 'new' keyword
     * @param {Vector} pos The position of the Polygon
     * @param {Vector[]} points The points for the polygon
     * @param {number=} density The density of the circle
     * @param {number=} size The size of the Polygon
     * @param {number=} angle The initial angle of the Polygon
     * @returns {Polygon} The new Polygon
     * @static
     */

  }], [{
    key: 'create',
    value: function create(pos, points, density, size, angle) {
      return new Polygon(pos, points, density, size, angle);
    }
  }]);

  return Polygon;
}();
/**
 * @prop {Vector[]} RegularPolygonPoints The array to be referenced for the Regular Polygons points
 * @global
 * @final
 */


var RegularPolygonPoints = function (amount) {
  /**
   * A function to generate Regular Polygon Points given a number of points
   * @param {number} numberSides The number of sides
   * @returns {Vector[]} The calculated points
   * @private
   * @function
   */
  var _generatePolygonPoints = function _generatePolygonPoints(numberSides) {
    // get the difference to add in angle
    var da = TWO_PI / numberSides;

    var points = [];
    var v = void 0;
    var x = void 0;
    var y = void 0;

    // for each angle:
    for (var a = 0; a < TWO_PI; a += da) {
      // use polar conversion to cartesian for x, y values
      x = Math.cos(a);
      y = Math.sin(a);

      // get the vector and add to points
      v = Vector.create(x, y);
      points.push(v);
    }
    return points;
  };

  // constant array for polygons points
  var array = [];
  var points = void 0;

  // loop through untill the amount specified and fill
  // that array spot with generated points
  for (var i = 3; i < amount; i++) {
    points = _generatePolygonPoints(i);
    array[i] = points;
  }

  return array;
}(50);

/**
 * Class representing the RegularPolygon object, used in the game
 * @class RegularPolygon
 * @classdesc Creates a new RegularPolygon and returns a normal Polygon
 */

var RegularPolygon = function () {
  /**
   * Creates a RegularPolygon
   * @param {Vector} pos The position of the Polygon
   * @param {number} numberSides The number of sides
   * @param {number=} density The density of the circle
   * @param {number=} size The size of the Polygon
   * @param {number=} angle The initial angle of the Polygon
   * @return {Polygon} The calculated polygon
   */
  function RegularPolygon(pos) {
    var numberSides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    var density = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var angle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, RegularPolygon);

    // get the points
    var vertices = RegularPolygonPoints[numberSides];
    var points = cloneVectorArray(vertices);

    // return the polygon
    return Polygon.create(pos, points, density, size, angle);
  }

  /**
   * Creates a RegularPolygon without having to use the new keyword
   * @param {Vector} p The position of the Polygon
   * @param {number} n The number of sides
   * @param {number=} d The density of the circle
   * @param {number=} s The size of the Polygon
   * @param {number=} a The initial angle of the Polygon
   * @returns {Polygon} The calculated polygon
   * @static
   */


  _createClass(RegularPolygon, null, [{
    key: 'create',
    value: function create(p, n, d, s, a) {
      return new RegularPolygon(p, n, d, s, a);
    }
  }]);

  return RegularPolygon;
}();
/**
 * Class representing the Body object, used in the game
 * @class Body
 * @classdesc Holds information for an object including collision data, etc
 */


var Body = function () {
  /**
   * Creates a new Body
   * @param {Circle|Polygon} shape The shape to be used
   */
  function Body(shape) {
    _classCallCheck(this, Body);

    /**
     * The hitbox or shape of the Body
     * @name Body#shape
     * @type {Circle|Polygon}
     * @instance
     */
    this.shape = shape;

    /**
     * The velocity of the Body
     * @name Body#vel
     * @type {Vector}
     * @instance
     */
    this.vel = Vector.create();
    /**
     * The acceleration of the Body
     * @name Body#acc
     * @type {Vector}
     * @instance
     */
    this.acc = Vector.create();
    /**
     * A temporary Vector to avoid allocating memory
     * @name Body#tempVector
     * @type {Vector}
     * @instance
     */
    this.tempVector = Vector.create();

    /**
     * The last 5 or so angles of the Body that are stored
     * So that the rotations are smooth
     * @name Body#angles
     * @type {number[]}
     * @instance
     */
    this.angles = [];
    /**
     * The angular Velocity of the Body
     * @name Body#angVel
     * @type {number}
     * @default 0
     * @instance
     */
    this.angVel = 0;
    /**
     * The times left before the Body can stop rotation
     * So that the rotation is smooth and not sudden
     * @name Body#angCount
     * @type {number}
     * @instance
     */
    this.angCount = 0;
    /**
     * The permanent rotation that the Body will rotate by
     * @name Body#permanentRotation
     * @type {number}
     * @default 0
     * @instance
     */
    this.permanentRotation = 0;

    /**
     * Whether the Body is oscilating
     * @name Body#oscilating
     * @type {boolean}
     * @default false
     * @instance
     */
    this.oscilating = false;
    /**
     * The last few sizes of the Body so that it can oscilate legitamately
     * @name Body#oscilationMemory
     * @type {number[]}
     * @instance
     */
    this.oscilationMemory = [];
    /**
     * How much the Body will be oscilating ie the strength
     * @name Body#oscilationStrength
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationStrength = 0;
    /**
     * The counter for ticking past the sin or cosin wave during oscilation
     * @name Body#oscilationCount
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationCount = 0;
    /**
     * The minimum size that the Polygon can be while oscilating
     * @name Body#minOscilationSize
     * @type {number}
     * @default 0
     * @instance
     */
    this.minOscilationSize = 0;
    /**
     * How fast the Body is oscilating
     * @name Body#oscilationSpeed
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationSpeed = 0;

    /**
     * Whether the Body is involved in a collision
     * @name Body#inCollision
     * @type {boolean}
     * @instance
     */
    this.inCollision = false;
    /**
     * The bounce when the Body is involved in a collision
     * @name Body#restitution
     * @type {number}
     * @default 0
     * @instance
     */
    this.restitution = 0;
    /**
     * Whether the Body is shrinking or not
     * @name Body#shrinking
     * @type {boolean}
     * @default false
     * @instance
     */
    this.shrinking = false;
    /**
     * How fast the Body is shrinking, the lower the faster
     * @name Body#shrinkSpeed
     * @type {number}
     * @default 0.95
     * @instance
     */
    this.shrinkSpeed = 0.95;
    /**
     * How many frames left before the Body shrinks
     * @name Body#lifespan
     * @type {boolean|number}
     * @default false
     * @instance
     */
    this.lifespan = false;
  }

  /**
   * Starts oscilating the Body, as in making it smaller and bigger
   * In a wave like motion due to the given inputs
   * @param {number=} strength How large or small it gets, the higher the srength the
   *   larger the difference between the highest and smallest sized during oscilation
   * @param {number=} speed How fast the Body will oscilate
   * @param {number=} min The minimum size while oscilating
   */


  _createClass(Body, [{
    key: 'oscilate',
    value: function oscilate() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;

      // set oscilation to true and update settings
      this.oscilating = true;
      this.oscilationCount = 0;
      this.oscilationStrength = strength;
      this.minOscilationSize = min;

      // scale down speed so numbers like 5 will equal a small oscilation speed
      this.oscilationSpeed = speed * 0.01;
    }

    /**
     * Applies a force to the Body, equivalently moving it in
     * a dirrection where the magnitude is affected by the mass
     * @param {Vector} force A Vector where the Body should be pushed
     */

  }, {
    key: 'applyForce',
    value: function applyForce(force) {
      var div = this.shape.invMass;
      var f = this.tempVector.copy(force).scale(div);

      // finally add the scaled force to the accelaration
      this.acc.add(f);
    }

    /**
     * Sets the velocity of the Body
     * @param {Vector=} vel The velocity to set
     */

  }, {
    key: 'setVel',
    value: function setVel() {
      var vel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Vector.create();

      this.vel = vel;
    }

    /**
     * Rotates the body by the given angle in radians
     * @param {number} angle The angle to rotate by
     */

  }, {
    key: 'rotate',
    value: function rotate(angle) {
      // cut up the turn into smaller steps so it doesnt look jumpy
      this.angVel = angle * 0.1;
      this.angCount = 10;
    }

    /**
     * Updates the shrinking motion of the Body effectively making it smaller
     */

  }, {
    key: 'shrink',
    value: function shrink() {
      this.shrinking = true;

      // scale the size by the shrinkspeed of the Body
      this.shape.scale(this.shrinkSpeed);
    }

    /**
     * Decides whether the Body size is big enough to exist
     * @returns {boolean} Whether the Body exists
     */

  }, {
    key: 'exists',
    value: function exists() {
      var type = this.shape.type;
      if (type === TYPE_POLYGON) return this.shape.size > 0.01;
      if (type === TYPE_CIRCLE) return this.shape.r > 0.01;
    }

    /**
     * Applies the given def to the body, changing its inner settings
     * @param {Def=} def The def to be applied against the Body
     * @param {Vector=} def.vel The velocity to be set
     * @param {number=} def.angle The initial angle to be set against the shaoe
     * @param {number=} def.rotate The permanent rotation
     * @param {boolean=} def.oscilate Whether the Body will oscilate
     * @param {number=} def.oscilationStrength The range of oscilation sizes
     * @param {number=} def.oscilationSpeed How fast the Body oscilates
     * @param {number=} def.minOscilationSize The minimum size during oscilation
     * @param {number=} def.lifespan How many game ticks are left till the Body shrinks
     * @param {number=} def.shrinkSpeed How fast the Body shrinks
     * @param {string|RGBA=} def.fillColor The fill color of the Body
     * @param {string|RGBA=} def.strokeColor The stroke color of the body
     * @param {number=} def.strokeWidth The width of the stroked line when drawing the Body
     * @param {number=} def.restitution The bounce factor during collisions
     */

  }, {
    key: 'applyDef',
    value: function applyDef() {
      var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Def.create();

      // set default values
      var vel = def.vel,
          angle = def.angle,
          rotate = def.rotate,
          oscilate = def.oscilate,
          oscilationStrength = def.oscilationStrength,
          oscilationSpeed = def.oscilationSpeed,
          minOscilationSize = def.minOscilationSize,
          lifespan = def.lifespan,
          shrinkSpeed = def.shrinkSpeed,
          fillColor = def.fillColor,
          strokeColor = def.strokeColor,
          strokeWidth = def.strokeWidth,
          restitution = def.restitution;

      // if there is a velocity then set the velocity

      if (vel) this.setVel(vel);

      // if there is an angle then rotate by that amount
      if (angle) this.shape.setAngle(angle);
      if (rotate) this.permanentRotation = rotate;

      // if oscilation is there than oscilate by the parameters given
      if (oscilate) {
        var strength = oscilationStrength;
        var speed = oscilationSpeed;
        var min = minOscilationSize;
        this.oscilate(strength, speed, min);
      }

      // if there was a lifespan specified then set lifespan and or shrinkspeed
      if (lifespan) this.lifespan = lifespan;
      if (shrinkSpeed) this.shrinkSpeed = shrinkSpeed;

      // set colors
      this.fillColor = fillColor;
      this.strokeColor = strokeColor;

      // some un-processable value for no strokeColor
      this.strokeWidth = strokeWidth || 0.01;

      // if there is no restitution then it will be the Def default value
      this.restitution = restitution;
    }

    /**
     * Updates the angles in the angular memory,
     * Aimed at creating a delayed turn
     * @param {boolean} doRotate whether the Body should rotate
     */

  }, {
    key: 'updateAngularMemory',
    value: function updateAngularMemory(doRotate) {
      var shape = this.shape;

      // only rotate if it is a polygon and the doRotate param is true
      if (shape.type === TYPE_POLYGON) {
        if (doRotate) {
          // get current angles
          var angles = this.angles;

          // get current angle
          var _angle = this.vel.getAngle();
          var currentAngle = angles.length < 5 ? _angle : angles.shift();

          // push current angle
          angles.push(_angle);

          // set angle of shape
          this.shape.setAngle(currentAngle);
        }

        // rotate by permanent rotation
        var angle = this.permanentRotation;
        if (angle) this.shape.rotate(angle);
      }
    }

    /**
     * Updates the oscilation of the Body
     */

  }, {
    key: 'updateOscilation',
    value: function updateOscilation() {
      // only if it is oscilating and not shrinking
      if (this.oscilating && !this.shrinking) {
        // update the oscilation count
        this.oscilationCount++;

        // def default variables
        var oscilationMemory = this.oscilationMemory,
            oscilationCount = this.oscilationCount,
            oscilationSpeed = this.oscilationSpeed,
            oscilationStrength = this.oscilationStrength,
            minOscilationSize = this.minOscilationSize,
            shape = this.shape;
        var r = shape.r,
            size = shape.size,
            type = shape.type;

        // get the current angle and sin value

        var theta = oscilationCount * oscilationSpeed;
        var sin = Math.sin(theta);

        // get last and current size
        var prevSize = oscilationMemory[0] || 0;
        var newSize = sin * oscilationStrength;

        // update oscilation memory
        oscilationMemory[0] = oscilationMemory[1] || 0;
        oscilationMemory[1] = newSize;

        // get difference between sizes and the current size
        var diff = newSize - prevSize;
        var radius = type === TYPE_CIRCLE ? r : size;

        // calculate the new size and change the shapes size to that
        var total = abs(diff + radius);
        var Size = constrain(total, minOscilationSize, Math.MAX_VALUE);

        this.shape.setSize(Size);
      }
    }

    /**
     * Updates the Polygon including angular rotation, velocity etc
     * @param {boolean} noRotate whether the Polygon should not have its rotation updated
     */

  }, {
    key: 'update',
    value: function update(noRotate) {
      // integrate velocity
      this.vel.add(this.acc);
      this.shape.move(this.vel);
      this.acc.reset();

      var doRotate = !noRotate;

      // update angles and oscilation
      this.updateAngularMemory(doRotate);
      this.updateOscilation();

      // update angular velocity
      if (this.angCount > 0) {
        this.vel.rotate(this.angVel);
        this.angCount--;

        if (this.angCount === 0) {
          this.angVel = 0;
          this.inCollision = false;
        }
      }

      // update lifespan
      if (this.lifespan) {
        this.lifespan--;

        if (this.lifespan <= 0) {
          this.shrink();
          this.lifespan = false;
        }
      }

      // update shrinking
      if (this.shrinking) {
        this.shrink();
      }
    }

    /**
     * Creates a new Body without having to use the 'new' keyword
     * @param {Polygon|Circle} shape The shape to be passed into the Bodys parameters
     * @returns {Body} The new CirBodycle
     * @static
     */

  }], [{
    key: 'create',
    value: function create(shape) {
      return new Body(shape);
    }
  }]);

  return Body;
}();
/**
 * Class representing Manifold for collision testing
 * @class Manifold
 * @classdesc Stores data for after a collision took place
 */


var Manifold = function () {
  /**
   * Creates a new Manifold
   */
  function Manifold() {
    _classCallCheck(this, Manifold);

    this.reset();
  }

  /**
   * Resets the values of the Manifold
   */


  _createClass(Manifold, [{
    key: 'reset',
    value: function reset() {
      this.normal = Vector.create();
      this.exitV = Vector.create();

      this.penetration = Number.MAX_VALUE;
    }

    /**
     * Creates a new Manifold without having to use the 'new' keyword
     * @returns {Manifold} The calculated Manifold
     * @static
     */

  }], [{
    key: 'create',
    value: function create() {
      return new Manifold();
    }
  }]);

  return Manifold;
}();
/**
 * Class representing the SAT object, used for collision detection
 * @class SAT
 * @classdesc Is a namespace for a collision tester
 */


var SAT = function () {
  /**
   * Creates a new instance of SAT
   */
  function SAT() {
    _classCallCheck(this, SAT);

    /**
     * An array of Vectors to avoid allocating memory
     * @name SAT#TVECS
     * @type {Vector[]}
     * @instance
     */
    this.TVECS = [];

    // fill with 10 Vectors
    for (var i = 0; i < 10; i++) {
      this.TVECS.push(Vector.create());
    }
  }

  /**
   * Gets the minimum and maximum points on an axis
   * @param {Vector[]} points The points to test on
   * @param {Vector} normal The normalized axis
   * @param {number[]} result The array which the values will be stored in
   */


  _createClass(SAT, [{
    key: 'flattenPointsOn',
    value: function flattenPointsOn(points, normal, result) {
      // set min and max as Infinity and -Infinity
      var min = Number.MAX_VALUE;
      var max = -min;

      for (var i = 0; i < points.length; i++) {
        // get the dot and if smaller or larger store it
        var dot = points[i].dot(normal);
        if (dot < min) min = dot;
        if (dot > max) max = dot;
      }

      // store the results
      result[0] = min;
      result[1] = max;
    }

    /**
     * Decides whether an axis separates two sets of points
     * @param {Vector} aPos The position of Polygon A
     * @param {Vector} bPos The position of Polygon B
     * @param {Vector[]} aPoints The points of Polygon A
     * @param {Vector[]} bPoints The points of Polygon B
     * @param {Vector} axis The normalized axis to test on
     * @param {Manifold} manifold The manifold for the result to be outputed
     * @param {boolean=} isCircle Whether Shape B is a circle
     * @param {number=} radius How big the circle is if it is a circle
     * @returns {boolean} Whether there is a separating axis
     */

  }, {
    key: 'isSeparatingAxis',
    value: function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, manifold, isCircle, radius) {
      // init ranges
      var rangeA = [0, 0];
      var rangeB = [0, 0];

      // get min and max
      this.flattenPointsOn(aPoints, axis, rangeA);
      this.flattenPointsOn(bPoints, axis, rangeB);

      // deal with whether it is a circle
      if (isCircle) {
        rangeB[0] -= radius;
        rangeB[1] += radius;
      }

      // set shorthand vars
      var minA = rangeA[0],
          maxA = rangeA[1];
      var minB = rangeB[0],
          maxB = rangeB[1];

      // early escape

      if (minA > maxB || minB > maxA) return true;

      // init vars
      var overlap = 0;
      var option1 = void 0;
      var option2 = void 0;

      // calculate overlap based off of a tree of options
      if (minA < minB) {
        if (maxA < maxB) {
          overlap = maxA - minB;
        } else {
          option1 = maxA - minB;
          option2 = maxB - minA;
          overlap = option1 < option2 ? option1 : -option2;
        }
      } else {
        if (maxA > maxB) {
          overlap = minA - maxB;
        } else {
          option1 = maxA - minB;
          option2 = maxB - minA;
          overlap = option1 < option2 ? option1 : -option2;
        }
      }

      // get penetration
      var penetration = abs(overlap);

      // decide if penetration is smaller, then save it
      if (penetration < manifold.penetration) {
        manifold.penetration = penetration;
        manifold.normal.copy(axis);

        // if the overlap is negative reverse the normal
        if (overlap < 0) manifold.normal.reverse();
      }

      // there was no separating axis
      return false;
    }

    /**
     * Decides if two AABBs collide
     * @param {Box} a The first AABB
     * @param {Box} b The second AABB
     * @returns {boolean} Whether they collide
     */

  }, {
    key: 'AABB',
    value: function AABB(a, b) {
      return !(a.min.x > b.max.x || a.max.x < b.min.x || a.min.y > b.max.y || a.max.y < b.min.y);
    }

    /**
     * Decides whether two circles are colliding
     * @param {Circle} a The first Circle
     * @param {Circle} b The second Circle
     * @param {Manifold} manifold The manifold to store the collision data
     * @returns {boolean} Whether the two circles are colliding
     */

  }, {
    key: 'circleCircle',
    value: function circleCircle(a, b, manifold) {
      // get the separation vector and distance
      // as well as total radius
      var distV = this.TVECS.pop().copy(b.pos).sub(a.pos);
      var totalR = a.r + b.r;
      var totalRSq = Math.pow(totalR, 2);
      var distSq = distV.len2();

      this.TVECS.push(distV);

      // if the distance is greater than the radii then
      // they are not colliding
      if (distSq > totalRSq) return false;

      // calculate real distance
      var dist = Math.sqrt(dist2);

      // store collision data
      manifold.penetration = totalR - dist;
      manifold.normal.copy(distV.normalize());
      manifold.exitV.copy(distV).scale(manifold.penetration);

      // they have collided
      return true;
    }

    /**
     * Decides whether a Polygon is colliding with a Circle
     * @param {Polygon} polygon The Polygon
     * @param {Circle} circle The Circle
     * @param {Manifold} manifold The manifold to hold the collision data
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'polygonCircle',
    value: function polygonCircle(polygon, circle, manifold) {
      // early escape if AABBs are not touching
      if (!this.AABB(polygon.AABB, circle.AABB)) return false;

      // aliases
      var points = polygon.calcPoints;
      var normals = polygon.normals;
      var len = points.length;
      var pPos = polygon.pos;
      var cPos = circle.pos;
      var r = circle.r;
      var cPoints = [cPos];

      var distSq = 0;
      var axis = this.TVECS.pop();
      var bestAxis = this.TVECS.pop();
      var bestDist = Number.MAX_VALUE;

      // loop through points and get least distance
      for (var i = 0; i < len; i++) {
        axis.copy(cPos).sub(points[i]);
        distSq = axis.len2();

        if (distSq < bestDist) {
          bestDist = distSq;
          bestAxis.copy(axis);
        }
      }

      // normalize the axis
      bestAxis.normalize();

      this.TVECS.push(axis);
      this.TVECS.push(bestAxis);

      // test the centerToClosestPoint axis and if there is early escape
      if (this.isSeparatingAxis(pPos, cPos, points, cPoints, bestAxis, manifold, true, r)) return false;

      // loop through Polygons axis and test against
      for (var _i3 = 0; _i3 < len; _i3++) {
        if (this.isSeparatingAxis(pPos, cPos, points, cPoints, normals[_i3], manifold, true, r)) return false;
      }

      // get data as they have collided
      manifold.exitV.copy(manifold.normal).scale(manifold.penetration * 1.1);
      return true;
    }

    /**
     * Decides whether a Circle is colliding with a Polygon
     * @param {Circle} a The Circle
     * @param {Polygon} b The Polygon
     * @param {Manifold} manifold The manifold to hold the collision data
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'circlePolygon',
    value: function circlePolygon(a, b, manifold) {
      var result = this.polygonCircle(b, a, manifold);

      // reverse data and return result
      manifold.normal.reverse();
      manifold.exitV.reverse();
      return result;
    }

    /**
     * Decides whether two polygons are colliding
     * @param {Polygon} a The first Polygon
     * @param {Polygon} b The second Polygon
     * @param {Manifold} manifold The manifold to store the collision data
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'polygonPolygon',
    value: function polygonPolygon(a, b, manifold) {
      // early escape if AABBs are not colliding
      if (!this.AABB(a.AABB, b.AABB)) return false;

      // aliases
      var aPoints = a.calcPoints;
      var bPoints = b.calcPoints;
      var aPos = a.pos;
      var bPos = b.pos;
      var aNormals = a.normals;
      var bNormals = b.normals;

      // loop through Polygon a axis and test for separation
      for (var i = 0; i < aPoints.length; i++) {
        if (this.isSeparatingAxis(aPos, bPos, aPoints, bPoints, aNormals[i], manifold)) return false;
      }

      // loop through Polygon b axis and test for separation
      for (var _i4 = 0; _i4 < bPoints.length; _i4++) {
        if (this.isSeparatingAxis(aPos, bPos, aPoints, bPoints, bNormals[_i4], manifold)) return false;
      }

      // they are colliding so calculate escape Vector and return
      manifold.exitV.copy(manifold.normal).scale(manifold.penetration * 1.1);
      return true;
    }

    /**
     * Decides whether two shapes are colliding
     * @param {Polygon|Circle} a The first shape
     * @param {Polygon|Circle} b The second shape
     * @param {Manifold} manifold The object that will hold the collision data
     * @returns {boolean} Whether the two shapes have collided or not
     */

  }, {
    key: 'collision',
    value: function collision(a, b, manifold) {
      // decide which type each one is
      var aIsPolygon = a.type === TYPE_POLYGON;
      var bIsPolygon = b.type === TYPE_POLYGON;

      // go through each possibility and return the result
      if (aIsPolygon) {
        if (bIsPolygon) {
          // A is polygon and B is polygon
          return this.polygonPolygon(a, b, manifold);
        }
        // A is polygon and B is circle
        return this.polygonCircle(a, b, manifold);
      }
      if (bIsPolygon) {
        // A is circle and B is polygon
        return this.circlePolygon(a, b, manifold);
      }
      // A is circle and B is circle
      return this.circleCircle(a, b, manifold);
    }

    /**
     * Solves a collision between two bodies
     * @param {Body} mover The body that will be pushed out of the way and
     *   who will be tested against the other body
     * @param {Body} body The static body that will be tested against
     *   the mover
     * @param {Manifold} manifold The object to hold the collision data
     * @param {boolean=} noRotate Whether the mover can not rotate or can rotate
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'solveCollision',
    value: function solveCollision(mover, body, manifold, noRotate) {
      manifold.reset();

      // get relative velovity and position
      var relativeVelocity = this.TVECS.pop().copy(mover.vel).sub(body.vel);
      var relativePosition = this.TVECS.pop().copy(mover.shape.pos).sub(body.shape.pos);

      // decide if they are moving towards eachother
      var dotProduct = relativeVelocity.dot(relativePosition);
      var isMovingTowards = dotProduct < 0;

      this.TVECS.push(relativeVelocity);
      this.TVECS.push(relativePosition);

      // get collision data
      var result = this.collision(mover.shape, body.shape, manifold);

      // only solve collision if they have collided
      if (result) {
        // move the mover out of the path
        mover.shape.pos.sub(manifold.exitV);

        // only if they are moving towards eachother
        // and the mover is not involved in a collision
        if (isMovingTowards && !mover.inCollision) {
          // only if the mover can rotate do the rotation
          if (noRotate) {
            // if cant rotate than just reflect against the normal
            mover.vel.reflectN(manifold.normal.perp());
          } else {
            // get velocity and collision normal
            var vel = this.TVECS.pop().copy(mover.vel);
            var normal = manifold.normal.perp();

            // calculate differences in angles
            var befAngle = vel.getAngle();
            var aftAngle = vel.reflectN(normal).getAngle();

            var angle = aftAngle - befAngle;

            // constrain angles
            if (angle > PI) angle -= TWO_PI;else if (angle < -PI) angle += TWO_PI;

            // update mover data and collision
            mover.vel.scale(mover.restitution);
            mover.rotate(angle);
            mover.inCollision = true;

            this.TVECS.push(vel);
          }
        }

        // they have collided so return true
        return true;
      }

      // they have not collided so return false
      return false;
    }

    /**
     * Creates a new instanceof the SAT class without having to use the 'new' keyword
     * @returns {SAT} The new SAT class
     * @static
     */

  }], [{
    key: 'create',
    value: function create() {
      return new SAT();
    }
  }]);

  return SAT;
}();

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var len = vendors.length;
  for (var x = 0; x < len && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();
window.addEventListener('load', function () {
  var game = new GameManager();
  game.world.border(6);
  game.restart();

  var fpsOutput = document.getElementById('fpsOutput');

  var fps = 0,
      referenceFrame = 0,
      referenceTime = Date.now();

  game.resize();

  var loop = function loop() {
    referenceFrame++;;
    if (referenceFrame > 10) {
      var currentTime = Date.now(),
          difference = currentTime - referenceTime,
          secondsPassed = difference * 0.001;
      fps = Math.round(referenceFrame / secondsPassed);
      fpsOutput.innerHTML = fps + ' fps';
      referenceTime = Date.now();
      referenceFrame = 0;
    }

    game.resize();
    game.update();
    window.requestAnimationFrame(loop);
  };
  loop();

  window.addEventListener('resize', function () {
    game.resize();
  });
});
