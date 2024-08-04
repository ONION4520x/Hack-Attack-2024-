document.addEventListener("DOMContentLoaded", function () {
  const commentForm = document.getElementById("tm-commentForm");
  const commentsContainer = document.getElementById("tm-commentsContainer");

  fetchComments();

  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("tm-username").value;
    const commentText = document.getElementById("tm-commentText").value;
    const rating = document.querySelector(
      'input[name="tm-star"]:checked'
    ).value;

    if (username && commentText && rating) {
      addComment(username, commentText, rating);
      commentForm.reset();
    }
  });

  function fetchComments() {
    fetch("/getComments")
      .then((response) => response.json())
      .then((comments) => {
        comments.forEach((comment) => {
          addCommentToDOM(
            comment.username,
            comment.commentText,
            comment.rating,
            new Date(comment.date)
          );
        });
      });
  }

  function addComment(username, commentText, rating) {
    fetch("/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, commentText, rating, date: new Date() }),
    })
      .then((response) => response.text())
      .then((data) => {
        addCommentToDOM(username, commentText, rating, new Date());
      });
  }

  function addCommentToDOM(username, commentText, rating, date) {
    const commentDiv = document.createElement("div");
    commentDiv.className = "tm-comment tm-mb-45";

    const profileFigure = document.createElement("figure");
    profileFigure.className = "tm-comment-figure";
    commentDiv.appendChild(profileFigure);

    const profileImg = document.createElement("img");
    profileImg.src = "img/default-profile.jpg"; // Replace with the actual profile image if available
    profileImg.alt = "Profile Image";
    profileImg.className = "mb-2 rounded-circle img-thumbnail";
    profileFigure.appendChild(profileImg);

    const profileCaption = document.createElement("figcaption");
    profileCaption.className = "tm-color-primary text-center";
    profileCaption.textContent = username;
    profileFigure.appendChild(profileCaption);

    const contentDiv = document.createElement("div");

    const commentTextElement = document.createElement("p");
    commentTextElement.textContent = commentText;
    contentDiv.appendChild(commentTextElement);

    const ratingElement = document.createElement("div");
    ratingElement.className = "tm-rating";
    ratingElement.innerHTML = getStarRating(rating);
    contentDiv.appendChild(ratingElement);

    const commentFooter = document.createElement("div");
    commentFooter.className = "d-flex justify-content-end";

    const dateElement = document.createElement("span");
    dateElement.className = "tm-color-primary tm-comment-time";
    dateElement.textContent = formatDate(date);

    commentFooter.appendChild(dateElement);

    contentDiv.appendChild(commentFooter);
    commentDiv.appendChild(contentDiv);

    commentsContainer.appendChild(commentDiv);
  }

  function formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function getStarRating(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? "★" : "☆";
    }
    return stars;
  }

  const stars = document.querySelectorAll('.tm-rating input[type="radio"]');

  stars.forEach((star) => {
    star.addEventListener("change", function () {
      updateStars();
    });
  });

  function updateStars() {
    stars.forEach((star) => {
      const starLabel = document.querySelector(`label[for=${star.id}]`);
      if (star.checked) {
        starLabel.style.color = "darkgreen";
        let previousSibling = star.previousElementSibling;
        while (previousSibling) {
          if (previousSibling.tagName === "LABEL") {
            previousSibling.style.color = "darkgreen";
          }
          previousSibling = previousSibling.previousElementSibling;
        }
      } else {
        starLabel.style.color = "lightgray";
        let nextSibling = star.nextElementSibling;
        while (nextSibling) {
          if (nextSibling.tagName === "LABEL") {
            nextSibling.style.color = "lightgray";
          }
          nextSibling = nextSibling.nextElementSibling;
        }
      }
    });
  }
});
