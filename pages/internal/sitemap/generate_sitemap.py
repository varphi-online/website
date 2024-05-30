import os

root = 'C:\\Users\\acfma\\Documents\\Code\\Web\\website'

main = []

for path, subdirs, files in os.walk(root):
    for name in files:
        if "git" not in path and ".ico" not in name.lower():
            dir = path.split("website\\")
            if len(dir) >1:
                dir = dir[1].split("\\")
                main.append((["root"] + dir,name))
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

path = root+"\\pages\\internal\\sitemap\\sitemap.txt"

file =  open(path, 'w')
file.write(str(out))