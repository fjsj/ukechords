var apiKey = "99cd2175108d157588c04758296d1cfc";

var currentChord = 0;

$(document).ready(function () {
  $("a#prev-chord").on("click", function () {
    if (currentChord === 0) {
      currentChord = chordsSrcs.length;
    }
    currentChord -= 1;
    
    return false;
  });

  $("a#next-chord").on("click", function () {
    currentChord += 1;
    currentChord %= chordsSrcs.length;

    return false;
  });

  var canvas = document.getElementById('chord');
  var ctx = canvas.getContext('2d');
  ctx.translate(0.5, 0.5);  // "disable" anti-aliasing. See: http://stackoverflow.com/a/3279863/145349
  var clearCanvas = function (ctx) {
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    ctx.restore();
  };
  var $input = $("input#chord-input");

  $input.val("C");
  $input.on("keyup change", function () {
    var chord = $input.val();
    clearCanvas(ctx);
    if (_(ChordDict).has(chord)) {
      ChordDrawer.drawChord(ctx, chord, ChordDict[chord]);
    } else {
      ChordDrawer.clearChord(ctx);
    }
  });

  $input.change();
});
