

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

tuning = ["G4", "C4", "E4", "A4"]
chord = "Cmaj7"
tuningNotes = (teoria.note(n) for n in tuning)
chordNotes = teoria.chord(chord, 4).notes

for p in permutations(chordNotes)
  diff = _(_.zip(tuningNotes, p)).map (zipped) ->
    [tNote, pNote] = zipped
    return pNote.scaleDegree(tNote.scale("chromatic")) - 1
  
  diffNoZeros = _.compact(diff)
  if diffNoZeros.length > 0
    if _(diffNoZeros).max() - _(diffNoZeros).min() < 4
      console.log _(p).map((x) -> return x.name)
      console.log diff
  else
    console.log _(p).map((x) -> return x.name)
    console.log diff


  

  
