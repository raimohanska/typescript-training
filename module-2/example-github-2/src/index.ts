import _ from "lodash"

const apiURL = "https://api.github.com/orgs/github/repos?per_page=100"

interface GithubRepo {
    name: string,
    url: string,
    stargazers_count: number,
    fork: boolean
}

interface GithubRepoDetails extends GithubRepo {
    parent: GithubRepo
}

async function fetchJSON<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (response.status !== 200) {
        throw Error("FAILED TO FETCH!")
    }
    return response.json()
}

async function fetchRepos(): Promise<GithubRepo[]> {
    return fetchJSON(apiURL)
}

async function fetchRepoDetails(repo: GithubRepo): Promise<GithubRepoDetails> {
    return fetchJSON(repo.url)    
}

async function convertRepo(r: GithubRepo): Promise<Repo> {
    if (r.fork) {
        const details = await fetchRepoDetails(r)
        const parent = await convertRepo(details.parent)
        return { type: "fork", name: r.name, url: r.url, parent }
    } else {
        return { type: "source", name: r.name, url: r.url, stars: r.stargazers_count }
    }    
}

async function main() {
    const repos = await fetchRepos()
    const sorted = _.sortBy(repos, r => r.name)
    const result = await Promise.all(sorted.map(convertRepo))
    result.forEach(dealWith)
}

function dealWith(repo: Repo) {
    if (repo.type === "fork") {
        console.log(repo.parent)
    } else {
        console.log(repo.stars)
    }
}

type Repo = ForkedRepo | SourceRepo

interface RepoBase {
    name: string;
    url: string;
}

interface ForkedRepo extends RepoBase {
    type: "fork"
    parent: Repo
}

interface SourceRepo extends RepoBase {
    type: "source"
    stars: number;
}

main()