import { apiRequest } from './api'

// GET /equipment-types
export function getEquipmentTypes() {
  return apiRequest('/equipment-types')
}

// GET /equipment-types/:id
export function getEquipmentType(id: number) {
  return apiRequest(`/equipment-types/${id}`)
}

// POST /equipment-types
export function createEquipmentType(data: {
  name: string
  description?: string | null
}) {
  return apiRequest('/equipment-types', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PATCH /equipment-types/:id
export function updateEquipmentType(
  id: number,
  data: {
    name?: string
    description?: string | null
  }
) {
  return apiRequest(`/equipment-types/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// DELETE /equipment-types/:id
export function deleteEquipmentType(id: number) {
  return apiRequest(`/equipment-types/${id}`, {
    method: 'DELETE',
  })
}
