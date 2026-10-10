import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createRecord,
  getAccessibleRecords,
  getRecordById
} from '../services/record.service';
import { delay } from '../utils/delay';

export const getRecords = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const requestedDelay = Number(req.query.delay ?? 0);

    // Protect the server from excessively large delays.
    const delayMs = Math.min(
      Math.max(requestedDelay, 0),
      10000
    );

    await delay(delayMs);

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const records = await getAccessibleRecords(req.user.role);

    res.status(200).json({
      success: true,
      message: 'Records retrieved successfully',
      meta: {
        role: req.user.role,
        delay: delayMs,
        count: records.length
      },
      data: records
    });
  } catch (error) {
    console.error('Get records error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve records'
    });
  }
};

export const getRecord = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const recordId = String(req.params.recordId);
    
    const record = await getRecordById(
        recordId,
        req.user.role
    );

    if (!record) {
      res.status(404).json({
        success: false,
        message: 'Record not found or access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Record retrieved successfully',
      data: record
    });
  } catch (error) {
    console.error('Get record error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve record'
    });
  }
};

export const addRecord = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      recordId,
      title,
      category,
      description,
      status,
      access
    } = req.body;

    if (!recordId || !title || !category || !description) {
      res.status(400).json({
        success: false,
        message:
          'recordId, title, category and description are required'
      });
      return;
    }

    const record = await createRecord({
      recordId,
      title,
      category,
      description,
      status,
      access
    });

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      data: record
    });
  } catch (error) {
    console.error('Create record error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create record'
    });
  }
};