const express = require("express");
const axios = require("axios");
const router = express.Router();
const prisma = require("../prisma");
const multer = require("multer");
const ComplaintProcessor = require("../testparser");
const ComplaintMatcher = require("../fuzzymatching");
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.get("/trackcomplaint/:id", async (req, res) => {
  try {
    const { id } = req.params; // Already a string

    const complaint = await prisma.complaint.findUnique({
      where: { id }, // No conversion needed
      select: {
        id: true,
        name: true,
        locality: true,
        description: true,
        priority: true,
        status: true,
        createdAt: true,
      },
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found." });
    }

    res.json(complaint);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ error: "Failed to fetch complaint." });
  }
});


const findAndHandleSimilarComplaints = async (
  matcher,
  complaintVar,
  locality,
  res
) => {
  // Find similar complaints
  const existingComplaints = await matcher.findSimilarComplaints(
    complaintVar,
    locality
  );

  // Check if there are any similar complaints
  if (existingComplaints && existingComplaints.length > 0) {
    // If there's only one similar complaint
    if (existingComplaints.length === 1) {
      const complaint = existingComplaints[0];

      // Optional: Update the existing complaint if needed
      // await complaint.save(); // Uncomment if you want to update the existing complaint

      return res.json({
        message: `Similar complaint already exists. Please note down the following id to track the status of your complaint: ${complaint.id}`,
      });
    }

    // If multiple similar complaints exist
    const complaintIds = existingComplaints.map((complaint) => complaint.id);

    return res.json({
      message: `Multiple similar complaints found`,
      similarComplaintIds: complaintIds,
    });
  }

  // If no similar complaints are found, continue with creating a new complaint
  // (this part would be the code that follows this check in your original logic)
  return null;
};

router.post(
  "/complaintreg",
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const { name, mobileNumber, locality, description, department } =
        req.body;

      // Convert description to standard format
      const processor = new ComplaintProcessor();
      const complaintVar = await processor.processComplaintAsJSON(description);

      // Get department ID
      let departmentId = await prisma.department.findFirst({
        where: {
          name: department,
        },
        select: {
          id: true,
        },
      });

      // If department not found, use default department
      if (!departmentId) {
        departmentId = await prisma.department.findFirst({
          where: {
            name: "Public Works Department (PWD)",
          },
          select: {
            id: true,
          },
        });
        console.log("Changed to default department");
      }

      // Prepare attachments array from uploaded files
      const attachments = req.files ? req.files.map((file) => file.buffer) : [];

      const matcher = new ComplaintMatcher();
      const result = await findAndHandleSimilarComplaints(
        matcher,
        complaintVar,
        locality,
        res
      );

      if (result === null) {
        // Register new complaint
        const newComplaint = await prisma.complaint.create({
          data: {
            name,
            mobileNumber,
            locality,
            description: complaintVar.keywords,
            departmentId: departmentId.id,
            priority: complaintVar.priority,
            status: "PENDING",
            category:complaintVar.category,
            attachments,
            createdAt: new Date(),
          },
        });

        res.json({
          message: "Complaint registered successfully!",
          complaintId: newComplaint.id,
        });
      }
    } catch (error) {
      console.error("Error registering complaint:", error);
      res.status(500).json({ error: "Failed to register complaint" });
    }
  }
);

module.exports = router;
