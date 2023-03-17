import express from "express";
import { DocumentModel } from "../models/Document.js";
import auth from "../middleware/user_jwt.js";
import multer from "multer";
import { fileUpload } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const documents = await DocumentModel.find({ user: req.user.id });
  res.status(200).json({ success: true, totalDocuments: documents.length, documents });
});

router.post("/", auth, multer({ storage: multer.memoryStorage() }).single("file"), async (req, res) => {
  try {
    const filename = req.body.filename;
    const user = req.user.id;

    const isFileExist = await DocumentModel.findOne({ filename, user });

    if (isFileExist) return res.status(409).json({ success: false, msg: "Document already exists!" });

    const result = await fileUpload(req.file, "documents");

    const newDocument = new DocumentModel({ public_id: result.public_id, filename, file_url: result.secure_url, user });
    await newDocument.save();

    res.status(200).json({ success: true, msg: "Uploaded Successfully", public_id: result.public_id, filename: filename, file_url: result.url, user: user });
  } catch (error) {
    console.warn(error);
  }
});

router.delete("/:project/:folder/:id", async (req, res) => {
  try {
    const public_id = req.params.project + "/" + req.params.folder + "/" + req.params.id;
    const result = await cloudinary.uploader.destroy(public_id).then(await DocumentModel.findOneAndDelete({ public_id }));
    if (result) return res.status(200).json({ success: true, msg: "Deleted Succesfully" });
  } catch (e) {
    console.warn(e);
  }
});

export { router as documentRouter };
