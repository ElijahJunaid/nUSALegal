export default defineNitroPlugin((nitroApp) => {
    // Patch for srvx/node import issue in Netlify environment
    return console.log("no NitroPlugin");
});