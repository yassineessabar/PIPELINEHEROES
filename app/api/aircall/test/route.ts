import { NextRequest, NextResponse } from 'next/server'
import aircallService from '@/lib/aircall'

export async function GET(request: NextRequest) {
  try {
    // Test basic connectivity
    const testResponse = await fetch('https://api.aircall.io/v1/ping', {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.AIRCALL_API_ID}:${process.env.AIRCALL_API_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!testResponse.ok) {
      throw new Error(`API test failed: ${testResponse.status} ${testResponse.statusText}`)
    }

    const pingResult = await testResponse.json()

    // Test service methods
    const callsResponse = await aircallService.getCalls({ per_page: 5 })

    return NextResponse.json({
      success: true,
      ping: pingResult,
      calls_count: callsResponse.meta.total,
      service_status: 'connected',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Aircall API test failed:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      service_status: 'disconnected',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { call_id } = body

    if (!call_id) {
      return NextResponse.json({
        success: false,
        error: 'call_id is required'
      }, { status: 400 })
    }

    // Test call analysis
    const analysis = await aircallService.analyzeCall(parseInt(call_id))

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Call analysis test failed:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}