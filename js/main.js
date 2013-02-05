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

  // for each not in rootNotes...
  _.find(rootNotes, function (note) {
    if (chord.indexOf(note) === 0) {  // if chord starts with note
      root = note;
      if (_.has(rootNotesAliases, root)) {  // rootNotesAliases has root
        root = rootNotesAliases[root];
      }

      // get the rest of the chord, after the root note
      var slice = chord.slice(root.length);
      if (slice !== "") {
        if (slice === "m") {
          chordType = "minor";
        } else {
          chordType = slice;
        }
      }
      return true;  // break the _.find
    }
  });

  return {
    r: root,
    typ: chordType
  };
};

var currentChord = 0;
var chordsSrcs = [];

var fetchChord = function (chord, callback) {
  if (!chord) {
    return;
  }

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
      var newChordsSrcs = [];
      $(data).find("chord_diag_mini").each(function () {
        var chordImgSrc = $(this).text();
        newChordsSrcs.push(chordImgSrc);
      });
      callback(newChordsSrcs);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Erro ao procurar acorde na internet! Você está conectado?");
    }
  });
};
fetchChord = async.memoize(fetchChord);  // async memoize fetchChord, preventing repeated HTTP requests

var setChords = function (newChordsSrcs) {
  chordsSrcs = newChordsSrcs;
  currentChord = 0;
  updateCurrentChord();
};

var updateCurrentChord = function () {
  $("img#chord").attr('src', chordsSrcs[currentChord]);
};

$(document).ready(function () {
  $("a#prev-chord").click(function () {
    if (currentChord === 0) {
      currentChord = chordsSrcs.length;
    }
    currentChord -= 1;
    
    updateCurrentChord();
    return false;
  });

  $("a#next-chord").on("click", function () {
    currentChord += 1;
    currentChord %= chordsSrcs.length;

    updateCurrentChord();
    return false;
  });

  var $input = $("input#chord-input");
  // debounce fetchChord function, preventing multiple
  // simultaneuos runs.
  var debouncedFetchChord = _.debounce(function (callback) {
    fetchChord($input.val(), callback);
  }, 500);
  $input.on("keyup", function () {
    debouncedFetchChord(setChords);
  });

  debouncedFetchChord(setChords);
});

