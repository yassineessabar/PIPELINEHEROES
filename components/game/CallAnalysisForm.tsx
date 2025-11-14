'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CallAnalysisFormProps {
  onClose: () => void
}

export function CallAnalysisForm({ onClose }: CallAnalysisFormProps) {
  const [formData, setFormData] = useState({
    customer: '',
    duration: '',
    callType: '',
    pipelineValue: '',
    transcript: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Here you would call your analysis API
    console.log('Submitting call analysis:', formData)

    setIsSubmitting(false)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Name */}
      <div className="space-y-2">
        <Label htmlFor="customer" className="text-gold">Customer/Company</Label>
        <Input
          id="customer"
          value={formData.customer}
          onChange={(e) => handleInputChange('customer', e.target.value)}
          placeholder="e.g., Acme Corp"
          className="bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-gold">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="30"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Call Type */}
        <div className="space-y-2">
          <Label className="text-gold">Call Type</Label>
          <Select value={formData.callType} onValueChange={(value) => handleInputChange('callType', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="discovery">Discovery</SelectItem>
              <SelectItem value="demo">Demo</SelectItem>
              <SelectItem value="closing">Closing</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pipeline Value */}
      <div className="space-y-2">
        <Label htmlFor="pipelineValue" className="text-gold">Potential Deal Value ($)</Label>
        <Input
          id="pipelineValue"
          type="number"
          value={formData.pipelineValue}
          onChange={(e) => handleInputChange('pipelineValue', e.target.value)}
          placeholder="50000"
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Transcript */}
      <div className="space-y-2">
        <Label htmlFor="transcript" className="text-gold">Call Notes/Transcript (Optional)</Label>
        <Textarea
          id="transcript"
          value={formData.transcript}
          onChange={(e) => handleInputChange('transcript', e.target.value)}
          placeholder="Add any notes or transcript from the call for better analysis..."
          className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="gold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Analyzing...' : 'Analyze Call'}
        </Button>
      </div>
    </form>
  )
}