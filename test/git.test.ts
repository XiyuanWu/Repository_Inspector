import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import { changedFiles, GitInspectionError, resolveBaseRef } from "../src/git.js";

const tempRepos: string[] = [];

function git(cwd: string, args: string[]) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function createRepo(options?: { defaultBranch?: string }): string {
  const dir = mkdtempSync(join(tmpdir(), "inspector-git-"));
  tempRepos.push(dir);
  const branch = options?.defaultBranch ?? "main";
  git(dir, ["init", `-b`, branch]);
  git(dir, ["config", "user.email", "test@example.com"]);
  git(dir, ["config", "user.name", "Test"]);
  writeFileSync(join(dir, "README.md"), "hello\n", "utf8");
  git(dir, ["add", "README.md"]);
  git(dir, ["commit", "-m", "init"]);
  return dir;
}

afterEach(() => {
  while (tempRepos.length > 0) {
    const dir = tempRepos.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("resolveBaseRef / changedFiles", () => {
  it("falls back to master when main does not exist", () => {
    const repo = createRepo({ defaultBranch: "master" });
    expect(resolveBaseRef(repo)).toBe("master");
    expect(changedFiles(repo)).toEqual([]);
  });

  it("rejects a missing --base-ref with a clear error", () => {
    const repo = createRepo({ defaultBranch: "main" });
    expect(() => changedFiles(repo, "does-not-exist")).toThrow(GitInspectionError);
    expect(() => changedFiles(repo, "does-not-exist")).toThrow(/Base ref "does-not-exist"/);
  });

  it("rejects a path that is not a git repository", () => {
    const dir = mkdtempSync(join(tmpdir(), "inspector-not-git-"));
    tempRepos.push(dir);
    expect(() => changedFiles(dir)).toThrow(/Not a Git repository/);
  });
});
