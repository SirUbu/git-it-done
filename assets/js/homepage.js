var getUserRepos = function() {
    fetch("https://api.github.com/users/sirubu/repos");
};

getUserRepos();