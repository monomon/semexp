import cairo    
from math import *

vote_colors=[
'#0000ff',
'#1300fe',
'#2601fc',
'#3806f8',
'#4b11f3',
'#5d26ed',
'#6e42e5',
'#7f64dc',
'#8f86d2',
'#9ea1c7',
'#adb0ba',
'#bab0ad',
'#c7a19e',
'#d2868f',
'#dc647f',
'#e5426e',
'#ed265d',
'#f3114b',
'#f80638',
'#fc0126',
'#fe0013'
]

WIDTH=600
HEIGHT=30
surface = cairo.ImageSurface(cairo.FORMAT_ARGB32,  WIDTH,  HEIGHT)
ctx = cairo.Context(surface)
ctx.scale(WIDTH,  HEIGHT)
min = -80
max= 180
iters=21
for i in range(iters):
    perc=float(i)/iters
    ctx.rectangle(perc,  0,  float(i+1)/iters*WIDTH,  HEIGHT)
    ctx.set_source_rgb(sin(perc*0.5*pi),  (sin(perc*pi)**4)*0.7,  cos(perc*0.5*pi))
    ctx.fill()
    ctx.set_source_rgb(1, 1, 1)
    ctx.stroke()
    
#print vote_colors[int(float(vote-min)/(max-min))*len(vote_colors)]

surface.write_to_png('colors.png')
