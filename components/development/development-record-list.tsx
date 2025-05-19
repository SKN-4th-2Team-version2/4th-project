"use client"

import { useState, useEffect } from "react"
import { getDevelopmentRecords } from "@/app/actions/development-record"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Loader2, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DevelopmentRecord {
  id: string
  date: string
  ageGroup: string
  developmentArea: string
  title: string
  description: string
  createdAt: string
  images?: string[]
  recordType?: string
}

export function DevelopmentRecordList() {
  const [records, setRecords] = useState<DevelopmentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>("all")

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getDevelopmentRecords()
        setRecords(data)
      } catch (error) {
        console.error("Failed to fetch development records:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [])

  const filteredRecords = records
    .filter((record) => {
      if (recordTypeFilter === "all") return true
      return record.recordType === recordTypeFilter || (!record.recordType && recordTypeFilter === "development")
    })
    .filter((record) => {
      if (filter === "all") return true
      return record.developmentArea === filter
    })

  const getAreaName = (area: string) => {
    switch (area) {
      case "physical":
        return "신체 발달"
      case "cognitive":
        return "인지 발달"
      case "language":
        return "언어 발달"
      case "social":
        return "사회성 발달"
      case "milestone":
        return "발달 이정표"
      case "special-day":
        return "특별한 날"
      case "health":
        return "건강 기록"
      case "nutrition":
        return "영양 기록"
      default:
        return area
    }
  }

  const getAgeGroupName = (id: string) => {
    switch (id) {
      case "1":
        return "0-6개월"
      case "2":
        return "7-12개월"
      case "3":
        return "1-2세"
      case "4":
        return "3-4세"
      case "5":
        return "5-6세"
      case "6":
        return "7세 이상"
      default:
        return id
    }
  }

  const getBadgeColor = (area: string) => {
    switch (area) {
      case "physical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cognitive":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "language":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "social":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "milestone":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "special-day":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "health":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      case "nutrition":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">발달 기록 내역</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Tabs value={recordTypeFilter} onValueChange={setRecordTypeFilter} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="development">발달 기록</TabsTrigger>
              <TabsTrigger value="milestone">이정표</TabsTrigger>
              <TabsTrigger value="special-day">특별한 날</TabsTrigger>
            </TabsList>
          </Tabs>

          {recordTypeFilter === "development" && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="영역별 필터링" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 영역</SelectItem>
                <SelectItem value="physical">신체 발달</SelectItem>
                <SelectItem value="cognitive">인지 발달</SelectItem>
                <SelectItem value="language">언어 발달</SelectItem>
                <SelectItem value="social">사회성 발달</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">선택한 필터에 해당하는 기록이 없습니다.</p>
            <p className="text-sm text-muted-foreground">새 기록 작성 탭에서 아이의 발달 과정을 기록해보세요.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(record.date), "yyyy년 M월 d일", { locale: ko })}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getBadgeColor(record.developmentArea)}>{getAreaName(record.developmentArea)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-sm text-muted-foreground mb-3">
                  {record.description.length > 150 ? `${record.description.substring(0, 150)}...` : record.description}
                </div>

                {record.images && record.images.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {record.images.map((image, index) => (
                      <div key={index} className="relative min-w-[80px] h-[80px] rounded-md overflow-hidden border">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${record.title} 이미지 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <div className="text-xs text-muted-foreground">{getAgeGroupName(record.ageGroup)}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    상세 보기
                  </Button>
                  <Button variant="default" size="sm">
                    수정
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
