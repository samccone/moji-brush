//     colorLab.js
//     (c) 2013 Stefan Huber, Signalwerk GmbH
//     colorLab may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://colorlabjs.org
// good infos and sources;
// https://www.rit.edu/cos/colorscience/rc_useful_data.php
// http://www.brucelindbloom.com/iPhone/ColorConv.html
// colorLab Class
// ---------------
// At the moment there ist just support for CIELAB
// Initialize the Class with
//
//
//     new colorLab('CIELAB', [2, 4, 6]);
// or
//
//     new colorLab('CIELAB');
var colorLab = (function (space, values) {

  // Initial Setup
  // -------------

  // Save a reference to the global object
  var root = this;


  // Current version of the library.
  this.VERSION = '0.1.1';


  // constatnats
  this.kK = 24389.0 / 27.0; // 903.296296296
  this.kE = 216.0 / 24389.0; // 0.00885645167


  this._currentSpace = 'none';
  this._CIELAB = {};
  this._CMYK = {};

  this.helper = {};

  this.helper.math = {

    toDegrees: function (angle) {
      return angle * (180 / Math.PI);
    },

    // Converts numeric degrees to radians
    toRad: function (num) {
      return num * Math.PI / 180;
    },

    // Convert from 0-1 to 0-255
    to8bit: function (num) {
      return root.helper.math.range8bit(num * 255);
    },

    // Convert from 0-1 to 0-255
    range8bit: function (num) {
      return Math.round(Math.min(255, Math.max(0, num)));
    }

  };

  this.helper.convert = {


    CIEXYZCIELAB: function (XYZ, RefWhite) {

      var fHelper = function (t) {
        if (t > root.kE) {
          return Math.pow(t, 1.0 / 3.0);
        } else {
          return ((root.kK * t + 16.0) / 116.0);
        }
      };

      var fx = fHelper(XYZ.X / RefWhite.X);
      var fy = fHelper(XYZ.Y / RefWhite.Y);
      var fz = fHelper(XYZ.Z / RefWhite.Z);

      var Lab = {};
      Lab.L = 116.0 * fy - 16.0;
      Lab.a = 500.0 * (fx - fy);
      Lab.b = 200.0 * (fy - fz);
      return Lab;
    },


    CIELABCIExyz: function (Lab, RefWhite) {

      var fHelper = function (t, m) {
        var p = Math.pow(t, 3);

        if (p > root.kE) {
          return p * m;
        } else {
          return ((t - 16.0 / 116.0) / 7.787) * m;
        }
      };

      var fy = (Lab.CIELAB.L() + 16.0) / 116.0;
      var fx = Lab.CIELAB.a() / 500.0 + fy;
      var fz = fy - Lab.CIELAB.b() / 200.0;


      // console.log(fy, fx, fz)
      //console.log(RefWhite.x, RefWhite.y, RefWhite.z)
      // console.log(fHelper(fx * RefWhite.x))
      // console.log(fHelper(fy * RefWhite.y))
      // console.log(fHelper(fz * RefWhite.z))

      var xyz = {};
      xyz.x = fHelper(fx, RefWhite.x);
      xyz.y = fHelper(fy, RefWhite.y);
      xyz.z = fHelper(fz, RefWhite.z);
      return xyz;

    },




    LABRGB: function (lab, RefWhite, RefMtx) {



      xyz = root.helper.convert.CIELABCIExyz(lab, RefWhite);


      rgb = root.helper.convert.xyzRGB(


        {
          x: xyz.x,
          y: xyz.y,
          z: xyz.z,
        }, RefMtx

      );



      return rgb;

    },

    gammaCompensate: function (linearValue, gamma, gammaStyle) {

      if (gammaStyle.toLowerCase() === 'srgb') {
        // sRGB Gamma corrections
        // sRGB-Standard = Gamma 2.4 (average ~2.2)
        // Gamma correction is linear for <= 0.0031308
        // Gamma correction is nonlinear for > 0.0031308

        if (linearValue < 0) {
          return 0;
        }

        if (linearValue <= 0.0031308) {
          return 12.92 * linearValue;
        } else {
          return 1.055 * Math.pow(linearValue, 1.0 / 2.4) - 0.055;
        }
      } else {
        return Math.pow(linearValue, 1 / gamma);
      }



    },


    // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html

    xyzRGB: function (xyz, RefMtx) {


      xyz = {
        x: xyz.x / 100.0,
        y: xyz.y / 100.0,
        z: xyz.z / 100.0
      };

      var RGB = {};
      RGB.R = xyz.x * RefMtx.m1 + xyz.y * RefMtx.m4 + xyz.z * RefMtx.m7;
      RGB.G = xyz.x * RefMtx.m2 + xyz.y * RefMtx.m5 + xyz.z * RefMtx.m8;
      RGB.B = xyz.x * RefMtx.m3 + xyz.y * RefMtx.m6 + xyz.z * RefMtx.m9;

      RGB.R = root.helper.math.to8bit(root.helper.convert.gammaCompensate(RGB.R, RefMtx.gamma, RefMtx.gammastyle));
      RGB.G = root.helper.math.to8bit(root.helper.convert.gammaCompensate(RGB.G, RefMtx.gamma, RefMtx.gammastyle));
      RGB.B = root.helper.math.to8bit(root.helper.convert.gammaCompensate(RGB.B, RefMtx.gamma, RefMtx.gammastyle));


      return RGB;
    }
  };



  // ### to work in the CIELAB colorspace
  // use it with `colorLab.CIELAB`
  this.CIELAB = {
    init: function (L, a, b) {
      root._CIELAB = {
        L: 0,
        a: 0,
        b: 0
      };
      this.L(L);
      this.a(a);
      this.b(b);
    },

    L: function (L) {
      if (L === undefined) {
        return root._CIELAB.L;
      } else {
        root._CIELAB.L = Math.min(100, Math.max(-100, L));
      }
    },
    a: function (a) {
      if (a === undefined) {
        return root._CIELAB.a;
      } else {
        root._CIELAB.a = Math.min(128, Math.max(-128, a));
      }
    },
    b: function (b) {
      if (b === undefined) {
        return root._CIELAB.b;
      } else {
        root._CIELAB.b = Math.min(128, Math.max(-128, b));
      }
    },

    // add value to pint like `add({x: 1, y: 2})`
    add: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a + b;
      });
    },
    sub: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a - b;
      });
    },
    mul: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a * b;
      });
    },
    div: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a / b;
      });
    },
    floor: function () {
      return this._fnTemplate(null, function (a) {
        return Math.floor(a);
      });
    },
    round: function () {
      return this._fnTemplate(null, function (a) {
        return Math.round(a);
      });
    },

    // #### general function template
    // this is the general template to run the generalized functions
    _fnTemplate: function (other, op) {

      // run function without an additional numeric imput like `add(2)`
      if (typeof (other) === 'number') {
        this.L(op(this.L(), other));
        this.a(op(this.a(), other));
        this.b(op(this.b(), other));
        return this;
      }

      // run function without an additional imput like `round()`
      if (other === null) {
        this.L(op(this.L()));
        this.a(op(this.a()));
        this.b(op(this.b()));
        return this;
      }

      // run function without an additional imput of type colorLab or objects `add({L: 2, a: 3, b: 2})`

      if (other.CIELAB === undefined) {
        this.L(op(this.L(), other.L));
      } else {
        this.L(op(this.L(), other.CIELAB.L()));
      }

      if (other.CIELAB === undefined) {
        this.a(op(this.a(), other.a));
      } else {
        this.a(op(this.a(), other.CIELAB.a()));
      }

      if (other.CIELAB === undefined) {
        this.b(op(this.b(), other.b));
      } else {
        this.b(op(this.b(), other.CIELAB.b()));
      }

      return this;
    },


    // http://lofi.forum.physorg.com/Convertion-from-nanometers-to-CIELAB-values_7984.html
    // Tristimulus values
    spectrum: function (spectralSet) {

      // with illuminant D !!!!!!! and 2° CIE1931

      var XYZ = {
        X: 0.0,
        Y: 0.0,
        Z: 0.0
      };
      var totalGet = 0;

      for (var i = 0; i < spectralSet.length; i++) {


        var currentNm = spectralSet[i].nm;

        var accordingIlluminant = colorLab.illuminant.D.filter(function (el) {
          return el.nm == currentNm;
        });

        // look for the current illuminant-value
        if (accordingIlluminant.length != 1) {
          throw {
            type: 'data',
            message: 'there is no corresponding illumination value for current nm'
          };
        } else {
          accordingIlluminant = accordingIlluminant[0];
        }

        // look for the current Observer-value
        var accordingObserver = colorLab.observer.CIE1931.filter(function (el) {
          return el.nm == currentNm;
        });

        if (accordingObserver.length != 1) {
          throw {
            type: 'data',
            message: 'there is no corresponding nm-Value in the observer-data'
          };
        } else {
          accordingObserver = accordingObserver[0];
        }

        // we need this to normalize the data afterwards
        totalGet += accordingObserver.xyz[1] * accordingIlluminant.power;

        // sum up all values in the nm-array
        XYZ.X += accordingObserver.xyz[0] * accordingIlluminant.power * spectralSet[i].value;
        XYZ.Y += accordingObserver.xyz[1] * accordingIlluminant.power * spectralSet[i].value;
        XYZ.Z += accordingObserver.xyz[2] * accordingIlluminant.power * spectralSet[i].value;


      }


      XYZ.X = XYZ.X / totalGet;
      XYZ.Y = XYZ.Y / totalGet;
      XYZ.Z = XYZ.Z / totalGet;

      // convert to CIELAB with D-Illuminant
      var specLAB = root.helper.convert.CIEXYZCIELAB({
        X: XYZ.X,
        Y: XYZ.Y,
        Z: XYZ.Z
      }, {
        X: 0.96397188,
        Y: 1.0,
        Z: 0.824037097
      });

      this.L(specLAB.L);
      this.a(specLAB.a);
      this.b(specLAB.b);
    },


    // find deltaE of two colorLab Variables
    CIEDE2000: function (newPoint) {

      // for more details see
      // http://www.ece.rochester.edu/~gsharma/ciede2000/
      // http://www.ece.rochester.edu/~gsharma/ciede2000/ciede2000noteCRNA.pdf
      // http://www.ece.rochester.edu/~gsharma/ciede2000/dataNprograms/deltaE2000.m
      // http://en.wikipedia.org/wiki/Color_difference

      // weighting factors
      var k_L = 1;
      var k_C = 1;
      var k_H = 1;

      // Input Lab pairs
      var Lab1 = {
        L: this.L(),
        a: this.a(),
        b: this.b()
      };
      var Lab2 = {
        L: newPoint.CIELAB.L(),
        a: newPoint.CIELAB.a(),
        b: newPoint.CIELAB.b()
      };

      // we calculate a C* to compensate later the for chroma
      Lab1.C = Math.sqrt(Math.pow(Lab1.a, 2) + Math.pow(Lab1.b, 2));
      Lab2.C = Math.sqrt(Math.pow(Lab2.a, 2) + Math.pow(Lab2.b, 2));

      var C_avr = (Lab1.C + Lab2.C) / 2; // average of the two C


      // console.log(Lab1);
      // console.log(Lab2);

      // get G for the colors
      var G = 0.5 * (1 - Math.sqrt(Math.pow(C_avr, 7) / (Math.pow(C_avr, 7) + Math.pow(25, 7))));
      // console.log('G', G);

      // add for both colors the a'
      Lab1.a_1 = (1 + G) * Lab1.a;
      Lab2.a_1 = (1 + G) * Lab2.a;

      // console.log('Lab1.a_1', Lab1.a_1);
      // console.log('Lab2.a_1', Lab2.a_1);

      // add for both colors the C'
      Lab1.C_1 = Math.sqrt(Math.pow(Lab1.a_1, 2) + Math.pow(Lab1.b, 2));
      Lab2.C_1 = Math.sqrt(Math.pow(Lab2.a_1, 2) + Math.pow(Lab2.b, 2));

      // console.log('Lab1.C_1', Lab1.C_1);
      // console.log('Lab2.C_1', Lab2.C_1);


      // add h' for both colors
      if (Lab1.a_1 === 0 && Lab1.b === 0) {
        Lab1.h = 0;
      } else {
        if (Lab1.b >= 0) {
          Lab1.h = root.helper.math.toDegrees(Math.atan2(Lab1.b, Lab1.a_1));
        } else {
          Lab1.h = root.helper.math.toDegrees(Math.atan2(Lab1.b, Lab1.a_1)) + 360;
        }
      }

      if (Lab2.a_1 === 0 && Lab2.b === 0) {
        Lab2.h = 0;
      } else {
        if (Lab2.b >= 0) {
          Lab2.h = root.helper.math.toDegrees(Math.atan2(Lab2.b, Lab2.a_1));
        } else {
          Lab2.h = root.helper.math.toDegrees(Math.atan2(Lab2.b, Lab2.a_1)) + 360;
        }
      }

      // console.log('Lab1.h', Lab1.h);
      // console.log('Lab2.h', Lab2.h);



      // Now calculate the signed differences in lightness, chroma, and hue

      // get the delta h and delta H
      var deltah;
      if ((Lab1.C_1 * Lab2.C_1) === 0) {
        deltah = 0;
      } else {
        if (Math.abs(Lab2.h - Lab1.h) <= 180) {
          deltah = Lab2.h - Lab1.h;
        } else {
          if (Lab2.h - Lab1.h > 180) {
            deltah = Lab2.h - Lab1.h - 360;
          } else {
            deltah = Lab2.h - Lab1.h + 360;
          }
        }
      }
      var deltaH = 2 * Math.sqrt(Lab1.C_1 * Lab2.C_1) * Math.sin(root.helper.math.toRad(deltah / 2));

      // console.log('deltah: ', deltah);
      // console.log('deltaH: ', deltaH);

      // the delta for lightness
      var deltaL = Lab1.L - Lab2.L;
      // console.log('deltaL', deltaL);


      // the delta for chroma
      var deltaC = Lab2.C_1 - Lab1.C_1;
      // console.log('deltaC', deltaC);


      // Calculate CIEDE2000 Color-Difference

      var L_ave = (Lab1.L + Lab2.L) / 2;
      var C_1ave = (Lab1.C_1 + Lab2.C_1) / 2;

      // console.log('L_ave', L_ave);
      // console.log('C_1ave', C_1ave);

      var hDiff;
      if ((Lab1.C_1 * Lab2.C_1) === 0) {
        hDiff = Lab1.h + Lab2.h;
      } else {
        if (Math.abs(Lab2.h - Lab1.h) > 180) {
          if ((Lab2.h + Lab1.h) < 360) {
            hDiff = Lab1.h + Lab2.h + 360;
          } else {
            hDiff = Lab1.h + Lab2.h - 360;
          }
        } else {
          hDiff = Lab1.h + Lab2.h;
        }
        hDiff = hDiff / 2;
      }

      // console.log('hDiff', hDiff);


      var L_aveMinus50pow2 = Math.pow((L_ave - 50), 2);
      // console.log('L_aveMinus50pow2', L_aveMinus50pow2);


      var SL = 1 + ((0.015 * L_aveMinus50pow2) / Math.sqrt(20 + L_aveMinus50pow2));
      // console.log('SL', SL);

      var SC = 1 + 0.045 * C_1ave;
      // console.log('SC', SC);


      var T = 1 - 0.17 * Math.cos(root.helper.math.toRad(hDiff - 30)) + 0.24 * Math.cos(root.helper.math.toRad(2 * hDiff)) + 0.32 * Math.cos(root.helper.math.toRad(3 * hDiff + 6)) - 0.20 * Math.cos(root.helper.math.toRad(4 * hDiff - 63));

      // console.log('T', T);

      var SH = 1 + 0.015 * C_1ave * T;
      // console.log('SH', SH);

      var dTheta = 30 * Math.exp(-1 * Math.pow((hDiff - 275) / 25, 2));
      // console.log('dTheta', dTheta);

      var RC = 2 * Math.sqrt(Math.pow(C_1ave, 7) / (Math.pow(C_1ave, 7) + Math.pow(25, 7)));
      // console.log('RC', RC);

      var RT = 0 - Math.sin(root.helper.math.toRad(2 * dTheta)) * RC;
      // console.log('RT', RT);



      var dkL = deltaL / (k_L * SL);
      var dkC = deltaC / (k_C * SC);
      var dkH = deltaH / (k_H * SH);

      // console.log('dkL', dkL);
      // console.log('dkC', dkC);
      // console.log('dkH', dkH);

      var CIEDE2000 = Math.sqrt(Math.pow(dkL, 2) + Math.pow(dkC, 2) + Math.pow(dkH, 2) + RT * dkC * dkH);

      // console.log('CIEDE2000', CIEDE2000);

      return CIEDE2000;

    },

    toArray: function () {
      return [this.L(), this.a(), this.b()];
    },

    // plot the Lab-Values
    toString: function () {
      return 'L: ' + this.L() + ', a: ' + this.a() + ', b: ' + this.b();
    },

    // shorthand for toString
    print: function () {
      return this.toString();
    }
  };

  // ### to work in the CMYK colorspace
  // use it with `colorLab.CMYK`
  this.CMYK = {
    init: function (C, M, Y, K) {
      root._CMYK = {
        C: 0,
        M: 0,
        Y: 0,
        K: 0
      };
      this.C(C);
      this.M(M);
      this.Y(Y);
      this.K(K);
    },

    C: function (C) {
      if (C === undefined) {
        return root._CMYK.C;
      } else {
        root._CMYK.C = C;
      }
    },
    M: function (M) {
      if (M === undefined) {
        return root._CMYK.M;
      } else {
        root._CMYK.M = M;
      }
    },
    Y: function (Y) {
      if (Y === undefined) {
        return root._CMYK.Y;
      } else {
        root._CMYK.Y = Y;
      }
    },
    K: function (K) {
      if (K === undefined) {
        return root._CMYK.K;
      } else {
        root._CMYK.K = K;
      }
    },

    // add value to pint like `add({x: 1, y: 2})`
    add: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a + b;
      });
    },
    sub: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a - b;
      });
    },
    mul: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a * b;
      });
    },
    div: function (other) {
      return this._fnTemplate(other, function (a, b) {
        return a / b;
      });
    },
    floor: function () {
      return this._fnTemplate(null, function (a) {
        return Math.floor(a);
      });
    },
    round: function () {
      return this._fnTemplate(null, function (a) {
        return Math.round(a);
      });
    },

    // #### general function template
    // this is the general template to run the generalized functions
    _fnTemplate: function (other, op) {

      // run function without an additional numeric imput like `add(2)`
      if (typeof (other) === 'number') {
        this.C(op(this.C(), other));
        this.M(op(this.M(), other));
        this.Y(op(this.Y(), other));
        this.K(op(this.K(), other));
        return this;
      }

      // run function without an additional imput like `round()`
      if (other === null) {
        this.C(op(this.C()));
        this.M(op(this.M()));
        this.Y(op(this.Y()));
        this.K(op(this.K()));
        return this;
      }

      // run function without an additional imput of type colorLab or objects `add({L: 2, a: 3, b: 2})`

      if (other.CMYK === undefined) {
        this.C(op(this.C(), other.C));
      } else {
        this.C(op(this.C(), other.CMYK.C()));
      }

      if (other.CMYK === undefined) {
        this.M(op(this.M(), other.M));
      } else {
        this.M(op(this.M(), other.CMYK.M()));
      }

      if (other.CMYK === undefined) {
        this.Y(op(this.Y(), other.Y));
      } else {
        this.Y(op(this.Y(), other.CMYK.Y()));
      }

      if (other.CMYK === undefined) {
        this.K(op(this.K(), other.K));
      } else {
        this.K(op(this.K(), other.CMYK.K()));
      }


      return this;
    },

    toArray: function () {
      return [this.C(), this.M(), this.Y(), this.K()];
    },

    // plot the Color-Values
    toString: function () {
      return 'C: ' + this.C() + ', M: ' + this.M() + ', Y: ' + this.Y() + ', K: ' + this.K();
    },

    // shorthand for toString
    print: function () {
      return this.toString();
    }
  };



  if (space !== undefined) {

    switch (space) {
    case 'CIELAB':
      this._currentSpace = space;

      if (values === undefined) {
        this.CIELAB.init(0, 0, 0);
      } else {
        this.CIELAB.init(values[0], values[1], values[2]);
      }
      break;
    case 'CMYK':
      this._currentSpace = space;

      if (values === undefined) {
        this.CMYK.init(0, 0, 0, 0);
      } else {
        this.CMYK.init(values[0], values[1], values[2], values[3]);
      }
      break;
    default:
      throw {
        type: 'implementation',
        message: 'at the moment you can just use CIELAB-Colorspce.'
      };
    }
  }



});




