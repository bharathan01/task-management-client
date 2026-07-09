export const TASK_PRIORITY_COLORS: Record<string, string> = {
  'Low': '#1976d2',     
  'Medium': '#2e7d32',  
  'High': '#ed6c02',     
  'Critical': '#d32f2f'  
};

export function getPriorityColorHex(priority: string): string {
  return TASK_PRIORITY_COLORS[priority] || '#333333';
}
