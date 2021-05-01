// query selectors
var userFromEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonEl = document.querySelector("#language-buttons");

// function to get input from from
var formSubmitHandler = function(event) {
    event.preventDefault();
    var username = nameInputEl.value.trim();

    if (username) {
        repoContainerEl.textContent = "Please wait...";
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        repoSearchTerm.textContent = "";
        repoContainerEl.textContent = "Please enter a GiHub username.";
    }
};

// function for language button click
var buttonClickHandler = function(event) {
    // get value of target click
    var language = event.target.getAttribute("data-language");

    // valid that target returned attribute
    if (language) {
        // clear old content
        repoContainerEl.textContent = `Please wait...`;

        // pass language to getFeaturedRepos function
        getFeaturedRepos(language);
    }
};

// function to perform API inquiry based on language clicked
var getFeaturedRepos = function(language) {
    var apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            })
        } else {
            repoSearchTerm.textContent = "";
            repoContainerEl.textContent = "There are no repositories to display.";
        }
    });
};

// function to perform api inquiry 
var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = `https://api.github.com/users/${user}/repos`;

    // mare a request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            repoSearchTerm.textContent = "";
            repoContainerEl.textContent = "There was no GitHub user by that name... try your search again.";
        }
    })
    .catch(function(error) {
        repoSearchTerm.textContent = "";
        repoContainerEl.textContent = "Unable to connect to GitHub... try your search again later.";    });
};

// function to display api inquiry to page
var displayRepos = function(repos, searchTerm) {
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returned 
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop over repos and display to dom
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = `${repos[i].owner.login}/${repos[i].name}`;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", `./single-repo.html?repo=${repoName}`);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // add number of issues if any
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = `<i class="fas fa-times status-icon icon-danger"></i>${repos[i].open_issues_count} issue(s)`;
        } else {
            statusEl.innerHTML = `<i class="fas fa-check-square status-icon icon-success"></i>`;
        }

        // append icon to container
        repoEl.appendChild(statusEl);

        // append to DOM
        repoContainerEl.appendChild(repoEl);
    }
}

// event listeners
userFromEl.addEventListener("submit", formSubmitHandler);
languageButtonEl.addEventListener("click", buttonClickHandler);