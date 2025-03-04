const express = require("express");
const axios = require("axios");
const router = express.Router();

const multer = require("multer");
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

router.post(
  "/complaintreg",
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const { name, mobileNumber, locality, description, department } =
        req.body;

      // Convert description to standard format
      const standardizedText = await standardizeDescription(description);

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

      // Check for existing complaints in the last 2 days
      const existingComplaint = await prisma.complaint.findFirst({
        where: {
          locality,
          description: standardizedText,
          status: {
            in: ["PENDING", "IN_PROGRESS"], // Use the 'in' operator for multiple status values
          },
        },
      });

      if (existingComplaint) {
        // Increase priority of existing complaint
        let newPriority = "MEDIUM";
        if (existingComplaint.priority === "MEDIUM") newPriority = "HIGH";
        if (existingComplaint.priority === "HIGH") newPriority = "URGENT";
        if (existingComplaint.priority === "URGENT") newPriority = "URGENT";

        // Update the existing complaint with new priority and append new attachments if any
        await prisma.complaint.update({
          where: { id: existingComplaint.id },
          data: {
            priority: newPriority,
            attachments: {
              push: attachments.length > 0 ? attachments : undefined,
            },
          },
        });

        return res.json({
          message: "Complaint already exists, priority increased!",
          complaintId: existingComplaint.id,
        });
      }

      // Register new complaint
      const newComplaint = await prisma.complaint.create({
        data: {
          name,
          mobileNumber,
          locality,
          description: standardizedText,
          departmentId: departmentId.id,
          priority: "LOW",
          status: "PENDING",
          attachments,
          createdAt: new Date(),
        },
      });

      res.json({
        message: "Complaint registered successfully!",
        complaintId: newComplaint.id,
      });
    } catch (error) {
      console.error("Error registering complaint:", error);
      res.status(500).json({ error: "Failed to register complaint" });
    }
  }
);

async function standardizeDescription(description) {
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2",
      prompt: `You are a complaint-processing assistant. Your task is to rewrite user complaints into a standardized and structured format while preserving the key issue and location details.

Rules:
1. Keep it concise and structured.
2. Use neutral and formal wording.
3. Ensure consistency in phrasing.
4. Do not add, remove, or infer extra information.

Complaint: "${description}"

Output only the standardized complaint description without any additional text or formatting`,
    });
    console.log("Output received from llama3.2 : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in standardizing complaint:", error);
    return description; // Fallback to original description
  }
}

module.exports = router;
