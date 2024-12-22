import os
songs=os.listdir("songs")
with open("songs.txt" ,"w") as f:
    pass

for i in songs:
    with open("songs.txt" ,"a") as f:
        f.write(f"<li><a href=\"songs/{i}\"></a></li>\n")
    
with open("songs.txt","r") as f:
    songs=(f.read())
    with open("songs.html","w") as h:
        html=f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>songs</title>
  </head>
  <body>
    <ul>
    {songs}
    </ul>
  </body>
</html>
"""
        h.write(html)
    