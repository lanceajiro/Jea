module.exports = {
    jea: {
        name: 'math',
        author: 'alice',
        description: 'calculator',
        usage: '1+1',
        category: 'study'
    },
    execute: async function ({ bot, chatId, args, usages }) {
        var axios = require("axios");
        var fs = require("fs-extra");
        var text = [];
        var key = 'T8J8YV-H265UQ762K';
        var content = args.join(" ");

        if (!content)
            return usages(bot);

        try {
            var data = (await axios.get(`http://api.wolframalpha.com/v2/query?appid=${key}&input=${encodeURIComponent(content)}&output=json`)).data;

            if (content.startsWith("-p")) {
                content = "primitive " + content.slice(3);
                var value = data.queryresult.pods.find((e) => e.id == "Input").subpods[0].plaintext;
                if (value.includes("≈")) {
                    var a = value.split("≈"),
                        b = a[0].split(" = ")[1],
                        c = a[1];
                    return bot.sendMessage(chatId, `Fractional: ${b}\nDecimal: ${c}`);
                } else return bot.sendMessage(chatId, value.split(" = ")[1].replace("+ constant", ""));
            } else if (content.startsWith("-g")) {
                content = "plot " + content.slice(3);
                var src = data.queryresult.pods.some((e) => e.id == "Plot") ? data.queryresult.pods.find((e) => e.id == "Plot").subpods[0].img.src : data.queryresult.pods.find((e) => e.id == "ImplicitPlot").subpods[0].img.src;
                var img = (await axios.get(src, { responseType: 'stream' })).data;
                img.pipe(fs.createWriteStream("./graph.png")).on("close", () => bot.sendPhoto(chatId, { source: "./graph.png" })
                    .then(() => fs.unlinkSync("./graph.png"))).catch(e => bot.sendMessage(chatId, `${e}`));
            } else if (content.startsWith("-v")) {
                content = "vector " + content.slice(3).replace(/\(/g, "<").replace(/\)/g, ">");
                var src = data.queryresult.pods.find((e) => e.id == "VectorPlot").subpods[0].img.src;
                var vector_length = data.queryresult.pods.find((e) => e.id == "VectorLength").subpods[0].plaintext,
                    result;
                if (data.queryresult.pods.some((e) => e.id == "Result")) result = data.queryresult.pods.find((e) => e.id == "Result").subpods[0].plaintext;
                var img = (await axios.get(src, { responseType: 'stream' })).data;
                img.pipe(fs.createWriteStream("./graph.png")).on("close", () => bot.sendPhoto(chatId, { caption: !result ? '' : result + "\nVector Length: " + vector_length, source: "./graph.png" })
                    .then(() => fs.unlinkSync("./graph.png"))).catch(e => bot.sendMessage(chatId, `${e}`));
            } else {
                if (data.queryresult.pods.some((e) => e.id == "Solution")) {
                    var value = data.queryresult.pods.find((e) => e.id == "Solution");
                    for (let e of value.subpods) text.push(e.plaintext);
                    return bot.sendMessage(chatId, text.join("\n"));
                } else if (data.queryresult.pods.some((e) => e.id == "ComplexSolution")) {
                    var value = data.queryresult.pods.find((e) => e.id == "ComplexSolution");
                    for (let e of value.subpods) text.push(e.plaintext);
                    return bot.sendMessage(chatId, text.join("\n"));
                } else if (data.queryresult.pods.some((e) => e.id == "Result")) return bot.sendMessage(chatId, data.queryresult.pods.find((e) => e.id == "Result").subpods[0].plaintext);
            }
        } catch (e) {
            bot.sendMessage(chatId, `${e}`);
        }
    }
};
