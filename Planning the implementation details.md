:engage2020:
---
title: Planning the Implementation details
---

Not blocked off walls. There's different levels, and the paths of the graphs 
are weighted by the difference in the levels. Will be using the A* 
algorithm, at least as the initial implementation. Three modes of operation:

- Knowing the map, the bot will move from Source to Destination, and 
  it may also include multiple destinations. The traditional pathfinding
  algorithm systems basically.
- Exploration and mapping stage, where the map is unknown, and the robot uses 
  its sensors for mapping the actual environment and also doing exploration 
  on it. 
  
## Pathfinding on a known map

- The scientists operating the rover have satellite imagery of the area they 
  wish to survey, and they mark out a destination, or multiple destinations,
  or ask the robot to survey as much of the land as it can.
- The terrain has differences in its level. This contributes to the 
  "hardness" of the path; the weight of the path between two nodes. Since it 
  is a grid, and we define the robot as only being able to move in 4 
  directions, the difference between the levels of the ground defines
  this hardness weight. The "weight" is actually the speed, so the weight
  between two consecutive cells is: 
  `function_defining_speed(difference of destination to source cell levels)`.
    - In general, we can think of flat as a good speed, raises to be 
      progressively harder exponentially, drops to be easier (and faster) 
      up to a turning point where we slow down exponentially again.
