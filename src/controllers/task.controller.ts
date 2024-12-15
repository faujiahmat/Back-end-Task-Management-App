import { NextFunction, Response } from 'express'
import prisma from '../db'
import { CustomRequest } from '../middleware/authentication'

export const createTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, dueDate } = req.body
    let { status, priority } = req.body

    status = status || 'PENDING'
    priority = priority || 'MEDIUM'

    if (!title || !dueDate) {
      res.status(400).send({
        statusCode: 400,
        error: null,
        message: 'Missing required fields'
      })
      return
    }

    // Validate status
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      res
        .status(400)
        .send({ statusCode: 400, error: null, message: 'Invalid status value' })
      return
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH']
    if (!validPriorities.includes(priority)) {
      res.status(400).send({
        statusCode: 400,
        error: null,
        message: 'Invalid priority value'
      })
      return
    }

    const userId = req.user?.id
    if (!userId) {
      res
        .status(400)
        .send({ statusCode: 400, error: null, message: 'User ID is required' })
      return
    }

    const task = await prisma.task.create({
      data: {
        userId, // Assuming userId is needed for task creation
        title,
        description,
        dueDate: new Date(dueDate), // Convert dueDate to Date object
        status,
        priority
      }
    })

    res.status(201).send({
      statusCode: 201,
      error: null,
      message: 'Task created',
      data: task
    })
    return
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/task.controller.ts:createTask: createTask => ' +
          error.message
      )
    )
  }
}

export const getAllTasks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      status,
      priority,
      dueDate,
      fromDate,
      toDate,
      beforeDate,
      afterDate
    } = req.query

    // Prepare filter object
    const filters: any = {
      userId: req.user?.id // Filter by logged-in user
    }

    // Validate and apply status filter if provided
    if (status) {
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
      if (!validStatuses.includes(status as string)) {
        res.status(400).send({
          statusCode: 400,
          error: null,
          message:
            'Invalid status value. Allowed values: PENDING, IN_PROGRESS, COMPLETED'
        })
        return
      }
      filters.status = status
    }

    // Validate and apply priority filter if provided
    if (priority) {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH']
      if (!validPriorities.includes(priority as string)) {
        res.status(400).send({
          statusCode: 400,
          error: null,
          message: 'Invalid priority value. Allowed values: LOW, MEDIUM, HIGH'
        })
        return
      }
      filters.priority = priority
    }

    // Validate and apply single dueDate filter if provided
    if (dueDate) {
      const dueDateObj = new Date(dueDate as string)
      if (isNaN(dueDateObj.getTime())) {
        res.status(400).send({
          statusCode: 400,
          error: null,
          message: 'Invalid dueDate value. Please provide a valid date.'
        })
        return
      }
      filters.dueDate = dueDateObj
    }

    // Validate and apply date range filter (fromDate and toDate)
    if (fromDate || toDate) {
      const dateRangeFilter: any = {}
      if (fromDate) {
        const fromDateObj = new Date(fromDate as string)
        if (isNaN(fromDateObj.getTime())) {
          res.status(400).send({
            statusCode: 400,
            error: null,
            message: 'Invalid fromDate value. Please provide a valid date.'
          })
          return
        }
        dateRangeFilter.gte = fromDateObj // Greater than or equal to fromDate
      }
      if (toDate) {
        const toDateObj = new Date(toDate as string)
        if (isNaN(toDateObj.getTime())) {
          res.status(400).send({
            statusCode: 400,
            error: null,
            message: 'Invalid toDate value. Please provide a valid date.'
          })
          return
        }
        dateRangeFilter.lte = toDateObj // Less than or equal to toDate
      }
      filters.dueDate = dateRangeFilter // Apply the range filter to dueDate
    }

    // Validate and apply beforeDate filter
    if (beforeDate) {
      const beforeDateObj = new Date(beforeDate as string)
      if (isNaN(beforeDateObj.getTime())) {
        res.status(400).send({
          statusCode: 400,
          error: null,
          message: 'Invalid beforeDate value. Please provide a valid date.'
        })
        return
      }
      filters.dueDate = { ...filters.dueDate, lt: beforeDateObj } // Less than beforeDate
    }

    // Validate and apply afterDate filter
    if (afterDate) {
      const afterDateObj = new Date(afterDate as string)
      if (isNaN(afterDateObj.getTime())) {
        res.status(400).send({
          statusCode: 400,
          error: null,
          message: 'Invalid afterDate value. Please provide a valid date.'
        })
        return
      }
      filters.dueDate = { ...filters.dueDate, gt: afterDateObj } // Greater than afterDate
    }

    // Fetch tasks with filters applied
    const tasks = await prisma.task.findMany({
      where: filters
    })

    if (tasks.length === 0) {
      res.status(404).send({
        statusCode: 404,
        error: null,
        message: 'No tasks found matching the given filters.'
      })
      return
    }

    res.status(200).send({
      statusCode: 200,
      error: null,
      message: 'Tasks retrieved',
      data: tasks
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/task.controller.ts:getAllTasks: getAllTasks => ' +
          error.message
      )
    )
  }
}

