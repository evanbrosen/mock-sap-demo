import { Request, Response } from 'express';
import { BaseModel, IEntity } from '../models/BaseModel';

export abstract class BaseController {
  protected model: BaseModel;

  constructor(model: BaseModel) {
    this.model = model;
  }

  /**
   * Get all records with optional filtering
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.$top ? parseInt(req.query.$top as string) : undefined;
      const offset = req.query.$skip ? parseInt(req.query.$skip as string) : undefined;

      const records = this.model.getAll(limit, offset);
      const total = this.model.count();

      res.json({
        value: records,
        '@odata.count': total,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  }

  /**
   * Get a single record by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const record = this.model.getById(id);

      if (!record) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      res.json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch record' });
    }
  }

  /**
   * Create a new record
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const record = this.model.create(data);

      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create record' });
    }
  }

  /**
   * Update a record
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = this.model.update(id, data);

      if (!updated) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update record' });
    }
  }

  /**
   * Delete a record
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = this.model.delete(id);

      if (!deleted) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete record' });
    }
  }

  /**
   * Get records by status
   */
  async getByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const records = this.model.getByStatus(status);

      res.json({
        value: records,
        '@odata.count': records.length,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  }
}
