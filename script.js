const titleText = "A 1 h a m | S o p h i e e";
let index = 0;

function animateTitle() {
    if (index <= titleText.length) {
        document.title = titleText.substring(0, index);
        index++;
        setTimeout(animateTitle, 200); // Speed of animation
    }
}


window.onload = animateTitle;
