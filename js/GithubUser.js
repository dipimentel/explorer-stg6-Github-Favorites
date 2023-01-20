export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(response => response.json())
        .then(({ name, login, public_repos, followers }) => ({
            name,
            login,
            public_repos,
            followers
        }))
    } 
}