/*


github-page >> http://ricostacruz.com/flatdoc/


// http://jsperf.com/linear-interpolation/5
function linearInterpolation(min, max, k) {
    return min + (max - min) * k;
}

http://bl.ocks.org/mbostock/4281513
http://bl.ocks.org/mbostock/3014589
dont mix colors in lab!! mix in xyz!!!


http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html

 */



//D65
colorLab.XYZ2RGBMtx = {

  CIED65 : {
    AdobeRGB : {name: 'Adobe RGB (1998)', m1: 2.04148, m2: -0.969258, m3: 0.0134455, m4: -0.564977, m5: 1.87599, m6: -0.118373, m7: -0.344713, m8: 0.0415557, m9: 1.01527, gamma: 2.2, gammastyle: 'nonlinear'}, // precise gamma: 563/256 (2.19921875)
    AppleRGB : {name: 'Apple RGB', m1: 2.95176, m2: -1.0851, m3: 0.0854804, m4: -1.28951, m5: 1.99084, m6: -0.269456, m7: -0.47388, m8: 0.0372023, m9: 1.09113, gamma: 1.8},
    ECIRGB   : {name: 'ECI RGB', m1: 1.78276, m2: -0.959362, m3: 0.0859318, m4: -0.496985, m5: 1.9478, m6: -0.174467, m7: -0.26901, m8: -0.0275807, m9: 1.32283, gamma: 1.8},
    sRGB     : {name: 'sRGB', m1: 3.24071, m2: -0.969258, m3: 0.0556352, m4: -1.53726, m5: 1.87599, m6: -0.203996, m7: -0.498571, m8: 0.0415557, m9: 1.05707, gamma: 2.4, gammastyle: 'sRGB'}
  }
};



