import { Router } from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/mine", auth, requireRole("seeker"), async (req, res, next) => {
  try {
    const apps = await Application.find({ applicant: req.user.id })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });
    res.json(apps.filter((a) => a.job));
  } catch (err) {
    next(err);
  }
});

router.get("/job/:jobId", auth, requireRole("employer"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || String(job.postedBy) !== req.user.id) {
      return res.status(403).json({ message: "Not your job" });
    }
    const apps = await Application.find({ job: job._id })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    next(err);
  }
});

router.post("/:jobId", auth, requireRole("seeker"), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const already = await Application.findOne({
      job: job._id,
      applicant: req.user.id,
    });
    if (already) {
      return res.status(400).json({ message: "You already applied to this job" });
    }
    const app = await Application.create({
      job: job._id,
      applicant: req.user.id,
      coverLetter: req.body.coverLetter || "",
    });
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", auth, requireRole("employer"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const app = await Application.findById(req.params.id).populate("job");
    if (!app || String(app.job.postedBy) !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }
    app.status = status;
    await app.save();
    res.json(app);
  } catch (err) {
    next(err);
  }
});

export default router;
