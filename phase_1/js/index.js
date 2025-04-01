const sort_button_List = document.querySelectorAll(".sort-button");
sort_button_List.forEach((sort_button) => {
  sort_button.addEventListener("click", () => {
    document.querySelector(".choice")?.classList.remove("choice");
    sort_button.classList.add("choice");
  });
});

function scrollup() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function likeUp(index) {
  let like = document.getElementsByClassName("like-amount");
  let like_icon = document.getElementsByClassName("like-change");
  let dislike = document.getElementsByClassName("dislike-amount");
  let dislike_icon = document.getElementsByClassName("dislike-change");
  if (
    like_icon[index].innerHTML ==
    '<i id="thumbs-up" class="bi bi-hand-thumbs-up"></i>'
  ) {
    if (
      dislike_icon[index].innerHTML ==
      '<i id="thumbs-down" class="bi bi-hand-thumbs-down"></i>'
    ) {
      like_icon[index].innerHTML =
        '<i id="thumbs-up" class="bi bi-hand-thumbs-up-fill"></i>';
      like[index].textContent = parseInt(like[index].textContent) + 1;
    } else {
      like_icon[index].innerHTML =
        '<i id="thumbs-up" class="bi bi-hand-thumbs-up-fill"></i>';
      like[index].textContent = parseInt(like[index].textContent) + 1;
      dislike_icon[index].innerHTML =
        '<i id="thumbs-down" class="bi bi-hand-thumbs-down"></i>';
      dislike[index].textContent = parseInt(dislike[index].textContent) - 1;
    }
  } else {
    like_icon[index].innerHTML =
      '<i id="thumbs-up" class="bi bi-hand-thumbs-up"></i>';
    like[index].textContent = parseInt(like[index].textContent) - 1;
  }
}

function dislikeUp(index) {
  let dislike = document.getElementsByClassName("dislike-amount");
  let dislike_icon = document.getElementsByClassName("dislike-change");
  let like = document.getElementsByClassName("like-amount");
  let like_icon = document.getElementsByClassName("like-change");
  if (
    dislike_icon[index].innerHTML ==
    '<i id="thumbs-down" class="bi bi-hand-thumbs-down"></i>'
  ) {
    if (
      like_icon[index].innerHTML ==
      '<i id="thumbs-up" class="bi bi-hand-thumbs-up"></i>'
    ) {
      dislike[index].textContent = parseInt(dislike[index].textContent) + 1;
      dislike_icon[index].innerHTML =
        '<i id="thumbs-down" class="bi bi-hand-thumbs-down-fill"></i>';
    } else {
      dislike[index].textContent = parseInt(dislike[index].textContent) + 1;
      dislike_icon[index].innerHTML =
        '<i id="thumbs-down" class="bi bi-hand-thumbs-down-fill"></i>';
      like_icon[index].innerHTML =
        '<i id="thumbs-up" class="bi bi-hand-thumbs-up"></i>';
      like[index].textContent = parseInt(like[index].textContent) - 1;
    }
  } else {
    dislike_icon[index].innerHTML =
      '<i id="thumbs-down" class="bi bi-hand-thumbs-down"></i>';
    dislike[index].textContent = parseInt(dislike[index].textContent) - 1;
  }
}

function showNewComment() {
  let comment = document.getElementById("comment-area");
  if (comment.style.display == "none") {
    comment.style.display = "block";
  } else {
    comment.style.display = "none";
  }
}

function submitComment() {
  let comment_content = document.getElementById("comment-box");
  var newDiv = document.createElement("div");
  newDiv.className = "comment-line";

  var accountName = document.createElement("p");
  accountName.textContent = "Unknown: ";
  accountName.className = "user-comment";

  var comment = document.createElement("p");
  comment.textContent = comment_content.value;
  comment.className = "comment-content";

  newDiv.appendChild(accountName);
  newDiv.appendChild(comment);

  var contentDiv = document.getElementById("comment-list");
  contentDiv.appendChild(newDiv);
}

const createPostInput = document.getElementById("createPostInput");

createPostInput.addEventListener("focus", function () {
  window.location.href = "createpost.html";
});
