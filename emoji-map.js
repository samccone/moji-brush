"use strict";

var emojiMap = {
    "apple": {
        "black": ["1f3a5.png", "1f393.png", "1f3a9.png", "1f3b1.png", "1f403.png", "1f41c.png", "1f4de.png", "1f50c.png"],

        "blue": ["1f6e2.png", "1f4d8.png", "1f698.png", "2693.png"],

        "brown-dark": ["1f4a9.png", "1f330.png", "1f357.png", "1f369.png", "1f3c8.png", "1f45c.png", "1f45e.png", "1f982.png"],

        "blue-light": ["1f4a7.png", "1f3bd.png", "1f433.png", "1f455.png", "2744.png"],

        "brown-light": ["1f36a.png", "1f3c6.png", "1f3c9.png", "1f42a.png", "1f43b.png", "1f4e6.png", "1f6aa.png"],

        "green-dark": ["1f422.png", "1f335.png", "1f409.png", "1f40a.png", "1f40d.png", "1f432.png"],

        "green-light": ["1f340.png", "1f343.png", "1f34f.png", "1f438.png", "1f4d7.png", "2618.png", "267b.png"],

        "grey-dark": ["1f3ae.png", "1f311.png", "1f399.png", "1f529.png", "1f58a.png", "1f68a.png"],

        "grey-light": ["1f527.png", "1f368.png", "1f3d0.png", "1f40f.png", "1f516.png", "1f56f.png", "1f5d1.png", "1f5dc.png"],

        "grey-medium": ["1f480.png", "1f400.png", "1f517.png", "1f58b.png", "2620.png", "2694.png", "26d3.png"],

        "indigo": ["1f456.png", "1f346.png", "1f699.png", "1f6cb.png", "2602.png", "2614.png"],

        "orange": ["1f34a.png", "1f383.png", "1f3c0.png", "1f458.png"],

        "pink": ["1f45b.png", "1f338.png", "1f33a.png", "1f380.png", "1f39f.png", "1f437.png", "1f43d.png", "1f444.png", "1f459.png"],

        "red": ["1f34e.png", "1f336.png", "1f353.png", "1f392.png", "1f47a.png", "1f58d.png", "1f980.png", "260e.png"],

        "white": ["1f35a.png", "1f3f3.png", "1f401.png", "1f407.png", "1f410.png", "1f4ad.png", "1f984.png", "2601.png"],

        "yellow": ["1f34b.png", "1f315.png", "1f319.png", "1f31d.png", "1f424.png", "1f431.png"]
    },

    "google": {
        "black": ["1f3a5.png", "1f3a9.png", "1f3b1.png", "1f4a3.png", "1f576.png", "1f5dd.png"],

        "blue": ["1f41f.png", "1f5f3.png", "1f68e.png", "1f6e1.png", "2708.png"],

        "blue-light": ["1f4a7.png", "1f516.png", "2668.png", "2693.png", "2744.png"],

        "brown-dark": ["1f3c8.png", "1f40e.png", "1f43b.png", "1f45e.png", "1f4a9.png", "1f4ff.png"],

        "brown-light": ["1f36a.png", "1f375.png", "1f3da.png", "1f43f.png", "1f58a.png", "26b0.png"],

        "green-dark": ["1f33f.png", "1f40a.png", "1f432.png", "1f458.png", "2618.png"],

        "green-light": ["1f348.png", "1f350.png", "1f40d.png", "1f438.png", "1f4b8.png"],

        "grey-dark": ["1f39e.png", "1f4f0.png", "1f577.png", "1f578.png"],

        "grey-light": ["1f3d0.png", "1f3db.png", "1f54a.png", "1f56f.png", "1f5d2.png"],

        "grey-medium": ["1f399.png", "1f400.png", "1f403.png", "1f480.png", "1f6e2.png"],

        "indigo": ["1f302.png", "1f40b.png", "1f418.png", "1f42c.png", "1f456.png", "1f6b0.png", "260e.png"],

        "orange": ["1f342.png", "1f3c9.png", "1f420.png", "1f431.png", "1f434.png", "2638.png"],

        "red": ["1f336.png", "1f337.png", "1f339.png", "1f39f.png", "1f58d.png", "1f608.png", "1f980.png"],

        "pink": ["1f338.png", "1f33c.png", "1f346.png", "1f347.png", "1f351.png", "1f429.png", "1f457.png", "1f460.png", "1f47e.png"],

        "white": ["1f401.png", "1f407.png", "1f410.png", "1f6c1.png", "1f984.png"],

        "yellow": ["1f34b.png", "1f397.png", "1f3f7.png", "1f41d.png", "1f424.png", "1f425.png", "1f4a1.png"]
    }

};