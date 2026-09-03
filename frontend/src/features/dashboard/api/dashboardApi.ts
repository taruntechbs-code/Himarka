import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { SystemHealth } from '@/types/domain';

export const dashboardApi = {
  getSystemHealth(): Promise<SystemHealth> {
    return apiClient.get<SystemHealth>(API_ENDPOINTS.HEALTH);
  },
};
