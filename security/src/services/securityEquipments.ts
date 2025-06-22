import { apiRequest } from './api'

// GET /security-equipments
export function getSecurityEquipments() {
  return apiRequest('/security-equipments')
}

// GET /security-equipments/:id
export function getSecurityEquipment(id: number) {
  return apiRequest(`/security-equipments/${id}`)
}

// POST /security-equipments
export function createSecurityEquipment(data: {
  equipmentTypeId: number
  location: string
  installationDate: string // formato ISO (ej. "2025-06-22")
  status: 'Active' | 'Inactive' | 'UnderMaintenance'
  description?: string | null
}) {
  return apiRequest('/security-equipments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PATCH /security-equipments/:id
export function updateSecurityEquipment(
  id: number,
  data: Partial<{
    equipmentTypeId: number
    location: string
    installationDate: string
    status: 'Active' | 'Inactive' | 'UnderMaintenance'
    description: string | null
  }>
) {
  return apiRequest(`/security-equipments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// DELETE /security-equipments/:id
export function deleteSecurityEquipment(id: number) {
  return apiRequest(`/security-equipments/${id}`, {
    method: 'DELETE',
  })
}
