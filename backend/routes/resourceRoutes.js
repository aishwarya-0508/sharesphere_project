const express = require("express");

const {
  createResource,
  getResources,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const router = express.Router();

router.post("/", createResource);
router.get("/", getResources);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

module.exports = router;
