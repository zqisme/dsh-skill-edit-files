#!/usr/bin/env node
// 校验仓库 SKILL.md 与已安装副本是否一致：事实源只有本仓库，复制品漂移即失败。
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoPath = join(dirname(fileURLToPath(import.meta.url)), "SKILL.md");
const installedPath = process.argv[2] ?? join(homedir(), ".dsh", "skills", "edit-files", "SKILL.md");

const digest = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 12);

async function read(path) {
  try {
    return await readFile(path);
  } catch {
    return undefined;
  }
}

const repo = await read(repoPath);
if (repo === undefined) {
  console.error(`缺少 ${repoPath}`);
  process.exit(2);
}

const installed = await read(installedPath);
if (installed === undefined) {
  console.error(`未安装：${installedPath}`);
  console.error("先跑 README「安装或更新」里的命令，再跑本脚本。");
  process.exit(2);
}

if (repo.equals(installed)) {
  console.log(`一致 ${digest(repo)}`);
} else {
  console.error("漂移：两份 SKILL.md 内容不同");
  console.error(`  repo      ${digest(repo)}  ${repoPath}`);
  console.error(`  installed ${digest(installed)}  ${installedPath}`);
  console.error("重跑安装命令覆盖已安装副本，再跑本脚本。");
  process.exitCode = 1;
}
