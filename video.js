
const YOUR_API_KEY = "AIzaSyBdmBMRjasuuysCCUEqxgRNmbiqqc1bzJs";

const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const commentThread_http ="https://www.googleapis.com/youtube/v3/commentThreads?";
const maxResults = 100;
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");
const videoPlayerContainer = document.getElementById("video-player");

if (videoId) {
  fetch(
    video_http +
      new URLSearchParams({
        part: "snippet",
        id: videoId,
        key: YOUR_API_KEY,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.items && data.items.length > 0) {
        videoPlayerContainer.innerHTML = ` <iframe width="1024" height="550" src="https://www.youtube.com/embed/${videoId}" frameborder="20" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
      } else {
        videoPlayerContainer.innerHTML = "<p>Video unavailable</p>";
      }
    })
    .catch((error) => {
      console.log("Error fetching video data:", error);
      videoPlayerContainer.innerHTML = "<p>Video unavailable</p>";
    });
} else {
  videoPlayerContainer.innerHTML = "<p>No Video ID provided.</p>";
}

const fetchAndDisplayComments = () => {
  fetch(
    commentThread_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet",
        videoId,
        maxResults,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        data.items.forEach((item) => {
          const comment = item.snippet.topLevelComment.snippet;
          console.log(comment);
          displayComment(comment);
        });
      }
    });
};
const displayComment = (comment) => {
  const commentList = document.getElementById("video-comments-list");
  const commentItem = document.createElement("li");
  commentItem.classList.add("comment-item");
  commentItem.innerHTML = `
    <div class="comment-author">
        <img
        src="${comment.authorProfileImageUrl}"
        alt="profile-img"
        />
       ${comment.authorDisplayName}
    </div>
    <div class="comment-body">
        <div class="comment-text">${comment.textDisplay}</div>
            <div class="comments-actions">
                <img src="img/liked video.PNG" alt="like-icon" />
                <span class="action-count">${comment.likeCount}</span>
                <img
                    src="img/liked video.PNG"
                    alt="dislike-icon"
                    class="dislike"
                />
                <span class="action-reply">Reply</span>
            </div>
    </div>
  `;
  commentList.appendChild(commentItem);
};
fetchAndDisplayComments();







const videoCardContainer = document.querySelector(".video-container");
const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".btn");
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";
const search_http = "https://www.googleapis.com/youtube/v3/search?";
const numberOfVideosToBeLoaded = 25;

fetch(
  video_http +
    new URLSearchParams({
      key: YOUR_API_KEY,
      part: "snippet,contentDetails",
      chart: "mostPopular",
      maxResults: numberOfVideosToBeLoaded,
      regionCode: "IN",
    })
)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    data.items.forEach((item) => {
      getChannelIcon(item);
    });
  })
  .catch((err) => console.log(err));

const getChannelIcon = (video_data) => {
  fetch(
    channel_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet",
        id: video_data.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video_data.channelThumbnail = data.items[0].snippet.thumbnails.high.url;
      makeVideoCard(video_data);
    })
    .catch((err) => console.log(err));
};

searchBtn.addEventListener("click", () => {
  const searchedValue = searchInput.value;
  if (searchedValue.length) {
    searchVideos(searchedValue);
  }
});

const searchVideos = (query) => {
  fetch(
    search_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet",
        q: query,
        maxResults: numberOfVideosToBeLoaded,
        type: "video",
      })
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("search--", data);
      videoCardContainer.innerHTML = "";
      data.items.forEach((item) => {
        if ((item.id.kind = "youtube#video")) {
          getChannelIcon(item);
          getVideoDetails(item.id.videoId);
        }
      });
    })
    .catch((err) => console.log("Error fetching search results: ", err));
};

const getVideoDetails = (videoId) => {
  fetch(
    video_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet",
        id: videoId,
        maxResults: numberOfVideosToBeLoaded,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("searched video ---", data);
      if (data.items.length > 0) makeVideoCard(data.items[0]);
    });
};
const makeVideoCard = (data) => {
  const videoCard = document.createElement("div");
  videoCard.classList.add("video");
  videoCard.addEventListener("click", () => {
    console.log("video clicked");
    window.location.href = `video.html?id=${data.id}`; 
  });
  videoCard.innerHTML = `
    <img src="${
      data.snippet.thumbnails.high.url
    }" class="thumbnail" alt="thumbnail"/>
    <div class="content">
        <img src="${
          data.channelThumbnail ?? data.snippet.thumbnails.high.url
        }" class="channel-icon"/>
        <div class="info">
            <h4 class="title">${data.snippet.title}</h4>
            <p class="channel-name">${data.snippet.channelTitle}</p>
        </div>
    </div>
  `;

  videoCardContainer.appendChild(videoCard);
};


//change in sidebar--------

// Get reference to the 'Explore' button in the sidebar
const exploreBtnSidebar = document.querySelector(".explore-btn"); 

// Fetch and display the most popular videos
const fetchPopularVideos = () => {
  fetch(
    video_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet,contentDetails",
        chart: "mostPopular",
        maxResults: numberOfVideosToBeLoaded,
        regionCode: "IN", // You can change the region if needed
      })
  )
    .then((res) => res.json())
    .then((data) => {
      videoCardContainer.innerHTML = ""; // Clear existing videos
      data.items.forEach((item) => {
        getChannelIcon(item);
      });
    })
    .catch((err) => console.error("Error fetching popular videos:", err));
};

// Add event listener for the 'Explore' button
exploreBtnSidebar.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default anchor behavior

  // Optional: Remove 'active' class from all sidebar links and add it to the clicked one
  document.querySelectorAll(".links").forEach(link => link.classList.remove("active"));
  exploreBtnSidebar.classList.add("active");

  // Call function to fetch and display popular videos when "Explore" is clicked
  fetchPopularVideos();
});


