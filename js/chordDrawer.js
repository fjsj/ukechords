var canvas = document.getElementById('chord');
var ctx = canvas.getContext('2d');

var ChordDrawer = (function() {
  // ChordDrawer code is based on chordgen Python code from Hans Boldt.
  // Source: http://www.boldts.net/Ukulele/Uke-chords.shtml

  var drawLine = function (ctx, start, end) {
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  };

  //// Start of chordgen-based code...
  var box_size = [48, 64];
  var diagram_xy = [12, 12];
  var vlines = [12, 20, 28, 36];
  var hlines = [13, 23, 33, 43, 53];

  // Computed globals
  var vtop = _.min(hlines);
  var vbottom = _.max(hlines);
  var vbottom_ext = vbottom + (hlines[1] - hlines[0] - 1);
  var hleft = _.min(vlines);
  var hright = _.max(vlines);

  var drawBox = function(ctx, top, bottom) {
    // Draw empty chord box into the picture

    // Draw horizontal lines
    if (top) {
      drawLine(ctx, [hleft, hlines[0] - 1], [hright, hlines[0] - 1]);
    }

    _(hlines).each(function (y) {
      drawLine(ctx, [hleft, y], [hright, y]);
    });

    // Draw vertical lines
    var b;
    if (bottom) {
        b = vbottom_ext;
    } else {
        b = vbottom;
    }

    _(vlines).each(function (x) {
      drawLine(ctx, [x, vtop - 1], [x, b]);
    });
  };

  var drawDot = function (ctx, string, fret, offset) {
      // Draw dot at the string/fret position.

      if (!offset) {
        offset = 0;
      }

      // Compute location of dot
      var xdiff = vlines[1] - vlines[0]; // Default 8
      var ydiff = hlines[1] - hlines[0]; // default 10
      var xoff = diagram_xy[0] - xdiff;
      var yoff = diagram_xy[1] + 1 - ydiff + ydiff / 2;
      var x = string * xdiff + xoff;
      var y = (fret - offset) * ydiff + yoff;

      // Draw lines for dot
      drawLine(ctx, [x - 2, y - 1], [x - 2, y + 1]);
      drawLine(ctx, [x - 1, y - 2], [x - 1, y + 2]);
      drawLine(ctx, [x + 1, y - 2], [x + 1, y + 2]);
      drawLine(ctx, [x + 2, y - 1], [x + 2, y + 1]);
  };

  var makeChordBox = function (ctx, namestr, fretstr) {
      var name = namestr.split(".")[0];
      name = name.replace("dim", "°");

      // Do we have a barred chord?
      var bar = false;
      var barpos = 0;
      if (fretstr[0] === "|") {
          fretstr = fretstr.slice(1);
          bar = true;
      }

      // Determine fret positions and offset
      var frets = _(fretstr.split("")).map(function (x) { return parseInt(x, 10); });
      var mn = _.min(_(frets).reject(function (x) { return x === 0; }));
      var mx = _.max(frets);
      var diff = mx - mn;
      if (diff > 4) {
        throw new Error("Fret difference too great for " + namestr);
      }
      
      var offset = 0;
      if (mx > 4) {
          offset = mn;
      }

      if (bar) {
        barpos = _.min(frets);
      }

      // Draw title
      ctx.font = '10px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, box_size[0] / 2, 8);
      
      // Draw skeleton box
      drawBox(ctx, (offset === 0), (diff === 4));
          
      // Draw dots at the fret positions
      var string = 1;
      _.each(frets, function (f) {
        if (f !== 0 && f !== barpos) {
          drawDot(ctx, string, f, _.max([offset - 1, 0]));
        }
        string += 1;
      });

      if (bar) {
        drawDot(ctx, 1, barpos, _.max([offset - 1, 0]));
        drawDot(ctx, 2, barpos, _.max([offset - 1, 0]));
        drawDot(ctx, 3, barpos, _.max([offset - 1, 0]));
        drawDot(ctx, 4, barpos, _.max([offset - 1, 0]));
      }
      
      // Write offset (if necessary)
      if (offset) {
        ctx.textAlign = 'left';
        ctx.fillText(offset, 2, 13);
      }
  };
  //// End of chordgen-based code.

  var drawChord = function (ctx, namestr, fretstr) {
    ctx.translate(0.5, 0.5);  // "disable" anti-aliasing. See: http://stackoverflow.com/a/3279863/145349
    makeChordBox(ctx, namestr, fretstr);
  };

  return {
    drawChord: drawChord
  };
}());

//ChordDrawer.drawChord(ctx, "Gdim", "0101");
//ChordDrawer.drawChord(ctx, "Am7.1", "5430");
//ChordDrawer.drawChord(ctx, "B5", "4622");
ChordDrawer.drawChord(ctx, "C", "0003");
