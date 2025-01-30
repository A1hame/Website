const titleText = "A 1 h a m ";
let index = 0;

function animateTitle() {
    if (index <= titleText.length) {
        document.title = titleText.substring(0, index);
        index++;
        setTimeout(animateTitle, 100); // Speed of animation
    }
}

window.onload = animateTitle;
