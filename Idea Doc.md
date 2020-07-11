:engage2020:
---
title: Engage 2020 Idea doc
---

# Summary

Make a "rover". System that will operate on a 3D Map. You, the operator,
gives instructions:

- Follow a path and scan as much as possible
- Cover maximal area with existing resources
- Get to a destination
- Get to multiple destinations given a priority
- Given multiple destinations, figure out an optimal path

# Detail

Have a procedurally generated terrain. It is mostly inert, but a
minuscule chance exists of finding say ice. Inert is 0, ice is 12, and 
anything around ice 12-distance. The terrain is 3D.

The robot will spend energy moving, more energy moving up, less (but not
0) energy moving down. It will also spend constant energy mapping the 
environment around it to get an idea of the map. It will also spend energy
if it wants to sample the soil (one cell), and it can only sample the 
surface. It can isolate the location of ice underground by triangulating.
It gains constant energy through solar panels, but this is not applicable
at night/in a dust storm.

Important assumptions:

- The rover has constant speed on flat surface, 1-block raises, 1-downs
- The rover cannot go up/down two-block drops or raises
- Time taken to analyse is insignificant

A scientist operating the rover can:

- Given a starting point, ask it to get to a finishing point.
- Assign multiple points the rover should check. The rover has to find 
  and optimal path, ending wherever.
- Ask the rover to survey as much land as possible in a given time frame

There is no concept of priority because it is science and it will move
eventually.
