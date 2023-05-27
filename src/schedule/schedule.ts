import { CreateScheduleInput, UpdateScheduleInput } from "../helper/interfaces";
import { prisma } from "../helper/prisma_helper";

export async function createSchedule(data: CreateScheduleInput) {
  try {
    let schedule = await prisma.schedule.create({ data });
    return schedule;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateSchedule(
  scheduleId: string,
  data: UpdateScheduleInput
) {
  return await prisma.schedule.update({ where: { id: scheduleId }, data });
}

export async function deleteSchedule(scheduleId: string) {
  return await prisma.schedule.delete({ where: { id: scheduleId } });
}

export async function getScheduleById(scheduleId: string) {
  return await prisma.schedule.findUnique({ where: { id: scheduleId } });
}

export async function getAllSchedules() {
  return await prisma.schedule.findMany();
}
