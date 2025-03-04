const express = require("express");

const router = express.Router();

router.post("/complaintreg", async (req, res) => {
  
  //we will take department name and then will search department table and will get the department id for creating complaint !
  try {
    const { name, mobileNumber, locality, description, department } = req.body;
    
    // Convert description to standard format
    const standardizedText = await standardizeDescription(description);
    
    // Check for existing complaints in the last 2 days
    const existingComplaint = await prisma.complaint.findFirst({
        where: {
            locality,
            complaintText: standardizedText,
            createdAt: {
                gte: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
            }
        }
    });

    if (existingComplaint) {
        let newPriority = "MEDIUM";
        if (existingComplaint.priority === "MEDIUM") newPriority = "HIGH";
        if (existingComplaint.priority === "HIGH") newPriority = "URGENT";

        await prisma.complaint.update({
            where: { id: existingComplaint.id },
            data: { priority: newPriority }
        });

        return res.json({ message: "Complaint already exists, priority increased!", complaintId: existingComplaint.id });
    }

    // Register new complaint
    const newComplaint = await prisma.complaint.create({
        data: {
            name,
            mobileNumber,
            locality,
            complaintText: standardizedText,
            department,
            priority: "LOW",
            createdAt: new Date()
        }
    });

    return res.json({ message: "New complaint registered", complaintId: newComplaint.id });

} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
}
});

async function standardizeDescription(description) {
  //Google Gemini 
  const response = await fetch("https://api.gemini.example.com/generate", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
          prompt: `Convert the following complaint into a standardized format:\n\n${description}`
      })
  });
  const data = await response.json();
  return data.standardizedText;
}

module.exports = router;
