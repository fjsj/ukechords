window.ChordGenerator = do () ->
  permutations = (input) ->
    used = []
    permArr = []
    permuteAux = ->
      for i in [0...input.length]
        item = input.splice(i, 1)[0]
        used.push(item)
        if input.length == 0
          permArr.push(used.slice())
        permuteAux(input)
        input.splice(i, 0, item)
        used.pop()
    permuteAux(input)
    return permArr

  tuning = ["G4", "C4", "E4", "A4"]  # string tunings
  tuningNotes = (teoria.note(n) for n in tuning)  # convert tunings notes to teoria.js note objects
  tNoteScales = (tNote.scale("chromatic") for tNote in tuningNotes)  # teoria.js scale for each string tuning

  frets = (chord) ->
    chordNotes = teoria.chord(chord, 4).notes
    if chordNotes.length == 4
      chordNotesCombs = [chordNotes]
    else
      chordNotesCombs = (chordNotes.concat([n]) for n in chordNotes)
    
    # Find all chord frets variations, ignoring those with a fret distance >= 4
    fretsVars = []
    for chordNotes in chordNotesCombs  # for all chord notes combinations...
      for permutNotes in permutations(chordNotes)  # for all permutations of those chord notes...
        diff = for i in [0...tuningNotes.length]
          tNote = tuningNotes[i]
          pNote = permutNotes[i]
          
          # Find the degree in the scale of the tuning.
          # Each degree corresponds to the a fret.
          # All of them will be stored in diff variable, in tuning order.
          degree = pNote.scaleDegree(tNoteScales[i]) - 1
          if degree >= 0
            degree
          else
            # Invalid degree (negative fret). Try all pNote enharmonics and get the min degree.
            enDegrees = (pNoteEn.scaleDegree(tNoteScales[i]) - 1 for pNoteEn in pNote.enharmonics())
            _(enDg for enDg in enDegrees when enDg >= 0).min()
            # TODO: for some reason, the two lines above introduce an error for the chord Cm7
        
        diffNoZeros = _(diff).compact()
        if diffNoZeros.length > 0
          if _(diffNoZeros).max() - _(diffNoZeros).min() < 4  # ignore variations with high distance
            fretsVars.push(diff)
        else
          fretsVars.push(diff)

    # Ignore invalid variations
    fretsVars = _(fretsVars).reject (fret) -> _(fret).contains(-1)

    # Sort variations by some heuristics which define how easy is to perform the chord
    fretsVars = _(fretsVars).sortBy (fret) ->
      fretMax = _(fret).max()
      fingerSum = (fret).reduce(((memo, num) -> return memo + (if num == 0 then 0 else 1)), 0)
      fingerDist = _(fret).max() - _(_(fret).compact()).min()
      return fretMax * 0.7 + fingerSum * 0.1 + fingerDist * 0.2

    # Return frets variations of the chord, ignoring repetitions
    return _(_(fretsVars).map((fret) -> fret.join(""))).uniq(true)

  return {
    frets: frets
  }
