import "./sitemap.js";

window.addEventListener("DOMContentLoaded", () => {
  createFileStructure(document.getElementById("sitemap"), sitemap);
});

function createFileStructure(rootElement, fileList) {
  var pwd = document.createElement("details");
  pwd.open = true;
  var pwdname = document.createElement("summary");
  var subpwd = document.createElement("span");
  var folder_img = document.createElement("img");
  folder_img.style.display = "inline";
  folder_img.src = "/sitewide/images/icons/Folder.ico";
  pwdname.appendChild(folder_img);
  var p = document.createElement("p");
  p.innerHTML = fileList[0];
  pwdname.appendChild(p);
  fileList.slice(1).forEach((entry) => {
    if (typeof entry === "string") {
      const li = document.createElement("summary");
      const a = document.createElement("a");
      if (entry.split("|").length >= 2) {
        a.href = "/" + entry.split("|")[1] + "/" + entry.split("|")[0];
      } else {
        a.href = "/" + entry.slice("|");
      }
      a.innerText = entry.split("|")[0];
      li.appendChild(a);
      subpwd.appendChild(li);
    } else {
      createFileStructure(subpwd, entry);
    }
  });
  pwd.appendChild(pwdname);
  pwd.appendChild(subpwd);
  rootElement.appendChild(pwd);
}