// Relative spectral power distribution of CIE Standard Illuminant D65
// Source: http://www.cie.co.at/publ/abst/datatables15_2004/CIE_sel_colorimetric_tables.xls
colorLab.illuminant = {
  CIED65 : [
    {nm: 300, power: 0.0341},
    {nm: 305, power: 1.6643},
    {nm: 310, power: 3.2945},
    {nm: 315, power: 11.7652},
    {nm: 320, power: 20.236},
    {nm: 325, power: 28.6447},
    {nm: 330, power: 37.0535},
    {nm: 335, power: 38.5011},
    {nm: 340, power: 39.9488},
    {nm: 345, power: 42.4302},
    {nm: 350, power: 44.9117},
    {nm: 355, power: 45.775},
    {nm: 360, power: 46.6383},
    {nm: 365, power: 49.3637},
    {nm: 370, power: 52.0891},
    {nm: 375, power: 51.0323},
    {nm: 380, power: 49.9755},
    {nm: 385, power: 52.3118},
    {nm: 390, power: 54.6482},
    {nm: 395, power: 68.7015},
    {nm: 400, power: 82.7549},
    {nm: 405, power: 87.1204},
    {nm: 410, power: 91.486},
    {nm: 415, power: 92.4589},
    {nm: 420, power: 93.4318},
    {nm: 425, power: 90.057},
    {nm: 430, power: 86.6823},
    {nm: 435, power: 95.7736},
    {nm: 440, power: 104.865},
    {nm: 445, power: 110.936},
    {nm: 450, power: 117.008},
    {nm: 455, power: 117.41},
    {nm: 460, power: 117.812},
    {nm: 465, power: 116.336},
    {nm: 470, power: 114.861},
    {nm: 475, power: 115.392},
    {nm: 480, power: 115.923},
    {nm: 485, power: 112.367},
    {nm: 490, power: 108.811},
    {nm: 495, power: 109.082},
    {nm: 500, power: 109.354},
    {nm: 505, power: 108.578},
    {nm: 510, power: 107.802},
    {nm: 515, power: 106.296},
    {nm: 520, power: 104.79},
    {nm: 525, power: 106.239},
    {nm: 530, power: 107.689},
    {nm: 535, power: 106.047},
    {nm: 540, power: 104.405},
    {nm: 545, power: 104.225},
    {nm: 550, power: 104.046},
    {nm: 555, power: 102.023},
    {nm: 560, power: 100},
    {nm: 565, power: 98.1671},
    {nm: 570, power: 96.3342},
    {nm: 575, power: 96.0611},
    {nm: 580, power: 95.788},
    {nm: 585, power: 92.2368},
    {nm: 590, power: 88.6856},
    {nm: 595, power: 89.3459},
    {nm: 600, power: 90.0062},
    {nm: 605, power: 89.8026},
    {nm: 610, power: 89.5991},
    {nm: 615, power: 88.6489},
    {nm: 620, power: 87.6987},
    {nm: 625, power: 85.4936},
    {nm: 630, power: 83.2886},
    {nm: 635, power: 83.4939},
    {nm: 640, power: 83.6992},
    {nm: 645, power: 81.863},
    {nm: 650, power: 80.0268},
    {nm: 655, power: 80.1207},
    {nm: 660, power: 80.2146},
    {nm: 665, power: 81.2462},
    {nm: 670, power: 82.2778},
    {nm: 675, power: 80.281},
    {nm: 680, power: 78.2842},
    {nm: 685, power: 74.0027},
    {nm: 690, power: 69.7213},
    {nm: 695, power: 70.6652},
    {nm: 700, power: 71.6091},
    {nm: 705, power: 72.979},
    {nm: 710, power: 74.349},
    {nm: 715, power: 67.9765},
    {nm: 720, power: 61.604},
    {nm: 725, power: 65.7448},
    {nm: 730, power: 69.8856},
    {nm: 735, power: 72.4863},
    {nm: 740, power: 75.087},
    {nm: 745, power: 69.3398},
    {nm: 750, power: 63.5927},
    {nm: 755, power: 55.0054},
    {nm: 760, power: 46.4182},
    {nm: 765, power: 56.6118},
    {nm: 770, power: 66.8054},
    {nm: 775, power: 65.0941},
    {nm: 780, power: 63.3828},
    {nm: 785, power: 63.8434},
    {nm: 790, power: 64.304},
    {nm: 795, power: 61.8779},
    {nm: 800, power: 59.4519},
    {nm: 805, power: 55.7054},
    {nm: 810, power: 51.959},
    {nm: 815, power: 54.6998},
    {nm: 820, power: 57.4406},
    {nm: 825, power: 58.8765},
    {nm: 830, power: 60.3125}
  ],
  D :  [
    {nm: 340, power: 17.92},
    {nm: 350, power: 20.98},
    {nm: 360, power: 23.91},
    {nm: 370, power: 25.89},
    {nm: 380, power: 24.45},
    {nm: 390, power: 29.83},
    {nm: 400, power: 49.25},
    {nm: 410, power: 56.45},
    {nm: 420, power: 59.97},
    {nm: 430, power: 57.76},
    {nm: 440, power: 74.77},
    {nm: 450, power: 87.19},
    {nm: 460, power: 90.56},
    {nm: 470, power: 91.32},
    {nm: 480, power: 95.07},
    {nm: 490, power: 91.93},
    {nm: 500, power: 95.70},
    {nm: 510, power: 96.59},
    {nm: 520, power: 97.11},
    {nm: 530, power: 102.09},
    {nm: 540, power: 100.75},
    {nm: 550, power: 102.31},
    {nm: 560, power: 100.00},
    {nm: 570, power: 97.74},
    {nm: 580, power: 98.92},
    {nm: 590, power: 93.51},
    {nm: 600, power: 97.71},
    {nm: 610, power: 99.29},
    {nm: 620, power: 99.07},
    {nm: 630, power: 95.75},
    {nm: 640, power: 98.90},
    {nm: 650, power: 95.71},
    {nm: 660, power: 98.24},
    {nm: 670, power: 103.06},
    {nm: 680, power: 99.19},
    {nm: 690, power: 87.43},
    {nm: 700, power: 91.66},
    {nm: 710, power: 92.94},
    {nm: 720, power: 76.89},
    {nm: 730, power: 86.56},
    {nm: 740, power: 92.63},
    {nm: 750, power: 78.27},
    {nm: 760, power: 57.72},
    {nm: 770, power: 82.97},
    {nm: 780, power: 78.31},
    {nm: 790, power: 79.59},
    {nm: 800, power: 73.44},
    {nm: 810, power: 63.95},
    {nm: 820, power: 70.81},
    {nm: 830, power: 74.48}
  ]
};



