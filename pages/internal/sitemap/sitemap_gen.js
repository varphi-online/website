var sitemap = ['root', 'CNAME', 'index.html', 'not_found.html', 'README.md', ['pages', ['index', 'cube.js', 'index.css', 'pixel.js', 'sphere_wide_1.png', 'taskbar_small.png'], ['internal', ['icons', 'icons.css', 'icons.html', 'icon_list.txt'], ['sitemap', 'generate_sitemap.py', 'sitemap.html', 'sitemap.txt', 'sitemap_gen.js']], ['music', ['orbit', 'C64_Pro-STYLE.otf', 'orbit.css', 'orbit.html', 'orbit.png', 'orbit12fps.gif', 'skybox2.png']], ['test', 'test.html'], ['willow', 'her.png', 'him.png', 'KodeMono-Regular.ttf', 'willow.css', 'willow.html', 'willow.js']], ['sitewide', 'primary.css', 'stars.gif', 'W95FA.otf', ['apps', 'a.txt', 'apps.js', 'app_test.html'], ['filters', 'pixelate.svg', 'pixelate2.svg'], ['images', ['mini', 'eos.jpg', 'ergo-empty.jpg', 'faded-horizons.jpg', 'fote6.jpg', 'orbit.png']], ['libs', 'p5.asciiart.js', 'p5.asciiart.min.js', 'p5.dom.min.js', 'p5.glitch.js', 'p5.min.js', 'p5.sound.min.js'], ['taskbar', 'chatroom.js', 'contArr.png', 'playingGod.png', 'Star.png', 'taskbar.css', 'taskbar.html', 'taskbar_startmenu.css', 'taskbar_window.css', 'window.js', ['musicPlayer', 'ffwd.png', 'music.js', 'next.png', 'pause.png', 'play.png', 'prev.png', 'rewd.png']]]]

window.addEventListener("DOMContentLoaded", () => {

    createFileStructure(document.getElementById("sitemap"), sitemap);

})

function createFileStructure(rootElement, fileList){
    var pwd = document.createElement("ul")
    var pwdname = document.createElement("li")
    var subpwd = document.createElement("ul")
    pwdname.innerHTML = fileList[0]
    fileList.slice(1).forEach( entry => {
        if (typeof entry === "string") {
        const li = document.createElement('li');
        li.innerHTML = entry
        subpwd.appendChild(li)
        } else {
            createFileStructure(subpwd, entry)
        }
    }
    )
    pwd.appendChild(pwdname)
    pwd.appendChild(subpwd)
    rootElement.appendChild(pwd)
}