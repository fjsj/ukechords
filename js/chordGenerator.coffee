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
chord = "C"
tuningNotes = (teoria.note(n) for n in tuning)
chordNotes = teoria.chord(chord, 4).notes
if chordNotes.length == 4
  chordNotesVars = [chordNotes]
else
  chordNotesVars = (chordNotes.concat([n]) for n in chordNotes)
  
# Find all chord combinations, ignoring those with a fret distance >= 4
fretsVars = []
tNoteScales = (tNote.scale("chromatic") for tNote in tuningNotes)
for chordNotes in chordNotesVars
  for permutNotes in permutations(chordNotes)
    diff = for i in [0...tuningNotes.length]
      tNote = tuningNotes[i]
      pNote = permutNotes[i]
      pNote.scaleDegree(tNoteScales[i]) - 1
    
    diffNoZeros = _(diff).compact()
    if diffNoZeros.length > 0
      if _(diffNoZeros).max() - _(diffNoZeros).min() < 4
        fretsVars.push(diff)
    else
      fretsVars.push(diff)

# Sort by some heuristics which define how easy is to perform the chord
fretsVars = _(fretsVars).sortBy (fret) ->
  fretMax = _(fret).max()
  fingerSum = (fret).reduce(((memo, num) -> return memo + (if num == 0 then 0 else 1)), 0)
  fingerDist = _(fret).max() - _(_(fret).compact()).min()
  return fretMax * 0.7 + fingerSum * 0.1 + fingerDist * 0.2

console.log _(fretsVars).uniq((fs) -> fs.join(""))
