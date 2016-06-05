/**
 * Simple JavaScript library for HEX/RGB/HSB/LAB/XYZ colors based
 * on algorithms from EasyRGB (http://www.easyrgb.com/index.php?X=MATH)
 *
 * @page    http://github.com/Shushik/i-color/
 * @author  Shushik <silkleopard@yandex.ru>
 * @version 2.0
 */
var IColor = IColor || (function() {

    /**
     * @static
     *
     * Static properties and methods
     *
     * @param {string|object}     raw
     * @param {undefined|string}  out
     * @param {undefined|boolean} inverted
     *
     * @property parent
     * @property available
     * @function check
     * @function clean
     * @function round
     * @function invert
     * @function convert
     * @function correct
     * @function identify
     */
    function
        self(raw, out, inverted) {
            return self.convert(raw, out, inverted);
        }

    /**
     * Available colors formats
     *
     * @type {string}
     */
    self.available = 'HEX,HSV,LAB,RGB,XYZ';

    /**
     * Link to the global object
     *
     * @type {object}
     */
    self.parent = this;

    /**
     * Check if the HSV, LAB, RGB or XYZ format given
     *
     * @static
     *
     * @param {string|object} raw
     * @param {string}        format
     *
     * @return {boolean}
     */
    self.check = function(raw, format) {
        var
            loop    = 0,
            checked = 0,
            letter  = '',
            letters = null;

        //
        if (typeof format == 'string') {
            letters = format.toLowerCase().match(/\w/g);
            loop    = letters.length;

            //
            if (self[format]) {
                while (--loop > -1) {
                    letter = letters[loop];

                    if (self[format][letter] && raw[letter] !== undefined) {
                        checked++;
                    }

                }

                //
                if (letters.length == checked) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get a clean format id
     *
     * @static
     *
     * @param {string} format
     *
     * @return {string}
     */
    self.clean = function(format) {
        return (
                   typeof format == 'string' &&
                   self.available.match(format)
               ) ?
               format.toUpperCase() :
               'RGB';
    }

    /**
     * Instead of nonworking Math.toFixed()
     *
     * @static
     *
     * @param {number} num
     * @param {number} to
     *
     * @return {number}
     */
    self.round = function(num, to) {
        if (typeof to != 'number' || to < 0) {
            return num;
        }

        var
            pow = Math.pow(10, to);

        return Math.round(num * pow) / pow;
    }

    /**
     * Invert a given color
     *
     * @static
     *
     * @param {string|object}    raw
     * @param {undefined|string} out
     *
     * @return {string|object}
     */
    self.invert = function(raw, out) {
        out = self.clean(out);

        var
            alias  = '',
            format = self.identify(raw),
            rgb    = null;

        if (typeof format == 'string') {
            rgb = self[format].RGB(raw);

            for (alias in rgb) {
                rgb[alias] = 255 - rgb[alias];
            }

            if (out != 'RGB') {
                return self.RGB[out](raw);
            }

            return rgb;
        }

        return null;
    }

    /**
     * Convert a given color into needed format
     *
     * @static
     *
     * @param {string|object}    raw
     * @param {undefined|string} out
     *
     * @return {string|object}
     */
    self.convert = function(raw, out) {
        out = self.clean(out);

        var
            format = self.identify(raw);

        if (typeof format == 'string') {
            if (format == out) {
                return self[format].correct(raw);
            } else if (self[format][out]) {
                return self[format][out](raw);
            }
        }

        return null;
    }

    /**
     * Get the correct color format
     *
     * @param {object} raw
     * @param {string} keys
     *
     * @return {object}
     */
    self.correct = function(raw, keys) {
        // No raw, no result
        if (raw === undefined) {
            return null;
        }

        var
            loop  = 0,
            type  = keys.toUpperCase(),
            alias = '',
            piece = '',
            clean = {},
            order = keys.toLowerCase().match(/\w/g);

        loop = order.length;

        //
        while (--loop > -1) {
            alias = order[loop];

            //
            if (typeof raw[loop] == 'number') {
                piece = raw[loop];
            } else if (typeof raw[alias] == 'number') {
                piece = raw[alias];
            } else {
                piece = self[type][alias].min;
            }


            //
            if (piece > self[type][alias].max) {
                piece = self[type][alias].max;
            } else if (piece < self[type][alias].min) {
                piece = self[type][alias].min;
            }

            clean[alias] = piece;
        }

        return clean;
    }

    /**
     * Get a type of a given color
     *
     * @static
     *
     * @param {string|object} raw
     *
     * @return {string|object}
     */
    self.identify = function(raw) {
        var
            loop  = 0,
            type  = '',
            types = self.available.split(',');

        loop = types.length;

        //
        while (--loop > -1) {
            type = types[loop];

            if (self[type].check(raw)) {
                return type;
            }
        }

        return null;
    }

    return self;

})();



/**
 * HEX format
 */
IColor.HEX = IColor.HEX || (function() {

    /**
     * @static
     *
     * @param {string} raw
     *
     * @return {string|object}
     *
     * Static properties and methods:
     *
     * @property _raw
     * @property _human
     * @property def
     * @property parent
     * @function HSV
     * @function LAB
     * @function RGB
     * @function XYZ
     * @property human
     * @function correct
     */
    function
        self(raw) {
            return self.parent.convert(raw, 'HEX');
        }

    /**
     * Colors by keywords
     *
     * @static
     * @private
     *
     * @type {string}
     */
    self._human = 'red:FF0000,tan:D2B48C,' +
                  'aqua:00FFFF,blue:0000FF,cyan:00FFFF,gold:FFD700,gray:808080,' +
                  'lime:00FF00,navy:000080,peru:CD853F,pink:FFC0CB,plum:DDA0DD,' +
                  'snow:FFFAFA,teal:008080,' +
                  'azure:F0FFFF,beige:F5F5DC,black:000000,brown:A52A2A,coral:FF7F50,' +
                  'green:008000,ivory:FFFFF0,khaki:F0E68C,linen:FAF0E6,olive:808000,' +
                  'wheat:F5DEB3,white:FFFFFF,' +
                  'bisque:FFE4C4,indigo:4B0082,maroon:800000,orange:FFA500,orchid:DA70D6,' +
                  'purple:800080,salmon:FA8072,sienna:A0522D,silver:C0C0C0,tomato:FF6347,' +
                  'violet:EE82EE,yellow:FFFF00,' +
                  'crimson:DC143C,darkred:8B0000,dimgray:696969,fuchsia:FF00FF,' +
                  'hotpink:FF69B4,magenta:FF00FF,oldlace:FDF5E6,skyblue:87CEEB,' +
                  'thistle:D8BFD8,' +
                  'cornsilk:FFF8DC,darkblue:00008B,darkcyan:008B8B,darkgray:A9A9A9,' +
                  'deeppink:FF1493,honeydew:F0FFF0,lavender:E6E6FA,moccasin:FFE4B5,' +
                  'seagreen:2E8B57,seashell:FFF5EE,' +
                  'aliceblue:F0F8FF,burlywood:DEB887,cadetblue:5F9EA0,chocolate:D2691E,' +
                  'darkgreen:006400,darkkhaki:BDB76B,firebrick:B22222,gainsboro:DCDCDC,' +
                  'goldenrod:DAA520,indianred:CD5C5C,lawngreen:7CFC00,lightblue:ADD8E6,' +
                  'lightcyan:E0FFFF,lightgrey:D3D3D3,lightpink:FFB6C1,limegreen:32CD32,' +
                  'mintcream:F5FFFA,mistyrose:FFE4E1,olivedrab:6B8E23,orangered:FF4500,' +
                  'palegreen:98FB98,peachpuff:FFDAD9,rosybrown:BC8F8F,royalblue:4169E1,' +
                  'slateblue:6A5ACD,slategray:708090,steelblue:4682B4,turquoise:40E0D0,' +
                  'aquamarine:7FFFD4,blueviolet:8A2BE2,chartreuse:7FFF00,' +
                  'darkorange:FF8C00,darkorchid:9932CC,darksalmon:E9967A,' +
                  'darkviolet:9400D3,dodgerblue:1E90FF,ghostwhite:F8F8FF,' +
                  'lightcoral:F08080,lightgreen:90EE90,mediumblue:0000CD,' +
                  'papayawhip:FFEFD5,powderblue:B0E0E6,sandybrown:F4A460,' +
                  'whitesmoke:F5F5F5,' +
                  'floralwhite:FFFAF0,forestgreen:228B22,darkmagenta:8B008B,' +
                  'deepskyblue:00BFFF,navajowhite:FFDEAD,yellowgreen:9ACD32,' +
                  'greenyellow:ADFF2F,lightsalmon:FFA07A,lightyellow:FFFFE0,' +
                  'saddlebrown:8B4513,springgreen:00FF7F,darkseagreen:8FBC8F,' +
                  'antiquewhite:FAEBD7,lemonchiffon:FFFACD,lightskyblue:87CEFA,' +
                  'mediumorchid:BA55D3,mediumpurple:9370D8,midnightblue:191970,' +
                  'darkslateblue:483D8B,darkslategray:2F4F4F,darkturquoise:00CED1,' +
                  'darkgoldenrod:B8860B,lavenderblush:FFF0F5,lightseagreen:20B2AA,' +
                  'palegoldenrod:EEE8AA,paleturquoise:AFEEEE,palevioletred:D87093,' +
                  'blanchedalmond:FFEBCD,cornflowerblue:6495ED,darkolivegreen:556B2F,' +
                  'lightslategray:778899,lightsteelblue:B0C4DE,mediumseagreen:3CB371,' +
                  'mediumslateblue:7B68EE,mediumturquoise:48D1CC,mediumvioletred:C71585,' +
                  'mediumaquamarine:66CDAA,mediumspringgreen:00FA9A,' +
                  'lightgoldenrodyellow:FAFAD2';

    /**
     * Maximum value
     *
     * @static
     *
     * @type {string}
     */
    self.max = 'FFF';

    /**
     * Minimum value
     *
     * @static
     *
     * @type {string}
     */
    self.min = '000';

    /**
     * Link to the parent object
     *
     * @static
     *
     * @type {object}
     */
    self.parent = this;

    /**
     * HEX > HSV
     *
     * @static
     *
     * @param {string} raw
     *
     * @return {object}
     */
    self.HSV = function(raw) {
        return self.parent.RGB.HSV(self.RGB(raw));
    }

    /**
     * HEX > LAB
     *
     * @static
     *
     * @param {string}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.LAB = function(raw, rnd) {
        return self.parent.XYZ.LAB(self.XYZ(raw), rnd);
    }

    /**
     * HEX > RGB
     *
     * @static
     *
     * @param {string} raw
     *
     * @return {object}
     */
    self.RGB = function(raw) {
        var
            rgb   = {
                        r : 0,
                        g : 0,
                        b : 0
                    },
            clean = self.correct(raw);

        if (clean.length == 3) {
            rgb.r = parseInt((clean.substring(0, 1) + clean.substring(0, 1)), 16);
            rgb.g = parseInt((clean.substring(1, 2) + clean.substring(1, 2)), 16);
            rgb.b = parseInt((clean.substring(2, 3) + clean.substring(2, 3)), 16);
        } else {
            rgb.r = parseInt(clean.substring(0, 2), 16);
            rgb.g = parseInt(clean.substring(2, 4), 16);
            rgb.b = parseInt(clean.substring(4, 6), 16);
        }

        return rgb;
    }

    /**
     * HEX > XYZ
     *
     * @static
     *
     * @param {string}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.XYZ = function(raw, rnd) {
        return self.parent.RGB.XYZ(self.RGB(raw), rnd);
    }

    /**
     * Check if the HEX format given
     *
     * @static
     *
     * @param {object} raw
     *
     * @return {boolean}
     */
    self.check = function(raw) {
        if (typeof raw == 'string') {
            if (found = raw.match(/^#?[A-F0-9]{3,6}/ig) || self.human(raw)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get a HEX color by a keyword from self._human
     *
     * @param {string}           keyword
     * @param {undefined|string} color
     *
     * @return {string|object}
     */
    self.human = function(keyword, color) {
        var
            clean = keyword.replace(/[^a-z0-9]/ig, '').toLowerCase(),
            found = null;

        if (self.check(color)) {
            self._human += ',' + keyword + ':' + self.correct(color);
        } else {
            if (found = self._human.match(new RegExp(clean + ':([^,]{6})'))) {
                return found[1];
            }
        }

        return null;
    }

    /**
     * Get the correct HEX format
     *
     * @param {string} raw
     *
     * @return {string|object}
     */
    self.correct = function(raw) {
        // Type check
        if (!self.check(raw)) {
            return null;
        }

        var
            length  = 0,
            human   = '',
            keyword = raw.toLowerCase().replace(/^#/, '');

        // Get by a keyword
        if (human = self.human(keyword)) {
            return human;
        }

        //
        keyword = keyword.
                  substring(0, 6).
                  replace(/[^A-F0-9]/ig, '0');
        length  = keyword.length;

        // Fix the wrong length
        if (length < 6 && length > 3) {
            keyword += ('000000').substring(length, 6 - length);
        } else if (length < 3) {
            keyword += ('000').substring(length, 3 - length);
        }

        return keyword;
    }

    return self;

}).call(IColor);



/**
 * HSV format
 */
IColor.HSV = IColor.HSV || (function() {

    /**
     * @static
     *
     * @param {string} raw
     *
     * @return {object}
     *
     * Static properties and methods:
     *
     * @property _raw
     * @property def
     * @property parent
     * @function HEX
     * @function LAB
     * @function RGB
     * @function XYZ
     * @function correct
     */
    function
        self(raw) {
            return self.parent.convert(raw, 'HSV');
        }

    /**
     * H minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.h = {
        max : 359,
        min : 0
    };

    /**
     * S minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.s = {
        max : 100,
        min : 0
    };

    /**
     * V minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.v = {
        max : 100,
        min : 0
    };

    /**
     * Link to the parent object
     *
     * @static
     *
     * @type {object}
     */
    self.parent = this;

    /**
     * HSV > HEX
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.HEX = function(raw) {
        return self.parent.RGB.HEX(self.RGB(raw));
    }

    /**
     * HSV > LAB
     *
     * @param {object}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.LAB = function(raw, rnd) {
        return self.parent.XYZ.LAB(self.XYZ(raw), rnd);
    }

    /**
     * HSV > RGB
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.RGB = function(raw) {
        var
            i     = 0,
            f     = 0,
            p     = 0,
            q     = 0,
            t     = 0,
            clean = self.correct(raw),
            h     = clean.h,
            s     = clean.s,
            v     = clean.v,
            rgb   = {
                r : 0,
                g : 0,
                b : 0
            };

        if (s == 0) {
            if (v == 0) {
                rgb.r = rgb.g = rgb.b = 0;
            } else {
                rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100);
            }
        } else {
            if (h == 360) {
                h = 0;
            }

            h /= 60;

            s = s / 100;
            v = v / 100;

            i = parseInt(h);
            f = h - i;
            p = v * (1 - s);
            q = v * (1 - (s * f));
            t = v * (1 - (s * (1 - f)));

            switch (i) {

                case 0:
                    rgb.r = v;
                    rgb.g = t;
                    rgb.b = p;
                break;

                case 1:
                    rgb.r = q;
                    rgb.g = v;
                    rgb.b = p;
                break;

                case 2:
                    rgb.r = p;
                    rgb.g = v;
                    rgb.b = t;
                break;

                case 3:
                    rgb.r = p;
                    rgb.g = q;
                    rgb.b = v;
                break;

                case 4:
                    rgb.r = t;
                    rgb.g = p;
                    rgb.b = v;
                break;

                case 5:
                    rgb.r = v;
                    rgb.g = p;
                    rgb.b = q;
                break;

            }

            rgb.r = parseInt(rgb.r * 255);
            rgb.g = parseInt(rgb.g * 255);
            rgb.b = parseInt(rgb.b * 255);
        }

        return rgb;
    }

    /**
     * HSV > XYZ
     *
     * @param {object}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.XYZ = function(raw, rnd) {
        return self.parent.RGB.XYZ(self.RGB(raw), rnd);
    }

    /**
     * Check if the HSV format given
     *
     * @static
     *
     * @param {string|object} raw
     *
     * @return {boolean}
     */
    self.check = function(raw) {
        return self.parent.check(raw, 'HSV');
    }

    /**
     * Get the correct RGB format
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.correct = function(raw) {
        return self.parent.correct(raw, 'HSV', true);
    }

    return self;

}).call(IColor);



/**
 * LAB format
 */
IColor.LAB = IColor.LAB || (function() {

    /**
     * @static
     *
     * @param {string} raw
     *
     * @return {object}
     *
     * Static properties and methods:
     *
     * @property _raw
     * @property def
     * @property parent
     * @function HEX
     * @function HSV
     * @function RGB
     * @function XYZ
     * @function correct
     */
    function
        self(raw) {
            return self.parent.convert(raw, 'LAB');
        }

    /**
     * A minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.a = {
        min : -128,
        max : 127
    };

    /**
     * B minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.b = {
        min : -128,
        max : 127
    };

    /**
     * L minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.l = {
        min : 0,
        max : 100
    };

    /**
     * Link to the parent object
     *
     * @static
     *
     * @type {object}
     */
    self.parent = this;

    /**
     * LAB > HEX
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.HEX = function(raw) {
        return self.parent.RGB.HEX(self.RGB(raw));
    }

    /**
     * LAB > HSV
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.HSV = function(raw) {
        return self.parent.RGB.HSV(self.RGB(raw));
    }

    /**
     * LAB > RGB
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.RGB = function(raw) {
        return self.parent.XYZ.RGB(self.XYZ(raw));
    }

    /**
     * LAB > XYZ
     *
     * @param {object}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.XYZ = function(raw, rnd) {
        var
            powed = 0,
            alias = '',
            xyz   = {},
            clean = self.correct(raw),
            white = self.parent.XYZ.white();

        //
        xyz.y = (clean.l + 16) / 116;
        xyz.x = clean.a / 500 + xyz.y;
        xyz.z = xyz.y - clean.b / 200;

        //
        for (alias in xyz) {
            powed = Math.pow(xyz[alias], 3);

            if (powed > 0.008856) {
                xyz[alias] = powed;
            } else {
                xyz[alias] = (xyz[alias] - 16 / 116) / 7.787;
            }

            xyz[alias] = self.parent.round(xyz[alias] * white[alias], rnd);
        }

        return xyz;
    }

    /**
     * Check if the LAB format given
     *
     * @static
     *
     * @param {string|object} raw
     *
     * @return {boolean}
     */
    self.check = function(raw) {
        return self.parent.check(raw, 'LAB');
    }

    /**
     * Get the correct RGB format
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.correct = function(raw) {
        return self.parent.correct(raw, 'LAB', true);
    }

    return self;

}).call(IColor);



/**
 * RGB format
 */
IColor.RGB = IColor.RGB || (function() {

    /**
     * @static
     *
     * @param {string} raw
     *
     * @return {object}
     *
     * Static properties and methods:
     *
     * @property _raw
     * @property def
     * @property parent
     * @function HEX
     * @function HSV
     * @function LAB
     * @function XYZ
     * @function correct
     */
    function
        self(raw) {
            return self.parent.convert(raw, 'RGB');
        }

    /**
     * B minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.b = {
        min : 0,
        max : 255
    };

    /**
     * G minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.g = {
        min : 0,
        max : 255
    };

    /**
     * R minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.r = {
        min : 0,
        max : 255
    };

    /**
     * Link to the parent object
     *
     * @static
     *
     * @type {object}
     */
    self.parent = this;

    /**
     * RGB > HEX
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.HEX = function(raw) {
        var
            loop  = '',
            tmp   = {},
            clean = self.correct(raw);

        //
        tmp.r = clean.r.toString(16),
        tmp.g = clean.g.toString(16),
        tmp.b = clean.b.toString(16);

        //
        for (loop in tmp) {
            if (tmp[loop].length < 2) {
                tmp[loop] = '0' + tmp[loop];
            }
        }

        return tmp.r + tmp.g + tmp.b;
    }

    /**
     * RGB > HSV
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.HSV = function(raw) {
        var
            r     = 0,
            g     = 0,
            b     = 0,
            min   = 0,
            max   = 0,
            delta = 0,
            hsv   = {
                        h : 0,
                        s : 0,
                        v : 0
                    },
            clean = self.correct(raw);

        r = clean.r / 255;
        g = clean.g / 255;
        b = clean.b / 255;

        //
        if (r >= g && r >= g) {
            max = r;
            min = g > b ? b : g;
        } else if (g >= b && g >= r) {
            max = g;
            min = r > b ? b : r;
        } else {
            max = b;
            min = g > r ? r : g;
        }

        //
        hsv.v = max;
        hsv.s = (max) ? ((max - min) / max) : 0;

        //
        if (!hsv.s) {
            hsv.h = 0;
        } else {
            delta = max - min;

            if (r == max) {
                hsv.h = (g - b) / delta;
            } else if (g == max) {
                hsv.h = 2 + (b - r) / delta;
            } else {
                hsv.h = 4 + (r - g) / delta;
            }

            hsv.h = parseInt(hsv.h * 60);

            if (hsv.v < 0) {
                hsv.v += 360;
            }
        }

        hsv.s = parseInt(hsv.s * 100);
        hsv.v = parseInt(hsv.v * 100);

        return hsv;
    }

    /**
     * RGB > LAB
     *
     * @param {object}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.LAB = function(raw, rnd) {
        return self.parent.XYZ.LAB(self.XYZ(raw), rnd);
    }

    /**
     * RGB > XYZ
     *
     * @param {object}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.XYZ = function(raw, rnd) {
        var
            tmp   = '',
            loop  = '',
            rgb   = null,
            xyz   = null,
            clean = self.correct(raw);;

        //
        rgb = {
            r : clean.r / 255,
            g : clean.g / 255,
            b : clean.b / 255
        }

        //
        for (loop in rgb) {
            if (rgb[loop] > 0.04045) {
                rgb[loop] = Math.pow(((rgb[loop] + 0.055) / 1.055), 2.4);
            } else {
                rgb[loop] /= 12.92;
            }

            rgb[loop] = rgb[loop] * 100;
        }

        //
        xyz = {
            x : rgb.r * 0.4124 + rgb.g * 0.3576 + rgb.b * 0.1805,
            y : rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722,
            z : rgb.r * 0.0193 + rgb.g * 0.1192 + rgb.b * 0.9505
        };

        //
        for (loop in xyz) {
            xyz[loop] = self.parent.round(xyz[loop], rnd);
        }

        return xyz;
    }

    /**
     * Check if the RGB format given
     *
     * @static
     *
     * @param {string|object} raw
     *
     * @return {boolean}
     */
    self.check = function(raw) {
        return self.parent.check(raw, 'RGB');
    }

    /**
     * Get the correct RGB format
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.correct = function(raw) {
        return self.parent.correct(raw, 'RGB', true);
    }

    return self;

}).call(IColor);



/**
 * XYZ format
 */
IColor.XYZ = IColor.XYZ || (function() {

    /**
     * @static
     *
     * @param {string} raw
     *
     * @return {object}
     *
     * Static properties and methods:
     *
     * @property _raw
     * @property def
     * @property parent
     * @function HSV
     * @function LAB
     * @function RGB
     * @property white
     * @function correct
     */
    function
        self(raw) {
            return self.parent.convert(raw, 'XYZ');
        }

    /**
     * X minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.x = {
        min : 0,
        max : 95.047
    };

    /**
     * Y minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.y = {
        min : 0,
        max : 100
    };

    /**
     * Z minimum and maximum values
     *
     * @static
     *
     * @type {object}
     */
    self.z = {
        min : 0,
        max : 108.883
    };

    /**
     * Link to the parent object
     *
     * @static
     *
     * @type {object}
     */
    self.parent = this;

    /**
     * XYZ > HEX
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.HEX = function(raw) {
        return self.parent.RGB.HEX(self.RGB(raw));
    }

    /**
     * XYZ > HSV
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.HSV = function(raw) {
        return self.parent.RGB.HSV(self.RGB(raw));
    }

    /**
     * XYZ > LAB
     *
     * @param {object}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.LAB = function(raw, rnd) {

        var
            loop  = '',
            xyz   = {},
            clean = self.correct(raw),
            white = self.white();

        for (loop in clean) {
            xyz[loop] = clean[loop] / white[loop];

            if (xyz[loop] > 0.008856) {
                xyz[loop] = Math.pow(xyz[loop], 1 / 3);
            } else {
                xyz[loop] = (7.787 * xyz[loop]) + (16 / 116);
            }
        }

        return {
            l : self.parent.round(116 * xyz.y - 16, rnd),
            a : self.parent.round(500 * (xyz.x - xyz.y), rnd),
            b : self.parent.round(200 * (xyz.y - xyz.z), rnd)
        };
    }

    /**
     * XYZ > RGB
     *
     * @param {object}           raw
     * @param {undefined|number} rnd
     *
     * @return {object}
     */
    self.RGB = function(raw, rnd) {
        var
            loop = '',
            xyz  = null,
            rgb  = null,
            clean = self.correct(raw);

        //
        xyz = {
            x : clean.x / 100,
            y : clean.y / 100,
            z : clean.z / 100
        };

        //
        rgb = {
            r : xyz.x * 3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986,
            g : xyz.x * -0.9689 + xyz.y * 1.8758 + xyz.z * 0.0415,
            b : xyz.x * 0.0557 + xyz.y * -0.2040 + xyz.z * 1.0570
        }

        //
        for (loop in rgb) {
            rgb[loop] = self.parent.round(rgb[loop], rnd);

            if (rgb[loop] < 0) {
                rgb[loop] = 0;
            }

            if (rgb[loop] > 0.0031308) {
                rgb[loop] = 1.055 * Math.pow(rgb[loop], (1 / 2.4)) - 0.055;
            } else {
                rgb[loop] *= 12.92;
            }

            rgb[loop] = Math.round(rgb[loop] * 255);
        }

        return rgb;
    }

    /**
     * Check if the XYZ format given
     *
     * @static
     *
     * @param {string|object} raw
     *
     * @return {boolean}
     */
    self.check = function(raw) {
        return self.parent.check(raw, 'XYZ');
    }

    /**
     * Get the white point
     *
     * @todo allow to reset the white point (http://courses.graphicon.ru/files/courses/imagesynt/2011/lectures/mis_lect04_11.pdf)
     *
     * @static
     *
     * @return {object}
     */
    self.white = function(type) {
        // 1931 x=0.31271, y=0.32902 standart observer
        // 1931 x=0.31382, y=0.33100 supplementary observer
        //
        return {
            x : 95.047,
            y : 100.000,
            z : 108.883
        }
    }

    /**
     * Get the correct RGB format
     *
     * @param {object} raw
     *
     * @return {object}
     */
    self.correct = function(raw) {
        return self.parent.correct(raw, 'XYZ', true);
    }

    return self;

}).call(IColor);
