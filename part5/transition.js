import { db, auth } from "./firebase.js"
import { collection, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'

 $(document).ready( async function () {

    var uid = 0;
    let testRef = null;
   
    try{
        await signInAnonymously(auth);
        console.log("User signed in successfully");
    }
    catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error.message);
    };

    onAuthStateChanged(auth, async (user) => {
        if (user) {
          uid = user.uid;
          console.log(uid);

          await setDoc(doc(db, 'transition', uid.toString()), {});
          testRef = doc(db, 'transition', uid.toString());
          console.log(testRef);
        } else {
          console.log("User signed-out");
        }
      });
    var up = new Audio('../media/button.mp3');
    var actualTestCount = 0;
    var testTypes = ["airplane", "field", "mensa", "pub", "train"];
    var fileNames = ["abrupt_-20dB.wav", "abrupt_-40dB.wav","abrupt_-60dB.wav", "slow_-20dB.wav", "slow_-40dB.wav", "slow_-60dB.wav",]


    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        }
    }

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

    function resetAll(audios, current) {
        $(`#${current} input`).blur();
        stopAllAudios(audios);
        $(".name").removeClass("chosen");
        $("input[type=range]").val(0);
        $(".value").each(function () {
            let id = $(this).parent().attr("id");
            if (id !== "0") {
                $(this).text("Actual Value: 0");
            }
        })

    }
    function generateTest() {

        var testResults = {
            "abrupt_-20dB.wav": 0,
            "abrupt_-40dB.wav": 0,
            "abrupt_-60dB.wav": 0,
            "slow_-20dB.wav": 0,
            "slow_-40dB.wav": 0,
            "slow_-60dB.wav": 0
        };

        actualTestCount += 1;
        $("h1").text(`Test ${actualTestCount}`);

        if (actualTestCount===1) {
            $("button").prop("disabled", true);
            setTimeout(() => {
                $("button").prop("disabled", false);
                console.log("Button enabled");
            }, 3000);
        }

        shuffleArray(fileNames);

        let randomIndex = Math.round(Math.random()*(testTypes.length-1));
        let actualTestType = testTypes[randomIndex];
        console.log(actualTestType);
        testTypes.splice(randomIndex,1);
        console.log(testTypes);

        if (testTypes.length === 0) {
            $(".button").toggleClass("hidden");
            $("a").attr("href", "./end2.html");
        } 
        
        var current = -1;

        var audio0 = new Audio(`../media/transition/${actualTestType}/passive.wav`);

        var audio1 = new Audio(`../media/transition/${actualTestType}/${fileNames[0]}`);
        $("#1 .slider input").attr("id", fileNames[0]);

        var audio2 = new Audio(`../media/transition/${actualTestType}/${fileNames[1]}`);
        $("#2 .slider input").attr("id", fileNames[1]);

        var audio3 = new Audio(`../media/transition/${actualTestType}/${fileNames[2]}`);
        $("#3 .slider input").attr("id", fileNames[2]);

        var audio4 = new Audio(`../media/transition/${actualTestType}/${fileNames[3]}`);
        $("#4 .slider input").attr("id", fileNames[3]);

        var audio5 = new Audio(`../media/transition/${actualTestType}/${fileNames[4]}`);
        $("#5 .slider input").attr("id", fileNames[4]);

        var audio6 = new Audio(`../media/transition/${actualTestType}/${fileNames[5]}`);
        $("#6 .slider input").attr("id", fileNames[5]);

        var audios = [audio0, audio1, audio2, audio3, audio4, audio5, audio6];
        
        $("input[type=range]").off().on("change", function () {
            let index = $(this).parent().parent().attr('id');
            let value = $(this).val();
            let name = $(this).attr('id');
            console.log(name);
            $(`#${index} .value`).text("Actual Value: "+ value);
            testResults[name] = value;
        });

        $("input").blur(function () {
            let id = $(this).parent().parent().attr("id");
            if (current === parseInt(id)) {
                $(this).focus();
            }
        })

        $("#submit").off().on("click", async (e) => {
            e.preventDefault();
            
            up.play();
            for (let i = 0; i < fileNames.length; i++) {
                let actualName = fileNames[i];
                const result = await setDoc(doc(collection(testRef, actualTestType), actualName), {
                    "value": testResults[actualName]
                })
            }
            await setDoc(testRef, {
                lastUpdatedAt: serverTimestamp()
            });
            window.location.href = "./end2.html";
        })
        $("button").off().on("click", async () => {
            $("button").prop("disabled", true);
            up.play();
            setTimeout(() => {
                $("button").prop("disabled", false);
                console.log("Button enabled");
            }, 3000);
            
            for (let i = 0; i < fileNames.length; i++) {
                let actualName = fileNames[i];
                const result = await setDoc(doc(collection(testRef, actualTestType), actualName), {
                    "value": testResults[actualName]
                })
            };
            await setDoc(testRef, {
                lastUpdatedAt: serverTimestamp()
            });
            let old = current;
            current = -1;
            resetAll(audios, old);
            generateTest();
        });

        $(document).off().on("keydown", (e) => {
            let old = 0;
            switch(e.key) {
                case "0":
                    old = current;
                    current = 0;
                    $(`#${old} input`).blur();
                    current = toggleClass(parseInt(e.key), old);
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
                case "3":
                    current = toggleClass(parseInt(e.key), current);
                    $(`#${e.key} input`).focus();
                    stopAllAudios(audios);
                    audio3.loop = true;
                    audio3.play();
                    break;
                case "4":
                    current = toggleClass(parseInt(e.key), current);
                    $(`#${e.key} input`).focus();
                    stopAllAudios(audios);
                    audio4.loop = true;
                    audio4.play();
                    break;
                case "5":
                    current = toggleClass(parseInt(e.key), current);
                    $(`#${e.key} input`).focus();
                    stopAllAudios(audios);
                    audio5.loop = true;
                    audio5.play();
                    break;
                case "6":
                    current = toggleClass(parseInt(e.key), current);
                    $(`#${e.key} input`).focus();
                    stopAllAudios(audios);
                    audio6.loop = true;
                    audio6.play();
                    break;
                case " ":
                    old = current;
                    current = -1;
                    $(`#${old} input`).blur();
                    stopAllAudios(audios);
                    $(".name").removeClass("chosen");
                default:
                    console.log(`Key ${e.key} is pressed!`);
                    break;
            }
        })
    }


    if (actualTestCount === 0) {
        generateTest();
    }
})