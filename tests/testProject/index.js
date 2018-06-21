
async function main() {
  const Rapid = require('../lib/Rapid');

  const rapid = new Rapid(__dirname)
    .clear()
    .migrate()
    .seed();

  rapid.discover
    .configs('config/config.default.js', 'config/config.js')
    .models('models/**/*.model.js')
    .controllers('controllers/**/*.controller.js')
    .routers('routers/**/*.router.js')
    .seeds('seeds/**/*.seed.js');

  await rapid.start();
}

main();
