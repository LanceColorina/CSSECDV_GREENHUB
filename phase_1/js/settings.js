const myProfileBtn = document.getElementById("myProfileBtn");
const myPostsBtn = document.getElementById("myPostsBtn");
const myCommentsBtn = document.getElementById("myCommentsBtn");

const myProfileContent = document.getElementById("myProfileContent");
const myPostsContent = document.getElementById("myPostsContent");
const myCommentsContent = document.getElementById("myCommentsContent");

let currentContent = myProfileContent;
let currentActiveBtn = myProfileBtn;

function showContent(content) {
    currentContent.style.display = "none"; // Hide current content first
    content.style.display = "block"; 
}

function activateBtn(btn) { 
    currentActiveBtn.firstElementChild.classList.remove("active"); // Remove current active btn first
    btn.firstElementChild.classList.add("active");
}

myProfileBtn.addEventListener('click', () => {
   showContent(myProfileContent);
   activateBtn(myProfileBtn);

   currentContent = myProfileContent;
   currentActiveBtn = myProfileBtn;
});

myPostsBtn.addEventListener('click', () => {
    showContent(myPostsContent);
    activateBtn(myPostsBtn);

    currentContent = myPostsContent;
    currentActiveBtn = myPostsBtn;
});

myCommentsBtn.addEventListener('click', () => {
    showContent(myCommentsContent);
    activateBtn(myCommentsBtn);

    currentContent = myCommentsContent;
    currentActiveBtn = myCommentsBtn;
});


