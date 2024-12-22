import os

songs=os.listdir("songs")
with open("songs.txt" ,"w") as f:
    pass

for i in songs:
    with open("songs.txt" ,"a") as f:
        f.write(f"<li><a href=\"songs/{i}\"></a></li>\n")
    