import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'web'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const days = searchParams.get('days') || '14'

  try {
    const response = await fetch(`http://localhost:3008/api/exchange_db2api?format=${format}&date=${date}&days=${days}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Exchange API responded with status: ${response.status}`)
    }

    const rawData = await response.json()
    
    // API 응답 형식 변환
    if (rawData.success && rawData.data && rawData.data.length > 0) {
      // days=1인 경우 단일 날짜 데이터, days>1인 경우 여러 날짜 데이터
      const isSingleDay = rawData.data.length === 1
      const latestData = rawData.data[0]
      const previousData = !isSingleDay && rawData.data[1] ? rawData.data[1] : null
      
      const transformedData = {
        date: latestData.date,
        usd: latestData.USD,
        eur: latestData.EUR,
        cny: latestData.CNH,
        jpy100: latestData.JPY100,
        previousDate: previousData?.date,
        previousUsd: previousData?.USD,
        previousEur: previousData?.EUR,
        previousCny: previousData?.CNH,
        previousJpy100: previousData?.JPY100,
        history: isSingleDay ? [] : rawData.data.reverse().map((item: any) => ({
          date: item.date,
          usd: item.USD,
          eur: item.EUR,
          cny: item.CNH,
          jpy100: item.JPY100
        }))
      }
      
      return NextResponse.json(transformedData)
    }
    
    return NextResponse.json(rawData)
  } catch (error) {
    console.error('Failed to fetch exchange data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exchange data' },
      { status: 500 }
    )
  }
}