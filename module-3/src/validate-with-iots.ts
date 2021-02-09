import _ from "lodash"
import * as t from 'io-ts'
import * as Either from "fp-ts/lib/Either"
import { PathReporter } from 'io-ts/PathReporter'

const apiURL = "https://api.github.com/orgs/github/repos?per_page=100"

const GHRepoCodec = t.type({
    name: t.string,
    url: t.string,
    stargazers_count: t.number,
    fork: t.boolean
}, "GithubRepo")
type GithubRepo = t.TypeOf<typeof GHRepoCodec>

const GHRepoDetailsCodec = t.intersection([
    GHRepoCodec,
    t.type({
        parent: GHRepoCodec
    }, "WithParent")
], "GithubRepoDetails")

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
        throw Error(PathReporter.report(result).join("\n"))
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