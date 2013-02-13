window.ChordDrawer = do ->
  # ChordDrawer code is based on chordgen Python code from Hans Boldt.
  # Source: http://www.boldts.net/Ukulele/Uke-chords.shtml

  drawLine = (ctx, start, end) ->
    ctx.beginPath()
    ctx.moveTo(start[0], start[1])
    ctx.lineTo(end[0], end[1])
    ctx.stroke()

  ## Start of chordgen-based code...
  box_size = [48, 64]
  diagram_xy = [12, 12]
  vlines = [12, 20, 28, 36]
  hlines = [13, 23, 33, 43, 53]

  # Computed globals
  vtop = _.min(hlines)
  vbottom = _.max(hlines)
  vbottom_ext = vbottom + (hlines[1] - hlines[0] - 1)
  hleft = _.min(vlines)
  hright = _.max(vlines)

  drawBox = (ctx, top, bottom) ->
    # Draw empty chord box into the picture

    # Draw horizontal lines
    if top
      drawLine(ctx, [hleft, hlines[0] - 1], [hright, hlines[0] - 1])

    for y in hlines
      drawLine(ctx, [hleft, y], [hright, y])

    # Draw vertical lines
    if bottom
        b = vbottom_ext
    else
        b = vbottom

    for x in vlines
      drawLine(ctx, [x, vtop - 1], [x, b])

  drawDot = (ctx, string, fret, offset) ->
    # Draw dot at the string/fret position.

    if not offset?
      offset = 0

    # Compute location of dot
    xdiff = vlines[1] - vlines[0]  # Default 8
    ydiff = hlines[1] - hlines[0]  # default 10
    xoff = diagram_xy[0] - xdiff
    yoff = diagram_xy[1] + 1 - ydiff + ydiff / 2
    x = string * xdiff + xoff
    y = (fret - offset) * ydiff + yoff

    # Draw lines for dot
    drawLine(ctx, [x - 2, y - 1], [x - 2, y + 1])
    drawLine(ctx, [x - 1, y - 2], [x - 1, y + 2])
    drawLine(ctx, [x + 1, y - 2], [x + 1, y + 2])
    drawLine(ctx, [x + 2, y - 1], [x + 2, y + 1])

  makeChordBox = (ctx, namestr, fretstr) ->
    name = namestr.split(".")[0]
    name = name.replace("dim", "°")

    # Do we have a barred chord?
    bar = false
    barpos = 0
    if fretstr[0] == "|"
      fretstr = fretstr.slice(1)
      bar = true

    # Determine fret positions and offset
    frets = _(fretstr.split("")).map (x) -> parseInt(x, 10)
    mn = _.min(_(frets).compact())  # ignore zeros
    mx = _.max(frets)
    diff = mx - mn
    if diff > 4
      throw new Error("Fret difference too great for " + namestr)
    
    offset = 0
    if mx > 4
      offset = mn

    if bar
      barpos = _.min(frets)

    # Draw title
    ctx.font = '10px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(name, box_size[0] / 2, 8)
    
    # Draw skeleton box
    drawBox(ctx, (offset == 0), (diff == 4))
        
    # Draw dots at the fret positions
    string = 1
    for f in frets
      if f != 0 and f != barpos
        drawDot(ctx, string, f, _.max([offset - 1, 0]))
      string += 1

    if bar
      drawDot(ctx, 1, barpos, _.max([offset - 1, 0]))
      drawDot(ctx, 2, barpos, _.max([offset - 1, 0]))
      drawDot(ctx, 3, barpos, _.max([offset - 1, 0]))
      drawDot(ctx, 4, barpos, _.max([offset - 1, 0]))
    
    # Write offset (if necessary)
    if offset
      ctx.textAlign = 'left'
      ctx.fillText(offset, 2, 20)
  # End of chordgen-based code.

  clearChord = (ctx) ->
    # Draw a white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, box_size[0], box_size[1])
    ctx.fillStyle = "black"

  drawChord = (ctx, namestr, fretstr) ->
    clearChord(ctx)
    makeChordBox(ctx, namestr, fretstr)

  drawUnknown = (ctx) ->
    clearChord(ctx)

    # Draw "???" text in the center
    ctx.font = '12px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText("???", box_size[0] / 2, box_size[1] / 2)

  return {
    drawChord: drawChord,
    drawUnknown: drawUnknown
  }
