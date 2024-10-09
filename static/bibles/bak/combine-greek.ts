


const OTRaw = await Deno.readTextFile("LXX.json");
const OTData = JSON.parse(OTRaw);
const NTRaw = await Deno.readTextFile("TR.json");
const NTData = JSON.parse(NTRaw);

const combined = {books: [...OTData.books, ...NTData.books]};

const text = JSON.stringify(combined);

await Deno.writeTextFile("LXXTR.json", text);
