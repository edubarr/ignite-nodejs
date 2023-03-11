import express, { response } from "express";
import { createCourse } from "./routes";

const app = express();

app.get("/", (request, response) => {
  createCourse(request, response);
});

app.listen(3333);
