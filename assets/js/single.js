// query selectors
var issuesContainerEl = document.querySelector("#issues-container");


// function to fetch API request
var getRepoIssues = function(repo) {
    var apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;

    issuesContainerEl.textContent = "Please wait...";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if(response.ok) {
            response.json().then(function(data) {
                // pass to displayIssues function
                displayIssues(data);
            })
        } else {
            issuesContainerEl.textContent = "There was a problem with your request.";
        }
    })
    .catch(function(error) {
        issuesContainerEl.textContent = `There was a problem with your request. Error: ${error}`;
    });
};

// function to display issues to DOM
var displayIssues = function(issues) {
    // clear container
    issuesContainerEl.textContent = "";

    // check if there are any issues to list
    if(issues.length === 0) {
        issuesContainerEl.textContent = "This repo has no open issues.";
        return
    }

    // loop through issues and add to DOM
    for(var i = 0; i < issues.length; i++) {
        // create link element to take users to the issues on github
        var issuesEl = document.createElement("a");
        issuesEl.classList = "list-item flex-row justify-space-between align-center";
        issuesEl.setAttribute("href", issues[i].html_url);
        issuesEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issuesEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");
        // check if issue is an actual issue or a pull request
        if(issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issuesEl.appendChild(typeEl);

        // append to DOM
        issuesContainerEl.appendChild(issuesEl);
    }
};

getRepoIssues("sirubu/git-it-done");