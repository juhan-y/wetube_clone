const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

let deleteComments = document.querySelectorAll("#delete__comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.id = "delete__comment";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault(); // 새로고침 방지
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-type": "application/json" }, // information about request
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const json = await response.json(); // json 추출.
    addComment(text, json.newCommentId);
    deleteComment = document.getElementById("delete__comment");
    deleteComment.removeEventListener("click", handleDeleteComment);
    deleteComment.addEventListener("click", handleDeleteComment);
  }
  // window.location.reload();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDeleteComment = async (event) => {
  const li = event.srcElement.parentNode;
  const {
    dataset: { id: commentId },
  } = li;

  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  li.remove();
};

if (deleteComments) {
  deleteComments.forEach((deleteComment) => {
    deleteComment.addEventListener("click", handleDeleteComment);
  });
}
