const YOUR_API_KEY = "AIzaSyBdmBMRjasuuysCCUEqxgRNmbiqqc1bzJs";
const videoCardContainer = document.querySelector(".video-container");
const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const filterOptions = document.querySelectorAll(".filter-option");

const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";
const search_http = "https://www.googleapis.com/youtube/v3/search?";
const numberOfVideosToBeLoaded = 50;

// Fetch and display the most popular videos
const fetchPopularVideos = () => {
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
      videoCardContainer.innerHTML = ""; // Clear existing videos
      data.items.forEach((item) => {
        getChannelIcon(item);
      });
    })
    .catch((err) => console.error("Error fetching popular videos:", err));
};

// Fetch videos by category
const fetchVideosByCategory = (category) => {
  const categoryQuery = getCategoryQuery(category);

  if (!categoryQuery) {
    console.log("No valid category query found");
    return; // Return early if no query is found
  }

  console.log("Fetching videos for category:", category, "Query:", categoryQuery); // Debugging log

  fetch(
    search_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet",
        q: categoryQuery, // Use category-specific query
        maxResults: numberOfVideosToBeLoaded,
        type: "video",
      })
  )
    .then((res) => res.json())
    .then((data) => {
      videoCardContainer.innerHTML = ""; // Clear current videos
      data.items.forEach((item) => {
        if (item.id.kind === "youtube#video") {
          getChannelIcon(item);
        }
      });
    })
    .catch((err) => console.error(`Error fetching ${category} videos:`, err));
};

// Get the query string based on the category
const getCategoryQuery = (category) => {
  const categoryQueries = {
    JavaScript: "JavaScript tutorials",
    React: "React tutorials",
    HTML: "HTML tutorials",
    Python: "Python tutorials",
    Gaming: "Gaming tutorials",
    Music: "Music tutorials",
    Technology: "Technology tutorials",
    All: "tutorials", // General search for 'All' category
  };
  return categoryQueries[category] || ""; // Default to empty string if no match
};

// Get channel icon and create video card
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
      video_data.channelThumbnail =
        data.items[0]?.snippet?.thumbnails?.high?.url || "";
      makeVideoCard(video_data);
    })
    .catch((err) => console.error("Error fetching channel icon:", err));
};

// Create a video card
const makeVideoCard = (data) => {
  const videoCard = document.createElement("div");
  videoCard.classList.add("video");
  videoCard.addEventListener("click", () => {
    window.location.href = `video.html?id=${data.id.videoId || data.id}`;
  });

  videoCard.innerHTML = `
    <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="thumbnail" />
    <div class="content">
      <img src="${data.channelThumbnail || data.snippet.thumbnails.high.url}" class="channel-icon" />
      <div class="info">
        <h4 class="title">${data.snippet.title}</h4>
        <p class="channel-name">${data.snippet.channelTitle}</p>
      </div>
    </div>
  `;

  videoCardContainer.appendChild(videoCard);
};

// Search for videos
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
      videoCardContainer.innerHTML = ""; // Clear current videos
      data.items.forEach((item) => {
        if (item.id.kind === "youtube#video") {
          getChannelIcon(item);
        }
      });
    })
    .catch((err) => console.error("Error fetching search results:", err));
};

// Add event listener for search button click
searchBtn.addEventListener("click", () => {
  const searchedValue = searchInput.value.trim();
  if (searchedValue) {
    searchVideos(searchedValue);
  }
});

// Add event listener for pressing 'Enter' key in the search input
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const searchedValue = searchInput.value.trim();
    if (searchedValue) {
      searchVideos(searchedValue);
    }
  }
});

// Add event listener for filter options
filterOptions.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.category;
    console.log("Category clicked:", category); // Debugging log

    // Remove 'active' class from all filters and add it to the clicked one
    filterOptions.forEach((option) => option.classList.remove("active"));
    filter.classList.add("active");

    // Fetch videos based on the category
    if (category === "All") {
      fetchPopularVideos();
    } else {
      fetchVideosByCategory(category);
    }
  });
});

// Initial load: fetch most popular videos
fetchPopularVideos();







