import _ from "lodash"
import * as t from 'io-ts'
import * as Either from "fp-ts/lib/Either"

const apiURL = "https://api.github.com/orgs/github/repos?per_page=100"

const GHRepoCodec = t.type({
    name: t.string,
    url: t.string,
    stargazers_count: t.number,
    fork: t.boolean
})
type GithubRepo = t.TypeOf<typeof GHRepoCodec>

const ParentProp = t.type({
    parent: GHRepoCodec,
    asdf: t.string        
})

const GHRepoDetailsCodec = t.intersection([
    GHRepoCodec,
    ParentProp
])

type GithubRepoDetails = t.TypeOf<typeof GHRepoDetailsCodec>

async function fetchJSON<T>(url: string, codec: t.Type<T>): Promise<T> {
    const response = await fetch(url)
    if (response.status !== 200) {
        throw Error("FAILED TO FETCH!")
    }
    const json = await response.json()
    const result = codec.decode(json)
    if (Either.isRight(result)) {
        return result.right
    } else {
        throw Error("parse failed: " + result.left)
    }    
}

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