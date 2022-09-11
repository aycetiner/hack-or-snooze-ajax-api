"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navFavorites.show();
  $navMyStories.show();
  $navSubmit.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// submit story link

function submitStoryClick(evt) {
  console.debug("submitStoryClick", evt);
  hidePageComponents();
  $storyForm.show();
}

$navSubmit.on("click", submitStoryClick);

// open favorites page
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

// open my stories page

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  putUserStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStoriesClick);

// open user profile

function navUserProfileClick(evt) {
  console.debug("UserprofileClick", evt);
  hidePageComponents();
  $welcomeUser.text(` Welcome ${currentUser.username}!`);
  $userForm.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

$body.on("click", "#nav-user-profile", navUserProfileClick);
