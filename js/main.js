var apiKey = "99cd2175108d157588c04758296d1cfc";

$(document).ready(function () {
  var canvas = document.getElementById('chord');
  var ctx = canvas.getContext('2d');
  ctx.translate(0.5, 0.5);  // "disable" anti-aliasing. See: http://stackoverflow.com/a/3279863/145349
  var $input = $("input#chord-input");
  var currentAlternative = 0;
  var chordAlternatives = [];
  var keysLen = _(ChordDict).keys().length;
  var drawChord = function (chord) {
    ChordDrawer.drawChord(ctx, chord, ChordDict[chord]);
  };
  var clearChord = function () {

  };

  $input.val("C");
  $input.on("keyup change", function () {
    var chord = $input.val();
    
    if (_(ChordDict).has(chord)) {
      chordAlternatives = [chord];
      for (var i = 1; i < keysLen ; i++) {
        var chordAlt = chord + "." + i;
        if (_(ChordDict).has(chordAlt)) {
          chordAlternatives.push(chordAlt);
        } else {
          break;
        }
      }
      
      drawChord(chord);
    } else {
      clearChord();
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
