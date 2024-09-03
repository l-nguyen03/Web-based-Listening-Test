$(document).ready(function () {
    var up = new Audio('../media/button.mp3');
    up.load();
    $("a").on("click", function (e) {
        e.preventDefault();
        up.play();
        up.onended = function () {
            window.location.href = "./start.html";
        }
    })

    var audio0 = new Audio("../media/example/pub_passive.wav");

    var audio1 = new Audio("../media/example/pub_260_tot_mismatch.wav");

    var audio2 = new Audio("../media/example/pub_65_tot_mismatch.wav");

    var audios = [audio0, audio1, audio2];

    var current = -1;

    function stopAllAudios(audios) {
        audios.forEach(function (audio) {
            audio.pause();
            audio.currentTime = 0;
        });
    }


    function toggleClass(index, current) {
        console.log(current);
        if (current === -1) {
            $(`#${index} .name`).addClass("chosen");
            current = index;
        }
        else {
            $(`#${current} .name`).removeClass("chosen");
            $(`#${index} .name`).addClass("chosen");
            current = index;
        }
        return current
    }

    $(document).off().on("keydown", (e) => {
        switch(e.key) {
            case "0":
                $(`#${current} input`).blur();
                current = toggleClass(parseInt(e.key), current);
                stopAllAudios(audios);
                audio0.loop = true;
                audio0.play();
                break;
            case "1":
                current = toggleClass(parseInt(e.key), current);
                $(`#${e.key} input`).focus();
                stopAllAudios(audios);
                audio1.loop = true;
                audio1.play();
                break;
            case "2":
                current = toggleClass(parseInt(e.key), current);
                $(`#${e.key} input`).focus();
                stopAllAudios(audios);
                audio2.loop = true;
                audio2.play();
                break;
            case " ":
                $(`#${current} input`).blur();
                stopAllAudios(audios);
                $(".name").removeClass("chosen");
            default:
                console.log(`Key ${e.key} is pressed!`);
                break;
            }
        })

    $("input[type=range]").off().on("change", function () {
        let index = $(this).parent().parent().attr('id');
        let value = $(this).val();
        $(`#${index} .value`).text("Actual Value: "+ value);
    });
})