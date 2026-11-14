# Two-minute demo script

Planned recording times, not existing video timestamps. Live site: https://stoa-eta.vercel.app. Keep the public video at or below2:00. Lead with the supported human-calibrated scan workflow. Do not imply automated raster extraction or real-scan benchmark accuracy.

## 0:00–0:15

"The hardest plans are scans. Measure lets an engineer supply the known scale and room boundary, then keeps the area calculation attached to that exact boundary."

Open **Calibrate & trace**. Show the PDF/image upload control, then open the clearly labelled practice plan.

## 0:15–0:55

"This practice shape is authored, with a known six-metre reference. Set the scale and trace each corner. The L-shape is twenty square metres, with a twenty-metre boundary. These points came from a person. We aren't claiming automatic room detection."

Reference endpoints:

```text
150,100
750,100
```

Reference6m. Apply scale, then click the six corners or enter:

```text
150,100
750,100
750,300
550,300
550,500
150,500
```

Finish boundary. Show20.00m²/20.00m and download the calculation. Enter coordinates before recording if needed, but show the human-assisted nature openly.

## 0:55–1:15

"On your PDF or image, you identify the reference and inside wall faces. The file stays in the browser. Scale uncertainty and a distorted photograph still need a person."

Optionally show a real PDF/image upload with scale unset. Do not invent a quantity or treat the practice result as a real-scan accuracy test. PDF support currently renders page1 only.

## 1:15–1:40

"Clean semantic DXF is a separate automatic path. Room5.11 measures13.62 square metres from its polygon, with a green boundary and metre units."

Open the real drawing. Ask `How many square metres is room 5.11?` Show the overlay and export. The historical engine1.0 benchmark was277/586 on paired DXFs. Current repair replays are seen regressions, not new held-out or raster results.

## 1:40–1:55

"The repaired router distinguishes area from counts and refuses unsupported arithmetic or conflicting scopes. Editing the question also invalidates the old export."

Show one refusal or stale-export state. Export records engine1.3.1, geometry1.0.0, the exact question, source hash and boundary.

## 1:55–2:00

"A quantity is easier to check when you can see its boundary and reproduce its calculation."