// 1931 2° CIE Standard Colorimetric Observer Data
// 1964 10 °CIE Standard Colorimetric Observer Data

// nm = Nanometer (light)
// xBar, yBar, and zBar

colorLab.observer = {
  CIE1964 : [
    {nm: 380, xyz: [0.00016, 0.000017, 0.000705]},
    {nm: 385, xyz: [0.000662, 0.000072, 0.002928]},
    {nm: 390, xyz: [0.002362, 0.000253, 0.010482]},
    {nm: 395, xyz: [0.007242, 0.000769, 0.032344]},
    {nm: 400, xyz: [0.01911, 0.002004, 0.086011]},
    {nm: 405, xyz: [0.0434, 0.004509, 0.19712]},
    {nm: 410, xyz: [0.084736, 0.008756, 0.389366]},
    {nm: 415, xyz: [0.140638, 0.014456, 0.65676]},
    {nm: 420, xyz: [0.204492, 0.021391, 0.972542]},
    {nm: 425, xyz: [0.264737, 0.029497, 1.2825]},
    {nm: 430, xyz: [0.314679, 0.038676, 1.55348]},
    {nm: 435, xyz: [0.357719, 0.049602, 1.7985]},
    {nm: 440, xyz: [0.383734, 0.062077, 1.96728]},
    {nm: 445, xyz: [0.386726, 0.074704, 2.0273]},
    {nm: 450, xyz: [0.370702, 0.089456, 1.9948]},
    {nm: 455, xyz: [0.342957, 0.106256, 1.9007]},
    {nm: 460, xyz: [0.302273, 0.128201, 1.74537]},
    {nm: 465, xyz: [0.254085, 0.152761, 1.5549]},
    {nm: 470, xyz: [0.195618, 0.18519, 1.31756]},
    {nm: 475, xyz: [0.132349, 0.21994, 1.0302]},
    {nm: 480, xyz: [0.080507, 0.253589, 0.772125]},
    {nm: 485, xyz: [0.041072, 0.297665, 0.57006]},
    {nm: 490, xyz: [0.016172, 0.339133, 0.415254]},
    {nm: 495, xyz: [0.005132, 0.395379, 0.302356]},
    {nm: 500, xyz: [0.003816, 0.460777, 0.218502]},
    {nm: 505, xyz: [0.015444, 0.53136, 0.159249]},
    {nm: 510, xyz: [0.037465, 0.606741, 0.112044]},
    {nm: 515, xyz: [0.071358, 0.68566, 0.082248]},
    {nm: 520, xyz: [0.117749, 0.761757, 0.060709]},
    {nm: 525, xyz: [0.172953, 0.82333, 0.04305]},
    {nm: 530, xyz: [0.236491, 0.875211, 0.030451]},
    {nm: 535, xyz: [0.304213, 0.92381, 0.020584]},
    {nm: 540, xyz: [0.376772, 0.961988, 0.013676]},
    {nm: 545, xyz: [0.451584, 0.9822, 0.007918]},
    {nm: 550, xyz: [0.529826, 0.991761, 0.003988]},
    {nm: 555, xyz: [0.616053, 0.99911, 0.001091]},
    {nm: 560, xyz: [0.705224, 0.99734, 0]},
    {nm: 565, xyz: [0.793832, 0.98238, 0]},
    {nm: 570, xyz: [0.878655, 0.955552, 0]},
    {nm: 575, xyz: [0.951162, 0.915175, 0]},
    {nm: 580, xyz: [1.01416, 0.868934, 0]},
    {nm: 585, xyz: [1.0743, 0.825623, 0]},
    {nm: 590, xyz: [1.11852, 0.777405, 0]},
    {nm: 595, xyz: [1.1343, 0.720353, 0]},
    {nm: 600, xyz: [1.12399, 0.658341, 0]},
    {nm: 605, xyz: [1.0891, 0.593878, 0]},
    {nm: 610, xyz: [1.03048, 0.527963, 0]},
    {nm: 615, xyz: [0.95074, 0.461834, 0]},
    {nm: 620, xyz: [0.856297, 0.398057, 0]},
    {nm: 625, xyz: [0.75493, 0.339554, 0]},
    {nm: 630, xyz: [0.647467, 0.283493, 0]},
    {nm: 635, xyz: [0.53511, 0.228254, 0]},
    {nm: 640, xyz: [0.431567, 0.179828, 0]},
    {nm: 645, xyz: [0.34369, 0.140211, 0]},
    {nm: 650, xyz: [0.268329, 0.107633, 0]},
    {nm: 655, xyz: [0.2043, 0.081187, 0]},
    {nm: 660, xyz: [0.152568, 0.060281, 0]},
    {nm: 665, xyz: [0.11221, 0.044096, 0]},
    {nm: 670, xyz: [0.081261, 0.0318, 0]},
    {nm: 675, xyz: [0.05793, 0.022602, 0]},
    {nm: 680, xyz: [0.040851, 0.015905, 0]},
    {nm: 685, xyz: [0.028623, 0.01113, 0]},
    {nm: 690, xyz: [0.019941, 0.007749, 0]},
    {nm: 695, xyz: [0.013842, 0.005375, 0]},
    {nm: 700, xyz: [0.009577, 0.003718, 0]},
    {nm: 705, xyz: [0.006605, 0.002565, 0]},
    {nm: 710, xyz: [0.004553, 0.001768, 0]},
    {nm: 715, xyz: [0.003145, 0.001222, 0]},
    {nm: 720, xyz: [0.002175, 0.000846, 0]},
    {nm: 725, xyz: [0.001506, 0.000586, 0]},
    {nm: 730, xyz: [0.001045, 0.000407, 0]},
    {nm: 735, xyz: [0.000727, 0.000284, 0]},
    {nm: 740, xyz: [0.000508, 0.000199, 0]},
    {nm: 745, xyz: [0.000356, 0.00014, 0]},
    {nm: 750, xyz: [0.000251, 0.000098, 0]},
    {nm: 755, xyz: [0.000178, 0.00007, 0]},
    {nm: 760, xyz: [0.000126, 0.00005, 0]},
    {nm: 765, xyz: [0.00009, 0.000036, 0]},
    {nm: 770, xyz: [0.000065, 0.000025, 0]},
    {nm: 775, xyz: [0.000046, 0.000018, 0]},
    {nm: 780, xyz: [0.000033, 0.000013, 0]}
  ],
  CIE1931 : [
    {nm: 380, xyz: [0.001368, 0.000039, 0.00645]},
    {nm: 385, xyz: [0.002236, 0.000064, 0.01055]},
    {nm: 390, xyz: [0.004243, 0.00012, 0.02005]},
    {nm: 395, xyz: [0.00765, 0.000217, 0.03621]},
    {nm: 400, xyz: [0.01431, 0.000396, 0.06785]},
    {nm: 405, xyz: [0.02319, 0.00064, 0.1102]},
    {nm: 410, xyz: [0.04351, 0.00121, 0.2074]},
    {nm: 415, xyz: [0.07763, 0.00218, 0.3713]},
    {nm: 420, xyz: [0.13438, 0.004, 0.6456]},
    {nm: 425, xyz: [0.21477, 0.0073, 1.03905]},
    {nm: 430, xyz: [0.2839, 0.0116, 1.3856]},
    {nm: 435, xyz: [0.3285, 0.01684, 1.62296]},
    {nm: 440, xyz: [0.34828, 0.023, 1.74706]},
    {nm: 445, xyz: [0.34806, 0.0298, 1.7826]},
    {nm: 450, xyz: [0.3362, 0.038, 1.77211]},
    {nm: 455, xyz: [0.3187, 0.048, 1.7441]},
    {nm: 460, xyz: [0.2908, 0.06, 1.6692]},
    {nm: 465, xyz: [0.2511, 0.0739, 1.5281]},
    {nm: 470, xyz: [0.19536, 0.09098, 1.28764]},
    {nm: 475, xyz: [0.1421, 0.1126, 1.0419]},
    {nm: 480, xyz: [0.09564, 0.13902, 0.81295]},
    {nm: 485, xyz: [0.05795, 0.1693, 0.6162]},
    {nm: 490, xyz: [0.03201, 0.20802, 0.46518]},
    {nm: 495, xyz: [0.0147, 0.2586, 0.3533]},
    {nm: 500, xyz: [0.0049, 0.323, 0.272]},
    {nm: 505, xyz: [0.0024, 0.4073, 0.2123]},
    {nm: 510, xyz: [0.0093, 0.503, 0.1582]},
    {nm: 515, xyz: [0.0291, 0.6082, 0.1117]},
    {nm: 520, xyz: [0.06327, 0.71, 0.07825]},
    {nm: 525, xyz: [0.1096, 0.7932, 0.05725]},
    {nm: 530, xyz: [0.1655, 0.862, 0.04216]},
    {nm: 535, xyz: [0.22575, 0.91485, 0.02984]},
    {nm: 540, xyz: [0.2904, 0.954, 0.0203]},
    {nm: 545, xyz: [0.3597, 0.9803, 0.0134]},
    {nm: 550, xyz: [0.43345, 0.99495, 0.00875]},
    {nm: 555, xyz: [0.51205, 1, 0.00575]},
    {nm: 560, xyz: [0.5945, 0.995, 0.0039]},
    {nm: 565, xyz: [0.6784, 0.9786, 0.00275]},
    {nm: 570, xyz: [0.7621, 0.952, 0.0021]},
    {nm: 575, xyz: [0.8425, 0.9154, 0.0018]},
    {nm: 580, xyz: [0.9163, 0.87, 0.00165]},
    {nm: 585, xyz: [0.9786, 0.8163, 0.0014]},
    {nm: 590, xyz: [1.0263, 0.757, 0.0011]},
    {nm: 595, xyz: [1.0567, 0.6949, 0.001]},
    {nm: 600, xyz: [1.0622, 0.631, 0.0008]},
    {nm: 605, xyz: [1.0456, 0.5668, 0.0006]},
    {nm: 610, xyz: [1.0026, 0.503, 0.00034]},
    {nm: 615, xyz: [0.9384, 0.4412, 0.00024]},
    {nm: 620, xyz: [0.85445, 0.381, 0.00019]},
    {nm: 625, xyz: [0.7514, 0.321, 0.0001]},
    {nm: 630, xyz: [0.6424, 0.265, 0.00005]},
    {nm: 635, xyz: [0.5419, 0.217, 0.00003]},
    {nm: 640, xyz: [0.4479, 0.175, 0.00002]},
    {nm: 645, xyz: [0.3608, 0.1382, 0.00001]},
    {nm: 650, xyz: [0.2835, 0.107, 0]},
    {nm: 655, xyz: [0.2187, 0.0816, 0]},
    {nm: 660, xyz: [0.1649, 0.061, 0]},
    {nm: 665, xyz: [0.1212, 0.04458, 0]},
    {nm: 670, xyz: [0.0874, 0.032, 0]},
    {nm: 675, xyz: [0.0636, 0.0232, 0]},
    {nm: 680, xyz: [0.04677, 0.017, 0]},
    {nm: 685, xyz: [0.0329, 0.01192, 0]},
    {nm: 690, xyz: [0.0227, 0.00821, 0]},
    {nm: 695, xyz: [0.01584, 0.005723, 0]},
    {nm: 700, xyz: [0.011359, 0.004102, 0]},
    {nm: 705, xyz: [0.008111, 0.002929, 0]},
    {nm: 710, xyz: [0.00579, 0.002091, 0]},
    {nm: 715, xyz: [0.004109, 0.001484, 0]},
    {nm: 720, xyz: [0.002899, 0.001047, 0]},
    {nm: 725, xyz: [0.002049, 0.00074, 0]},
    {nm: 730, xyz: [0.00144, 0.00052, 0]},
    {nm: 735, xyz: [0.001, 0.000361, 0]},
    {nm: 740, xyz: [0.00069, 0.000249, 0]},
    {nm: 745, xyz: [0.000476, 0.000172, 0]},
    {nm: 750, xyz: [0.000332, 0.00012, 0]},
    {nm: 755, xyz: [0.000235, 0.000085, 0]},
    {nm: 760, xyz: [0.000166, 0.00006, 0]},
    {nm: 765, xyz: [0.000117, 0.000042, 0]},
    {nm: 770, xyz: [0.000083, 0.00003, 0]},
    {nm: 775, xyz: [0.000059, 0.000021, 0]},
    {nm: 780, xyz: [0.000042, 0.000015, 0]}
  ]
};
