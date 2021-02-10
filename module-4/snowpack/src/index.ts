import { sortBy } from "lodash-es"
import * as t from './my-own-validation'

const apiURL = "https://api.github.com/orgs/github/repos?per_page=100"

console.log("Sorted", sortBy([3,2,1], x => x))

const GHRepoCodec = t.object({
    name: t.string,
    url: t.string,
    stargazers_count: t.number,
    fork: t.boolean
})
type GithubRepo = ReturnType<typeof GHRepoCodec>

const GHRepoDetailsCodec = t.intersection(
    GHRepoCodec,
    t.object({
        parent: GHRepoCodec       
    })
)

type GithubRepoDetails = ReturnType<typeof GHRepoDetailsCodec>

async function fetchJSON<T>(url: string, validator: t.Validator<T>): Promise<T> {
    const response = await fetch(url)
    if (response.status !== 200) {
        throw Error("FAILED TO FETCH!!!")
    }
    const json = await response.json()
    return validator(json)
}

console.log("HELLO!")

class ValidationError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}

const error = new ValidationError("just testing");
console.log("Works?", (error instanceof ValidationError))

console.log([1,2,3,4].flatMap(x => [x, x]))

async function fetchRepos(): Promise<GithubRepo[]> {
    return fetchJSON<GithubRepo[]>(apiURL, t.array(GHRepoCodec))
}

async function fetchRepoDetails(repo: GithubRepo): Promise<GithubRepoDetails> {
    return fetchJSON(repo.url, GHRepoDetailsCodec)    
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
    const sorted = sortBy(repos, r => r.name)
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