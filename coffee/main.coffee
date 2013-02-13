$(document).ready ->
  canvas = document.getElementById('chord')
  ctx = canvas.getContext('2d')
  ctx.translate(0.5, 0.5)  # "disable" anti-aliasing. See: http://stackoverflow.com/a/3279863/145349
  
  currentChord = "C"
  currentAlternative = 0
  chordAlternatives = []
  
  drawChord = -> ChordDrawer.drawChord(ctx, currentChord, chordAlternatives[currentAlternative])
  drawUnknown = -> ChordDrawer.drawUnknown(ctx)
  
  $input = $("input#chord-input")
  $input.val(currentChord)
  $input.on "keyup change", ->
    chord = $input.val()
    currentChord = chord
    currentAlternative = 0
    
    try
      chordAlternatives = ChordGenerator.frets(chord)
      # For now, ignore alternatives with frets larger than 10
      chordAlternatives = _(chordAlternatives).reject (alt) -> alt.length > 4
    catch e
      chordAlternatives = []
    
    if chordAlternatives.length > 0
      drawChord()
    else
      drawUnknown()
  $input.change()

  $("a#prev-chord").on "click", ->
    if currentAlternative == 0
      currentAlternative = chordAlternatives.length
    currentAlternative -= 1
    
    drawChord(chordAlternatives[currentAlternative])
    return false

  $("a#next-chord").on "click", ->
    currentAlternative += 1
    currentAlternative %= chordAlternatives.length

    drawChord(chordAlternatives[currentAlternative])
    return false
