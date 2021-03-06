import env from "../env.js";
import Adapters from "../classes/Adapters.js";
import User from "./User.js";
import { Services } from "./Services.js";

const Navbar = `  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
<!-- Left navbar links -->
<ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#"><i class="fas fa-bars"></i></a>
    </li>
    <li class="nav-item d-none d-sm-inline-block">
        <a href="index.html" class="nav-link">Anasayfa</a>
    </li>
</ul>

<!-- SEARCH FORM -->
<form class="form-inline  ml-3">
    <div class="input-group input-group-sm">
        <input class="form-control form-control-navbar" type="search" placeholder="Ara..."
            aria-label="Search">
        <div class="input-group-append">
            <button class="btn btn-navbar" type="submit">
                <i class="fas fa-search"></i>
            </button>
        </div>
    </div>
</form>

<!-- Right navbar links -->
<ul class="navbar-nav ml-auto">
    <li class="nav-item">
        <a class="nav-link"  href="#">
            <img src="dist/img/user2-160x160.jpg" class="img-circle my-photo" style="height: 30px;"
                alt="User Image">
        </a>
    </li>
    <!-- Notifications Dropdown Menu -->
    <li id="friendRequestsButton" class="nav-item dropdown">

        
    </li>
    <!-- Ayarlar Dropdown -->
    <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
            <i class="fas fa-cog"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span class="dropdown-item dropdown-header"> @gitsukru </span>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">
                <i class="fas fa-cog mr-2"></i> Ayarlar
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">
                <i class="fas fa-key"></i> Şifre İşlemleri
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="bg-danger dropdown-item dropdown-footer">Çıkış Yap</a>
        </div>
    </li>
</ul>
</nav>`,
  Sidebar = `     <aside class="main-sidebar sidebar-dark-primary elevation-4">
<!-- Brand Logo -->
<a href="index.html" class="brand-link">
    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
        style="opacity: .8">
    <span class="brand-text font-weight-light">SUCO</span>
</a>

<!-- Sidebar -->
<div class="sidebar">
    <!-- Sidebar user panel (optional) -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
            <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2 my-photo" alt="User Image">
        </div>
        <div class="info">
            <a href="#" class="d-block my-user-name">Selami Şahin</a>
        </div>
    </div>

    <!-- Sidebar Menu -->
    <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
            data-accordion="false">
            <!-- Add icons to the links using the .nav-icon class
   with font-awesome or any other icon font library -->
            <li class="nav-item has-treeview">
                <a href="#" class="nav-link active">
                    <i class="nav-icon fas fa-home"></i>
                    <p>
                        Anasayfa
                        <i class="right fas fa-angle-left"></i>
                    </p>
                </a>
                <ul class="nav nav-treeview">
                    <li class="nav-item">
                        <a href="./index.html" class="nav-link">
                            <i class="far fa-circle nav-icon"></i>
                            <p>Anasayfa</p>
                        </a>
                    </li>
                </ul>
            </li>
            <li class="nav-item">
                <a href="settings.html" class="nav-link">
                    <i class="nav-icon fas fa-cog"></i>
                    <p>
                        Ayarlar
                        <span class="right badge badge-danger">New</span>
                    </p>
                </a>
            </li>
            <li class="nav-item">
                <a href="profile.html" class="nav-link sidebar-profile">
                    <i class="nav-icon fas fa-user"></i>
                    <p>
                        Profil
                        <span class="right badge badge-danger">New</span>
                    </p>
                </a>
            </li>
        </ul>
    </nav>
    <!-- /.sidebar-menu -->
</div>
<!-- /.sidebar -->
</aside>`;

let timeOut = setTimeout(() => {});

