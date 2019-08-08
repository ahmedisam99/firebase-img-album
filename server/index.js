const app = require("./app");

app.listen(app.get("port"), () =>
  console.log(`Server is up on http://localhost:${app.get("port")}`)
);
