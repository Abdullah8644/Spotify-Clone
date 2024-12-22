console.log("JavaScript is working!");
var currentSong = new Audio();

function secondsToMinsSec(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const mintues = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const forrmattedMinutes = String(mintues).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${forrmattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
  let a = await fetch("/songs.html");
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

const playMusic = async (track) => {
  songs = await getsongs();
  console.log(songs);
  index = 0;
  for (song of songs) {
    index++;
    song = song.replaceAll("%20", "");
    if (song.includes(track)) {
      break;
    }
  }

  play.src = "svgs/pause.svg";
  currentSong.src = "/songs/" + songs[index - 1];
  currentSong.play();

  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  let songs = await getsongs();

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img class="invert" src="svgs/music.svg" alt="music" />
                <div class="info">
                  <div>${
                    song.replaceAll("%20", "").replace(".mp3", "").split("-")[0]
                  }</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="svgs/play.svg" alt="play" />
                </div>
              </li>`;
  }

  // Attach an event listenr to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      music = e.querySelector(".info").firstElementChild.innerHTML.trim();
      playMusic(music);
    });
  });

  // *  Attach an event listener to the next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/pause.svg";
      console.log("Playing");
    } else {
      currentSong.pause();
      play.src = "svgs/play.svg";
      console.log("Pausing");
    }
  });

  //* Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinsSec(
      currentSong.currentTime
    )} / ${secondsToMinsSec(currentSong.duration)}`;
  });



}

main();
