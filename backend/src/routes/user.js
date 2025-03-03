const express = require("express");

const router = express.Router();

router.post("/complaintreg", async (req, res) => {
  const body = req.body;
  console.log("Got the body: ", body);
  //we will take department name and then will search department table and will get the department id for creating complaint !
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
      res
        .status(511)
        .json({ message: "Department already exist with same name" });
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

module.exports = router;
