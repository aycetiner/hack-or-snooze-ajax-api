"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
         ${showStar ? getStarHTML(story, currentUser) : ""} 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        ${getEditBtnHTML(currentUser, story.storyId)}
        ${getDeleteBtnHTML(currentUser, story.storyId)}
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

function getEditBtnHTML(currentUser, storyId) {
  if (
    currentUser &&
    currentUser.ownStories.some((s) => s.storyId === storyId)
  ) {
    return `
      <span class="edit-btn">
      <i class="fas fa-edit"></i>
      </span>`;
  } else {
    return "";
  }
}

function getDeleteBtnHTML(currentUser, storyId) {
  if (
    currentUser &&
    currentUser.ownStories.some((s) => s.storyId === storyId)
  ) {
    return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
  } else {
    return "";
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** put user stories on page */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

// Post a story by current user

async function postStory(evt) {
  console.debug("postStory", evt);
  evt.preventDefault();

  // grab the title, author and url
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  await storyList.addStory(currentUser, {
    title,
    author,
    url,
  });
  $storyForm.trigger("reset");
  alert("Your new story is posted!");
}

$storyForm.on("submit", postStory);

// Edit a story by current user
async function submitEditStoryForm(evt) {
  console.debug("submitEditStoryForm");
  evt.preventDefault();
  console.log(evt.target);
  // grab the new title, author and url
  const storyId = $("#story-edit-id").val();
  const title = $("#story-edit-title").val();
  const author = $("#story-edit-author").val();
  const url = $("#story-edit-url").val();

  await storyList.editStory(currentUser, {
    storyId,
    title,
    author,
    url,
  });

  // re-generate story list
  start();
}

$storyEditForm.on("submit", submitEditStoryForm);

// Delete a story by current user

async function deleteStory(evt) {
  console.debug("deleteStory");
  evt.preventDefault();
  const trash_story_id = $(evt.target).closest("li").attr("id");

  await storyList.removeStory(currentUser, trash_story_id);
  // re-generate story list
  start();
}

$allStoriesList.on("click", ".trash-can", deleteStory);
$favoritedStories.on("click", ".trash-can", deleteStory);
$ownStories.on("click", ".trash-can", deleteStory);

/** Put favorites list on page. */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);

/** Open edit story form  */

function editStoryFormClick(evt) {
  console.debug("editStoryFormClick", evt);
  hidePageComponents();
  $storyEditForm.trigger("reset");

  const storyId = $(evt.target).closest("li").attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  $storyEditId.attr("value", storyId);
  $storyEditTitle.attr("value", story.title);
  $storyEditAuthor.attr("value", story.author);
  $storyEditURL.attr("value", story.url);

  $storyEditForm.show();
}

$allStoriesList.on("click", ".edit-btn", editStoryFormClick);
$favoritedStories.on("click", ".edit-btn", editStoryFormClick);
$ownStories.on("click", ".edit-btn", editStoryFormClick);
