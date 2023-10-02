import experss from "express";
import "dotenv/config";

const app = experss();
const port = process.env.PORT || 8888;
app.use(experss.json());
app.use(experss.urlencoded({ extended: true }));
app.use("/", (req, res) => {
  res.send("thanh cong");
});

app.listen(port, () => {
  console.log("server running on the port :" + port);
});
