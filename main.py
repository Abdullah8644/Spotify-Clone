import os
import json

folders_file=os.listdir("songs")

folders=[]

for i in folders_file:
    if  "." not in i:
        folders.append(i)

j={}
for index,i in enumerate(folders):
    o=os.listdir(f"songs/{i}")
    j[i] = o
    

    with open('songs/songs_folders.json', 'w') as json_file:
        json.dump(j, json_file, indent=4)