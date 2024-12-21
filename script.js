console.log("JavaScript is working!");

async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = await response;
  let as = div.getElementsByTagName("a");

  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}

async function main() {
  let songs = await getsongs();

  console.log(songs);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  index = 0;
  for (const song of songs) {
    console.log(song);
    index++;
    console.log(index);
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img class="invert" src="svgs/music.svg" alt="music" />
                <div class="info">
                  <div>${song.replaceAll("%20","").replace(".mp3","").split("-")[0]}</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="svgs/play.svg" alt="play" />
                </div>
              </li>`;

  }

  var audio = new Audio(songs[0]);
  console.log(audio);
  let none = document.querySelector(".none");

  // audio.play();

  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}

main();
