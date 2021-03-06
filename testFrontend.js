async function getMessages(myUsername, friendUsername, page) {
  const url = `http://localhost/getMessages?from=${myUsername}&to=${friendUsername}&page=${page}`;
  // loading göster
  loading(true);
  let response = await fetch(url);
  // loading sil
  loading(false);
  tempHeight = directMessage.scrollHeight;
  return await response.json();
}

function loading(status) {
  if (status) {
    let loadingContainer = document.createElement("div");
    loadingContainer.style =
      "padding:0;margin:0;box-sizing:border-box;relative:absolute;background-color:white;width:100%;text-align:center";

    let loadingElement = document.createElement("img");
    loadingElement.src = "loading.gif";
    loadingElement.height = "40";
    loadingElement.width = "40";
    loadingElement.id = "loadingMessages";
    loadingContainer.insertAdjacentElement("afterbegin", loadingElement);
    directMessage.insertAdjacentElement("afterbegin", loadingContainer);
  } else {
    let loadingElement = document.getElementById("loadingMessages");
    loadingElement.remove();
  }
}

let page = 1;
let myUsername = "corx";
let isFirst = true;
let isFinish = false;
let directMessage = document.getElementById("directMessage");
let tempHeight = directMessage.scrollHeight;

getMessages("corx", "sukru1", page).then((messages) => drawMessages(messages));

function drawMessages(messages) {
  if (messages[0] === undefined) isFinish = true;
  messages.forEach((item) => {
    directMessage.insertAdjacentHTML(
      "afterbegin",
      `<div class="message ${myUsername == item.from ? "right" : ""}">
            ${item.content}
        </div>`
    );
  });
  scrollSet();
}

function scrollSet() {
  if (isFirst) {
    directMessage.scrollTop = directMessage.scrollHeight;
    console.log(directMessage.scrollTop);
    isFirst = false;
  } else {
    if (isFinish) return;
    directMessage.scrollTop = directMessage.scrollHeight - tempHeight;
  }
}

directMessage.addEventListener("scroll", async (e) => {
  if (directMessage.scrollTop <= 0) {
    setTimeout(() => {});
    getMessages("corx", "sukru1", ++page).then((messages) =>
      drawMessages(messages)
    );
  }
  console.log(directMessage.scrollTop);
});

const messageInput = document.getElementById("message-input");
messageInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    //mesag gönder
    let message = messageInput.value;
    fetch("http://localhost/saveMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ message: message }),
    }).then((response) => {
      response.status == 200 ? (messageInput.value = "") : "";
    });
  }
});
