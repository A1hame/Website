const titleText = "A1ham";
let index = 0;

function animateTitle() {
    if (index <= titleText.length) {
        document.title = titleText.substring(0, index);
        index++;
        setTimeout(animateTitle, 100); // Speed of animation
    }
}

window.onload = animateTitle;
