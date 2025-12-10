import express from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware';

const router = express.Router();

router
    .route("/habits")
    .get(async (req: any, res: any) => {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const habits = await prisma.habit.findMany({
                where: {
                    userId: authReq.user.userId
                },
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
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    })
    .post(async (req: any, res: any) => {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const { name, qtt, goal, mode, resetOnFailure } = req.body;
            const newHabit = await prisma.habit.create({
                data: {
                    name,
                    qtt,
                    goal: goal || 0,
                    mode: mode || "NORMAL",
                    resetOnFailure: resetOnFailure || false,
                    userId: authReq.user.userId
                },
            });
            res.status(201).json({
                status: "success",
                data: newHabit,
            });
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    });

router.patch("/habits/:id/increment", async (req: any, res: any) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const { id } = req.params;
        // Verify ownership
        const habit = await prisma.habit.findUnique({ where: { id: parseInt(id) } });
        if (!habit || habit.userId !== authReq.user.userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if already completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const lastIncrement = habit.lastIncrementedAt;
        if (lastIncrement) {
            const lastIncrementDate = new Date(lastIncrement);
            lastIncrementDate.setHours(0, 0, 0, 0);

            if (lastIncrementDate.getTime() === today.getTime()) {
                return res.status(400).json({
                    status: "error",
                    message: "Você já marcou este hábito hoje. Volte amanhã!",
                    alreadyCompletedToday: true
                });
            }
        }

        // Calculate next day number
        const nextDayNumber = habit.qtt + 1;

        // Create completion record
        await prisma.habitCompletion.create({
            data: {
                habitId: parseInt(id),
                dayNumber: nextDayNumber,
                completedAt: new Date(),
                isFailure: false
            }
        });

        // Update habit
        const updatedHabit = await prisma.habit.update({
            where: { id: parseInt(id) },
            data: {
                qtt: {
                    increment: 1,
                },
                lastIncrementedAt: new Date(),
            },
        });

        res.status(200).json({
            status: "success",
            data: updatedHabit,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/habits/:id/fail", async (req: any, res: any) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const { id } = req.params;
        // Verify ownership
        const habit = await prisma.habit.findUnique({ where: { id: parseInt(id) } });
        if (!habit || habit.userId !== authReq.user.userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const updatedHabit = await prisma.habit.update({
            where: { id: parseInt(id) },
            data: {
                qtt: 0,
                startDate: new Date(),
                lastIncrementedAt: new Date(),
            },
        });
        res.status(200).json({
            status: "success",
            data: updatedHabit,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/habits/:id", async (req: any, res: any) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const { id } = req.params;
        // Verify ownership
        const habit = await prisma.habit.findUnique({ where: { id: parseInt(id) } });
        if (!habit || habit.userId !== authReq.user.userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        await prisma.habit.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({
            status: "success",
            message: "Habit deleted successfully",
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/habits/:id/completions", async (req: any, res: any) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const { id } = req.params;
        // Verify ownership
        const habit = await prisma.habit.findUnique({ where: { id: parseInt(id) } });
        if (!habit || habit.userId !== authReq.user.userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const completions = await prisma.habitCompletion.findMany({
            where: { habitId: parseInt(id) },
            orderBy: { dayNumber: 'asc' }
        });

        res.status(200).json({
            status: "success",
            data: completions,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

export default router;

