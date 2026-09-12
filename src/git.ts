import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import type { ChangedFile } from "./types.js";

export class GitInspectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitInspectionError";
  }
}

function git(repositoryPath: string, args: string[]): string {
  try {
    return execFileSync("git", args, {
      cwd: repositoryPath,
      encoding: "utf8",
    }).trim();
  } catch (error) {
    const stderr =
      error && typeof error === "object" && "stderr" in error
        ? String((error as { stderr?: string }).stderr ?? "").trim()
        : "";
    throw new GitInspectionError(
      stderr || `Git command failed: git ${args.join(" ")}`,
    );
  }
}

function assertGitRepository(repositoryPath: string): void {
  if (!existsSync(repositoryPath)) {
    throw new GitInspectionError(`Repository path does not exist: ${repositoryPath}`);
  }

  try {
    const inside = execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: repositoryPath,
      encoding: "utf8",
    }).trim();
    if (inside !== "true") {
      throw new GitInspectionError(`Not a Git repository: ${repositoryPath}`);
    }
  } catch (error) {
    if (error instanceof GitInspectionError) {
      throw error;
    }
    throw new GitInspectionError(`Not a Git repository: ${repositoryPath}`);
  }
}

function refExists(repositoryPath: string, ref: string): boolean {
  try {
    execFileSync("git", ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], {
      cwd: repositoryPath,
      encoding: "utf8",
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

/** Resolve compare base: explicit --base-ref, else main, else master. */
export function resolveBaseRef(repositoryPath: string, baseRef?: string): string {
  if (baseRef) {
    if (!refExists(repositoryPath, baseRef)) {
      throw new GitInspectionError(
        `Base ref "${baseRef}" was not found in ${repositoryPath}. Pass a valid branch, tag, or commit with --base-ref.`,
      );
    }
    return baseRef;
  }

  for (const candidate of ["main", "master"] as const) {
    if (refExists(repositoryPath, candidate)) {
      return candidate;
    }
  }

  throw new GitInspectionError(
    `Could not find a default base branch (tried main, master) in ${repositoryPath}. Pass one explicitly with --base-ref.`,
  );
}

function parseNameStatus(output: string): ChangedFile[] {
  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [code, ...pathParts] = line.split("\t");
      const status = code === "A" ? "added" : code === "D" ? "deleted" : "modified";
      return { path: pathParts.join("\t"), status };
    });
}

export function changedFiles(repositoryPath: string, baseRef?: string): ChangedFile[] {
  assertGitRepository(repositoryPath);
  const base = resolveBaseRef(repositoryPath, baseRef);

  if (!refExists(repositoryPath, "HEAD")) {
    throw new GitInspectionError(
      `Repository has no commits yet (HEAD is missing): ${repositoryPath}`,
    );
  }

  const output = git(repositoryPath, ["diff", "--name-status", `${base}...HEAD`]);
  return parseNameStatus(output);
}
