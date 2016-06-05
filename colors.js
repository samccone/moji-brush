var c = document.querySelector('canvas');
var ctx = c.getContext('2d');
ctx.font = '16px Arial';

function getDistance(labA, labB) {
  var lab1 = new colorLab('CIELAB', [
    labA.l,
    labA.a,
    labA.b,
  ]);

  var lab2 = new colorLab('CIELAB', [
    labB.l,
    labB.a,
    labB.b,
  ]);

  return lab1.CIELAB.CIEDE2000(lab2);
}

function getDominate(arr) {
  var labs = [];
  var buckets = [];

  for (let j = 0; j < arr.length; j += 4) {
    if (arr[j + 3] === 255) {
      labs.push({
        rgb: arr.slice(j, j + 3),
        lab: IColor.RGB.LAB({
          r: arr[j],
          g: arr[j + 1],
          b: arr[j + 2],
        }),
        count: 1
      });
    }
  }


  buckets.push(labs[0]);

/**
  <= 1.0 Not perceptible by human eyes
  1 - 2 Perceptible through close observation.
  2 - 10 Perceptible at a glance.
  11 - 49 Colors are more similar than opposite
  100 Colors are exact opposite
*/
  for (var i = 1; i < labs.length; i++) {
    var matched = false;
    for (var k = 0; k < buckets.length && !matched; k++) {
      var distance = getDistance(labs[i].lab, buckets[k].lab);
      if (distance < 1) {
        //buckets[k].lab = mergeLab(buckets[k], labs[i]);
        buckets[k].count++;
        matched = true;
      }
    }

    if (!matched) {
      buckets.push(labs[i]);
    }
  }

  return buckets.reduce((prev, curr) => {
    if (curr.count > prev.count) {
      return curr;
    }

    return prev;
  }).rgb
}

var d = 0;

for (let e in emojiMap) {
  setTimeout(function() {
    let codePoint = emojiMap[e];
    ctx.clearRect(0, 0, 32, 32);
    ctx.fillText(String.fromCodePoint(codePoint), 0, 16);
    var rgb = getDominate(ctx.getImageData(0, 0, 16, 16).data);

    var can = document.createElement('canvas');
    can.setAttribute('height', '32px');
    can.setAttribute('width', '32px');
    var ctx2 = can.getContext('2d');
    ctx2.font = '18px Arial';
    ctx2.fillStyle = `rgb(${rgb.join(',')})`
    ctx2.fillRect(0, 0, 32, 32);
    ctx2.fillText(String.fromCodePoint(codePoint), 0, 18);
    document.body.appendChild(can);
  }, ++d * 250);
}
