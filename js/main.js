var apiKey = "99cd2175108d157588c04758296d1cfc";

// See: http://www.ukulele-chords.com/api
// and: http://en.wikipedia.org/wiki/Chord_names_and_symbols_(popular_music)#Examples
var parseChord = function (chord) {
  var rootNotes = ["A", "A#", "Bb", "B" , "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab"];
  rootNotes.sort(function (a, b) {
    return b.length - a.length;  // move two letter strings to left
  });
  var rootNotesAliases = {
    "A#": "Bb",
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab"
  };
  var root = null;
  var chordType = "major";

  for (var i = 0; i < rootNotes.length; i++) {
    if (chord.indexOf(rootNotes[i]) === 0) {
      root = rootNotes[i];
      if (rootNotesAliases.hasOwnProperty(root)) {
        root = rootNotesAliases[root];
      }

      var slice = chord.slice(root.length);
      if (slice !== "") {
        if (slice === "m") {
          chordType = "minor";
        } else {
          chordType = slice;
        }
      }
      break;
    }
  }

  return {
    r: root,
    typ: chordType
  };
};

var currentChord = 0;
var chordsSrcs = [];
var fetchChord = function (chord) {
  chordsSrcs.length = 0;  //   empties the array
  var parsed = parseChord(chord);
  var params = {
    r: parsed.r,
    typ: parsed.typ,
    ak: apiKey
  };

  $.ajax({
    url: "http://ukulele-chords.com/get?" + $.param(params),
    type: 'GET',
    cache: true,
    dataType: 'xml',
    success: function (data, textStatus, jqXHR) {
      $(data).find("chord_diag_mini").each(function () {
        var chordImgSrc = $(this).text();
        chordsSrcs.push(chordImgSrc);
      });
      $("img#chord").attr('src', chordsSrcs[currentChord]);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      //forge.logging.info(errorThrown);
    }
  });
};

$(document).ready(function () {
  $("a#prev-chord").click(function () {
    if (currentChord === 0) {
      currentChord = chordsSrcs.length;
    }
    currentChord -= 1;
    
    $("img#chord").attr('src', chordsSrcs[currentChord]);
    return false;
  });

  $("a#next-chord").on("click", function () {
    currentChord += 1;
    currentChord %= chordsSrcs.length;
    
    $("img#chord").attr('src', chordsSrcs[currentChord]);
    return false;
  });
});

fetchChord('C#aug');
