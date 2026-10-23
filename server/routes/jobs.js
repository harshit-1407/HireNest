import { Router } from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/", async (req, res, next) => {
  try {
    const { q, location, type } = req.query;
    const filter = {};
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: rx }, { company: rx }, { skills: rx }];
    }
    if (location) filter.location = new RegExp(escapeRegex(location), "i");
    if (type) filter.type = type;
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.get("/mine/list", auth, requireRole("employer"), async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, requireRole("employer"), async (req, res, next) => {
  try {
    const { title, company, location, type, salary, skills, description } = req.body;
    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "Fill all required fields" });
    }
    const skillList = Array.isArray(skills)
      ? skills
      : String(skills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    const job = await Job.create({
      title,
      company,
      location,
      type,
      salary,
      description,
      skills: skillList,
      postedBy: req.user.id,
    });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, requireRole("employer"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.postedBy) !== req.user.id) {
      return res.status(403).json({ message: "Not your job" });
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
