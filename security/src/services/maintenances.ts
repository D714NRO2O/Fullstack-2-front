import { apiRequest } from './api'

// GET /maintenances
export function getMaintenances() {
  return apiRequest('/maintenances')
}

// GET /maintenances/:id
export function getMaintenance(id: number) {
  return apiRequest(`/maintenances/${id}`)
}

// POST /maintenances
export function createMaintenance(data: {
  equipmentId: number
  type: 'Corrective' | 'Preventive'
  date: string // formato ISO
  performedBy: string
  observations?: string | null
}) {
  return apiRequest('/maintenances', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PATCH /maintenances/:id
export function updateMaintenance(
  id: number,
  data: Partial<{
    equipmentId: number
    type: 'Corrective' | 'Preventive'
    date: string
    performedBy: string
    observations: string | null
  }>
) {
  return apiRequest(`/maintenances/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// DELETE /maintenances/:id
export function deleteMaintenance(id: number) {
  return apiRequest(`/maintenances/${id}`, {
    method: 'DELETE',
  })
}
