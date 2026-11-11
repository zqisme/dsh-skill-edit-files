---
name: edit-files
description: 在用 edit 或 write 修改已有文件前使用；特别是 shell、脚本或 git 写入后，避免遗漏重新 read。
---

# shell 写过，不等于已登记

成功的 `edit` / `write` 会更新本会话的文件版本记录；shell、脚本、git 写入不会。
系统提示中的“刚创建或编辑过”只指前者。无外部变更时，成功编辑后无需重复读取。

- 文件被 shell、脚本、git 或会重写文件的工具改过（如 `Set-Content`、`git restore`），先重新 `read` 再修改。
- 已知自己刚做的改动内容，可用 `read` 的 `limit: 1` 刷新登记；不清楚最新变化时，读取待改区域及必要上下文。
- `Get-Content` / `Select-String` / `grep` 展示内容不算读取登记。
- 新会话或从历史恢复会话后，修改已有文件前先 `read`。

遇到未读取或版本过期错误：
不要原样重试，也不要改用 `write` 强行覆盖；按上述原则重新 `read` 后再修改。

字节保持：当前本地 UTF-8 后端的 `edit` 会去掉 UTF-8 BOM，
并统一混合 LF/CRLF；需要保留原始字节格式时注意这一点。
