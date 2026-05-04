import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ExpandableExplanationProps {
  shortAnswer: string
  detailedAnswer: string
  className?: string
}

export const ExpandableExplanation: React.FC<ExpandableExplanationProps> = ({
  shortAnswer,
  detailedAnswer,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Default Response - Always Visible */}
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed inherit">
          {shortAnswer}
        </div>
      </div>

      {/* Expand Button - Only show if there's detailed content */}
      {detailedAnswer && detailedAnswer.trim() !== '' && (
        <button
          onClick={toggleExpanded}
          className={cn(
            'mt-4 flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-gradient-to-r from-purple-600/20 to-indigo-600/20',
            'border border-purple-400/30 text-purple-300',
            'hover:from-purple-600/30 hover:to-indigo-600/30 hover:border-purple-400/50',
            'transition-all duration-300 ease-in-out',
            'text-sm font-medium',
            'shadow-sm hover:shadow-md',
            'transform hover:scale-105 active:scale-95'
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isExpanded ? 'Hide detailed explanation' : 'See detailed explanation'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform duration-300" />
          )}
        </button>
      )}

      {/* Expanded Section */}
      <div
        className={cn(
          'mt-4 overflow-hidden transition-all duration-500 ease-in-out',
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 bg-gradient-to-br from-gray-800/50 to-blue-900/50 rounded-lg border border-gray-600/30 shadow-inner">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed inherit">
              {detailedAnswer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpandableExplanation
