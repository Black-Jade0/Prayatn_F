const express = require("express");
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_PASSWORD = process.env.JWT_PASSWORD;
const { authMiddleware } = require("../middleware");
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

router.post("/departmentcreation", async (req, res) => {
    const body = req.body;
    console.log("Got the body: ", body);
    if (!body.name || !body.description) {
        console.error({
            message: "Invalid or Insufficent parameters  ",
            error: err,
        });
        res.status(511).json({ message: "Department  creation failed !" });
    }
    try {
        let dept = await prisma.department.findFirst({
            where: {
                name: body.name,
            },
        });
        if (dept) {
            console.log({ message: "Department already exist with same name" });
            res.status(511).json({
                message: "Department already exist with same name",
            });
            return;
        }
        dept = await prisma.department.create({
            data: {
                name: body.name,
                description: body.description,
            },
        });

        res.json({ message: "Department created successfully !" });
    } catch (err) {
        console.error({
            message: "Got the error while creating department ! ",
            error: err,
        });
        res.status(511).json({ message: "Department creation failed !" });
    }
});

router.post("/signup", async (req, res) => {
    //Route for making admins i.e. adding authority
    const body = req.body;
    console.log("Got the body: ", body);
    if (!body.name || !body.email || !body.password || !body.departmentId) {
        console.error({ message: "Invalid credentails  ", error: err });
        res.status(511).json({ message: "Signup failed !" });
    }
    try {
        let user = await prisma.admin.findFirst({
            where: {
                email: body.email,
            },
        });
        if (user) {
            console.log({ message: "User already exist with same emailId" });
            res.status(511).json({
                message: "User already exist with same emailId",
            });
            return;
        }
        user = await prisma.admin.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                departmentId: body.departmentId,
            },
        });
        const userId = user.id;
        const token = jwt.sign({ userId: userId }, JWT_PASSWORD);
        res.cookie("token", token);
        res.json({ message: "signup successful !" });
    } catch (err) {
        console.error({
            message: "Got the error while signing up ",
            error: err,
        });
        res.status(511).json({ message: "Signup failed !" });
    }
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    console.log("Got the body: ", body);

    if (!body.email || !body.password) {
        console.error({ message: "Credentials are missing" });
        return res
            .status(400)
            .json({ message: "Signin failed! Missing credentials." });
    }

    try {
        const user = await prisma.admin.findFirst({
            where: {
                email: body.email,
                password: body.password,
            },
            include: {
                department: {
                    include: {
                        complaints: true, // Fetch complaints of the department
                    },
                },
            },
        });

        if (user) {
            const token = jwt.sign({ userId: user.id }, JWT_PASSWORD);
            res.cookie("token", token);

            res.json({
                message: "Signin successful!",
                userData: user,
                departmentName: user.department.name,
                complaints: user.department.complaints, // Send complaints of the department
            });
        } else {
            console.log({ message: "User not found, check the credentials" });
            res.status(404).json({ message: "User not found!" });
        }
    } catch (err) {
        console.error({ message: "Error during signin", error: err });
        res.status(500).json({ message: "Signin failed!" });
    }
});


router.put(
    "/complaint/:id/change-department",
    authMiddleware,
    async (req, res) => {
        // NEED CHECKING
        console.log("here")
        const { id } = req.params;
        const { newDepartmentId } = req.body;

        if (!newDepartmentId) {
            return res
                .status(400)
                .json({ message: "New department ID is required" });
        }

        try {
            // Check if the new department exists
            const newDepartment = await prisma.department.findUnique({
                where: { id: newDepartmentId },
            });

            if (!newDepartment) {
                return res
                    .status(404)
                    .json({ message: "New department not found" });
            }

            // Update the complaint's department
            const updatedComplaint = await prisma.complaint.update({
                where: { id },
                data: { departmentId: newDepartmentId },
            });

            res.json({
                message: "Complaint department updated successfully",
                complaint: updatedComplaint,
            });
        } catch (err) {
            console.error("Error updating complaint department:", err);
            res.status(500).json({
                message: "Failed to update complaint department",
            });
        }
    }
);

//route for fetching all complaits

router.post(
    "/changeStatus/:complaintId",
    authMiddleware,
    upload.array("attachments", 5),
    async (req, res) => {
        //route for changing status--needs checking !
        const { complaintId } = req.params;
        try {
            const attachments = req.files
                ? req.files.map((file) => file.buffer)
                : [];
            //pass this image to llama and confirm if the problem given user is resolved or not
            //if llama accepts it then add the following image to complaints attachment
            //else return insufficent proof
            if (attachments) {
                const updatedComplaint = await prisma.complaint.update({
                    where: {
                        id: complaintId,
                    },
                    data: {
                        status: req.body.status,
                    },
                });
                res.json({
                    message: "Complaint update , ",
                    newStatus: updatedComplaint.status,
                });
            } else {
                res.status(511).json({
                    message:
                        "Insufficent or invalid proof is provided ! Status not changed !",
                });
            }
        } catch (err) {
            console.error("Error updating complaint department:", err);
            res.status(500).json({
                message: "Failed to update complaint department",
            });
        }
    }
);

// Add this route to your admin router file
router.get("/complaints/locality/:locality", authMiddleware, async (req, res) => {
    const { locality } = req.params;
    
    try {
        const complaints = await prisma.complaint.findMany({
            where: {
                locality: locality
            },
            include: {
                department: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        if (complaints.length === 0) {
            return res.status(200).json({ 
                message: "No complaints found for this locality", 
                complaints: [] 
            });
        }
        
        res.json({ 
            message: "Complaints retrieved successfully", 
            complaints: complaints 
        });
    } catch (err) {
        console.error("Error fetching complaints by locality:", err);
        res.status(500).json({ message: "Failed to retrieve complaints" });
    }
});

router.get("/check-auth", authMiddleware, (req, res) => {
    res.status(200).json({ authenticated: true, userId: req.userId });
});

module.exports = router;
