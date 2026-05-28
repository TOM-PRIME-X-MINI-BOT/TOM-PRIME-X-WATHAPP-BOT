module.exports = {
  name: "bot",
  aliases: ["tom", "ai", "sim"],
  category: "ai",
  description: "AI chat with auto-reply support",
  usage: ".bot <message> or reply/mention bot",

  async execute(sock, msg, args, extra) {
    // Command is disabled - do nothing and return immediately
    return;
  }
};