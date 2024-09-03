$(document).ready(function () {
    var up = new Audio('./media/button.mp3');
    up.load()
    $("a").on("click", function (e) {
        e.preventDefault();
        up.play();
        up.onended = function () {
            window.location.href = "./static/pos.html";
        }
    })

})
