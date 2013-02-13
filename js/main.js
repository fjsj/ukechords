$(document).ready(function () {
  var canvas = document.getElementById('chord');
  var ctx = canvas.getContext('2d');
  ctx.translate(0.5, 0.5);  // "disable" anti-aliasing. See: http://stackoverflow.com/a/3279863/145349
  var $input = $("input#chord-input");
  var currentChord = "C";
  var currentAlternative = 0;
  var chordAlternatives = [];
  var drawChord = function () {
    ChordDrawer.drawChord(ctx, currentChord, chordAlternatives[currentAlternative]);
  };
  var drawUnknown = function () {
    ChordDrawer.drawUnknown(ctx);
  };

  $input.val(currentChord);
  $input.on("keyup change", function () {
    var chord = $input.val();
    currentChord = chord;
    currentAlternative = 0;
    try {
      chordAlternatives = ChordGenerator.frets(chord);
      // For now, ignore alternatives with frets larger than 10
      chordAlternatives = _(chordAlternatives).reject(function(alt) { return alt.length > 4; });
    } catch (e) {
      chordAlternatives = [];
    }
    
    if (chordAlternatives.length > 0) {
      drawChord();
    } else {
      drawUnknown();
    }
  });
  $input.change();

  $("a#prev-chord").on("click", function () {
    if (currentAlternative === 0) {
      currentAlternative = chordAlternatives.length;
    }
    currentAlternative -= 1;
    
    drawChord(chordAlternatives[currentAlternative]);
    return false;
  });

  $("a#next-chord").on("click", function () {
    currentAlternative += 1;
    currentAlternative %= chordAlternatives.length;

    drawChord(chordAlternatives[currentAlternative]);
    return false;
  });
});