export const getTaskById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params

    if (!taskId) {
      res.status(400).send({
        statusCode: 400,
        error: null,
        message: 'Invalid taskId format. It must be a number.'
      })
      return
    }
    // Fetch the task from the database
    const task = await prisma.task.findUnique({
      where: {
        id: Number(taskId), // Convert taskId to number to match the type of taskId,
        userId: req.user?.id // Ensure the task belongs to the logged-in user
      }
    })

    // Check if the task exists and belongs to the user
    if (!task) {
      res.status(404).send({
        statusCode: 404,
        error: null,
        message: 'Task not found or not accessible.'
      })
      return
    }

    // Send the task details
    res.status(200).send({
      statusCode: 200,
      error: null,
      message: 'Task retrieved successfully',
      data: task
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/task.controller.ts:getTaskById: getTaskById => ' +
          error.message
      )
    )
  }
}

export const updateTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params
    const { title, description, dueDate, status, priority } = req.body

    // Validate the taskId format (assuming numeric IDs)
    if (!taskId || isNaN(Number(taskId))) {
      res.status(400).send({
        statusCode: 400,
        error: null,
        message: 'Invalid taskId format. It must be a number.'
      })
      return
    }

    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: {
        id: Number(taskId),
        userId: req.user?.id
      }
    })

    if (!existingTask) {
      res.status(404).send({
        statusCode: 404,
        error: null,
        message: 'Task not found or not accessible.'
      })
      return
    }

    // Update the task with the provided data
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId)
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority })
      }
    })

    // Send the updated task details
    res.status(200).send({
      statusCode: 200,
      error: null,
      message: 'Task updated successfully',
      data: updatedTask
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/task.controller.ts:updateTask: updateTask => ' +
          error.message
      )
    )
  }
}

export const deleteTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params

    // Validate the taskId format (assuming numeric IDs)
    if (!taskId || isNaN(Number(taskId))) {
      res.status(400).send({
        statusCode: 400,
        error: null,
        message: 'Invalid taskId format. It must be a number.'
      })
      return
    }

    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: {
        id: Number(taskId),
        userId: req.user?.id
      }
    })

    if (!existingTask) {
      res.status(404).send({
        statusCode: 404,
        error: null,
        message: 'Task not found or not accessible.'
      })
      return
    }

    // Delete the task
    await prisma.task.delete({
      where: {
        id: Number(taskId)
      }
    })

    // Send confirmation of deletion
    res.status(200).send({
      statusCode: 200,
      error: null,
      message: 'Task deleted successfully'
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/task.controller.ts:deleteTask: deleteTask => ' +
          error.message
      )
    )
  }
}

export const changeTaskStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params
    const { status } = req.body

    // Validate the taskId format (assuming numeric IDs)
    if (!taskId || isNaN(Number(taskId))) {
      res.status(400).send({
        statusCode: 400,
        error: null,
        message: 'Invalid taskId format. It must be a number.'
      })
      return
    }

    // Validate the status value
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
    if (!status || !validStatuses.includes(status)) {
      res.status(400).send({
        statusCode: 400,
        error: null,
        message:
          'Invalid status. Allowed values are: PENDING, IN_PROGRESS, COMPLETED.'
      })
      return
    }

    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: {
        id: Number(taskId),
        userId: req.user?.id
      }
    })

    if (!existingTask) {
      res.status(404).send({
        statusCode: 404,
        error: null,
        message: 'Task not found or not accessible.'
      })
      return
    }

    // Update the task status
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId)
      },
      data: {
        status
      }
    })

    // Send the updated task details
    res.status(200).send({
      statusCode: 200,
      error: null,
      message: 'Task status updated successfully',
      data: updatedTask
    })
  } catch (error: Error | any) {
    next(
      new Error(
        'Error at src/controllers/task.controller.ts:changeTaskStatus: changeTaskStatus => ' +
          error.message
      )
    )
  }
}
