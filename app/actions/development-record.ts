"use server"

import { v4 as uuidv4 } from "uuid"

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 함)
let developmentRecords: any[] = []

export async function saveDevelopmentRecord(data: {
  date: string
  ageGroup: string
  developmentArea: string
  title: string
  description: string
  images?: string[]
  recordType?: string
}) {
  try {
    // 실제 구현에서는 데이터베이스에 저장
    const record = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    developmentRecords.push(record)
    return record.id
  } catch (error) {
    console.error("Error saving development record:", error)
    throw new Error("Failed to save development record")
  }
}

export async function getDevelopmentRecords() {
  try {
    // 실제 구현에서는 데이터베이스에서 조회
    // 날짜 내림차순으로 정렬
    return [...developmentRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error getting development records:", error)
    throw new Error("Failed to get development records")
  }
}

export async function getDevelopmentRecord(id: string) {
  try {
    // 실제 구현에서는 데이터베이스에서 조회
    return developmentRecords.find((record) => record.id === id)
  } catch (error) {
    console.error("Error getting development record:", error)
    throw new Error("Failed to get development record")
  }
}

export async function deleteDevelopmentRecord(id: string) {
  try {
    // 실제 구현에서는 데이터베이스에서 삭제
    developmentRecords = developmentRecords.filter((record) => record.id !== id)
    return true
  } catch (error) {
    console.error("Error deleting development record:", error)
    throw new Error("Failed to delete development record")
  }
}
