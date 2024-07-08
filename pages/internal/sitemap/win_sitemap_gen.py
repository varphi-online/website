import os
import sys


def walk_up_folder(path, depth=1):
    _cur_depth = 1
    while _cur_depth < depth:
        path = os.path.dirname(path)
        _cur_depth += 1
    return path


pathType = "\\"
if not sys.platform.startswith("win"):
    pathType = '/'

root = os.path.join(os.path.dirname(__file__))
root = walk_up_folder(root, 4)

main = []

for path, subdirs, files in os.walk(root):
    for name in files:
        if "git" not in path and ".ico" not in name.lower():
            dir = path.split("website"+pathType)
            print(path)
            if len(dir) == 3:
                dir = dir[2].split(pathType)
                main.append((["root"] + dir, name+"|" +
                            path.split("website"+pathType)[2]))
            else:
                dir = ""
                main.append((["root"], name))

# print(main)
out = ["root"]


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

if sys.platform.startswith("win"):
    path = root+"\\pages\\internal\\sitemap\\sitemap.js"
else:
    path = root+"/pages/internal/sitemap/sitemap.js"

with open(path, "w") as file:
    file.write(f"var sitemap = {str(out)};\n")

a = "var sitemap = ['root', 'CNAME', 'index.html', 'not_found.html', 'README.md', ['pages', ['index', 'cube.js|pages\\index', 'index.css|pages\\index', 'pixel.js|pages\\index', 'sphere_wide_1.png|pages\\index', 'taskbar_small.png|pages\\index'], ['internal', ['icons', 'icons.css|pages\\internal\\icons', 'icons.html|pages\\internal\\icons', 'icon_list.txt|pages\\internal\\icons'], ['sitemap', 'generate_sitemap.py|pages\\internal\\sitemap', 'sitemap.css|pages\\internal\\sitemap', 'sitemap.html|pages\\internal\\sitemap', 'sitemap.js|pages\\internal\\sitemap', 'sitemap_gen.js|pages\\internal\\sitemap']], ['music', ['orbit', 'C64_Pro-STYLE.otf|pages\\music\\orbit', 'orbit.css|pages\\music\\orbit', 'orbit.html|pages\\music\\orbit', 'orbit.png|pages\\music\\orbit', 'orbit12fps.gif|pages\\music\\orbit', 'skybox2.png|pages\\music\\orbit']], ['test', 'test.html|pages\\test'], ['willow', 'her.png|pages\\willow', 'him.png|pages\\willow', 'KodeMono-Regular.ttf|pages\\willow', 'willow.css|pages\\willow', 'willow.html|pages\\willow', 'willow.js|pages\\willow']], ['sitewide', 'primary.css|sitewide', 'stars.gif|sitewide', 'W95FA.otf|sitewide', ['apps', 'a.txt|sitewide\\apps', 'apps.js|sitewide\\apps', 'app_test.html|sitewide\\apps'], ['filters', 'pixelate.svg|sitewide\\filters', 'pixelate2.svg|sitewide\\filters'], ['images', ['mini', 'eos.jpg|sitewide\\images\\mini', 'ergo-empty.jpg|sitewide\\images\\mini', 'faded-horizons.jpg|sitewide\\images\\mini', 'fote6.jpg|sitewide\\images\\mini', 'orbit.png|sitewide\\images\\mini']], ['libs', 'p5.asciiart.js|sitewide\\libs', 'p5.asciiart.min.js|sitewide\\libs', 'p5.dom.min.js|sitewide\\libs', 'p5.glitch.js|sitewide\\libs', 'p5.min.js|sitewide\\libs', 'p5.sound.min.js|sitewide\\libs'], ['taskbar', 'chatroom.js|sitewide\\taskbar', 'contArr.png|sitewide\\taskbar', 'playingGod.png|sitewide\\taskbar', 'Star.png|sitewide\\taskbar', 'taskbar.css|sitewide\\taskbar', 'taskbar.html|sitewide\\taskbar', 'taskbar_startmenu.css|sitewide\\taskbar', 'taskbar_window.css|sitewide\\taskbar', 'window.js|sitewide\\taskbar', ['musicPlayer', 'ffwd.png|sitewide\\taskbar\\musicPlayer', 'music.js|sitewide\\taskbar\\musicPlayer', 'next.png|sitewide\\taskbar\\musicPlayer', 'pause.png|sitewide\\taskbar\\musicPlayer', 'play.png|sitewide\\taskbar\\musicPlayer', 'prev.png|sitewide\\taskbar\\musicPlayer', 'rewd.png|sitewide\\taskbar\\musicPlayer']]]];"
