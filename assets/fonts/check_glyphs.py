import fontforge

font = fontforge.open("Pixellari.ttf")

for name in font:
    print(name)
