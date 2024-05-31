import os

def walk_up_folder(path, depth=1):
    _cur_depth = 1
    while _cur_depth < depth:
        path = os.path.dirname(path)
        _cur_depth += 1
    return path

root = os.path.join(os.path.dirname( __file__ ))
root = walk_up_folder(root,4)

main = []

for path, subdirs, files in os.walk(root):
    for name in files:
        if "git" not in path and ".ico" not in name.lower():
            dir = path.split("website\\")
            if len(dir) >1:
                dir = dir[1].split("\\")
                main.append((["root"] + dir,name+"|"+path.split("website\\")[1]))
            else:
                dir = ""
                main.append((["root"],name))

out=["root"]

def listadd(file, directory_path, pwd):
    if len(directory_path) == 1 and directory_path[0] == pwd[0]:
        pwd.append(file)
    else:
        for item in pwd:
            if type(item) == type([]) and directory_path[1] == item[0]:
                listadd(file, directory_path[1:], item)
                return
        new_sublist = [directory_path[1]]
        pwd.append(new_sublist)
        listadd(file, directory_path[1:], new_sublist)

for item in main:
    listadd(item[1], item[0], out)

path = root+"\\pages\\internal\\sitemap\\sitemap.js"
with open(path, "w") as file:
    file.write(f"var sitemap = {str(out)};\n")