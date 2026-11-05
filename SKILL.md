---
name: edit-files
description: 改文件前先 read 的规则——文件被 shell / 脚本 / git 写过（含会替你重写文件的工具）就要重新 read，否则 edit 报 file changed since it was read；附被拒后的恢复办法。
whenToUse: 准备用 edit / write 修改任何文件之前；出现 file changed since it was read 或 file has not been read 时。
---

# 改文件前先 `read`

`edit` / `write` 只认**本会话 `read` 过**的版本。所以动手前先问一句：这个文件，除了 `edit`，还有谁写过它？

**被 shell、脚本或 git 写过 → 先 `read` 一次，再 `edit`**（`limit: 1` 够）。

算「写过」的：`Add-Content`、`Set-Content`、`Out-File`、`WriteAllText`、`WriteAllBytes`、
`Copy-Item -Force`、`git checkout` / `restore` / `apply`、生成文件的脚本、会替你重写文件的工具
（如 `wb-local.cmd`）。

三个容易漏的点：

- `Get-Content` / `Select-String` / `grep` 看一眼**不算**读过——要登记只能用 `read`。
- 新会话、会话恢复后登记簿是空的，第一次编辑同样要先 `read`。
- 系统提示里那句「unless you just created or edited it in this session」只指 `edit` / `write`；
  用 shell 写过**不算**，登记照样失效。

## 被拒了怎么办

别原样重试，也别用 `write` 整文件覆盖（同样被拒）。

## 一个副作用

`edit` 会吞掉 UTF-8 BOM，并把混合行尾归一成主流风格。需要字节原样时（多数是 `.ps1`）记住这点。
