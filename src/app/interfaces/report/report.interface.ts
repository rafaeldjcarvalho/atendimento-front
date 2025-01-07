export interface ReportData {
  totalServices: number; // Número total de atendimentos
  completedServices: number; // Quantidade de atendimentos concluídos
  canceledServices: number; // Quantidade de atendimentos cancelados
  servicesDays: ServiceDay[]; // Lista com dados dos dias de atendimento
  weeklyUsage: Record<string, WeeklyHours>; // Mapeamento de uso semanal por usuário
}

export interface ServiceDay {
  date: string; // Data do atendimento (ISO 8601 format: 'YYYY-MM-DD')
  hours: number; // Total de horas no dia
}

export interface WeeklyHours {
  userName: string; // Nome do usuário (professor ou monitor)
  hoursByWeek: Record<string, number>; // Mapeamento "Semana X" -> Horas
}
