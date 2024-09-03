$(document).ready(function () {
    var up = new Audio('./media/button.mp3');
    up.load()
    $("a").on("click", function (e) {
        e.preventDefault();
        let link = $(this).attr("href");
        up.play();
        up.onended = function () {
            window.location.href = link;
        }
    })
})
