# dsh-skill-edit-files

一个给 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai) 用的技能：**改文件之前先 `read`**。

装上它以后，AI 在动手改文件前会先判断「这个文件除了 `edit`，还有谁写过它」——被 shell、脚本或 git
写过就先 `read` 一次，从而不再撞上：

```
Error: cannot edit "...": file changed since it was read — re-read the file, then retry
Error: cannot modify "...": file has not been read — read the file, then retry
```

## 它解决什么

DSH 的 `edit` / `write` 是带版本守卫的写入：只认**本会话 `read` 过**的版本。而 shell 命令
（`Add-Content`、`Set-Content`、`WriteAllText`…）、git 操作、生成文件的脚本都不在这个登记体系里。
于是「刚用 pwsh 追加过一行，接着就 edit」这种最常见的操作顺序，必然被拒。

技能里把这件事写成了一条可执行的规则，外加三个容易误判的点（`Get-Content` 不算读过、新会话登记簿为空、
系统提示里 `unless you just created or edited it in this session` 只指 `edit`/`write`）。

## 安装

技能就是一个 markdown 文件，放到 DSH 的技能根目录即可（**不用重启**，目录是被监视的）。

Windows：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.dsh\skills\edit-files" | Out-Null
Copy-Item .\SKILL.md "$env:USERPROFILE\.dsh\skills\edit-files\SKILL.md"
```

macOS / Linux：

```sh
mkdir -p ~/.dsh/skills/edit-files
cp SKILL.md ~/.dsh/skills/edit-files/SKILL.md
```

也可以放进某个仓库（`<repo>/.dsh/skills/edit-files/SKILL.md`），跟着 git 共享给同事。

## 验证

新开一个会话，技能目录里应出现 `edit-files`，描述是「改文件前先 read 的规则——…」。

## 注意

- 目录只能一层：`skills/edit-files/SKILL.md`，嵌套更深就发现不到。
- 文件必须是 UTF-8（带不带 BOM 都能读；别存成 GBK）。
- 正文里提到 `wb-local.cmd` 是作者本机某个项目的例子，其他环境可以删掉那半句。

## 内容

| 文件 | 说明 |
|---|---|
| `SKILL.md` | 技能本体，30 行。frontmatter 的 `name` / `description` / `whenToUse` 决定它何时被加载 |

## License

MIT