export default class Dom {
  static isFirst = true;
  static isFinish = false;
  static directMessage;
  static page = 1;
  static tempHeight;
  static async standartRender(data) {
    let wrapper = document.getElementsByClassName("wrapper")[0];
    wrapper.insertAdjacentHTML("afterbegin", Sidebar);
    wrapper.insertAdjacentHTML("afterbegin", Navbar);
    let searchBar = document.querySelector("input[placeholder='Ara...']");
    let myNamePlace = Array.from(
      document.getElementsByClassName("my-user-name")
    );
    let myPhotoPlace = Array.from(document.getElementsByClassName("my-photo"));
    let sidebarProfileLink = document.getElementsByClassName(
      "sidebar-profile"
    )[0];
    myNamePlace.forEach((el) => {
      el.innerHTML =
        `<a href="/frontend/profile.html?user=${data.kullaniciAdi}">` +
        data.adSoyad +
        "</a>";
    });
    myPhotoPlace.forEach((el) => {
      let parent = el.parentElement;
      parent.innerHTML = "";
      parent.innerHTML +=
        `<a href="/frontend/profile.html?user=${
          data.kullaniciAdi
        }">  <img src="${
          env.host + data.profilResmi
        }" class="img-circle my-photo" style="height: 30px;"
            alt="User Image">` + "</a>";
    });

    searchBar.addEventListener("keydown", this.searchRouter);
    sidebarProfileLink.href = `profile.html?user=${data.kullaniciAdi}`;
    await this.initFriendRequestsButton(data);
    this.stopLoadingPlaceholder();
  }
  static searchRouter(e) {
    if (e.key == "Enter") e.preventDefault();
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      location.href = "search.html?keyword=" + e.target.value;
    }, 700);
  }
  static stopLoadingPlaceholder() {
    let elements = Array.from(
      document.getElementsByClassName("loading-placeholder")
    );
    elements.forEach((element) => {
      element.parentElement.removeChild(element);
    });
  }
  static loading(status) {
    let postsPlace = document.getElementById("postsPlace");
    let loadingBox = document.getElementById("loading");
    if (status == true) {
      loadingBox.style.display = "block";
      postsPlace.style.display = "none";
    } else {
      loadingBox.style.display = "none";
      postsPlace.style.display = "block";
    }
  }
  static async setHomeEvents() {
    let commentForms = Array.from(
      document.getElementsByClassName("comment-form")
    );
    let likeButtons = Array.from(
      document.getElementsByClassName("like-button")
    );
    let commentDeleteButtons = Array.from(
      document.getElementsByClassName("commentDelete")
    );
    let shareButtons = Array.from(
      document.getElementsByClassName("share-button")
    );

    for (let i = 0; i < likeButtons.length; i++) {
      likeButtons[i].addEventListener("click", async (e) => {
        let postId = e.target.getAttribute("postId");
        this.updatePostCounters(postId);
      });
    }

    for (let i = 0; i < commentForms.length; i++) {
      commentForms[i].addEventListener("keydown", async (e) => {
        if (e.key == "Enter") {
          let postId = e.target.getAttribute("postId");
          let comment = e.target.value;
          this.commentLoading(true, postId);
          if (comment == "") return;
          await Services.postJson(env.routes.post.sendComment + postId, {
            comment,
          });
          this.updatePostCounters(postId);
          this.updatePostComments(postId);
          e.target.value = "";
        }
      });
    }
    for (let i = 0; i < commentDeleteButtons.length; i++) {
      commentDeleteButtons[i].addEventListener("click", async (e) => {
        let buton = e.target.parentElement,
          myId = buton.getAttribute("myid"),
          comment = buton.getAttribute("comment"),
          postId = buton.parentElement.parentElement.getAttribute(
            "postcommentsbyid"
          );
        this.commentLoading(true, postId);
        await Services.postJson(env.routes.post.deleteComment + postId, {
          commentData: { myId, comment },
        });
        this.updatePostComments(postId);
        this.updatePostCounters(postId);
      });
    }
    for (let i = 0; i < shareButtons.length; i++) {
      shareButtons[i].addEventListener("click", (e) => {
        let postId = e.target.getAttribute("postid");
        this.shareModalInit(postId);
      });
    }
  }

  static async settingsInit(user) {
    let settingsForm = document.getElementById("settingsForm");
    let template = `<div class="row">
        <div class="col-6"> 
            <div class="row">
                <div class="col-8">
                    <img src="${
                      env.host + user.profilResmi
                    }" id="ppPreview" style="height: 200px; width: 200px;">
                </div>
                <div class="col-4 py-5">
                    <button class="btn btn-outline-primary m-1" id="ppSelect" >Değiştir</button>
                    <input id="ppInput" style="display:none" type="file">
                    <button class="btn btn-outline-success m-1" id="ppConfirm">Onayla</button>
                </div>
            </div>
            
        </div>
        <div class="col-6">
            <div class="row">
                <div class="col-8">
                    <img src="${
                      env.host + user.kapakResmi
                    }" id="cpPreview" style="height: 200px; width: 200px;">
                </div>
                <div class="col-4 py-5">
                    <button class="btn btn-outline-primary m-1" id="cpSelect">Değiştir</button>
                    <input id="cpInput" style="display:none" type="file">
                    <button class="btn btn-outline-success m-1" id="cpConfirm">Onayla</button>
                </div>
            </div>
        </div>
    </div>
    <div class="dropdown-divider"></div>
    <div class="row mt-3">
        <div class="col-3">
            <input type="password" id="oldPassword" placeholder="Eski Şifre" class="form-control">
        </div>
        <div class="col-3">
            <input type="password" id="newPassword" placeholder="Yeni Şifre" class="form-control">
        </div>
        <div class="col-3">
            <input type="password" id="reNewPassword" placeholder="Yeni Şifre Tekrar" class="form-control">
        </div>
        <div class="col-3">
            <button type="button" id="passwordUpdateButton" class="btn btn-block btn-outline-info btn-md">Kaydet</button>
        </div>
    </div>
    <div class="dropdown-divider my-4"></div>
    <div class="row">
        <div class="col-5">
            <input type="text" id="name" value="${
              user.adSoyad
            }" class="form-control">
        </div>
        <div class="col-5">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">@</span>
                </div>
                <input type="text" id="username" class="form-control" value="${
                  user.kullaniciAdi
                }">
              </div>
        </div>
        <div class="col-2">
            <button type="button" id="updateNameAndUsername" class="btn btn-block btn-outline-secondary btn-md">Kaydet</button>
        </div>
    </div>
    <div class="dropdown-divider my-4"></div>
    <div class="row">
        <div class="col-3">
            <input type="text" id="memleketInput" class="form-control" placeholder="Memleket...">  
        </div>
        <div class="col-3">
            <input type="text" id="meslekInput" class="form-control" placeholder="Meslek...">  
        </div>
        <div class="col-3">
            <input type="text" id="dogumInput" class="form-control" placeholder="Doğum Tarihi...">  
        </div>
        <div class="col-3">
            <button type="button" id="saveInfoButton" class="btn btn-block btn-outline-dark btn-md">Kaydet</button>
        </div>
    </div>
    <div class="slide-in-fwd-center bounce-out-top" style="position:absolute;display:none;top:10%;left:30%;background:green;width:8vw;height:5vh;text-align:center;padding:.5em;color:white;border-radius:100px;opacity:.7" id="alertMessage">Başarılı</div>`;
    settingsForm.innerHTML += template;

    let ppSelect = document.getElementById("ppSelect"),
      ppConfirm = document.getElementById("ppConfirm"),
      ppInput = document.getElementById("ppInput"),
      cpSelect = document.getElementById("cpSelect"),
      cpConfirm = document.getElementById("cpConfirm"),
      cpInput = document.getElementById("cpInput"),
      formData = new FormData();

    formData.set("token", localStorage.getItem("token"));

    ppSelect.addEventListener("click", () => {
      ppInput.click();
    });
    cpSelect.addEventListener("click", () => {
      cpInput.click();
    });

    ppInput.addEventListener("change", (e) => {
      let image = e.target.files[0];
      if (
        image.type == "image/png" ||
        image.type == "image/jpeg" ||
        image.type == "image/jpg"
      ) {
        this.previewImage(image, "ppPreview");
        formData.append("pp", image);
      } else e.target.value = "";
    });

    cpInput.addEventListener("change", (e) => {
      let image = e.target.files[0];
      if (
        image.type == "image/png" ||
        image.type == "image/jpeg" ||
        image.type == "image/jpg"
      ) {
        this.previewImage(image, "cpPreview");
        formData.append("cp", image);
        console.log(formData.get("cp"));
      } else e.target.value = "";
      console.log("kapak foto seçildi");
    });

    //Onaylama
    ppConfirm.addEventListener("click", async () => {
      let update = await fetch(env.host + env.routes.user.updatePP, {
        method: "POST",
        body: formData,
      });
      console.log(update);
    });
    cpConfirm.addEventListener("click", async () => {
      let update = await fetch(env.host + env.routes.user.updateCP, {
        method: "POST",
        body: formData,
      });
      console.log(update);
    });

    //info Settings
    const saveInfoButton = document.getElementById("saveInfoButton"),
      memleketInput = document.getElementById("memleketInput"),
      dogumInput = document.getElementById("dogumInput"),
      meslekInput = document.getElementById("meslekInput");

    saveInfoButton.addEventListener("click", saveInfo);
    let kisiselBilgi = JSON.parse(user.kisiselBilgi);
    console.log(kisiselBilgi);
    memleketInput.value = kisiselBilgi.memleket || "";
    dogumInput.value = kisiselBilgi.dogum || "";
    meslekInput.value = kisiselBilgi.meslek || "";
    async function saveInfo() {
      let data = {};

      if (memleketInput.value.trim() != "") {
        data.memleket = memleketInput.value;
      }
      if (dogumInput.value.trim() != "") {
        data.dogum = dogumInput.value;
      }
      if (meslekInput.value.trim() != "") {
        data.meslek = meslekInput.value;
      }
      await Services.postJson(env.routes.user.updateInfo, {
        data,
        id: user.id,
      });
      console.log("Update successful !");
    }

    //password Settings

    let oldPasswordPlace = document.getElementById("oldPassword");
    let newPasswordPlace = document.getElementById("newPassword");
    let reNewPasswordPlace = document.getElementById("reNewPassword");
    let passwordUpdateButton = document.getElementById("passwordUpdateButton");
    let oldPassStatus = false,
      newPassStatus = false;
    oldPasswordPlace.addEventListener("input", async (e) => {
      if (e.target.value == "") {
        oldPasswordPlace.classList.remove("is-invalid");
        oldPasswordPlace.classList.remove("is-valid");
        return;
      }
      let status = await Services.postJson(env.routes.user.passwordControl, {
        username: localStorage.getItem("username"),
        password: e.target.value,
      });
      status = await status.json();
      if (status.status == true) {
        oldPasswordPlace.classList.remove("is-invalid");
        oldPasswordPlace.classList.add("is-valid");
        oldPassStatus = true;
      } else {
        oldPasswordPlace.classList.remove("is-valid");
        oldPasswordPlace.classList.add("is-invalid");
        oldPassStatus = false;
      }
    });
    reNewPasswordPlace.addEventListener("input", () => {
      if (reNewPasswordPlace.value == newPasswordPlace.value) {
        reNewPasswordPlace.classList.remove("is-invalid");
        reNewPasswordPlace.classList.add("is-valid");
        newPasswordPlace.classList.remove("is-invalid");
        newPasswordPlace.classList.add("is-valid");
        newPassStatus = true;
      } else {
        reNewPasswordPlace.classList.add("is-invalid");
        reNewPasswordPlace.classList.remove("is-valid");
        newPasswordPlace.classList.add("is-invalid");
        newPasswordPlace.classList.remove("is-valid");
        newPassStatus = false;
      }
    });
    newPasswordPlace.addEventListener("input", () => {
      if (reNewPasswordPlace.value == newPasswordPlace.value) {
        reNewPasswordPlace.classList.remove("is-invalid");
        reNewPasswordPlace.classList.add("is-valid");
        newPasswordPlace.classList.remove("is-invalid");
        newPasswordPlace.classList.add("is-valid");
        newPassStatus = true;
      } else {
        reNewPasswordPlace.classList.add("is-invalid");
        reNewPasswordPlace.classList.remove("is-valid");
        newPasswordPlace.classList.add("is-invalid");
        newPasswordPlace.classList.remove("is-valid");
        newPassStatus = false;
      }
    });
    passwordUpdateButton.addEventListener("click", async () => {
      if (oldPassStatus && newPassStatus) {
        let status = await Services.postJson(env.routes.user.updatePassword, {
          id: user.id,
          newPassword: newPasswordPlace.value,
        });
        status = await status.json();
        console.log(status);
      } else {
      }
    });

    let updateNameAndUsernameButton = document.getElementById(
        "updateNameAndUsername"
      ),
      namePlace = document.getElementById("name"),
      usernamePlace = document.getElementById("username"),
      oldUsername = usernamePlace.value,
      alertMessage = document.getElementById("alertMessage");
    updateNameAndUsernameButton.addEventListener("click", async () => {
      if (namePlace.value == "" || usernamePlace.value == "") {
        alert("Boş alan bırakılamaz !");
        return;
      }
      // Şükrü Ünlü  (split)->   ["Şükrü","Ünlü"]
      if (namePlace.value.split(" ").length < 2) {
        alert("Ad Soyad şeklinde yazılmalıdır !");
        return;
      }

      let status = await (
        await Services.postJson(env.routes.user.updateUsernameAndName, {
          id: user.id,
          newUsername: usernamePlace.value,
          newName: namePlace.value,
        })
      ).json();
      if (status.status == "ok") {
        alertMessage.innerHTML == "Güncelleme Başarılı";
        alertMessage.style.display = "block";
        setTimeout(() => {
          alertMessage.style.display = "none";
          if (usernamePlace.value != oldUsername) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            location.href = "login.html";
          }
        }, 2000);
      }
    });
  }
  static previewImage(file, imgId) {
    let reader = new FileReader();
    reader.onload = function () {
      let output = document.getElementById(imgId);
      output.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  static shareModalInit(postId) {
    let facebokButton = document.getElementById("fb-sh"),
      twitterButton = document.getElementById("tw-sh"),
      whatsappButton = document.getElementById("wa-sh"),
      copyButton = document.getElementById("cp-sh");
    facebokButton.href = `https://www.facebook.com/sharer/sharer.php?u=${location.host}/frontend/post.html?postId=${postId}`;
    twitterButton.href = `https://twitter.com/intent/tweet?original_referer=${location.host}/frontend/post.html?postId=${postId}&ref_src=twsrc%5Etfw&url=http://localhost:85/post.html?postId=${postId}`;
    whatsappButton.href = `whatsapp://send?text=${location.host}/frontend/post.html?postId=${postId}`;
    copyButton.setAttribute(
      "url",
      `${location.host}/frontend/post.html?postId=${postId}`
    );
    copyButton.addEventListener("click", () => {
      let alan = copyButton.getAttribute("url");
      let textAlani = document.createElement("TEXTAREA");
      textAlani.value = alan;
      document.body.appendChild(textAlani);
      textAlani.select();
      document.execCommand("copy");
      textAlani.style.display = "none";
    });
  }

  static async updatePostComments(postId) {
    let thisPost = (await Services.getPostData(postId))[0];
    let thisComments = document.querySelector(
      `div[postcommentsbyid="${postId}"]`
    );
    thisComments.innerHTML = await this.commentRender(thisPost.yorumlar);
    await this.setHomeEvents();
    this.commentLoading(false, postId);
  }
  static commentLoading(status, postId) {
    let commentLoadingBoxes = document.querySelector(
      `.commentLoading,div[postId="${postId}"]`
    );
    if (status) {
      commentLoadingBoxes.style.display = "block";
      return;
    }
    commentLoadingBoxes.style.display = "none";
  }
  static async updatePostCounters(postId) {
    await Services.postJson(env.routes.post.like + postId);
    let thisPost = await Services.getPostData(postId);
    let liveLikeCounter = eval(thisPost[0].begenenler).length;
    let liveCommentCounter = eval(thisPost[0].yorumlar).length;
    let postDom = document.querySelector(`span[counterforbyid="${postId}"]`);
    postDom.innerHTML = `${liveLikeCounter} Suco - ${liveCommentCounter} Yorum`;
  }
  static async postRender(postData) {
    let postsPlace = document.getElementById("postsPlace");
    postData.resim = Adapters.postImageAdapter(postData.resim);
    let user = new User();
    let username = (await User.getUserNameById(postData.paylasanId)).username;
    let duygu = (function () {
      switch (postData.duygu) {
        case "0":
          return "Mutlu 😊";
        case "1":
          return "Mutsuz ☹";

        case "2":
          return "Endişeli😟";
        case "3":
          return "Çılgın 🤪";

        case "4":
          return "Hasta 🤢";

        case "5":
          return "Gülmekten Kırılmış 🤣";

        case "6":
          return "Sinirli 😡";

        case "7":
          return "Keyfi Yerinde 🤗";
      }
    })();
    await user.init(username);
    let header = `<div class="card card-widget offset-md-2 col-md-8">
        <div class="card-header">
            <div class="user-block">
            <a href="/frontend/profile.html?user=${username}">
                <img class="img-circle" src="${
                  env.host + user.data.profilResmi
                }" alt="User Image"> </a>
                <span class="username"><a href="/frontend/profile.html?user=${username}">${
      user.data.adSoyad
    }</a></span>
                <span class="description" ><a style="color:black" href="post.html?postId=${
                  postData.id
                }"> ${(function () {
      if (postData.gizlilik == 1) return "Arkadaşlar";
      else return "Herkese Açık";
    })()} - ${postData.tarih} </a> | ${(function () {
      if (duygu == undefined) return "";
      else
        return `<span class="badge badge-primary" style="font-size:0.8rem"> ${duygu} <span>`;
    })()} </span>
            </div>
            <!-- /.user-block -->
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-toggle="tooltip" title="Mark as read">
                    <i class="far fa-circle"></i></button>
                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                </button>
                <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i>
                </button>
            </div>
            <!-- /.card-tools -->
        </div>
        <!-- /.card-header -->`;
    let footer = `<div class="card-footer card-comments" postCommentsById="${
      postData.id
    }" style="display: block;">
        ${await Dom.commentRender(postData.yorumlar)}
        </div>
        <!-- /.card-footer -->
        <div class="card-footer" style="display: block;">
        <div id="loading" class="col-12 text-center">
              <div class="mb-2" style="display:none" postId="${
                postData.id
              }" class="commentLoading">  
                    <div class="spinner-border" style="width: 1rem; height: 1rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <strong>Yükleniyor...</strong>  
                    </div>
                </div>
                <img class="img-fluid img-circle img-sm" src="${
                  env.host + user.data.profilResmi
                }" alt="Alt Text">
                <!-- .img-push is used to add margin to elements next to floating images -->
                       
                <div class="img-push">
                    <input type="text" postId = ${
                      postData.id
                    } class="form-control form-control-sm comment-form" placeholder="Yorum bırak...">
                </div>
        </div>
        <!-- /.card-footer --></div>`;
    if (postData.resim.length == 0) {
      let noImagePostTemp = `
    <div class="card-body" style="display: block;">
        <p>${postData.metin}</p>
        <button type="button" postId="${
          postData.id
        }" data-toggle="modal" data-target="#share-modal" class="btn btn-default btn-sm share-button"><i class="fas fa-share"></i>Paylaş</button>
        <button type="button" postId="${
          postData.id
        }" class="btn btn-default btn-sm like-button"><i class="fas fa-heart"></i>Suco</button>
        <span class="float-right text-muted" counterForById="${postData.id}">${
        eval(postData.begenenler).length
      } Suco - ${eval(postData.yorumlar).length} Yorum</span>
    </div>
    <!-- /.card-body -->
`;
      postsPlace.innerHTML += header + noImagePostTemp + footer;
    }
    if (postData.resim.length == 1) {
      let singleImagePostTemp = `
        <div class="card-body" style="display: block;">
            <img class="img-fluid pad" src="${
              env.host + "/postImages/" + postData.resim[0]
            }" alt="Photo">

            <p>${postData.metin}</p>
            <button type="button" postId="${
              postData.id
            }" data-toggle="modal" data-target="#share-modal" class="btn btn-default btn-sm share-button"><i class="fas fa-share"></i>
                Paylaş</button>
            <button type="button" postId="${
              postData.id
            }" class="btn btn-default btn-sm like-button"><i class="fas fa-heart"></i>
                Suco</button>
            <span class="float-right text-muted" counterForById="${
              postData.id
            }">${eval(postData.begenenler).length} Suco - ${
        eval(postData.yorumlar).length
      } Yorum</span>
        </div>
        <!-- /.card-body -->
        
    `;
      postsPlace.innerHTML += header + singleImagePostTemp + footer;
    }
    if (postData.resim.length > 1) {
      let multiImagePostTemp = `
            <div class="card-body" style="display: block;">
               
                        <div class="row">
                            ${this.multiImagePostRender(postData.resim)}
                        </div>
    
                <p>${postData.metin}</p>
                <button type="button" postId="${
                  postData.id
                }" data-toggle="modal" data-target="#share-modal" class="btn btn-default btn-sm share-button"><i class="fas fa-share"></i>Paylaş</button>
                <button type="button" postId="${
                  postData.id
                }" class="btn btn-default btn-sm like-button"><i class="fas fa-heart"></i>Suco</button>

                <span class="float-right text-muted" counterForById="${
                  postData.id
                }">${eval(postData.begenenler).length} Suco - ${
        eval(postData.yorumlar).length
      } Yorum</span>
            </div>
            <!-- /.card-body -->
            
        `;
      postsPlace.innerHTML += header + multiImagePostTemp + footer;
    }
  }
  static async commentRender(commentData) {
    let commentsResult = "";
    commentData = eval(commentData);
    await new Promise(async (resolve, reject) => {
      for (let i = 0; i < commentData.length; i++) {
        let user = new User();
        user.username = (
          await User.getUserNameById(commentData[i].myId)
        ).username;
        await user.init(user.username);
        //console.log(commentData[i]);
        //console.log(user);
        commentsResult += `  <div class="card-comment">
                <!-- User image -->
                <img class="img-circle img-sm" src="${
                  env.host + user.data.profilResmi
                }" alt="User Image">
                <button type="button" myId="${commentData[i].myId}" comment="${
          commentData[i].comment
        }" ${(function () {
          if (user.username != localStorage.getItem("username"))
            return 'style="display:none"';
          else return "";
        })()} class="close commentDelete" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
                <div class="comment-text">
                <a href="/frontend/profile.html?user=${
                  user.data.kullaniciAdi
                }"><span class="username">
                        ${user.data.adSoyad}
                        <span class="text-muted float-right"></span>
                    </span></a><!-- /.username -->
                    ${commentData[i].comment}
                </div>
                <!-- /.comment-text -->
               
            </div> `;
      }
      resolve();
    });
    return commentsResult;
  }
  static multiImagePostRender(imageArray) {
    let result = "";
    if (imageArray.length >= 4) {
      if (imageArray.length % 4 == 0) {
        for (let i = 0; i < imageArray.length; i++) {
          result += `<div class="col-md-3">
                <a href="${
                  env.host + "/postImages/" + imageArray[i]
                }" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
               <img src="${
                 env.host + "/postImages/" + imageArray[i]
               }" style="height:140px" class="img-fluid mb-2" alt="white sample">
            </a>
             </div>`;
        }
      }
      if (imageArray.length % 4 != 0) {
        let k = imageArray.length % 4;
        for (let i = 0; i < imageArray.length - k; i++) {
          result += `<div class="col-md-3">
                <a href="${
                  env.host + "/postImages/" + imageArray[i]
                }" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
               <img src="${
                 env.host + "/postImages/" + imageArray[i]
               }" style="height:140px" class="img-fluid mb-2" alt="white sample">
                </a>
                 </div>`;
        }
        for (let i = 0; i < k; i++) {
          if (k == 1) {
            result += `<div class="col-md-12 text-center">
                 <a href="${
                   env.host +
                   "/postImages/" +
                   imageArray[imageArray.length - k + i]
                 }" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                 <img src="${
                   env.host +
                   "/postImages/" +
                   imageArray[imageArray.length - k + i]
                 }" style="height:250px" class="img-fluid mb-2" alt="white sample">
                 </a>
                 </div>`;
          }
          if (k == 2) {
            result += `<div class="col-md-6">
                 <a href="${
                   env.host +
                   "/postImages/" +
                   imageArray[imageArray.length - k + i]
                 }" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                 <img src="${
                   env.host +
                   "/postImages/" +
                   imageArray[imageArray.length - k + i]
                 }" style="height:200px" class="img-fluid mb-2" alt="white sample">
                 </a>
                 </div>`;
          }
          if (k == 3) {
            result += `<div class="col-md-4">
                 <a href="${
                   env.host +
                   "/postImages/" +
                   imageArray[imageArray.length - k + i]
                 }" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                 <img src="${
                   env.host +
                   "/postImages/" +
                   imageArray[imageArray.length - k + i]
                 }" style="height:160px" class="img-fluid mb-2" alt="white sample">
                 </a>
                 </div>`;
          }
        }
      }
    } else {
      if (imageArray.length == 2) {
        for (let i = 0; i < imageArray.length; i++) {
          result += `<div class="col-md-6">
                    <a href="${
                      env.host + "/postImages/" + imageArray[i]
                    }" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                    <img src="${
                      env.host + "/postImages/" + imageArray[i]
                    }" style="height:200px" class="img-fluid mb-2" alt="white sample">
                    </a>
                    </div>`;
        }
      }
      if (imageArray.length == 3) {
        for (let i = 0; i < imageArray.length; i++) {
          result += `<div class="col-md-4">
                    <a href="${
                      env.host + "/postImages/" + imageArray[i]
                    }" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                    <img src="${
                      env.host + "/postImages/" + imageArray[i]
                    }" style="height:160px" class="img-fluid mb-2" alt="white sample">
                    </a>
                    </div>`;
        }
      }
    }

    return result;
  }
  static async profileRender(userData) {
    let firstNamePlace = document.getElementById("firstName"),
      lastNamePlace = document.getElementById("lastName"),
      ppPlace = document.getElementById("pp"),
      cpPlace = document.getElementById("cp"),
      postCounterPlace = document.getElementById("postCounter"),
      friendCounter = document.getElementById("friendCounter");

    [firstNamePlace, lastNamePlace, postCounterPlace, friendCounter].forEach(
      (el) => {
        el.innerHTML = "";
      }
    );

    let firstName = userData.adSoyad.split(" ")[0],
      lastName = userData.adSoyad.split(" ")[1];

    firstNamePlace.innerHTML = firstName;
    lastNamePlace.innerHTML = lastName;
    ppPlace.src = env.host + userData.profilResmi;
    cpPlace.style = `background: url('${
      env.host + userData.kapakResmi
    }');background-size: cover;`;
    postCounterPlace.innerHTML = userData.posts.length;
    friendCounter.innerHTML = eval(userData.arkadaslar).length;
    this.profileInfoRender(userData.kisiselBilgi);
    await this.profileFriendButtonsRender(userData);
  }
  static async profileFriendButtonsRender(data) {
    let friendButtonPlace = document.getElementById("friendButtonPlace");
    let myId = (await User.getUserData(localStorage.getItem("username"))).id;
    let userFriends = JSON.parse(data.arkadaslar);
    let userFriendRequest = JSON.parse(data.istekler);

    userFriendRequest.gelen = eval(userFriendRequest.gelen);
    userFriendRequest.gonderilen = eval(userFriendRequest.gonderilen);

    console.log(userFriendRequest);
    // Bu Kişi arkadaşım mı ?
    if (userFriends.includes(myId)) {
      friendButtonPlace.innerHTML = `<button type="button" id="deleteFriendButton" class="btn btn-block btn-outline-success">Arkadaşlıktan Çıkar</button>
            <button type="button" id="blockButton" class="btn btn-block btn-outline-success">Engelle</button>`;
      let deleteFriendButton = document.getElementById("deleteFriendButton");
      let blockButton = document.getElementById("blockButton");
      deleteFriendButton.addEventListener("click", async () => {
        let status = await Services.postJson(
          env.routes.user.deleteFriend + data.kullaniciAdi
        );
        this.showToast("Arkadaşlıktan çıkartıldı.", "success");
        this.profileRender(await User.getUserData(data.kullaniciAdi));
      });
      blockButton.addEventListener("click", async () => {
        let status = await Services.postJson(
          env.routes.user.block + data.kullaniciAdi
        );
        this.showToast("Kişi Engellendi !", "warning");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
    // Bu kişi bana istek göndermiş mi ?
    else if (userFriendRequest.gonderilen.includes(myId)) {
      console.log("İstek gelmiş");
      friendButtonPlace.innerHTML = ` <button type="button" id="acceptButton" class="btn btn-block btn-outline-success">İsteği Onayla</button>
            <button type="button" id="rejectButton" class="btn btn-block btn-outline-danger">Reddet</button>`;
      let acceptButton = document.getElementById("acceptButton");
      let rejectButton = document.getElementById("rejectButton");
      acceptButton.addEventListener("click", async () => {
        let status = await Services.postJson(
          env.routes.user.acceptFriendRequest + data.kullaniciAdi
        );
        this.showToast("Artık Arkadaşsınız", "success");
        this.profileRender(await User.getUserData(data.kullaniciAdi));
      });
      rejectButton.addEventListener("click", async () => {
        let status = await Services.postJson(
          env.routes.user.rejectFriendRequest + data.kullaniciAdi
        );
        this.showToast("Arkadaşlık isteği reddedildi.", "warning");
        this.profileRender(await User.getUserData(data.kullaniciAdi));
      });
    }
    // Ben bu kişiye istek göndermiş miyim ?
    else if (userFriendRequest.gelen.includes(myId)) {
      console.log("Bu kişiden bana istek gelmiş");
      friendButtonPlace.innerHTML = `<button type="button" id="cancelRequestButton" class="btn btn-block btn-outline-primary">İstekten Vazgeç</button>`;
      let cancelRequestButton = document.getElementById("cancelRequestButton");
      cancelRequestButton.addEventListener("click", async () => {
        let status = await Services.postJson(
          env.routes.user.cancelFriendRequest + data.kullaniciAdi
        );
        this.showToast("İstekten Vazgeçildi.", "success");
        this.profileRender(await User.getUserData(data.kullaniciAdi));
      });
    } else if (data.id == myId) {
      console.log("Kendi Profilin");
      friendButtonPlace.innerHTML = `<button type="button" id="friendsButton" class="btn btn-block btn-outline-primary" data-toggle="modal" data-target="#friendsModal">Arkadaşlar</button>`;
      this.friendsRender(data.kullaniciAdi);
    }
    // Eğer arkadaşımız değilse ve istek durumu yoksa
    else if (
      !userFriends.includes(myId) &&
      !userFriendRequest.gelen.includes(myId) &&
      !userFriendRequest.gonderilen.includes(myId)
    ) {
      console.log("Bu kişi arkadaşın değil");
      friendButtonPlace.innerHTML = `<button type="button" id="sendFriendRequestButton" class="btn btn-block btn-outline-primary">Arkadaş Ol</button>
            <button type="button" id="blockButton" class="btn btn-block btn-outline-success">Engelle</button>`;
      let sendFriendRequestButton = document.getElementById(
        "sendFriendRequestButton"
      );
      let blockButton = document.getElementById("blockButton");
      sendFriendRequestButton.addEventListener("click", async () => {
        let status = await Services.postJson(
          env.routes.user.addFriend + data.kullaniciAdi
        );
        this.showToast("Arkadaşlık isteği gönderildi.", "success");
        this.profileRender(await User.getUserData(data.kullaniciAdi));
      });
      blockButton.addEventListener("click", async () => {
        let status = await Services.postJson(
          env.routes.user.block + data.kullaniciAdi
        );
        this.showToast("Kişi Engellendi !", "warning");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  }
  static async initFriendRequestsButton(data) {
    let friendRequestsButton = document.getElementById("friendRequestsButton");
    friendRequestsButton.innerHTML = "";
    let myUsername = data.kullaniciAdi;
    data = JSON.parse(data.istekler);

    let requestCounter = data.length;
    data = JSON.parse(data.gelen);

    let requestsHTML = "";
    for (let i = 0; i < data.length; i++) {
      let username = (await User.getUserNameById(data[i])).username;
      let userData = await User.getUserData(username);
      requestsHTML += `<div class="my-2 mx-1" >
            <a href="/frontend/profile.html?user=${username}" class="dropdown-item d-inline"> <img src="${
        env.host + "/" + userData.profilResmi
      }"
                    style="width: 30px; height: 30px;" class="img-circle elevation-2" alt="User Image">
                <span class="d-inline ml-1"> ${userData.adSoyad} </span></a>
                <div class="d-inline ml-1">
                    <button class="btn btn-xs btn-success navbarFriendRequestAcceptButton" username="${username}">Onayla</button>
                    <button class="btn btn-xs btn-danger navbarFriendRequestRejectButton" username="${username}"> Reddet</button>
                </div>
            
        </div>`;
    }
    let template = ``;
    if (data.length == 0) {
      template = `<a class="nav-link" data-toggle="dropdown" href="#">
            <i class="fas fa-user-friends"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right pb-3">
                <span class="dropdown-item dropdown-header">Arkadaşlık isteği yok.</span>
                <div class="dropdown-divider"></div>
            </div>`;
    } else {
      template = `<a class="nav-link" data-toggle="dropdown" href="#">
            <i class="fas fa-user-friends"></i>
            <span class="badge badge-primary navbar-badge">${data.length}</span>
    
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right pb-3">
                <span class="dropdown-item dropdown-header">${data.length} Yeni Arkadaşlık İsteği</span>
                <div class="dropdown-divider"></div>
                ${requestsHTML}   
            </div>`;
    }
    friendRequestsButton.innerHTML += template;
    let acceptButtons = document.getElementsByClassName(
      "navbarFriendRequestAcceptButton"
    );
    let rejectButtons = document.getElementsByClassName(
      "navbarFriendRequestRejectButton"
    );
    for (let i = 0; i < acceptButtons.length; i++) {
      acceptButtons[i].addEventListener("click", async (e) => {
        let status = await Services.postJson(
          env.routes.user.acceptFriendRequest +
            e.target.getAttribute("username")
        );
        this.showToast("Artık Arkadaşsınız", "success");
        await this.initFriendRequestsButton(await User.getUserData(myUsername));
      });
    }
  }
  static showToast(body, bgcolor) {
    // showToast("arkadaş olarak eklendi","bg-success");
    let myToast = document.getElementsByClassName("myToast")[0];
    myToast.style.display = "block";
    let icon,
      ToastBody = document.getElementById("toast-body");

    if (bgcolor == "success") icon = "check";
    if (bgcolor == "warning") icon = "exclamation-triangle";
    if (bgcolor == "danger") icon = "ban";

    let content = `   <div class="alert alert-${bgcolor} alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <h5><i class="icon fas fa-${icon}"></i> Tamam !</h5>
        ${body}
       </div>`;
    ToastBody.innerHTML = content;
    setTimeout(() => {
      myToast.style.display = "none";
      ToastBody.innerHTML = "";
    }, 3000);
  }
  static profileInfoRender(info) {
    info = JSON.parse(info);
    let infoPlace = document.getElementById("personelInfo");
    let birthdayIcon = `fas fa-birthday-cake`,
      cityIcon = `fas fa-street-view`,
      jobIcon = `fas fa-briefcase`;

    infoPlace.innerHTML = "";
    Object.keys(info).forEach((el) => {
      if (el == "memleket") {
        infoPlace.innerHTML += `
                <li class="nav-item">
                  <a  class="nav-link">
                    <i class="${cityIcon} mr-2"></i> Memleket <span class="float-right badge">${info.memleket.toUpperCase()} </span>
                  </a>
                </li>`;
      }
      if (el == "meslek") {
        infoPlace.innerHTML += `
                <li class="nav-item">
                  <a  class="nav-link">
                    <i class="${jobIcon} mr-2"></i> Meslek <span class="float-right badge">${info.meslek.toUpperCase()} </span>
                  </a>
                </li>`;
      }
      if (el == "dogum") {
        infoPlace.innerHTML += `
                <li class="nav-item">
                  <a  class="nav-link">
                    <i class="${birthdayIcon} mr-2"></i> Doğum Tarihi <span class="float-right badge">${info.dogum.toUpperCase()} </span>
                  </a>
                </li>`;
      }
    });
  }
  static async friendsRender(username) {
    let friendsIds = eval((await User.getUserData(username)).arkadaslar);
    let friendsListPlace = document.getElementById("friendsListPlace"),
      friendsUserNames = [],
      friends = [];
    for (let i = 0; i < friendsIds.length; i++) {
      friendsUserNames.push(
        (await User.getUserNameById(friendsIds[i])).username
      );
    }
    for (let i = 0; i < friendsIds.length; i++) {
      friends.push(await User.getUserData(friendsUserNames[i]));
    }
    friendsListPlace.innerHTML = "";
    for (let i = 0; i < friends.length; i++) {
      friendsListPlace.innerHTML += `<li class="list-group-item row">
               <div class="row">
                   <div class="col-2 ">
                      <a href="/frontend/profile.html?user=${
                        friendsUserNames[i]
                      }"> <img src="${
        env.host + "/" + friends[i].profilResmi
      }" class="img-circle" style="height: 30px;"
                           alt="User Image"> </a>
                   </div>
                   <div class="col-4">
                   <a href="/frontend/profile.html?user=${
                     friendsUserNames[i]
                   }">  <i> ${friends[i].adSoyad} </i></a>
                   </div>
                   <div class="col-4 offset-2">
                       <button class="btn btn-sm btn-primary friendsDeleteButtons" username="${
                         friendsUserNames[i]
                       }"> Arkadaşlardan Sil </button>
                   </div>
               </div>
           </li>`;
    }
    let friendsDeleteButtons = document.getElementsByClassName(
      "friendsDeleteButtons"
    );
    for (let i = 0; i < friendsDeleteButtons.length; i++) {
      friendsDeleteButtons[i].addEventListener("click", async (e) => {
        let status = await Services.postJson(
          env.routes.user.deleteFriend + e.target.getAttribute("username")
        );
        this.profileRender(await User.getUserData(username));
        this.friendsRender(username);
      });
    }
  }

  static async searchResults() {
    let searchBar = document.querySelector("input[placeholder='Ara...']");
    let keyword = new URLSearchParams(window.location.search).get("keyword");
    searchBar.removeEventListener("keydown", this.searchRouter);
    searchBar.value = keyword;
    this.searchUsers(keyword);
    searchBar.addEventListener("keyup", () => {
      this.searchUsers(searchBar.value);
    });
  }
  static async searchUsers(keyword) {
    if (keyword.trim() == "") return;
    let results = await Services.postJson(env.routes.user.search, { keyword });
    results = (await results.json()).results;
    this.drawSearchResults(results);
  }
  static async drawSearchResults(users) {
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";
    users.forEach((item) => {
      searchResults.innerHTML += `<div class="col-md-6 col-sm-12">
            <div class="card card-outline card-primary">
                <div class="card-body d-flex justify-content-between">
                    <img class="direct-chat-img" src="${
                      env.host + item.profilResmi
                    }">
                    <span>
                        <h3>${item.adSoyad}</h3>
                    </span>
                        <a  href="profile.html?user=${
                          item.kullaniciAdi
                        }" class="d-inline btn btn-primary text-light">Profile Git</a>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>`;
    });
  }

  static drawChat() {
    const chatDiv = document.getElementById("chatDiv");
    chatDiv.innerHTML = `  <div class="row">
        <div class="col-6">
            <div class="row ">
                <div class="col-3 offset-md-7 fixed-bottom">
                    <div id="directMessage" class="card card-success card-outline direct-chat direct-chat-success" style="display:none">
                        <div class="card-header">
                            <h3 class="card-title"></h3>

                            <div class="card-tools">

                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i
                                        class="fas fa-minus"></i>
                                </button>
                                <button type="button" class="btn btn-tool" data-card-widget="remove"><i
                                        class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body" style="display: block;">
                            <!-- Conversations are loaded here -->
                            <div class="direct-chat-messages">
                                <!-- Message. Default to the left -->
                               <!-- MESAJLAŞMA ALANI  -->
                            </div>
                            <!--/.direct-chat-messages-->


                            <!-- /.direct-chat-pane -->
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer" style="display: block;">
                            <form id="message-form">
                                <div class="input-group">
                                    <input type="text" name="message"  autocomplete="off" placeholder="Sadece yaz..."
                                        class="form-control">
                                    <span class="input-group-append">
                                        <button type="submit" id="message-send-button" class="btn btn-success">Gönder</button>
                                    </span>
                                </div>
                            </form>
                        </div>
                        <!-- /.card-footer-->
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="row">
                <div id="messenger-box" class="col-2  ml-auto fixed-bottom">
                    <div
                        class="card card-primary direct-chat direct-chat-contacts-open d-lg-block d-xl-block  direct-chat-danger collapsed-card">
                        <div class="card-header">
                            <h3 class="card-title">Mesajlaş</h3>

                            <div class="card-tools">
                                <span data-toggle="tooltip" title="3 New Messages" class="badge badge-success">3</span>
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i
                                        class="fas fa-minus"></i>
                                </button>

                            </div>
                        </div>
                        <!-- /.card-header -->
                        <div style="height: 250px !important;display:none" class="card-body">
                            <!-- Conversations are loaded here -->
                            <div class="direct-chat-messages">
                                <!-- Message. Default to the left -->
                                <div class="direct-chat-msg">
                                    <div class="direct-chat-infos clearfix">
                                        <span class="direct-chat-name float-left">Alexander Pierce</span>
                                        <span class="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>
                                    </div>
                                    <!-- /.direct-chat-infos -->
                                    <img class="direct-chat-img" src="dist/img/user1-128x128.jpg"
                                        alt="Message User Image">
                                    <!-- /.direct-chat-img -->
                                    <div class="direct-chat-text">
                                        Mesaj
                                    </div>
                                    <!-- /.direct-chat-text -->
                                </div>
                                <!-- /.direct-chat-msg -->

                                <!-- Message to the right -->
                                <div class="direct-chat-msg right">
                                    <div class="direct-chat-infos clearfix">
                                        <span class="direct-chat-name float-right">Sarah Bullock</span>
                                        <span class="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>
                                    </div>
                                    <!-- /.direct-chat-infos -->
                                    <img class="direct-chat-img" src="dist/img/user3-128x128.jpg"
                                        alt="Message User Image">
                                    <!-- /.direct-chat-img -->
                                    <div class="direct-chat-text">
                                        You better believe it!
                                    </div>
                                    <!-- /.direct-chat-text -->
                                </div>
                                <!-- /.direct-chat-msg -->
                            </div>
                            <!--/.direct-chat-messages-->

                            <!-- Contacts are loaded here -->
                            <div class="direct-chat-contacts">
                                <ul class="contacts-list">
                               
                      <!--KOD GELECEK-->
                                    <!-- End Contact Item -->
                                </ul>
                                <!-- /.contatcts-list -->
                            </div>
                            <!-- /.direct-chat-pane -->
                        </div>
                        <!-- /.card-body -->
                        <div class="card-footer" style="display:none">
                            <form action="#" method="post">
                                <div class="input-group">
                                    <input type="text" name="message" placeholder="Arkadaş Ara..." class="form-control">
                                </div>
                            </form>
                        </div>
                        <!-- /.card-footer-->
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="share-modal" style="display: none;" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content bg-secondary">
                    <div class="modal-header">
                        <h4 class="modal-title">Bu Gönderiyi Paylaş</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body bg-light text-center">
                        <a id="fb-sh" href="" target="_blank">
                            <i style="font-size: 3rem" class="fab fa-facebook m-1"></i>
                        </a>
                        <a id="tw-sh" href="">
                            <i style="font-size: 3rem" class="fab fa-twitter m-1"></i>
                        </a>
                        <a id="wa-sh" href="">
                            <i style="font-size: 3rem" class="fab fa-whatsapp-square m-1"></i>
                        </a>
                        <span id="cp-sh" url="">
                            <i style="font-size: 3rem" class="fas fa-copy m-1"></i>
                        </span>
                    </div>
                    <div class="modal-footer justify-content-between">
                        <button type="button" class="btn btn-outline-light" data-dismiss="modal">Kapat</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    </div>`;
    this.directMessage = document.querySelector(".direct-chat-messages");
    this.directMessage.addEventListener("scroll", async () => {
      if (this.directMessage.scrollTop <= 0) {
        this.page += 1;
        await this.getMessages("sukru1");
        this.scrollSet();
      }
      console.log("scrollTop :" + this.directMessage.scrollTop);
    });
    setTimeout(() => {});
  }
  static messages = [];
  static addSendMessageEvent(e) {
    e.preventDefault();
    let messageInput = document.querySelector('input[name="message"]');
    e.target._this.sendMessage(
      e.target.socket,
      e.target.user,
      messageInput.value
    );
    messageInput.value = "";
  }
  static openDirectMessage(adSoyad, user, socket) {
    console.log("Selam");
    const directMessage = document.getElementById("directMessage"),
      friendName = document.querySelector("#directMessage .card-title");
    const messageForm = document.getElementById("message-form");
    let messageInput = document.querySelector('input[name="message"]');
    friendName.innerHTML = adSoyad;
    if (directMessage.style.display != "block") {
      directMessage.style.display = "block";
      messageForm.user = user;
      messageForm.socket = socket;
      messageForm._this = this;
      messageForm.removeEventListener(
        "submit",
        this.addSendMessageEvent,
        false
      );
      messageForm.addEventListener("submit", this.addSendMessageEvent);
    }

    this.getMessages(user[0].username);
  }
  static messageScrollKeepBottom() {
    const messagesBody = document.querySelector(".direct-chat-messages");
    messagesBody.scrollTop =
      messagesBody.scrollHeight - messagesBody.clientHeight;
  }
  static async getMessagePP(username) {
    let userPP = localStorage.getItem("pp-" + username);
    if (userPP === null) {
      let userData = await User.getUserData(username);
      let pp = env.host + userData.profilResmi;
      localStorage.setItem("pp-" + username, pp);
      userPP = localStorage.getItem("pp-" + username);
    }
    return userPP;
  }

  static async getMessages(fUsername) {
    const directChatMessages = document.querySelector(".direct-chat-messages");
    const myUsername = localStorage.getItem("username");
    let data = await this.getMessagesFromServer(fUsername);
    for (let i = 0; i < data.length; i++) {
      directChatMessages.insertAdjacentHTML(
        "afterbegin",
        `<div class="direct-chat-msg ${
          data[i].from == myUsername && data[i].to == fUsername ? "right" : ""
        }">
        <div class="direct-chat-infos clearfix">
        </div>
        <!-- /.direct-chat-infos -->
        <img class="direct-chat-img" src="${await this.getMessagePP(
          data[i].from
        )}" alt="Message User Image">
        <!-- /.direct-chat-img -->
        <div class="direct-chat-text">
          ${data[i].content}
        </div>
        <!-- /.direct-chat-text -->
    </div>`
      );
    }

    this.scrollSet();
  }

  static async getMessagesFromServer(fusername) {
    let myUsername = localStorage.getItem("username");
    let url = `http://localhost:84/getMessages?to=${fusername}&from=${myUsername}&page=${this.page}`;
    let messages = await (await fetch(url)).json();
    this.tempHeight = this.directMessage.scrollHeight;
    return messages;
  }

  static scrollSet() {
    console.log(
      "ScrollSet Çalıştı",
      "TempHeight " + this.tempHeight,
      "ScrollHeight" + this.directMessage.scrollHeight
    );
    if (this.isFirst) {
      this.directMessage.scrollTop = this.directMessage.scrollHeight;
      console.log(this.directMessage.scrollTop);
      this.isFirst = false;
    } else {
      if (this.isFinish) return;
      this.directMessage.scrollTop =
        this.directMessage.scrollHeight - this.tempHeight;
    }
  }
  static sendMessage(socket, user, message) {
    socket.emit("message", {
      user,
      message,
      from: localStorage.getItem("username"),
    });
    console.log();
    this.saveMessagesToStorage({
      from: localStorage.getItem("username"),
      to: user[0].username,
      content: message,
    });
    // Bunu burdan sil TODO
    // this.getMessages(this.getMessagesFromStorage(), user[0].username);
  }
  static saveMessagesToStorage(message) {
    let messages = localStorage.getItem("messages");
    if (messages === null) {
      localStorage.setItem("messages", JSON.stringify([]));
      messages = localStorage.getItem("messages");
    }
    messages = JSON.parse(messages);
    messages.push(message);
    localStorage.setItem("messages", JSON.stringify(messages));
  }
  static getMessagesFromStorage() {
    let messages = localStorage.getItem("messages");
    if (messages === null) {
      localStorage.setItem("messages", JSON.stringify([]));
    }
    messages = JSON.parse(messages);
    return messages;
  }
  static playBip() {
    let bip = new Audio("dist/bip.ogg");
    bip.play();
  }
  static async drawChatFriends(onlineList, socket) {
    let friends = await User.getFriends(localStorage.getItem("username")),
      contactsListUl = document.getElementsByClassName("contacts-list")[0];
    contactsListUl.innerHTML = "";
    let onlineFriendsTemp;
    let onlineFriends;
    for (let i = 0; i < friends.length; i++) {
      contactsListUl.innerHTML += `<li class="chat-online-user" kullaniciAdi="${
        friends[i].kullaniciAdi
      }" adSoyad="${friends[i].adSoyad}"><a href="#">
      <img class="contacts-list-img" src="${env.host + friends[i].profilResmi}">
            <div class="contacts-list-info">
                <span class="contacts-list-name">
                     ${friends[i].adSoyad}
                     <small class="contacts-list-date float-right"><i  class="fas primary  fa-circle"></i></small>
                </span>
            </div>
            <!-- /.contacts-list-info -->
        </a>
    </li>`;
      // Burda arkadaşlar ve online arkadaşların kesişim kümesini bulmak için arra'yin elemanlarını string' çeviriyoruz
      let friendsStr = friends.map((f) => {
        return f.kullaniciAdi;
      });
      let onlineStr = onlineList.map((o) => {
        return o.username;
      });
      onlineFriendsTemp = friendsStr.filter((f) => onlineStr.includes(f));
      onlineFriends = onlineFriendsTemp.map((ofu) => {
        let data = onlineList.find((o) => {
          return o.username == ofu;
        });
        return data;
      });

      //  HEM ONLİNE HEM ARKADAŞIMIZ OLANLARN K.ADLARINI TUTUYORUZ BURADA KALDIK ///
    }
    // Arkadaşlar çekildi ve bunu chat-contants divine eklemek gerekiyor.
    let chatOnlineUser = document.getElementsByClassName("chat-online-user");
    chatOnlineUser = Array.from(chatOnlineUser);

    chatOnlineUser.forEach((user) => {
      if (onlineFriendsTemp.includes(user.getAttribute("kullaniciAdi"))) {
        let onlineStatusDot =
          user.firstChild.firstChild.nextSibling.nextSibling.nextSibling
            .firstChild.nextSibling.firstChild.nextSibling.firstChild;
        onlineStatusDot.classList.add("text-success");
      }

      user.addEventListener("click", (event) => {
        let element = event.target;
        while (element.tagName != "LI") {
          element = element.parentElement;
        }
        let adSoyad = element.getAttribute("adsoyad"),
          kullaniciAdi = element.getAttribute("kullaniciAdi");

        let selectedUser = onlineFriends.map((i) => {
          return i.username === kullaniciAdi
            ? { id: i.id, username: kullaniciAdi }
            : { username: kullaniciAdi };
        });
        console.log(selectedUser);
        this.closeDirectMessage();
        this.openDirectMessage(adSoyad, selectedUser, socket);
      });
    });
    let friendBoxes = document.querySelectorAll(".chat-online-user");
    friendBoxes.forEach((friend) => {
      let friendUsername = friend.getAttribute("kullaniciAdi");
      friend.onclick = async () => {
        await this.getMessages(friendUsername);
        this.scrollSet();
      };
    });
    return onlineFriends;
  }
  static closeDirectMessage() {
    const directMessage = document.getElementById("directMessage");
    directMessage.style.display = "none";
  }
  static messengerConnection(status) {
    const messengerBox = document.getElementById("messenger-box");
    if (status) {
      messengerBox.classList.remove("bg-secondary");
      messengerBox.style.opacity = "1";
    } else {
      messengerBox.classList.add("bg-secondary");
      messengerBox.style.opacity = "0.5";
    }
  }
}
