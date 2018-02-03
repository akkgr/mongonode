import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import eaa from "express-async-await";

const router = db => {
  const api = eaa(Router());

  api.get("/:collection", async (req, res) => {
    const collection = req.params.collection;
    try {
      const docs = await db
        .collection(collection)
        .find({})
        .toArray();
      res.json(docs);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  api.post("/login", async (req, res) => {
    try {
      const users = await db
        .collection("users")
        .find({
          username: req.body.username
        })
        .toArray();
      if (!users || users.length != 1) {
        res.status(401).json({
          message: "Authentication failed. User not found."
        });
        return;
      }
      if (!bcrypt.compareSync(req.body.password, users[0].password)) {
        res.status(401).json({
          message: "Authentication failed. Wrong password."
        });
        return;
      }
      const token = await jwt.sign(
        {
          email: users[0].email,
          username: users[0].username,
          _id: users[0]._id
        },
        "RESTFULAPIs"
      );
      res.json({
        token: token
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  return api;
};

export default router;
