# dsh-skill-edit-files

给 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai) 用的技能：**shell 写过，不等于已登记**。

## 它解决什么

在 DSH 默认文件观察策略下，`read` 和成功的 `edit` / `write` 会更新本会话的文件版本记录；shell、脚本、git 或其他重写工具不会。

AI 容易把“刚用 shell 修改过文件”误当作系统提示里的“刚创建或编辑过”，接着调用 `edit` / `write` 时遇到未读取或版本过期错误。本技能专门澄清这个区别，不要求每次成功编辑后重复读取。

核心规则：

- 其他方式写过文件后，先重新 `read` 再修改。
- 已知自己的改动内容，可最小读取刷新登记；未知变化则读取待改区域及必要上下文。
- `Get-Content` / `Select-String` / `grep` 展示内容不算读取登记。
- 从历史恢复会话后，重新读取；报错后不盲目重试、不改用整份覆盖。

## 安装或更新

在本仓库目录执行。默认启用技能目录监视，无需重启 DSH。

Windows：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.dsh\skills\edit-files" | Out-Null
Copy-Item .\SKILL.md "$env:USERPROFILE\.dsh\skills\edit-files\SKILL.md" -Force
```

macOS / Linux：

```sh
mkdir -p ~/.dsh/skills/edit-files
cp SKILL.md ~/.dsh/skills/edit-files/SKILL.md
```

也可以使用项目级安装，随仓库共享：

```text
<repo>/.dsh/skills/edit-files/SKILL.md
```

## 改完之后

`SKILL.md` 的事实源只有本仓库；安装出来的副本是复制品，两边不会自动同步。

改完 `SKILL.md` 必须重跑上面的安装命令，再跑校验：

```powershell
node .\check-sync.mjs
```

- 一致：打出 `一致 <hash>`，退出码 0。
- 漂移：打出两边哈希与路径，退出码 1，重跑安装命令。
- 未安装：提示先安装，退出码 2。

装了项目级副本时，把那份的路径作为参数传入：`node .\check-sync.mjs <path>`。

## 加载与验证

- `name` 保持为 `edit-files`，触发条件直接写入 `description`。当前模型可见的技能目录展示名称与描述，操作细节留在正文。
- 新会话目录应出现 `edit-files`，描述以“在用 edit 或 write 修改已有文件前使用”开头；输入 `/edit-files` 可检查实际加载内容。
- 更新不会改写历史中已加载的正文，验证新版建议新开会话或再次手动调用。
- 描述帮助 AI 匹配任务，不是自动执行机制；本次更新不代表已验证自动加载率。

## 注意

- 推荐目录结构为 `skills/edit-files/SKILL.md`，不要再套更深的目录；技能文件使用 UTF-8，不要保存成 GBK。
- 当前本地 UTF-8 后端的 `edit` 会去掉 UTF-8 BOM，并统一混合 LF/CRLF；需要保留原始字节格式时注意这一点。

## 更新记录

2026-11-08：采用简洁确认稿；明确文件工具与其他写入方式的区别，保留重写工具场景和有条件的最小读取，触发条件合入 `description`。

## License

MIT
