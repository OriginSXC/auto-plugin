/**
 * 解析某个群真正所属的 Bot。
 *
 * TRSS-Yunzai 支持多 Bot 同时在线，`Bot.uin` 是一个数组，其 `toJSON()` 会
 * **随机**返回其中一个 uin（见 TRSS-Yunzai lib/bot.js）。把 `Bot.uin` 直接当作
 * user_id 传给适配器，就会出现「拿 KOOK 的 uin 去操作 QQ 群」这类串台：
 *
 *   uin数组 = [3389512751, "ko_2514911040"]
 *   uin.toJSON = "ko_2514911040"      ← 随机挑中
 *   gl.bot_id  = 3389512751           ← 该群实际所属
 *   → NapCat 返回 {"retcode":1400,"wording":"user_id: expected a positive integer"}
 *
 * 导致自动群名片在多 Bot 环境下 100% 失败。`Bot.gl` 的条目里带 `bot_id`，
 * 用它才能拿到该群自己的那个 Bot。
 *
 * Miao-Yunzai 只有单 Bot，`Bot.gl` 的条目没有 `bot_id`，也没有 `Bot.bots`，
 * 取值链会自然回落到 `Bot.uin` / `Bot.nickname`，行为与改动前完全一致。
 *
 * @param {string|number} groupID 群号
 * @returns {{ uin: string|number, nickname: string }}
 */
export function getGroupBot (groupID) {
  const botId = Bot.gl?.get?.(groupID)?.bot_id
  const bot = (botId !== undefined && Bot.bots?.[botId]) || null
  return {
    uin: botId !== undefined ? botId : Bot.uin,
    nickname: bot?.nickname || bot?.info?.nickname || Bot.nickname
  }
}
