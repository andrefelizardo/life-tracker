const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router
  .route("/habits")
  .get(async (req, res) => {
    try {
      const habits = await prisma.habit.findMany({
        orderBy: {
          id: "asc",
        },
      });
      res.status(200).json({
        status: "success",
        data: {
          habits,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, qtt } = req.body;
      const newHabit = await prisma.habit.create({
        data: {
          name,
          qtt,
        },
      });
      res.status(201).json({
        status: "success",
        data: newHabit,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  });

router.patch("/habits/:id/increment", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHabit = await prisma.habit.update({
      where: { id: parseInt(id) },
      data: {
        qtt: {
          increment: 1,
        },
      },
    });
    res.status(200).json({
      status: "success",
      data: updatedHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
