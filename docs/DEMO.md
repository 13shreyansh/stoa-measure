# Two-minute demo script

Record the live site at https://stoa-eta.vercel.app. Keep the final public video at or below 2:00. Do not call these results independent human validation. Show the real highlighted boundaries while speaking.

## 0:00–0:15

"Before an engineer orders flooring, they need to know which area a number describes. Measure keeps the room boundary and calculation together."

Show the first screen. Click **Open real drawing**.

## 0:15–0:45

"This is a real Junction preview drawing derived from Swiss Dwellings, with attribution below. Ask for room 5.11. We get 13.62 square metres from the room's polygon, in metre units. The green boundary shows exactly what was measured. The printed room area agrees, but it comes from the same source, so it isn't independent proof."

Click room 5.03 and show 10.15 m². Expand coordinates. Download the JSON calculation, if there is time.

## 0:45–1:05

"The cheap path is deterministic. No model calls. On 16 held-out drawings, it answered 277 of 586 supplied questions correctly and requested review on the rest. All 277 answered cases passed that test. These are paired DXFs, not a claim about arbitrary scans."

Scroll briefly to the evaluation, keeping both coverage and answered-correct figures in shot.

## 1:05–1:20

"Ask for a door count. The system knows that door arcs can overcount double leaves, so it asks for review. Missing room labels also block a total. I would rather show an unresolved takeoff than invent one."

Ask **How many doors are drawn?** Show the refusal.

## 1:20–1:50

"For scans, a person supplies the missing geometry. Set a known length, then trace the room. This practice plan is an authored fixture. Its six-metre reference gives a twenty-square-metre L-shape. The calculation records the scale and every corner."

Switch to **Calibrate & trace** and open the practice plan. For a fast recording, use keyboard coordinate entry:

Reference endpoints, one pair per line:

```text
150,100
750,100
```

Reference length: 6 metres. Apply scale. Boundary coordinates:

```text
150,100
750,100
750,300
550,300
550,500
150,500
```

Finish boundary. Show 20.00 m² and 20.00 m boundary length. If typing this takes too long, pre-stage the tracing view and cut to it in the recording. Do not imply automatic segmentation.

## 1:50–2:00

"The next step is broader drawing extraction. The useful part already works: a quantity tied to the geometry, explicit limits, and a calculation another person can inspect."

End on the real DXF room proof or the exported boundary.
