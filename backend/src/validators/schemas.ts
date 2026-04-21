import { z } from 'zod';

export const configUpdateSchema = z.object({
  max_temp: z.number().min(50).max(120).optional(),
  max_delay_minutes: z.number().min(0).max(120).optional(),
  defect_threshold_percent: z.number().min(0).max(100).optional(),
  simulation_speed_ms: z.number().min(500).max(10000).optional()
});

export const demoControlSchema = z.object({
  action: z.enum(['pause', 'resume', 'reset', 'trigger-alert'])
});
